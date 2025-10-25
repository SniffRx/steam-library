<?php

namespace App\Services\Steam;

use App\Models\CompletedGame;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Pool;
use GuzzleHttp\Psr7\Response;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use InvalidArgumentException;
use RuntimeException;

class SteamService
{
    private const CACHE_TTL = [
        'short' => 3600, // 1 hour
        'medium' => 86400, // 1 day
        'long' => 604800, // 1 week
    ];

    private const REQUEST_TIMEOUT = 15;
    private const CONNECT_TIMEOUT = 5;
    private const MAX_RETRIES = 3;
    private const RETRY_DELAY = 1000; // ms
    private const RATE_LIMIT_KEY = 'steam_api_requests';
    private const RATE_LIMIT_MAX = 200; // requests
    private const RATE_LIMIT_DECAY = 60; // seconds

    private Client $client;
    private string $apiKey;

    public function __construct()
    {
        $this->apiKey = Config::get('steam-auth.api_key');

        if (empty($this->apiKey)) {
            throw new RuntimeException('API ключ Steam не задан.');
        }

        $this->client = new Client([
            'timeout' => self::REQUEST_TIMEOUT,
            'connect_timeout' => self::CONNECT_TIMEOUT,
            'headers' => [
                'User-Agent' => Config::get('app.name', 'MySteamApp') . '/1.0',
                'Accept' => 'application/json',
            ],
            'http_errors' => false, // Handle errors manually
        ]);
    }

    /** Генерация ключей
     * @param string $prefix
     * @param string $identifier
     * @return string
     */
    private function cacheKey(string $prefix, string $identifier): string
    {
        return "steam:{$prefix}:" . md5($identifier);
    }

    /**
     * [translate:Check rate limit]
     */
    private function checkRateLimit(): bool
    {
        return RateLimiter::attempt(
            self::RATE_LIMIT_KEY,
            self::RATE_LIMIT_MAX,
            function() {},
            self::RATE_LIMIT_DECAY
        );
    }

    /**
     * [translate:Make API request with retry logic and rate limiting]
     */
    private function makeRequest(
        string $url,
        string $cacheKey,
        int $ttl,
        string $responsePath = '',
        bool $throwOnEmpty = true
    ): mixed {

        // Rate limiting check
        if (!$this->checkRateLimit()) {
            Log::warning('Steam API rate limit exceeded', ['url' => $url]);
            return $this->getCachedOrEmpty($cacheKey);
        }

        try {
            return Cache::remember($cacheKey, $ttl, function() use ($url, $responsePath, $throwOnEmpty) {
                $data = $this->executeWithRetry($url);

                if ($responsePath) {
                    $data = data_get($data, $responsePath, []);
                }

                if ($throwOnEmpty && empty($data)) {
                    throw new RuntimeException('Empty API response');
                }

                return $data;
            });

        } catch (InvalidArgumentException $e) {
            Log::error("Cache error for Steam API", [
                'error' => $e->getMessage(),
                'url' => $url
            ]);
            return [];
        } catch (GuzzleException $e) {
            Log::warning("Steam API request failed", [
                'error' => $e->getMessage(),
                'url' => $url
            ]);
            return $this->getCachedOrEmpty($cacheKey);
        } catch (RuntimeException $e) {
            Log::debug("Steam API empty response", [
                'message' => $e->getMessage(),
                'url' => $url
            ]);
            return [];
        }
    }

    /**
     * [translate:Execute request with retry logic]
     */
    private function executeWithRetry(string $url, int $attempt = 1): array
    {
        try {
            $response = $this->client->get($url);

            if ($response->getStatusCode() !== 200) {
                throw new RuntimeException(
                    "Steam API returned status {$response->getStatusCode()}"
                );
            }

            $data = json_decode($response->getBody()->getContents(), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new RuntimeException('Invalid JSON response from Steam API');
            }

            return $data ?? [];

        } catch (\Throwable $e) {
            if ($attempt < self::MAX_RETRIES) {
                usleep(self::RETRY_DELAY * $attempt * 1000); // Exponential backoff
                return $this->executeWithRetry($url, $attempt + 1);
            }

            throw $e;
        }
    }

    /**
     * [translate:Get cached value or empty array]
     */
    private function getCachedOrEmpty(string $cacheKey): array
    {
        return Cache::get($cacheKey, []);
    }

