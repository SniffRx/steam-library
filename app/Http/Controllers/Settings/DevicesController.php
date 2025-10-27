<?php
namespace App\Http\Controllers\Settings;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DevicesController
{
    // Показываем список активных сессий (устройств)
    public function index(Request $request)
    {
        $sessions = DB::table('sessions')
            ->where('user_id', Auth::id())
            ->orderBy('last_activity', 'desc')
            ->get()
            ->map(function ($session) {
                return (object)[
                    'id' => $session->id,
                    'ip_address' => $session->ip_address,
                    'user_agent' => $session->user_agent,
                    'last_activity' => Carbon::createFromTimestamp($session->last_activity)->diffForHumans(),
                ];
            });

        return Inertia::render('settings/devices', [
            'sessions' => $sessions,
            'current_session_id' => $request->session()->getId(),
        ]);
    }

    // Удаляем сессию конкретного устройства, деавторизуя его
    public function logoutDevice(Request $request, $sessionId)
    {
        $session = DB::table('sessions')->where('id', $sessionId)->first();

        if (! $session || $session->user_id !== Auth::id()) {
            abort(403);
        }

        // Предотвращаем удаление текущей сессии (безопасность)
        if ($sessionId === $request->session()->getId()) {
            return back()->withErrors(['error' => 'Нельзя отключить текущую сессию.']);
        }

        // Удаляем указанную сессию
        DB::table('sessions')->where('id', $sessionId)->delete();

        // Возвращаемся назад с сообщением
        return back()->with('status', 'Устройство отключено');
    }

    // Разлогиниваем все устройства кроме текущего с подтверждением пароля
    public function logoutOtherDevices(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        if (! Auth::validate(['email' => Auth::user()->email, 'password' => $request->password])) {
            return back()->withErrors(['password' => 'Неверный пароль.']);
        }

        // Удаляем все сессии пользователя кроме текущей
        DB::table('sessions')
            ->where('user_id', Auth::id())
            ->where('id', '!=', $request->session()->getId())
            ->delete();

        return back()->with('status', 'Вы успешно вышли из всех остальных устройств!');
    }
}
