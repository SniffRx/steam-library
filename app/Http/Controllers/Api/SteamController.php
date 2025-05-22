<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Steam\SteamService;
use Exception;
use Illuminate\Support\Facades\Auth;

class SteamController extends Controller
{
    private SteamService $steamService;

    public function __construct(SteamService $steamService)
    {
        $this->steamService = $steamService;
    }

    public function getUserInfo()
    {
        $steamId = Auth::user()->steamId;
        return response()->json($this->steamService->getUserInfo($steamId));
    }

    public function getUserGames()
    {
        $steamId = Auth::user()->steam_id;
        $games = $this->steamService->getUserGames($steamId);

        return response()->json([
            'games' => $games['games'] ?? [],
            'game_count' => $games['game_count'] ?? 0
        ]);
    }

    public function getUserFriends()
    {
        $steamId = Auth::user()->steamId;
        $friends = $this->steamService->getUserFriends($steamId);

        $steamIds = collect($friends)->pluck('steamid')->implode(',');
        $summaries = $this->steamService->getUserInfo($steamIds);

        return response()->json($summaries);
    }

    public function getGameDetails($appId)
    {
        try {
            $details = $this->steamService->getGameInfo($appId);
            $steamId = Auth::user()->steamID;
            $details['achievements'] = $this->steamService->getGameAchievements($appId, $steamId);
            return response()->json($details);
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getFriendGames($steamId)
    {
        return response()->json($this->steamService->getFriendGames($steamId));
    }
}
