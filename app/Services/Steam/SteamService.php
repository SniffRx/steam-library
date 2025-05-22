<?php

namespace App\Services\Steam;

use App\Models\CompletedGame;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use RuntimeException;

class SteamService
{
    private string $apiKey;
    private Client $client;

    public function __construct()
    {
        $this->apiKey = Config::get('steam-auth.api_key');
        if (empty($this->apiKey)) {
            throw new RuntimeException('API ключ Steam не задан.');
        }

        $this->client = new Client();
    }

    /** Генерация ключей
     * @param string $prefix
     * @param string $value
     * @return string
     */
    private function cacheKey(string $prefix, string $value): string
    {
        return $prefix . ':' . substr(md5($value), 0, 32);
    }

    /**
     * Получить информацию о пользователе Steam.
     *
     * @param string $steamId
     * @return array
     */
    public function getUserInfo(string $steamId): array
    {
        if (empty($this->apiKey)) {
            throw new RuntimeException('API ключ Steam не задан.');
        }

        return Cache::remember($this->cacheKey('steam:user:info', $steamId), now()->addDay(), function () use ($steamId) {
            $url = sprintf(
                'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=%s&steamids=%s',
                $this->apiKey,
                $steamId
            );

            try {
                $response = $this->client->get($url);
                $data = json_decode($response->getBody()->getContents(), true);

                return $data['response']['players'] ?? throw new RuntimeException('Информация о пользователе не найдена.');
            } catch (GuzzleException $e) {
                throw new RuntimeException('Ошибка при запросе к Steam API: ' . $e->getMessage());
            }
        });
    }

    /**
     * Получить информацию о играх пользователя Steam.
     *
     * @param string $steamId
     * @return array
     */
    public function getUserGames(string $steamId): array
    {

        if (empty($this->apiKey)) {
            throw new RuntimeException('API ключ Steam не задан');
        }

        return Cache::remember($this->cacheKey('steam:user:games', $steamId), now()->addDays(7), function () use ($steamId) {
            $url = sprintf(
                'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=%s&steamid=%s&include_appinfo=1',
                $this->apiKey,
                $steamId
            );

            try {
                $response = $this->client->get($url);
                $data = json_decode($response->getBody()->getContents(), true);

                return $data['response']['games'] ?? throw new RuntimeException('Информация о пользователе не найдена.');
            } catch (GuzzleException $e) {
                throw new RuntimeException('Ошибка при запросе к Steam API: ' . $e->getMessage());
            }
        });
    }

    /**
     * Получить игры друга.
     *
     * @param string $steamId
     * @return array
     */
    public function getFriendGames(string $steamId): array
    {
        if (empty($this->apiKey)) {
            throw new RuntimeException('API ключ Steam не задан');
        }

        return Cache::remember($this->cacheKey('steam:friend:games', $steamId), now()->addHours(6), function () use ($steamId) {
            $url = sprintf(
                'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=%s&steamid=%s&include_appinfo=1',
                $this->apiKey,
                $steamId
            );

            try {
                $response = $this->client->get($url);
                $data = json_decode($response->getBody()->getContents(), true);

                return $data['response']['games'] ?? [];
            } catch (GuzzleException $e) {
                throw new RuntimeException('Ошибка при запросе к Steam API: ' . $e->getMessage());
            }
        });
    }

    /**
     * Получить информацию о друзьях пользователя Steam.
     *
     * @param string $steamId
     * @return array
     */
    public function getUserFriends(string $steamId): array
    {
        if (empty($this->apiKey)) {
            throw new RuntimeException('API ключ Steam не задан');
        }

        return Cache::remember($this->cacheKey('steam:friend:friends', $steamId), now()->addDay(), function () use ($steamId) {
            $url = sprintf(
                'http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=%s&steamid=%s',
                $this->apiKey,
                $steamId
            );

            try {
                $response = $this->client->get($url);
                $data = json_decode($response->getBody()->getContents(), true);

                return $data['friendslist']['friends'] ?? throw new RuntimeException('Информация о пользователе не найдена.');
            } catch (GuzzleException $e) {
                throw new RuntimeException('Ошибка при запросе к Steam API: ' . $e->getMessage());
            }
        });
    }

