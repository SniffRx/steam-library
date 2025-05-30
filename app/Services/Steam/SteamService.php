<?php

namespace App\Services\Steam;

use App\Models\CompletedGame;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;

/**
 * cacheKey
 * makeRequest
 *
 * getUserInfo
 * getUserGames
 * getUserFriends
 * getUserBans
 * getUserGamesCount
 * getUserLevel
 *
 * getOnlineFriendsWithGames
 * getFriendGames
 *
 * getGameInfo
 * getGameStoreDetails
 * getRecentlyPlayedGames
 *
 * getGameAchievements
 * getAchievementSchema
 * checkAndUpdateAchievements
 *
 */
class SteamService
{
    private const CACHE_TTL = [
        'short' => 3600, // 1 hour
        'medium' => 86400, // 1 day
        'long' => 604800, // 1 week
    ];

    private Client $client;
    private string $apiKey;

    public function __construct()
    {
        $this->apiKey = Config::get('steam-auth.api_key');
        if (empty($this->apiKey)) {
            throw new RuntimeException('API ключ Steam не задан.');
        }

        $this->client = new Client([
            'timeout' => 15,
            'connect_timeout' => 5,
            'headers' => [
                'User-Agent' => 'MySteamApp/1.0',
                'Accept' => 'application/json',
            ]
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
     * Make API request with caching and error handling
     */
    private function makeRequest(
        string $url,
        string $cacheKey,
        int $ttl,
        string $responsePath = '',
        bool $throwOnEmpty = true
    ): mixed {
        try {
            return Cache::remember($cacheKey, $ttl, function() use ($url, $responsePath, $throwOnEmpty) {
                $response = $this->client->get($url);
                $data = json_decode($response->getBody()->getContents(), true) ?? [];

                if ($responsePath) {
                    $data = data_get($data, $responsePath, []);
                }

                if ($throwOnEmpty && empty($data)) {
                    throw new RuntimeException('Empty API response');
                }

                return $data;
            });
        } catch (InvalidArgumentException $e) {
            Log::error("Cache error for Steam API: {$e->getMessage()}");
            return [];
        } catch (GuzzleException $e) {
            Log::warning("Steam API request failed: {$e->getMessage()}", ['url' => $url]);
            return [];
        } catch (RuntimeException $e) {
            Log::warning("Steam API empty response: {$e->getMessage()}", ['url' => $url]);
            return [];
        }
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
            'response.games'
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
        $url = "http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key={$this->apiKey}&steamid={$steamId}";
        return $this->makeRequest(
            $url,
            $this->cacheKey('friends', $steamId),
            self::CACHE_TTL['medium'],
            'friendslist.friends'
        );
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

            // Шаг 2: Разбиваем на порции по 20 ID
            $chunks = array_chunk($allSteamIds, 20);
            $summaries = [];

            foreach ($chunks as $chunk) {
                \Log::info("Запрошены данные для", ['ids' => $chunk]);
                $data = $this->getUserInfo($chunk); // Передаём массив ID

                if (!empty($data)) {
                    $summaries = array_merge($summaries, $data);
                }
            }

            \Log::info("Получено записей", ['total' => count($summaries)]);

            // Шаг 3: Фильтруем только онлайн-друзей
            $onlineFriends = array_filter($summaries, function ($player) {
                return ($player['personastate'] ?? 0) > 0;
            });

            $onlineFriends = array_values($onlineFriends); // Сброс ключей

            return [
                'total_friends' => $totalFriends,
                'online_friends_count' => count($onlineFriends),
                'online_friends' => $onlineFriends,
            ];
        });
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

        // Enrich with schema data if available
        $schema = $this->getAchievementSchema($appId);
        if (!empty($schema)) {
            foreach ($achievements as &$achievement) {
                $schemaData = $schema[$achievement['apiname'] ?? null];
                if ($schemaData) {
                    $achievement += $schemaData;
                }
            }
        }

        return $achievements;
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

        $result = [];
        foreach ($schema as $item) {
            $result[$item['name']] = [
                'name' => $item['displayName'] ?? '',
                'description' => $item['description'] ?? '',
                'icon' => $item['icon'] ?? '',
                'icon_gray' => $item['icongray'] ?? ''
            ];
        }

        return $result;
    }

    /**
     * Get detailed game information from store
     */
    public function getGameStoreDetails(int $appId): array
    {
        $url = "https://store.steampowered.com/api/appdetails?appids={$appId}";
        $data = $this->makeRequest(
            $url,
            $this->cacheKey('store', (string)$appId),
            self::CACHE_TTL['long'],
            "{$appId}.data",
            false
        );

        return is_array($data) ? $data : [];
    }

    public function checkAndUpdateAchievements(CompletedGame $userGame): bool
    {
        if (!$userGame->auto_complete_enabled || $userGame->is_completed) {
            return false;
        }

        $achievements = $this->getGameAchievements($userGame->app_id, $userGame->steam_id);
        if (empty($achievements)) {
            return false;
        }

        $allAchieved = !empty($achievements) && collect($achievements)->every(fn($a) => $a['achieved']);

        if ($allAchieved) {
            $userGame->update(['is_completed' => true]);
            return true;
        }

        return false;
    }

    public function getRecentlyPlayedGames(string $steamId): array
    {
        return Cache::remember(
            $this->cacheKey('steam:game:recently', $steamId),
            now()->addDay(),
            function () use ($steamId) {
                $url = sprintf(
                    'http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=%s&steamid=%s',
                    $this->apiKey,
                    $steamId
                );

                try {
                    $response = $this->client->get($url);
                    $data = json_decode($response->getBody()->getContents(), true);

                    return $data['response'];
                } catch (GuzzleException $e) {
                    return []; // Если ошибка, возвращаем пустой массив
                }
            }
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
     * Получить информацию об игре.
     *
     * @param int $appId
     * @return array
     */
    public function getGameInfo(int $appId): array
    {
        $url = "https://store.steampowered.com/api/appdetails?appids={$appId}";
        $data = $this->makeRequest(
            $url,
            $this->cacheKey('game_info', (string)$appId),
            self::CACHE_TTL['long'],
            "{$appId}.data",
            false
        );

        if (isset($data['success']) && !$data['success']) {
            Log::warning("Steam API returned unsuccessful response for game {$appId}");
            return [];
        }

        return $data;
    }
}
