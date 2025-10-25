<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompletedGame extends Model
{
    protected $fillable = [
        'user_id',
        'game_id',      // НОВОЕ
        'game_appid',   // Оставляем для обратной совместимости
        'is_completed',
        'completed_at'
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    /**
     * Пользователь
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * НОВОЕ: Связь с Game
     */
    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }
}