    /**
     * Получить онлайн-друзей с информацией об играх
     *
     * @param string $steamId
     * @return array
     */
    public function getOnlineFriendsWithGames(string $steamId): array
    {
        // Кэшируем результат на 24 часа
        return Cache::remember($this->cacheKey('steam:user:online_friends_with_games', $steamId), now()->addDay(), function () use ($steamId) {
            // Получаем список всех друзей
            $friends = $this->getUserFriends($steamId);

            if (empty($friends)) {
                return [
                    'total_friends' => 0,
                    'online_friends' => [],
                ];
            }

            // Собираем steamID всех друзей
            $steamIds = array_column($friends, 'steamid');
            $steamIdsString = implode(',', $steamIds);

            // Получаем информацию о друзьях (одним запросом)
            $players = $this->getUserInfo($steamIdsString);

            // Фильтруем только онлайн-друзей и тех, кто в игре
            $onlineFriends = array_filter($players, function ($player) {
                return isset($player['personastate']) &&
                    ($player['personastate'] > 0 || isset($player['gameextrainfo']));
            });

            // Сортируем: сначала играющие, потом просто онлайн
            usort($onlineFriends, function ($a, $b) {
                $aPlaying = isset($a['gameextrainfo']) ? 1 : 0;
                $bPlaying = isset($b['gameextrainfo']) ? 1 : 0;

                if ($aPlaying === $bPlaying) {
                    return $b['personastate'] <=> $a['personastate'];
                }

                return $bPlaying <=> $aPlaying;
            });

            // Добавляем информацию об игре, если есть
            foreach ($onlineFriends as &$friend) {
                if (isset($friend['gameid'])) {
                    // Кэшируем информацию об игре на 7 дней
                    $friend['game_info'] = $this->getGameInfo($friend['gameid']);
                }
            }

            return [
                'total_friends' => count($friends),
                'online_friends' => array_values($onlineFriends),
            ];
        });
    }

    /**
     * Получить информацию о уровне пользователя Steam.
     *
     * @param string $steamId
     * @return int
     */
    public function getUserLevel(string $steamId): int
    {
        if (empty($this->apiKey)) {
            throw new RuntimeException('API ключ Steam не задан');
        }

        return Cache::remember($this->cacheKey('steam:friend:level', $steamId), now()->addDays(7), function () use ($steamId) {
            $url = sprintf(
                'http://api.steampowered.com/IPlayerService/GetSteamLevel/v0001/?key=%s&steamid=%s',
                $this->apiKey,
                $steamId
            );

            try {
                $response = $this->client->get($url);
                $data = json_decode($response->getBody()->getContents(), true);

                return $data['response']['player_level'] ?? throw new RuntimeException('Информация о пользователе не найдена.');
            } catch (GuzzleException $e) {
                throw new RuntimeException('Ошибка при запросе к Steam API: ' . $e->getMessage());
            }
        });
    }

    /**
     * Получить информацию об игре.
     *
     * @param int $appId
     * @return array
     */
    public function getGameInfo(int $appId): array
    {
        if (empty($this->apiKey)) {
            throw new RuntimeException('API ключ Steam не задан');
        }

        return Cache::remember($this->cacheKey('steam:game:info', $appId), now()->addDay(), function () use ($appId) {
            $url = sprintf('https://store.steampowered.com/api/appdetails?appids=%s&cc=us&l=en', $appId);

            try {
                $response = $this->client->request('GET', $url, [
                    'headers' => [
                        'User-Agent' => 'Mozilla/5.0 (compatible; SteamApp/1.0)',
                        'Accept' => 'application/json',
                    ],
                    'timeout' => 10,
                ]);

                $body = $response->getBody()->getContents();

                // Проверка: действительно ли JSON
                if (str_starts_with(trim($body), '<')) {
                    throw new RuntimeException('Steam API вернул HTML вместо JSON');
                }

                $data = json_decode($body, true);

                if (!isset($data[$appId]['success']) || !$data[$appId]['success']) {
                    throw new RuntimeException("Информация об игре (appid: $appId) не найдена или неуспешна.");
                }

                return $data[$appId]['data'] ?? [];
            } catch (GuzzleException $e) {
                throw new RuntimeException('Ошибка при запросе к Steam API: ' . $e->getMessage());
            }
        });
    }

    public function getGameAchievements(int $appId, string $steamId): array
    {
        return Cache::remember(
            $this->cacheKey('steam:game:achievements', $appId . ':' . $steamId),
            now()->addDay(),
            function () use ($appId, $steamId) {
                $url = sprintf(
                    'http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?key=%s&steamid=%s&appid=%s',
                    $this->apiKey,
                    $steamId,
                    $appId
                );

                try {
                    $response = $this->client->get($url);
                    $data = json_decode($response->getBody()->getContents(), true);

                    return $data['playerstats']['achievements'] ?? [];
                } catch (GuzzleException $e) {
                    return []; // Если ошибка, возвращаем пустой массив
                }
            }
        );
    }

    public function checkAndUpdateAchievements(CompletedGame $userGame): void
    {
        if (!$userGame->auto_complete_enabled || $userGame->is_completed) {
            return; // Галочка не включена или уже завершено
        }

        $steamService = new SteamService();
        $achievements = $steamService->getGameAchievements($userGame->app_id, $userGame->steam_id);

        if (empty($achievements)) {
            return; // У игры нет достижений или не удалось получить
        }

        $allAchieved = collect($achievements)->every(fn($a) => $a['achieved'] === 1);

        if ($allAchieved) {
            $userGame->is_completed = true;
            $userGame->save();
        }
    }
}
