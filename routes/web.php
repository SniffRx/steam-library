<?php

use App\Http\Controllers\Api\SteamController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GameCompletionController;
use App\Http\Controllers\GamesListController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome/welcome');
})->name('home');

Route::get('/health', function () { return json_encode(['status' => 'OK']);});

Route::middleware(['auth', 'verified'])->group(function () {

    //Вывод пользователя
    //Вывод игр
    //Вывод

    Route::prefix('steam')->middleware('auth')->group(function () {
        // Информация о пользователе
        Route::get('user', [SteamController::class, 'getUserInfo'])->name('steam.user.info');
        Route::get('user/{steamId}', [SteamController::class, 'getUser'])->name('steam.user.profile');

        // Игры пользователя
        Route::get('games', [SteamController::class, 'getUserGames'])->name('steam.user.games');
        Route::get('game/{appId}/details', [SteamController::class, 'getGameDetails'])->name('steam.game.details');
        Route::get('game/{appId}/friends', [SteamController::class, 'getFriendGames'])->name('steam.game.friends');

        // Друзья
        Route::get('friends', [SteamController::class, 'getUserFriends'])->name('steam.user.friends');
        Route::get('friend/{steamId}/games', [SteamController::class, 'getFriendGames'])->name('steam.friend.games');
    });

//    Route::prefix('steam')->group(function () {
//       Route::get('user/{steamId}', [SteamController::class, 'getUser'])->name('steam.user');
//       Route::get('games/{appId}', [SteamController::class, 'getGameDetails'])->name('steam.games');
//       Route::get('user/{steamId}', [SteamController::class, 'getUser'])->name('steam.user');
//    });

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('gameslist', [GamesListController::class, 'index'])->name('games.list');

    // Список с играми
    Route::prefix('gameslist')->group(function () {
        Route::post('/{appid}/toggle-completion', [GameCompletionController::class, 'toggle'])
            ->name('game.toggle_completion');
        Route::get('/{appid}/completion-status', [GameCompletionController::class, 'status'])
            ->name('game.completion_status');
        Route::get('/{appid}/auto-complete', [GameCompletionController::class, 'autoCompleteIfAllAchievementsDone'])
            ->name('game.auto_complete');
    });

//    Route::prefix('steam')->group(function () {
//        Route::get('user', [SteamController::class, 'getUserInfo']);
//        Route::get('games', [SteamController::class, 'getUserGames']);
//        Route::get('friends', [SteamController::class, 'getUserFriends']);
//        Route::get('game/{appId}', [SteamController::class, 'getGameDetails']);
//        Route::get('friend/{steamId}/games', [SteamController::class, 'getFriendGames']);
//    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
