<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\GameSyncService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncGameDetails implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 600;
    public int $tries = 3;

    public function __construct(private int $userId)
    {}

    public function handle(GameSyncService $gameSyncService): void
    {
        $user = User::find($this->userId);

        if (!$user) {
            Log::warning("User {$this->userId} not found for game details sync");
            return;
        }

        try {
            // Постепенно загружаем детали игр (по 10 за раз)
            $syncedCount  = $gameSyncService->syncGameDetailsInBatches($user, 10);

            if ($syncedCount > 0) {
                Log::info("Synced details for {$syncedCount} games for user {$user->id}");
            }

        } catch (\Throwable $e) {
            Log::error("Failed to sync game details for user {$user->id}: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
