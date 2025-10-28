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

    public int $timeout = 1800;
    public int $tries = 2;

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

            // ШАГ 2: Получаем игры с их appid ОДНИМ запросом
            $userGamesData = $user->userGames()
                ->with('game:id,appid') // Загружаем только нужные поля
                ->get(['id', 'game_id', 'user_id']);

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

            // ШАГ 3: Получаем все существующие записи ОДНИМ запросом
            $existingCompletions = CompletedGame::where('user_id', $user->id)
                ->pluck('updated_at', 'game_id')
                ->toArray();

            $processed = 0;
            $completed = 0;
            $errors = 0;
            $batchUpdates = [];

            Cache::put($cacheKey, [
                'status' => 'processing',
                'progress' => 20,
                'processed' => 0,
                'total' => $totalGames,
                'completed' => 0,
                'message' => 'Проверка достижений...',
            ], 600);

            // ШАГ 4: Обрабатываем по 100 игр за раз
            foreach ($userGamesData->chunk(100) as $gamesChunk) {
                foreach ($gamesChunk as $userGame) {
                    $game = $userGame->game;

                    if (!$game || !$game->appid) {
                        $processed++;
                        continue;
                    }

                    // Пропускаем недавно проверенные (БЕЗ запроса к БД!)
                    if (!$this->forceRefresh
                        && isset($existingCompletions[$game->id])
                        && $existingCompletions[$game->id]->gt(now()->subDays(7))
                    ) {
                        $processed++;
                        continue;
                    }

                    try {
                        // Кешируем результаты API на 7 дней
                        $cacheKeyAch = "game:{$game->appid}:user:{$user->steamID}:achievements";

                        $achievements = Cache::remember($cacheKeyAch, 60 * 60 * 24 * 7, function () use ($steamService, $game, $user) {
                            return $steamService->getGameAchievements($game->appid, $user->steamID);
                        });

                        if (empty($achievements)) {
                            $processed++;
                            continue;
                        }

                        $allUnlocked = collect($achievements)
                            ->every(fn($achievement) => ($achievement['achieved'] ?? 0) == 1);

                        // Собираем обновления в батч
                        $batchUpdates[] = [
                            'user_id' => $user->id,
                            'game_id' => $game->id,
                            'game_appid' => $game->appid,
                            'is_completed' => $allUnlocked,
                            'completed_at' => $allUnlocked ? now() : null,
                            'updated_at' => now(),
                            'created_at' => now(),
                        ];

                        if ($allUnlocked) {
                            $completed++;
                        }

                    } catch (\Throwable $e) {
                        $errors++;
                        Log::debug("Failed achievements check for game {$game->appid}: {$e->getMessage()}");
                    }

                        $processed++;

                    // Обновляем прогресс и записываем батч каждые 20 игр
                        if ($processed % 20 === 0) {
                            $this->batchUpdateCompletions($batchUpdates);
                            $batchUpdates = [];

                            Cache::put($cacheKey, [
                                'status' => 'processing',
                                'progress' => 20 + round(($processed / $totalGames) * 75),
                                'processed' => $processed,
                                'total' => $totalGames,
                                'completed' => $completed,
                                'errors' => $errors,
                            ], 600);
                        }

                        usleep(20000); // Уменьшено до 20ms (было 50ms)
                    }

                    // Освобождаем память после каждого чанка
                    gc_collect_cycles();
                }

            // Записываем остатки батча
            if (!empty($batchUpdates)) {
                $this->batchUpdateCompletions($batchUpdates);
            }

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

        } catch (\Throwable $e) {
            Log::error("Sync failed for user {$user->id}: {$e->getMessage()}");
            Cache::put($cacheKey, [
                'status' => 'error',
                'message' => $e->getMessage()
            ], 300);
        }
    }

    /**
     * Батчевое обновление/вставка записей
     */
    private function batchUpdateCompletions(array $updates): void
    {
        if (empty($updates)) {
            return;
        }

        // Используем upsert для массовой вставки/обновления
        CompletedGame::upsert(
            $updates,
            ['user_id', 'game_id'], // Уникальные ключи
            ['game_appid', 'is_completed', 'completed_at', 'updated_at'] // Обновляемые поля
        );
    }
}
