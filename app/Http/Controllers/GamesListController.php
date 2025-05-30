<?php

namespace App\Http\Controllers;

use App\Models\CompletedGame;
use App\Services\Steam\SteamService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class GamesListController extends Controller
{

    private SteamService $steamService;

    public function __construct(SteamService $steamService)
    {
        $this->steamService = $steamService;
    }

    /**
     * Отображает страницу со списком игр пользователя.
     *
     * @return Response|RedirectResponse
     */
    public function index()
    {
        $steamId = Auth::user()->steamID;

        try {
            // Получаем список игр пользователя
            $games = $this->steamService->getUserGames($steamId);

            // Получаем друзей с их данными
            $friends = $this->steamService->getUserFriends($steamId);

            $completedGames = auth()->user()
                ? CompletedGame::where('user_id', auth()->id())
                    ->where('is_completed', true)
                    ->pluck('game_appid')
                    ->map(fn($appid) => (int)$appid)
                    ->toArray()
                : [];

            return Inertia::render('GamesList/GamesList', [
                'games' => $games ?? [],
                'friends' => $friends,
                'gameCount' => is_array($games) ? count($games) : 0,
                'completedGames' => $completedGames
            ]);
        } catch (Exception $e) {
            return Inertia::render('GamesList/GamesList', [
                'games' => [],
                'friends' => [],
                'completedGames' => [],
                'error' => 'Failed to load Steam data: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Получает информацию о друзьях пользователя.
     *
     * @param string $steamId
     * @return array<int, array<string, mixed>>
     */
    private function getFriendsWithSummaries(string $steamId): array
    {
        $friends = $this->steamService->getUserFriends($steamId);

        if (empty($friends)) {
            return [];
        }

        $steamIds = collect($friends)->pluck('steamid')->implode(',');
        $userInfo = $this->steamService->getUserInfo($steamIds);

        return $userInfo['players'] ?? [];
    }

}

