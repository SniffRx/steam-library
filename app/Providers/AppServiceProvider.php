<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share('completedGames', function () {
            if (Auth::check()) {
                return Auth::user()->completedGames()
                    ->where('is_completed', true)
                    ->pluck('game_appid')
                    ->map(fn($id) => (int)$id)
                    ->toArray();
            }

            return [];
        });

        Inertia::share('auth.user.id', fn() => Auth::check() ? Auth::user()->id : null);
    }
}
