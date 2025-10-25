<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    protected $fillable = [
        'appid',
        'name',
        'img_icon_url',
        'header_image',
        'short_description',
        'detailed_description',
        'developers',
        'publishers',
        'genres',
        'categories',
        'screenshots', // НОВОЕ
        'movies', // НОВОЕ
        'pc_requirements', // НОВОЕ
        'mac_requirements', // НОВОЕ
        'linux_requirements', // НОВОЕ
        'platforms', // НОВОЕ
        'release_date',
        'metacritic_score',
        'price_currency',
        'price_initial',
        'price_final',
        'is_free',
        'last_synced_at',
    ];

    protected $casts = [
        'appid' => 'integer',
        'developers' => 'array',
        'publishers' => 'array',
        'genres' => 'array',
        'categories' => 'array',
        'screenshots' => 'array', // НОВОЕ
        'movies' => 'array', // НОВОЕ
        'pc_requirements' => 'array', // НОВОЕ
        'mac_requirements' => 'array', // НОВОЕ
        'linux_requirements' => 'array', // НОВОЕ
        'platforms' => 'array', // НОВОЕ
        'release_date' => 'date',
        'metacritic_score' => 'integer',
        'price_initial' => 'integer',
        'price_final' => 'integer',
        'is_free' => 'boolean',
        'last_synced_at' => 'datetime',
    ];

    /**
     * Пользователи, у которых есть эта игра
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_games')
            ->withPivot(['playtime_forever', 'playtime_2weeks', 'last_played_at'])
            ->withTimestamps();
    }

    /**
     * Связь через user_games
     */
    public function userGames(): HasMany
    {
        return $this->hasMany(UserGame::class);
    }

    /**
     * Статусы завершения
     */
    public function completions(): HasMany
    {
        return $this->hasMany(CompletedGame::class);
    }

    /**
     * Проверка, нужно ли обновить данные игры
     */
    public function needsSync(): bool
    {
        // Обновляем раз в неделю
        return !$this->last_synced_at || $this->last_synced_at->diffInDays(now()) > 7;
    }

    /**
     * Форматированная цена
     */
    public function formattedPrice(): ?string
    {
        if ($this->is_free) {
            return 'Free';
        }

        if (!$this->price_final) {
            return null;
        }

        $price = $this->price_final / 100;
        return ($this->price_currency ?? 'USD') . ' ' . number_format($price, 2);
    }

    /**
     * Есть ли скидка
     */
    public function hasDiscount(): bool
    {
        return $this->price_initial && $this->price_final && $this->price_initial > $this->price_final;
    }

    /**
     * Процент скидки
     */
    public function discountPercent(): ?int
    {
        if (!$this->hasDiscount()) {
            return null;
        }

        return round((($this->price_initial - $this->price_final) / $this->price_initial) * 100);
    }
}
