<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\User;
use App\Services\Steam\SteamService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use RuntimeException;

class SteamController extends Controller
{
    private const CACHE_TTL = 86400; // 24 часа
    private const RATE_LIMIT_KEY = 'steam_api';
    private const RATE_LIMIT_MAX = 100; // 100 запросов
    private const RATE_LIMIT_DECAY = 60; // за 60 секунд

    public function __construct(
        private readonly SteamService $steamService
    ) {}

    /**
     * Получить информацию о пользователе
     */
    public function getUserInfo(): JsonResponse
    {
        $steamId = Auth::user()->steamID;

        $userInfo = Cache::remember(
            "user:{$steamId}:info",
            self::CACHE_TTL,
            fn() => $this->steamService->getUserInfo($steamId)
        );

        return response()->json($userInfo);
    }

    /**
     * Получить игры пользователя
     */
    public function getUserGames(): JsonResponse
    {
        $steamId = Auth::user()->steamID;

        $games = Cache::remember(
            "user:{$steamId}:games",
            self::CACHE_TTL,
            fn() => $this->steamService->getUserGames($steamId)
        );

        return response()->json([
            'games' => $games['games'] ?? [],
            'game_count' => $games['game_count'] ?? 0
        ]);
    }

    /**
     * Получить друзей пользователя
     */
    public function getUserFriends(): JsonResponse
    {
        $steamId = Auth::user()->steamID;

        return Cache::remember(
            "user:{$steamId}:friends",
            self::CACHE_TTL / 2, // Обновляем чаще - 12 часов
            function () use ($steamId) {
                $friends = $this->steamService->getUserFriends($steamId);

                if (empty($friends)) {
                    return [];
                }

                $steamIds = collect($friends)->pluck('steamid')->implode(',');
                return $this->steamService->getUserInfo($steamIds);
            }
        );
    }

