<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSteamConnected
{
    /**
     * Проверить, что у пользователя подключён Steam аккаунт
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if (empty($user->steamID)) {
            return redirect()
                ->route('login')
                ->with('warning', __('dashboard.connect_steam_required'));
        }

        return $next($request);
    }
}
