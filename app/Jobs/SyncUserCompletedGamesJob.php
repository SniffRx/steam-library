<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\CompletedGame;
use App\Services\Steam\SteamService;
use App\Services\GameSyncService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class SyncUserCompletedGamesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 900;
    public int $tries = 3;

    public function __construct(
        private int $userId,
        private bool $forceRefresh = false
    ) {}

    public function handle(
        SteamService $steamService,
        GameSyncService $gameSyncService
    ): void {
        $user = User::find($this->userId);

        if (!$user) {
            Log::warning("User {$this->userId} not found");
            return;
        }

        $cacheKey = "user:{$user->id}:completion_sync_progress";

        try {
            // ШАГ 1: БЫСТРАЯ синхронизация списка игр (без деталей)
            Cache::put($cacheKey, [
                'status' => 'processing',
                'progress' => 5,
                'message' => 'Синхронизация списка игр...',
            ], 600);

            $syncResult = $gameSyncService->syncUserGames($user);

            // Инвалидируем кеш
            Cache::forget("user:{$user->id}:games_list");

            // ШАГ 2: Получаем количество игр (не загружаем все сразу!)
            $totalGames = $user->userGames()->count();

            if ($totalGames === 0) {
                Cache::put($cacheKey, [
                    'status' => 'completed',
                    'progress' => 100,
                    'message' => 'No games found',
                    'synced_games' => 0,
                ], 300);
                return;
            }

            $processed = 0;
            $completed = 0;
            $errors = 0;

            Cache::put($cacheKey, [
                'status' => 'processing',
                'progress' => 20,
                'processed' => 0,
                'total' => $totalGames,
                'completed' => 0,
                'message' => 'Проверка достижений...',
            ], 600);

            // ШАГ 3: Обрабатываем игры ЧАНКАМИ (по 50 за раз)
            $user->userGames()
                ->with('game')
                ->chunkById(50, function ($userGames) use (
                    $user,
                    $steamService,
                    &$processed,
                    &$completed,
                    &$errors,
                    $totalGames,
                    $cacheKey
                ) {
                    foreach ($userGames as $userGame) {
                        $game = $userGame->game;

                        if (!$game) {
                            $processed++;
                            continue;
                        }

                        // Пропускаем недавно проверенные
                        if (!$this->forceRefresh) {
                            $existing = CompletedGame::where('user_id', $user->id)
                                ->where('game_id', $game->id)
                                ->where('updated_at', '>', now()->subDays(7))
                                ->first();

                            if ($existing) {
                                $processed++;
                                if ($existing->is_completed) {
                                    $completed++;
                                }
                                continue;
                            }
                        }

                        try {
                            $achievements = $steamService->getGameAchievements($game->appid, $user->steamID);

                            if (empty($achievements)) {
                                $processed++;
                                continue;
                            }

                            $allUnlocked = collect($achievements)
                                ->every(fn($achievement) => ($achievement['achieved'] ?? 0) == 1);

                            CompletedGame::updateOrCreate(
                                [
                                    'user_id' => $user->id,
                                    'game_id' => $game->id,
                                ],
                                [
                                    'game_appid' => $game->appid,
                                    'is_completed' => $allUnlocked,
                                    'completed_at' => $allUnlocked ? now() : null,
                                ]
                            );

                            if ($allUnlocked) {
                                $completed++;
                            }

                        } catch (\Throwable $e) {
                            $errors++;
                            Log::debug("Failed achievements check for game {$game->appid}: {$e->getMessage()}");
                        }

                        $processed++;

                        // Обновляем прогресс каждые 5 игр
                        if ($processed % 5 === 0) {
                            Cache::put($cacheKey, [
                                'status' => 'processing',
                                'progress' => 20 + round(($processed / $totalGames) * 75),
                                'processed' => $processed,
                                'total' => $totalGames,
                                'completed' => $completed,
                                'errors' => $errors,
                            ], 600);
                        }

                        usleep(50000); // 0.05 секунды
                    }

                    // Освобождаем память после каждого чанка
                    gc_collect_cycles();
                });

            Cache::put($cacheKey, [
                'status' => 'completed',
                'progress' => 100,
                'processed' => $processed,
                'total' => $totalGames,
                'completed' => $completed,
                'errors' => $errors,
                'synced_games' => $syncResult['synced'],
                'finished_at' => now()->toISOString(),
                'message' => 'Синхронизация завершена!',
            ], 3600);

            Cache::forget("user:{$user->id}:completed_games");
            Cache::forget("user:{$user->id}:games_list");
            Cache::forget("user:{$user->id}:sync_dispatched");

        } catch (\Throwable $e) {
            Log::error("Sync failed for user {$user->id}: {$e->getMessage()}");
            Cache::put($cacheKey, [
                'status' => 'error',
                'message' => $e->getMessage()
            ], 300);

            Cache::forget("user:{$user->id}:sync_dispatched");
        }
    }
}
