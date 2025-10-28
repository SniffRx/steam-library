<?php

namespace App\Http\Controllers;

use App\Jobs\SyncUserCompletedGamesJob;
use App\Models\CompletedGame;
use App\Services\Steam\SteamService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
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
        $completion->completed_at = $completion->is_completed ? now() : null;
        $completion->save();

        // Инвалидируем кеш
        Cache::forget("user:{$user->id}:completed_games");

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
            // Кешируем результат на 1 час
            $cacheKey = "game:{$appid}:user:{$user->steamID}:achievements";

            $achievements = Cache::remember($cacheKey, 3600, function () use ($appid, $user) {
                return $this->steamService->getGameAchievements($appid, $user->steamID);
            });
//            $steamService = app(SteamService::class);
//            $achievements = $steamService->getGameAchievements($user->steamID, $appid);

            if (empty($achievements)) {
                return response()->json(['skipped' => true, 'reason' => 'No achievements']);
            }

//            if (!$achievements || count($achievements) === 0) {
//                return response()->json([
//                    'skipped' => true,
//                    'reason' => 'No achievements found for this game'
//                ]);
//            }

            // Проверяем, все ли достижения получены
            $allUnlocked = collect($achievements)
                ->every(fn($achievement) => ($achievement['achieved'] ?? 0) == 1);

            if ($allUnlocked) {
                // Используем upsert вместо firstOrCreate
                CompletedGame::upsert(
                    [
                        [
                            'user_id' => $user->id,
                            'game_appid' => $appid,
                            'is_completed' => true,
                            'completed_at' => now(),
                            'updated_at' => now(),
                            'created_at' => now(),
                        ]
                    ],
                    ['user_id', 'game_appid'],
                    ['is_completed', 'completed_at', 'updated_at']
                );

                Cache::forget("user:{$user->id}:completed_games");

                return response()->json([
                    'completed' => true,
                    'message' => 'Game auto-completed'
                ]);
            }
            return response()->json(['completed' => false]);

        } catch (Throwable $e) {
            Log::error("Failed to auto-complete game {$appid}: {$e->getMessage()}");
            return response()->json(['error' => 'Failed to check achievements'], 500);
//            return response()->json([
//                'error' => 'Failed to fetch or process achievements',
//                'message' => $e->getMessage()
//            ], 500);
        }
    }

    /**
     * Проверяем ачивки для всех игр пользователя и помечаем те, где все открыты.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    /**
     * Устаревший метод - оставлен для совместимости
     */
    public function checkAll(): JsonResponse
    {
        return $this->syncAll(request());
    }

    /**
     * Запускает фоновую синхронизацию всех игр пользователя
     */
    public function syncAll(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $cacheKeyProgress = "user:{$user->id}:completion_sync_progress";
        $cacheKeyLastSync = "user:{$user->id}:last_completion_sync_time";

        // Проверяем, не запущен ли уже процесс
        $existingProgress = Cache::get($cacheKeyProgress);
        if ($existingProgress && $existingProgress['status'] === 'processing') {
            return response()->json([
                'message' => 'Sync already in progress',
                'progress' => $existingProgress
            ]);
        }

        // Проверяем время последней успешной синхронизации
        $lastSync = Cache::get($cacheKeyLastSync);
        if ($lastSync) {
            $lastSyncTime = \Carbon\Carbon::parse($lastSync);
            $now = \Carbon\Carbon::now();
            if ($now->diffInHours($lastSyncTime) < 24) {
                return response()->json([
                    'message' => 'Sync can be run only once every 24 hours',
                    'last_sync' => $lastSyncTime->toDateTimeString()
                ], 429);
            }
        }

        // Устанавливаем начальный статус
        Cache::put($cacheKeyProgress, [
            'status' => 'queued',
            'progress' => 0,
            'started_at' => now()->toISOString(),
        ], 300);

        // Запускаем job синхронизации
        $forceRefresh = $request->boolean('force', false);
        SyncUserCompletedGamesJob::dispatch($user->id, $forceRefresh);

        // Сохраняем время последнего запуска синхронизации
        Cache::put($cacheKeyLastSync, now(), 24 * 60 * 60); // 24 часа

        return response()->json([
            'message' => 'Sync started',
            'status' => 'queued'
        ]);
    }

    /**
     * Получить текущий прогресс синхронизации
     */
    public function syncProgress(): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $cacheKey = "user:{$user->id}:completion_sync_progress";
        $progress = Cache::get($cacheKey);

        if (!$progress) {
            return response()->json([
                'status' => 'idle',
                'message' => 'No sync in progress'
            ]);
        }

        return response()->json($progress);
    }
}
