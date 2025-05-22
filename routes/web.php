<?php

use App\Http\Controllers\Api\SteamController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GameCompletionController;
use App\Http\Controllers\GamesListController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('gameslist', [GamesListController::class, 'index'])->name('games.list');

    // Контроль завершённости игр
    Route::prefix('gameslist')->group(function () {
        // ✅ Правильный метод: POST
        Route::post('/{appid}/toggle-completion', [GameCompletionController::class, 'toggle'])
            ->name('game.toggle_completion');

        // Получение статуса
        Route::get('/{appid}/completion-status', [GameCompletionController::class, 'status'])
            ->name('game.completion_status');

        Route::get('/{appid}/auto-complete', [GameCompletionController::class, 'autoCompleteIfAllAchievementsDone'])
            ->name('game.auto_complete');
    });

    Route::get('/steam/user', [SteamController::class, 'getUserInfo']);
    Route::get('/steam/games', [SteamController::class, 'getUserGames']);
    Route::get('/steam/friends', [SteamController::class, 'getUserFriends']);
    Route::get('/steam/game/{appId}', [SteamController::class, 'getGameDetails']);
    Route::get('/steam/friend/{steamId}/games', [SteamController::class, 'getFriendGames']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
