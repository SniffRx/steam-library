<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class DashboardController extends Controller
{

    /**
     * Отобразить dashboard пользователя
     *
     * Перенаправляет на страницу профиля Steam пользователя
     */
    public function index(): InertiaResponse
    {
        return Inertia::render('Dashboard/dashboard');
    }

    /**
     * Проверить наличие Steam аккаунта
     */
    private function hasSteamAccount($user): bool
    {
        return !empty($user->steamID) && !is_null($user->steamID);
    }

    /**
     * Валидировать Steam ID (64-bit ID)
     */
    private function isValidSteamId(string $steamId): bool
    {
        // Steam ID должен быть числом из 17 цифр, начинающимся с 7656119...
        return preg_match('/^7656119[0-9]{10}$/', $steamId) === 1;
    }

    /**
     * Проверить rate limit
     */
    private function checkRateLimit(): bool
    {
        $key = 'dashboard:' . Auth::id();

        return RateLimiter::attempt(
            $key,
            $perMinute = 10, // 10 запросов в минуту
            function() {}
        );
    }

    /**
     * Логировать доступ к dashboard для аналитики
     */
    private function logDashboardAccess($user): void
    {
        // Можно использовать для аналитики посещений
        Log::info('Dashboard accessed', [
            'user_id' => $user->id,
            'steam_id' => $user->steamID,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent()
        ]);

        // Опционально: отправить в систему аналитики (Google Analytics, Mixpanel и т.д.)
        // event('dashboard.visited', ['user' => $user]);
    }

    /**
     * Редирект на профиль Steam
     */
    private function redirectToSteamProfile(string $steamId): RedirectResponse
    {
        return redirect()->to(
            route('steam.user.profile', ['steamId' => $steamId])
        );
    }

    /**
     * Редирект для подключения Steam
     */
    private function redirectToConnectSteam(): RedirectResponse
    {
        return redirect()
            ->route('login')
            ->with('warning', __('dashboard.connect_steam_required'))
            ->with('action', [
                'url' => route('steam.auth'),
                'text' => __('dashboard.connect_steam_button')
            ]);
    }

    /**
     * Редирект для переподключения Steam (невалидный ID)
     */
    private function redirectToReconnectSteam(): RedirectResponse
    {
        return redirect()
            ->route('profile.edit')
            ->with('error', __('dashboard.invalid_steam_id'))
            ->with('action', [
                'url' => route('steam.auth.reconnect'),
                'text' => __('dashboard.reconnect_steam_button')
            ]);
    }

    /**
     * Редирект с общей ошибкой
     */
    private function redirectWithError(string $message): RedirectResponse
    {
        return redirect()
            ->back()
            ->with('error', $message);
    }

    /**
     * Обработать ошибку dashboard
     */
    private function handleDashboardError(): InertiaResponse
    {
        return Inertia::render('Error', [
            'status' => 500,
            'message' => __('dashboard.error_loading'),
            'action' => [
                'url' => route('dashboard'),
                'text' => __('dashboard.try_again')
            ]
        ]);
    }
}
