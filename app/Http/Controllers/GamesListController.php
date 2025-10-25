<?php

namespace App\Http\Controllers;

use App\Services\Steam\SteamService;
use App\Models\Game;
use App\Models\UserGame;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class GamesListController extends Controller
{
    public function __construct(private SteamService $steamService)
    {
    }

    public function index()
    {
        $user = Auth::user();
        $userId = $user->id;

        try {
            // Проверяем, есть ли игры в БД
            $hasGamesInDb = UserGame::where('user_id', $userId)->exists();

            if (!$hasGamesInDb) {
                // Первый заход - БЫСТРАЯ синхронизация
                Log::info("First sync for user {$userId}");
                $this->quickSyncUserGames($user);
            } else {
                // Проверяем, давно ли была последняя синхронизация
                $lastSync = Cache::get("user:{$userId}:last_games_sync");

                if (!$lastSync || now()->diffInHours($lastSync) > 6) {
                    // Обновляем в фоне (не блокируем)
                    Log::info("Background sync for user {$userId}");
                    try {
                        $this->quickSyncUserGames($user);
                    } catch (\Throwable $e) {
                        Log::warning("Background sync failed: {$e->getMessage()}");
                        // Не падаем, показываем старые данные
                    }
                }
            }

            // Получаем игры из БД (быстро)
            $games = $this->getUserGamesFromDb($user);

            // Получаем друзей (с кэшем)
            $friends = Cache::remember(
                "user:{$user->steamID}:friends",
                now()->addHours(2),
                function () use ($user) {
                    try {
                        return $this->steamService->getUserFriends($user->steamID);
                    } catch (\Throwable $e) {
                        Log::warning("Failed to load friends: {$e->getMessage()}");
                        return [];
                    }
                }
            );

            $completedGames = $user->completedGames()
                ->where('is_completed', true)
                ->pluck('game_appid')
                ->toArray();

            return Inertia::render('GamesList/GamesList', [
                'games' => $games,
                'friends' => $friends,
                'completedGames' => $completedGames,
                'gameCount' => count($games),
            ]);

        } catch (\Throwable $e) {
            Log::error("Error loading games list: {$e->getMessage()}", [
                'user_id' => $userId,
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('GamesList/GamesList', [
                'games' => [],
                'friends' => [],
                'completedGames' => [],
                'error' => 'Не удалось загрузить игры. Попробуйте обновить страницу.',
            ]);
        }
    }

    /**
     * БЫСТРАЯ синхронизация - только список игр без деталей
     */
    private function quickSyncUserGames($user): void
    {
        try {
            // Получаем список игр из Steam
            $steamGamesData = $this->steamService->getUserGames($user->steamID);

            // Проверяем разные форматы ответа
            if (isset($steamGamesData['response']['games'])) {
                $steamGames = $steamGamesData['response']['games'];
            } elseif (isset($steamGamesData['games'])) {
                $steamGames = $steamGamesData['games'];
            } else {
                $steamGames = $steamGamesData;
            }

            if (empty($steamGames)) {
                Log::warning("No games found for user {$user->id}");
                return;
            }

            Log::info("Syncing {count} games for user {$user->id}", ['count' => count($steamGames)]);

            DB::transaction(function () use ($user, $steamGames) {
                $synced = 0;

                foreach ($steamGames as $steamGame) {
                    $appId = (int)($steamGame['appid'] ?? 0);

                    if (!$appId) {
                        continue;
                    }

                    // Создаём минимальную запись игры
                    $game = Game::firstOrCreate(
                        ['appid' => $appId],
                        [
                            'name' => $steamGame['name'] ?? "Game {$appId}",
                            'img_icon_url' => $steamGame['img_icon_url'] ?? null,
                        ]
                    );

                    // Парсим last_played_at
                    $lastPlayedAt = null;
                    if (isset($steamGame['rtime_last_played']) && $steamGame['rtime_last_played'] > 0) {
                        $lastPlayedAt = Carbon::createFromTimestamp($steamGame['rtime_last_played']);
                    }

                    // Создаём связь пользователя с игрой
                    UserGame::updateOrCreate(
                        [
                            'user_id' => $user->id,
                            'game_id' => $game->id,
                        ],
                        [
                            'playtime_forever' => $steamGame['playtime_forever'] ?? 0,
                            'playtime_2weeks' => $steamGame['playtime_2weeks'] ?? null,
                            'last_played_at' => $lastPlayedAt,
                        ]
                    );

                    $synced++;
                }

                Log::info("Successfully synced {$synced} games for user {$user->id}");
            });

            // Обновляем метку последней синхронизации
            Cache::put("user:{$user->id}:last_games_sync", now(), now()->addHours(6));

            // Инвалидируем кеш списка игр
            Cache::forget("user:{$user->id}:games_list");

        } catch (\Throwable $e) {
            Log::error("Quick sync failed for user {$user->id}: {$e->getMessage()}", [
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Получить игры пользователя из БД
     */
    private function getUserGamesFromDb($user): array
    {
        return Cache::remember(
            "user:{$user->id}:games_list",
            now()->addMinutes(30),
            function () use ($user) {
                $games = UserGame::where('user_id', $user->id)
                    ->with('game')
                    ->orderBy('playtime_2weeks', 'desc')
                    ->orderBy('playtime_forever', 'desc')
                    ->get();

                return $games->map(function ($userGame) use ($user) {
                    $game = $userGame->game;

                    if (!$game) {
                        return null;
                    }

                    // Получаем статус завершения
                    $completion = $user->completedGames()
                        ->where('game_appid', $game->appid)
                        ->first();

                    // Формируем URL превью из Steam CDN
                    $imgIconUrl = null;
                    if ($game->img_icon_url) {
                        $imgIconUrl = "https://media.steampowered.com/steamcommunity/public/images/apps/{$game->appid}/{$game->img_icon_url}.jpg";
                    }

                    return [
                        'appid' => $game->appid,
                        'name' => $game->name,
                        'playtime_forever' => $userGame->playtime_forever,
                        'playtime_2weeks' => $userGame->playtime_2weeks,
                        'last_played_at' => $userGame->last_played_at,
                        'img_icon_url' => $imgIconUrl,
                        'is_completed' => $completion?->is_completed ?? false,
                        'completed_at' => $completion?->completed_at,

                        // Детали загружаем только при клике на игру
                        'has_details' => !is_null($game->header_image),
                    ];
                })->filter()->values()->toArray();
            }
        );
    }
}
