<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserGame extends Model
{
    protected $fillable = [
        'user_id',
        'game_id',
        'playtime_forever',
        'playtime_2weeks',
        'last_played_at',
    ];

    protected $casts = [
        'playtime_forever' => 'integer',
        'playtime_2weeks' => 'integer',
        'last_played_at' => 'datetime',
    ];

    /**
     * Владелец игры
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Информация об игре
     */
    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    /**
     * Форматированное время игры
     */
    public function getFormattedPlaytimeAttribute(): string
    {
        $hours = floor($this->playtime_forever / 60);
        $minutes = $this->playtime_forever % 60;

        if ($hours > 0) {
            return "{$hours}h {$minutes}m";
        }

        return "{$minutes}m";
    }
}
