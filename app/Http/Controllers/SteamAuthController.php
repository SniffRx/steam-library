<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\Auth\SteamAuth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Exception\GuzzleException;

class SteamAuthController extends Controller
{

    /**
     * AuthController constructor.
     *
     * @param SteamAuth $steam
     */
    public function __construct(private readonly SteamAuth $steam) {}

    /**
     * Redirect the user to the authentication page
     *
     * @return RedirectResponse
     */
    public function redirect(): RedirectResponse
    {
        return $this->steam->redirect();
    }

    /**
     * Get user info and log in
     *
     * @param Request $request
     * @return RedirectResponse
     * @throws GuzzleException
     */
    public function handle(Request $request): RedirectResponse
    {
        if (!$this->steam->validate($request)) {
            Log::warning('Steam authentication failed', ['ip' => $request->ip()]);
            return redirect()->route('login')->withErrors(['steam' => 'Steam authentication failed.']);
        }

        $steamId = $this->steam->getSteamId($request);
        $info = $this->steam->getUserInfo($steamId);

        if (!isset($info['personaname'], $info['avatarfull'])) {
            Log::error('Failed to get Steam user info', ['steam_id' => $steamId]);
            return redirect()->route('login')
                ->withErrors(['steam' => 'Не удалось получить информацию о вашем аккаунте Steam.']);
        }

        $fakeEmail = 'steam_' . $steamId . '@steam.local';

        // Создаем или обновляем пользователя
        $user = User::updateOrCreate(
            ['steamID' => $steamId],
            [
                'name' => $info['personaname'],
                'avatar' => $info['avatarfull'],
                'email' => $fakeEmail,
                'password' => bcrypt(str()->random(32)), // Случайный пароль, т.к. вход через Steam
            ]
        );

        Auth::login($user, true);

        Log::info('User logged in via Steam', ['user_id' => $user->id, 'steam_id' => $steamId]);

        return redirect()->route('dashboard');
    }
}
