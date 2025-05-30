<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{

    public function index()
    {
        $user = Auth::user();

        if (empty($user->steamID)) {
            return redirect()->route('login')->with('error', 'Please connect your Steam account first');
        }

        return Inertia::location(route('steam.user.profile', ['steamId' => $user->steamID]));
    }
//    public function index()
//    {
//        $user = Auth::user();
//
//        if (empty($user->steamID)) {
//            return redirect()->route('login')->with('error', 'Please connect your Steam account first');
//        }
//
//        try {
//            $steamId = $user->steamID;
//            // Получаем информацию о пользователе через Steam API
//            $steamUserInfo = $this->steamService->getUserInfo($steamId);
//            $steamUserGames = $this->steamService->getUserGames($steamId);
//            $steamUserFriends = $this->steamService->getOnlineFriendsWithGames($steamId);
//            //                $steamUserFriends = $this->steamService->getUserFriends($steamId);
//            $steamUserLevel = $this->steamService->getUserLevel($steamId);
//
//            // Передаем информацию в представление
//            return Inertia::render('Dashboard/dashboard', [
//                'steamUserInfo' => $steamUserInfo[0] ?? null,
//                'steamUserGames' => $steamUserGames,
//                'steamUserFriends' => $steamUserFriends,
//                'steamUserLevel' => $steamUserLevel,
//            ]);
//        } catch (Exception|ConnectException $e) {
//            // Обработка ошибок
//            return Inertia::render('Dashboard/dashboard', [
//                'error' => 'Failed to load Steam data: ' . $e->getMessage()
//            ]);
//        }
//    }
}