    /**
     * Получить информацию о пользователе Steam.
     *
     * @param string $steamId
     * @return array
     */
    public function getUserInfo(array|string $steamIds): array
    {
        if (is_array($steamIds)) {
            $steamIds = implode(',', $steamIds); // поддержка нескольких ID
        }

        $url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={$this->apiKey}&steamids={$steamIds}";

        return $this->makeRequest(
            $url,
            $this->cacheKey('user_info', $steamIds),
            self::CACHE_TTL['medium'],
            'response.players',
            false
        );
    }

    /**
     * Получить информацию о играх пользователя Steam.
     *
     * @param string $steamId
     * @return array
     */
    public function getUserGames(string $steamId): array
    {
        $url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key={$this->apiKey}&steamid={$steamId}&include_appinfo=1";
        return $this->makeRequest(
            $url,
            $this->cacheKey('games', $steamId),
            self::CACHE_TTL['long'],
            'response'
        );
    }

    /**
     * Получить информацию о друзьях пользователя Steam.
     *
     * @param string $steamId
     * @return array
     */
    public function getUserFriends(string $steamId): array
    {
        $url = "http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key={$this->apiKey}&steamid={$steamId}&relationship=friend";

        try {
            return $this->makeRequest(
                $url,
                $this->cacheKey('friends', $steamId),
                self::CACHE_TTL['medium'],
                'friendslist.friends',
                false // Не бросать ошибку на пустой ответ
            );
        } catch (\Throwable $e) {
            // Если профиль закрыт (401) или другая ошибка - возвращаем пустой массив
            Log::debug("Friends list unavailable", [
                'steamid' => $steamId,
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }

    /**
     * Получить список онлайн-друзей с информацией о профиле.
     *
     * @param string $steamId - Steam ID текущего пользователя
     * @return array - Массив друзей, которые сейчас онлайн
     */
    public function getOnlineFriendsWithGames(string $steamId): array
    {
        $cacheKey = $this->cacheKey('online_friends', $steamId);

        return Cache::remember($cacheKey, self::CACHE_TTL['short'], function () use ($steamId) {
            // Шаг 1: Получаем список всех друзей
            $friends = $this->getUserFriends($steamId);

            if (empty($friends)) {
                return [
                    'total_friends' => 0,
                    'online_friends_count' => 0,
                    'online_friends' => []
                ];
            }

            $totalFriends = count($friends); // Общее количество друзей
            $allSteamIds = array_column($friends, 'steamid'); // Извлекаем все Steam ID

            // Parallel batch requests
            $summaries = $this->batchGetUserInfo($allSteamIds);

            // Filter online friends
            $onlineFriends = collect($summaries)
                ->filter(fn($player) => ($player['personastate'] ?? 0) > 0)
                ->values()
                ->toArray();

            return [
                'total_friends' => $totalFriends,
                'online_friends_count' => count($onlineFriends),
                'online_friends' => $onlineFriends,
            ];
        });
    }

    /**
     * [translate:Batch get user info with parallel requests]
     */
    private function batchGetUserInfo(array $steamIds): array
    {
        $chunks = array_chunk($steamIds, 100); // Steam API supports up to 100 IDs
        $allSummaries = [];

        $requests = function ($chunks) {
            foreach ($chunks as $chunk) {
                $ids = implode(',', $chunk);
                $url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={$this->apiKey}&steamids={$ids}";
                yield function() use ($url) {
                    return $this->client->getAsync($url);
                };
            }
        };

        $pool = new Pool($this->client, $requests($chunks), [
            'concurrency' => 5,
            'fulfilled' => function (Response $response) use (&$allSummaries) {
                $data = json_decode($response->getBody()->getContents(), true);
                $players = $data['response']['players'] ?? [];
                $allSummaries = array_merge($allSummaries, $players);
            },
            'rejected' => function ($reason) {
                Log::warning('Batch request failed', ['reason' => $reason]);
            },
        ]);

        $pool->promise()->wait();

        return $allSummaries;
    }

    /**
     * Get game achievements for a user
     */
    public function getGameAchievements(int $appId, string $steamId): array
    {
        $url = "http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?key={$this->apiKey}&steamid={$steamId}&appid={$appId}";

        $achievements = $this->makeRequest(
            $url,
            $this->cacheKey('achievements', "{$appId}:{$steamId}"),
            self::CACHE_TTL['medium'],
            'playerstats.achievements',
            false
        );

        // Enrich with schema
        if (!empty($achievements)) {
            $schema = $this->getAchievementSchema($appId);
            return $this->enrichAchievements($achievements, $schema);
        }

        return $achievements;
    }

    /**
     * [translate:Enrich achievements with schema data]
     */
    private function enrichAchievements(array $achievements, array $schema): array
    {
        if (empty($schema)) {
            return $achievements;
        }

        return collect($achievements)
            ->map(function ($achievement) use ($schema) {
                $apiName = $achievement['apiname'] ?? null;
                return $apiName && isset($schema[$apiName])
                    ? array_merge($achievement, $schema[$apiName])
                    : $achievement;
            })
            ->toArray();
    }

    /**
     * Get achievement schema for a game
     */
    public function getAchievementSchema(int $appId): array
    {
        $url = "http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key={$this->apiKey}&appid={$appId}";

        $schema = $this->makeRequest(
            $url,
            $this->cacheKey('schema', (string)$appId),
            self::CACHE_TTL['long'],
            'game.availableGameStats.achievements',
            false
        );

        return collect($schema)
            ->keyBy('name')
            ->map(fn($item) => [
                'name' => $item['displayName'] ?? '',
                'description' => $item['description'] ?? '',
                'icon' => $item['icon'] ?? '',
                'icon_gray' => $item['icongray'] ?? ''
            ])
            ->toArray();
    }

    /**
     * [translate:Get recently played games]
     */
    public function getRecentlyPlayedGames(string $steamId): array
    {
        $url = "http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key={$this->apiKey}&steamid={$steamId}";

        return $this->makeRequest(
            $url,
            $this->cacheKey('recently', $steamId),
            self::CACHE_TTL['short'],
            'response',
            false
        );
    }

    /**
     * Получить информацию о блокировках пользователей Steam.
     *
     * @param string $steamId
     * @return array
     */
    public function getUserBans(string $steamId): array
    {
        $url = "http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key={$this->apiKey}&steamids={$steamId}";

        return $this->makeRequest(
            $url,
            $this->cacheKey('user_bans', $steamId),
            self::CACHE_TTL['medium'],
            'players.0'
        );
    }

    /**
     * Получить количество игр пользователя Steam.
     *
     * @param string $steamId
     * @return int
     */
    public function getUserGamesCount(string $steamId): int
    {
        $url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key={$this->apiKey}&steamid={$steamId}&include_appinfo=0";

        $data = $this->makeRequest(
            $url,
            $this->cacheKey('games_count', $steamId),
            self::CACHE_TTL['long'],
            'response.game_count'
        );

        return (int)($data ?? 0);
    }

    /**
     * Получить игры друга.
     *
     * @param string $steamId
     * @return array
     */
    public function getFriendGames(string $steamId): array
    {
        $url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key={$this->apiKey}&steamid={$steamId}&include_appinfo=1";
        return $this->makeRequest(
            $url,
            $this->cacheKey('friend_games', $steamId),
            self::CACHE_TTL['medium'],
            'response.games'
        );
    }

    /**
     * Получить информацию о уровне пользователя Steam.
     *
     * @param string $steamId
     * @return int
     */
    public function getUserLevel(string $steamId): int
    {
        $url = "http://api.steampowered.com/IPlayerService/GetSteamLevel/v0001/?key={$this->apiKey}&steamid={$steamId}";

        $data = $this->makeRequest(
            $url,
            $this->cacheKey('user_level', $steamId),
            self::CACHE_TTL['long'],
            'response.player_level'
        );

        return (int)($data ?? 0);
    }

    /**
     * Получить информацию об игре с fallback на разные регионы
     *
     * @param int $appId
     * @return array
     */
    public function getGameInfoWithFallback(int $appId): array
    {
        $regions = [
            ['cc' => null, 'lang' => 'russian'],
            ['cc' => null, 'lang' => 'english'],
            ['cc' => 'us', 'lang' => 'english'],
            ['cc' => 'ru', 'lang' => 'russian'],
        ];

        foreach ($regions as $config) {
            $data = $this->getGameInfoByRegion($appId, $config['cc'], $config['lang']);

            if (!empty($data) && !$this->isSpanish($data['short_description'] ?? '')) {
                Log::debug("Game fetched successfully", [
                    'appid' => $appId,
                    'region' => $config['cc'] ?? 'global',
                    'lang' => $config['lang']
                ]);
                return $data;
            }
        }

        Log::warning("Game not available in any region", ['appid' => $appId]);
        return [];
    }

    /**
     * Получить информацию об игре для конкретного региона
     *
     * @param int $appId
     * @param string|null $region
     * @return array
     */
    private function getGameInfoByRegion(int $appId, ?string $region, string $lang = 'english'): array
    {
        $params = ['appids' => $appId, 'l' => $lang];

        if ($region) {
            $params['cc'] = $region;
        }

        $url = 'https://store.steampowered.com/api/appdetails?' . http_build_query($params);
        $cacheKey = $this->cacheKey('game_store', "{$appId}:{$region}:{$lang}");

        try {
            $data = Cache::remember($cacheKey, self::CACHE_TTL['long'], function() use ($url, $appId) {
                $response = $this->executeWithRetry($url);

                if (!isset($response[$appId]['success']) || $response[$appId]['success'] !== true) {
                    return [];
                }

                return $response[$appId]['data'] ?? [];
            });

            return $data;

        } catch (\Throwable $e) {
            Log::debug("Failed to fetch game info", [
                'appid' => $appId,
                'region' => $region,
                'lang' => $lang,
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }

    /**
     * Проверка, является ли текст испанским
     */
    private function isSpanish(string $text): bool
    {
        $spanishIndicators = [
            'Durante', 'más de', 'años', 'jugadores',
            'mundo', 'momento', 'historia', 'puede'
        ];

        $matches = 0;
        foreach ($spanishIndicators as $word) {
            if (str_contains($text, $word)) {
                $matches++;
            }
        }

        return $matches >= 2; // More strict detection
    }

    /**
     * [translate:Check and update achievements]
     */
    public function checkAndUpdateAchievements(CompletedGame $userGame): bool
    {
        if (!$userGame->auto_complete_enabled || $userGame->is_completed) {
            return false;
        }

        $achievements = $this->getGameAchievements($userGame->app_id, $userGame->steam_id);

        if (empty($achievements)) {
            return false;
        }

        $allAchieved = collect($achievements)->every(fn($a) => $a['achieved'] ?? false);

        if ($allAchieved) {
            $userGame->update(['is_completed' => true]);
            return true;
        }

        return false;
    }

    /**
     * [translate:Get store details]
     */
    public function getGameStoreDetails(int $appId): array
    {
        return $this->getGameInfoWithFallback($appId);
    }

    /**
     * [translate:Clear cache for user]
     */
    public function clearUserCache(string $steamId): void
    {
        $prefixes = ['user_info', 'games', 'friends', 'online_friends', 'user_bans', 'user_level'];

        foreach ($prefixes as $prefix) {
            Cache::forget($this->cacheKey($prefix, $steamId));
        }
    }

    /**
     * Получить информацию об игре из Steam Store API
     *
     * @param int $appId
     * @return array
     */
    public function getGameInfo(int $appId): array
    {
        $url = "https://store.steampowered.com/api/appdetails?appids={$appId}&cc=us&l=english";
        $cacheKey = $this->cacheKey('game_info', (string)$appId);

        try {
            return Cache::remember($cacheKey, self::CACHE_TTL['long'], function() use ($url, $appId) {
                $response = $this->client->get($url);
                $rawData = json_decode($response->getBody()->getContents(), true);

                // Проверяем наличие данных для игры
                if (!isset($rawData[$appId])) {
                    Log::warning("Steam Store API returned no data for game {$appId}");
                    return [];
                }

                $gameResponse = $rawData[$appId];

                // Проверяем флаг success
                if (!isset($gameResponse['success']) || $gameResponse['success'] !== true) {
                    Log::warning("Steam Store API returned unsuccessful response for game {$appId}", [
                        'success' => $gameResponse['success'] ?? 'not set'
                    ]);
                    return [];
                }

                // Возвращаем данные игры
                return $gameResponse['data'] ?? [];
            });

        } catch (GuzzleException $e) {
            Log::warning("Failed to fetch game info for {$appId}: {$e->getMessage()}");
            return [];
        } catch (\Throwable $e) {
            Log::error("Unexpected error fetching game info for {$appId}: {$e->getMessage()}");
            return [];
        }
    }
}