    /**
     * Получить детали игры с оптимизацией
     */
    public function getGameDetails(int $appId): JsonResponse
    {
        try {
            // Валидация
            if ($appId <= 0) {
                return $this->errorResponse('Invalid app ID', 400);
            }

            // Rate limiting для защиты от спама
            if (!$this->checkRateLimit()) {
                return $this->errorResponse('Too many requests. Please try again later.', 429);
            }

            $user = Auth::user();
            $cacheKey = "game:{$appId}:details:v2";

            // Кэшируем всю структуру ответа
            $gameData = Cache::remember(
                $cacheKey,
                self::CACHE_TTL,
                fn() => $this->loadGameData($appId, $user)
            );

            return response()->json($gameData);

        } catch (\Throwable $e) {
            Log::error("Error loading game details", [
                'appid' => $appId,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse('Failed to load game details', 500);
        }
    }

    /**
     * Загрузить данные игры (кэшируемый метод)
     */
    private function loadGameData(int $appId, User $user): array
    {
        // Получаем или создаём игру
        $game = Game::firstOrCreate(
            ['appid' => $appId],
            ['name' => "Game {$appId}"]
        );

        // Проверяем необходимость синхронизации
        if ($this->needsSync($game)) {
            try {
                $this->syncGameDetails($game);
                $game->refresh();
            } catch (\Throwable $e) {
                Log::warning("Failed to sync game {$appId}", [
                    'error' => $e->getMessage()
                ]);
            }
        }

        // Параллельная загрузка достижений и друзей (не блокируем)
        [$achievements, $friendsPlaying] = $this->loadAsyncData($appId, $user);

        return [
            'game_info' => $this->formatGameInfo($game),
            'achievements' => $achievements,
            'friendsPlaying' => $friendsPlaying,
        ];
    }

    /**
     * Загрузить данные асинхронно
     */
    private function loadAsyncData(int $appId, User $user): array
    {
        $achievements = [];
        $friendsPlaying = [];

        try {
            // Достижения с кэшированием
            $achievements = Cache::remember(
                "game:{$appId}:achievements:{$user->steamID}",
                self::CACHE_TTL,
                function () use ($appId, $user) {
                    try {
                        return $this->steamService->getGameAchievements($appId, $user->steamID);
                    } catch (\Throwable $e) {
                        Log::debug("No achievements for game {$appId}");
                        return [];
                    }
                }
            );
        } catch (\Throwable $e) {
            Log::debug("Failed to load achievements", ['appid' => $appId]);
        }

        try {
            // Друзья играющие в игру
            $friendsPlaying = $this->getFriendsPlayingGame($appId);
        } catch (\Throwable $e) {
            Log::debug("Failed to load friends for game", ['appid' => $appId]);
        }

        return [$achievements, $friendsPlaying];
    }

    /**
     * Проверить необходимость синхронизации
     */
    private function needsSync(Game $game): bool
    {
        return is_null($game->header_image)
            || is_null($game->last_synced_at)
            || $game->last_synced_at->lt(now()->subDays(7)); // Обновляем раз в неделю
    }

    /**
     * Форматировать информацию об игре
     */
    private function formatGameInfo(Game $game): array
    {
        return [
            'appid' => $game->appid,
            'name' => $game->name,
            'header_image' => $game->header_image,
            'short_description' => $game->short_description,
            'detailed_description' => $game->detailed_description ?? $game->short_description,
            'developers' => $game->developers ?? [],
            'publishers' => $game->publishers ?? [],
            'genres' => $this->formatTags($game->genres),
            'categories' => $this->formatTags($game->categories),
            'screenshots' => $game->screenshots ?? [],
            'movies' => $game->movies ?? [],
            'pc_requirements' => $game->pc_requirements ?? [],
            'mac_requirements' => $game->mac_requirements ?? [],
            'linux_requirements' => $game->linux_requirements ?? [],
            'platforms' => $game->platforms ?? [],
            'release_date' => $game->release_date?->format('Y-m-d'),
            'metacritic_score' => $game->metacritic_score,
            'price' => $game->formattedPrice(),
            'is_free' => $game->is_free,
        ];
    }

    /**
     * Форматировать теги для frontend
     */
    private function formatTags(?array $tags): array
    {
        if (!$tags) {
            return [];
        }

        return collect($tags)
            ->map(fn($tag) => ['description' => $tag])
            ->toArray();
    }

    /**
     * Синхронизировать детали игры (оптимизировано)
     */
    private function syncGameDetails(Game $game): void
    {
        try {
            Log::info("Syncing game", ['appid' => $game->appid]);

            $details = $this->steamService->getGameInfoWithFallback($game->appid);

            if (empty($details)) {
                $game->update(['last_synced_at' => now()]);
                return;
            }

            // Используем массовое присвоение с валидацией
            $updateData = $this->buildUpdateData($details);
            $game->update($updateData);

            // Инвалидируем кэш
            Cache::tags(['games'])->flush();
            Cache::forget("user:" . auth()->id() . ":games_list");

            Log::info("Game synced successfully", ['appid' => $game->appid]);

        } catch (\Throwable $e) {
            Log::error("Failed to sync game", [
                'appid' => $game->appid,
                'error' => $e->getMessage()
            ]);

            $game->update(['last_synced_at' => now()]);
            throw $e;
        }
    }

    /**
     * Построить данные для обновления
     */
    private function buildUpdateData(array $details): array
    {
        $releaseDate = $this->parseReleaseDate($details['release_date']['date'] ?? null);
        $priceData = $details['price_overview'] ?? null;

        return [
            'header_image' => $details['header_image'] ?? null,
            'short_description' => $details['short_description'] ?? null,
            'detailed_description' => $details['detailed_description']
                ?? $details['about_the_game']
                    ?? null,
            'developers' => $details['developers'] ?? null,
            'publishers' => $details['publishers'] ?? null,
            'genres' => $this->extractDescriptions($details['genres'] ?? []),
            'categories' => $this->extractDescriptions($details['categories'] ?? []),
            'screenshots' => $details['screenshots'] ?? null,
            'movies' => $details['movies'] ?? null,
            'pc_requirements' => $details['pc_requirements'] ?? null,
            'mac_requirements' => $details['mac_requirements'] ?? null,
            'linux_requirements' => $details['linux_requirements'] ?? null,
            'platforms' => $details['platforms'] ?? null,
            'release_date' => $releaseDate,
            'metacritic_score' => $details['metacritic']['score'] ?? null,
            'price_currency' => $priceData['currency'] ?? null,
            'price_initial' => $priceData['initial'] ?? null,
            'price_final' => $priceData['final'] ?? null,
            'is_free' => $details['is_free'] ?? false,
            'last_synced_at' => now(),
        ];
    }

    /**
     * Извлечь описания из массива
     */
    private function extractDescriptions(array $items): ?array
    {
        if (empty($items)) {
            return null;
        }

        return collect($items)
            ->pluck('description')
            ->filter()
            ->values()
            ->toArray();
    }

    /**
     * Парсить дату релиза
     */
    private function parseReleaseDate(?string $dateString): ?string
    {
        if (!$dateString) {
            return null;
        }

        try {
            return Carbon::parse($dateString)->format('Y-m-d');
        } catch (\Exception $e) {
            Log::debug("Failed to parse release date", ['date' => $dateString]);
            return null;
        }
    }

    /**
     * Получить друзей, играющих в игру
     */
    private function getFriendsPlayingGame(int $appId): array
    {
        try {
            $user = Auth::user();

            $friends = Cache::remember(
                "user:{$user->steamID}:friends:raw",
                self::CACHE_TTL / 2,
                fn() => $this->steamService->getUserFriends($user->steamID)
            );

            if (empty($friends)) {
                return [];
            }

            return collect($friends)
                ->filter(fn($friend) =>
                    isset($friend['gameid']) && (int)$friend['gameid'] === $appId
                )
                ->values()
                ->toArray();

        } catch (\Throwable $e) {
            Log::debug("Failed to load friends", ['appid' => $appId]);
            return [];
        }
    }

    /**
     * Проверить rate limit
     */
    private function checkRateLimit(): bool
    {
        $key = self::RATE_LIMIT_KEY . ':' . Auth::id();

        return RateLimiter::attempt(
            $key,
            self::RATE_LIMIT_MAX,
            function() {},
            self::RATE_LIMIT_DECAY
        );
    }

    /**
     * Форматированный ответ об ошибке
     */
    private function errorResponse(string $message, int $code = 500): JsonResponse
    {
        return response()->json([
            'error' => $message,
            'code' => $code
        ], $code);
    }

    /**
     * Получить игры друга
     */
    public function getFriendGames(string $steamId): JsonResponse
    {
        return response()->json(
            $this->steamService->getFriendGames($steamId)
        );
    }

    /**
     * Получить страницу пользователя
     */
    public function getUser(string $steamId): InertiaResponse
    {
        try {
            $user = User::where('steamID', $steamId)->firstOrFail();

            // Параллельная загрузка данных с кэшированием
            $userData = Cache::remember(
                "user:{$steamId}:profile",
                self::CACHE_TTL / 2,
                fn() => [
                    'userInfo' => $this->steamService->getUserInfo($steamId)[0],
                    'userBans' => $this->steamService->getUserBans($steamId),
                    'userLevel' => $this->steamService->getUserLevel($steamId),
                    'userRecentlyGames' => $this->steamService->getRecentlyPlayedGames($steamId),
                    'userGamesCount' => $this->steamService->getUserGamesCount($steamId),
                    'userFriends' => $this->steamService->getOnlineFriendsWithGames($steamId),
                ]
            );

            return Inertia::render('userPage/UserPage', $userData);

        } catch (Exception $e) {
            Log::warning("User not found", ['steamid' => $steamId]);
            return Inertia::render('userNotFound', ['steamID' => $steamId]);
        }
    }

    public function searchUsers(Request $request): JsonResponse
    {
        $query = $request->input('query', '');

        Log::info('Search query:', ['query' => $query]);

        if (strlen($query) < 3) {
            return response()->json([
                'results' => [],
                'message' => __('Введите не менее 3 символов для поиска.')
            ]);
        }

        // Для PostgreSQL используем ILIKE вместо LIKE
        $matches = User::query()
            ->where('steamID', 'ILIKE', "%{$query}%")
            ->orWhere('name', 'ILIKE', "%{$query}%")
            ->limit(10)
            ->get(['steamID', 'name', 'avatar']);

        Log::info('Search results:', ['count' => $matches->count()]);

        $results = $matches->map(fn($user) => [
            'steamId' => $user->steamID,
            'name' => $user->name,
            'avatar' => $user->avatar,
        ]);

        return response()->json(['results' => $results]);
    }

}
