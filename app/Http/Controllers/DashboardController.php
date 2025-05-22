<?php

namespace App\Http\Controllers;

use App\Services\Steam\SteamService;
use Exception;
use GuzzleHttp\Exception\ConnectException;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private $steamService;

    public function __construct(SteamService $steamService)
    {
        $this->steamService = $steamService;
    }

    public function index()
    {
        $user = Auth::user();

        if (empty($user->steamID)) {
            return redirect()->route('login')->with('error', 'Please connect your Steam account first');
        }

        try {
            $steamId = $user->steamID;
            // Получаем информацию о пользователе через Steam API
            $steamUserInfo = $this->steamService->getUserInfo($steamId);
            $steamUserGames = $this->steamService->getUserGames($steamId);
            $steamUserFriends = $this->steamService->getOnlineFriendsWithGames($steamId);
            //                $steamUserFriends = $this->steamService->getUserFriends($steamId);
            $steamUserLevel = $this->steamService->getUserLevel($steamId);

            // Передаем информацию в представление
            return Inertia::render('dashboard', [
                'steamUserInfo' => $steamUserInfo[0] ?? null,
                'steamUserGames' => $steamUserGames,
                'steamUserFriends' => $steamUserFriends,
                'steamUserLevel' => $steamUserLevel,
            ]);
        } catch (Exception|ConnectException $e) {
            // Обработка ошибок
            return Inertia::render('dashboard', [
                'error' => 'Failed to load Steam data: ' . $e->getMessage()
            ]);
        }
    }
}
