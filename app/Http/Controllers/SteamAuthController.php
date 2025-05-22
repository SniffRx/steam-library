<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\Auth\SteamAuth;
use Illuminate\Support\Facades\Auth;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;

class SteamAuthController extends Controller
{

    /**
     * AuthController constructor.
     *
     * @param SteamAuth $steam
     */
    public function __construct(private readonly SteamAuth $steam)
    {
    }

    /**
     * Redirect the user to the authentication page
     *
     * @return RedirectResponse
     */
    public function redirect()
    {
        return $this->steam->redirect();
    }

    /**
     * Get user info and log in
     *
     * @return RedirectResponse|Redirector
     * @throws GuzzleException
     */
    public function handle(Request $request)
    {
        if (!$this->steam->validate($request)) {
            return redirect()->route('login')->withErrors(['steam' => 'Steam authentication failed.']);
        }

        $steamId = $this->steam->getSteamId($request);
        $info = $this->steam->getUserInfo($steamId);

        $user = User::firstOrCreate(
            ['steamID' => $steamId],
            [
                'name' => $info['personaname'],
                'avatar' => $info['avatarfull'],
                'email' => $steamId . '@steam.local', // фейковый email
                'password' => bcrypt(str()->random(32)), // случайный пароль
            ]
        );

        Auth::login($user, true);

        return redirect()->route('dashboard');
    }
}
