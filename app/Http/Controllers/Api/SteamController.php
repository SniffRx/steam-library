<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Steam\SteamService;
use Exception;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use RuntimeException;

class SteamController extends Controller
{
    private SteamService $steamService;

    public function __construct(SteamService $steamService)
    {
        $this->steamService = $steamService;
    }

    public function getUserInfo()
    {
        $steamId = Auth::user()->steamID;
        return response()->json($this->steamService->getUserInfo($steamId));
    }

    public function getUserGames()
    {
        $steamId = Auth::user()->steamID;
        $games = $this->steamService->getUserGames($steamId);

        return response()->json([
            'games' => $games['games'] ?? [],
            'game_count' => $games['game_count'] ?? 0
        ]);
    }

    public function getUserFriends()
    {
        $steamId = Auth::user()->steamID;
        $friends = $this->steamService->getUserFriends($steamId);

        $steamIds = collect($friends)->pluck('steamid')->implode(',');
        $summaries = $this->steamService->getUserInfo($steamIds);

        return response()->json($summaries);
    }

    public function getGameDetails(int $appId)
    {
        try {
            // Получаем информацию об игре
            $gameInfo = $this->steamService->getGameInfo($appId);

            if (empty($gameInfo)) {
                return response()->json([
                    'error' => 'Игра не найдена или данные недоступны',
                    'game_info' => []
                ]);
            }

            // Получаем ID текущего пользователя
            $steamId = Auth::user()?->steamID;

            // Если пользователь авторизован — получаем его достижения
            $achievements = [];
            if ($steamId) {
                $achievements = $this->steamService->getGameAchievements($appId, $steamId);
            }

            // Формируем финальный ответ
            return response()->json([
                'game_info' => $gameInfo,
                'achievements' => $achievements,
            ]);

        } catch (\Exception $e) {
            \Log::error("Ошибка при загрузке информации об игре {$appId}: " . $e->getMessage());

            return response()->json([
                'error' => 'Не удалось загрузить информацию об игре',
                'game_info' => [],
                'achievements' => []
            ], 500);
        }
    }

    public function getFriendGames($steamId)
    {
        return response()->json($this->steamService->getFriendGames($steamId));
    }

    public function getUser(string $steamId)
    {

        try {
            $user = User::where('steamID', $steamId)->firstOrFail();

            $userInfo = $this->steamService->getUserInfo($steamId);
            $userBans = $this->steamService->getUserBans($steamId);
            $userLevel = $this->steamService->getUserLevel($steamId);
            $userRecentlyGames = $this->steamService->getRecentlyPlayedGames($steamId);
            $userGamesCount = $this->steamService->getUserGamesCount($steamId);
            $userFriends = $this->steamService->getOnlineFriendsWithGames($steamId);

            if($user->exists()) return Inertia::render('userPage/UserPage',
                [
                    'userInfo' => $userInfo[0],
                    'userBans' => $userBans,
                    'userLevel' => $userLevel,
                    'userFriends' => $userFriends,
                    'userRecentlyGames' => $userRecentlyGames,
                    'userGamesCount' => $userGamesCount

                ]);

            return throw new RuntimeException('User does not exist.');
        } catch (Exception $e) {
            return Inertia::render('userNotFound', ['steamID' => $steamId]);
        }
    }
}
