<?php

namespace App\Jobs;

use App\Models\Game;
use App\Services\GameSyncService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncGameDetailsBatchJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 600;
    public int $tries = 3;

    public function __construct(private int $batchSize = 20)
    {
    }

    public function handle(GameSyncService $gameSyncService): void
    {
        // Находим игры, которые давно не обновлялись
        $games = Game::where(function ($query) {
            $query->whereNull('last_synced_at')
                ->orWhere('last_synced_at', '<', now()->subDays(7));
        })
            ->whereNull('header_image') // Приоритет играм без деталей
            ->limit($this->batchSize)
            ->pluck('id')
            ->toArray();

        if (empty($games)) {
            return;
        }

        $gameSyncService->syncMultipleGameDetails($games, $this->batchSize);
    }
}
