<?php

namespace App\Http\Controllers;

use App\Models\CompletedGame;
use App\Services\Steam\SteamService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Throwable;

class GameCompletionController extends Controller
{
    public function toggle(int $appid): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $completion = CompletedGame::firstOrCreate([
            'user_id' => $user->id,
            'game_appid' => $appid,
        ]);

        $completion->is_completed = !$completion->is_completed;
        $completion->save();

        return response()->json([
            'is_completed' => $completion->is_completed,
            'game_appid' => $completion->game_appid
        ]);
    }

    public function status(int $appid): JsonResponse
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['is_completed' => false], 401);
        }

        $status = CompletedGame::where('user_id', $userId)
            ->where('game_appid', $appid)
            ->first();

        return response()->json([
            'is_completed' => $status?->is_completed ?? false,
            'completed_at' => $status?->completed_at,
        ]);
    }

    public function autoCompleteIfAllAchievementsDone(int $appid): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if (!$user->auto_mark_completed) {
            return response()->json(['skipped' => true, 'reason' => 'Auto-mark is disabled']);
        }

        // Получаем достижения через SteamService
        try {
            $steamService = app(SteamService::class);
            $achievements = $steamService->getGameAchievements($user->steamID, $appid);

            if (!$achievements || count($achievements) === 0) {
                return response()->json([
                    'skipped' => true,
                    'reason' => 'No achievements found for this game'
                ]);
            }

            // Проверяем, все ли достижения получены
            $allUnlocked = collect($achievements)
                ->every(fn($achievement) => $achievement['achieved'] == 1);

            if ($allUnlocked) {
                CompletedGame::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'game_appid' => $appid,
                    ],
                    [
                        'is_completed' => true,
                        'completed_at' => now(),
                    ]
                );

                return response()->json(['is_completed' => true, 'auto_marked' => true]);
            }

            return response()->json([
                'is_completed' => false,
                'auto_marked' => false,
                'reason' => 'Not all achievements are unlocked'
            ]);

        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Failed to fetch or process achievements',
                'message' => $e->getMessage()
            ], 500);
        }
    }


}
