<?php

namespace App\Services;

use App\Models\Game;
use App\Models\User;
use App\Models\UserGame;
use App\Services\Steam\SteamService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class GameSyncService
{
    public function __construct(private SteamService $steamService)
    {
    }

    /**
     * Синхронизировать игры пользователя из Steam в БД
     */
    public function syncUserGames(User $user): array
    {
        try {
            // Получаем игры из Steam API
            $steamGamesData = $this->steamService->getUserGames($user->steamID);
            $steamGames = $steamGamesData['games'] ?? $steamGamesData ?? [];

            if (empty($steamGames)) {
                return ['synced' => 0, 'errors' => 0];
            }

            $synced = 0;
            $errors = 0;

            DB::transaction(function () use ($user, $steamGames, &$synced, &$errors) {
                foreach ($steamGames as $steamGame) {
                    try {
                        $appId = (int)($steamGame['appid'] ?? 0);

                        if (!$appId) {
                            continue;
                        }

                        // ТОЛЬКО создаём запись с минимальной информацией
                        $game = Game::firstOrCreate(
                            ['appid' => $appId],
                            [
                                'name' => $steamGame['name'] ?? "Game {$appId}",
                                // НЕ загружаем детали здесь!
                            ]
                        );

                        // Парсим last_played_at
                        $lastPlayedAt = null;
                        if (isset($steamGame['rtime_last_played']) && $steamGame['rtime_last_played'] > 0) {
                            $lastPlayedAt = Carbon::createFromTimestamp($steamGame['rtime_last_played']);
                        }

                        // Обновляем связь пользователя с игрой
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

                    } catch (\Throwable $e) {
                        $errors++;
                        Log::debug("Failed to sync game {$appId}: {$e->getMessage()}");
                    }
                }
            });

            return ['synced' => $synced, 'errors' => $errors];

        } catch (\Throwable $e) {
            Log::error("Failed to sync user games for user {$user->id}: {$e->getMessage()}");
            throw $e;
        }
    }


    /**
     * Загрузить детальную информацию об игре из Steam
     */
    public function syncGameDetails(Game $game): void
    {
        try {
            $details = $this->steamService->getGameInfo($game->appid);

            if (empty($details)) {
                // Обновляем метку синхронизации, даже если данных нет
                $game->update(['last_synced_at' => now()]);
                return;
            }

            // Парсим цену
            $priceData = $details['price_overview'] ?? null;
            $releaseDate = null;
            if (isset($details['release_date']['date'])) {
                try {
                    $releaseDate = Carbon::parse($details['release_date']['date'])->format('Y-m-d');
                } catch (\Exception $e) {
                    Log::debug("Failed to parse release date for game {$game->appid}");
                }
            }

            $game->update([
                'header_image' => $details['header_image'] ?? null,
                'short_description' => $details['short_description'] ?? null,
                'detailed_description' => $details['detailed_description'] ?? $details['about_the_game'] ?? null, // НОВОЕ
                'developers' => $details['developers'] ?? null,
                'publishers' => $details['publishers'] ?? null,
                'genres' => isset($details['genres'])
                    ? collect($details['genres'])->pluck('description')->toArray()
                    : null,
                'categories' => isset($details['categories'])
                    ? collect($details['categories'])->pluck('description')->toArray()
                    : null,
                'release_date' => $releaseDate,
                'metacritic_score' => $details['metacritic']['score'] ?? null,
                'price_currency' => $priceData['currency'] ?? null,
                'price_initial' => $priceData['initial'] ?? null,
                'price_final' => $priceData['final'] ?? null,
                'is_free' => $details['is_free'] ?? false,
                'last_synced_at' => now(),
            ]);

        } catch (\Throwable $e) {
            Log::warning("Failed to sync game details for {$game->appid}: {$e->getMessage()}");
            $game->update(['last_synced_at' => now()]);
        }
    }

    /**
     * Постепенная загрузка деталей (в фоне, малыми порциями)
     */
    public function syncGameDetailsInBatches(User $user, int $batchSize = 5): int
    {
        // Получаем игры пользователя БЕЗ деталей
        $games = $user->games()
            ->whereNull('header_image')
            ->limit($batchSize)
            ->get();

        $synced = 0;

        foreach ($games as $game) {
            $this->syncGameDetails($game);
            $synced++;

            // Задержка для rate limit
            usleep(500000); // 0.5 секунды
        }

        return $synced;
    }
}
