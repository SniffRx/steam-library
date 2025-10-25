<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'steamID',
        'auto_mark_completed'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'auto_mark_completed' => 'boolean',
        ];
    }

    /**
     * Игры пользователя (many-to-many через user_games)
     */
    public function games(): BelongsToMany
    {
        return $this->belongsToMany(Game::class, 'user_games')
            ->withPivot(['playtime_forever', 'playtime_2weeks', 'last_played_at'])
            ->withTimestamps();
    }

    /**
     * Связь через user_games напрямую
     */
    public function userGames(): HasMany
    {
        return $this->hasMany(UserGame::class);
    }

    /**
     * Завершённые игры
     */
    public function completedGames(): HasMany
    {
        return $this->hasMany(CompletedGame::class);
    }

    /**
     * Получить игры с полной информацией + статусы
     */
    public function getGamesWithCompletion()
    {
        return $this->games()
            ->with(['completions' => function ($query) {
                $query->where('user_id', $this->id);
            }])
            ->orderByPivot('playtime_2weeks', 'desc')
            ->get()
            ->map(function ($game) {
                $completion = $game->completions->first();

                return [
                    'appid' => $game->appid,
                    'name' => $game->name,
                    'header_image' => $game->header_image,
                    'short_description' => $game->short_description,
                    'playtime_forever' => $game->pivot->playtime_forever,
                    'playtime_2weeks' => $game->pivot->playtime_2weeks,
                    'last_played_at' => $game->pivot->last_played_at,
                    'is_completed' => $completion?->is_completed ?? false,
                    'completed_at' => $completion?->completed_at,
                    'price' => $game->formatted_price,
                    'has_discount' => $game->has_discount,
                    'discount_percent' => $game->discount_percent,
                ];
            });
    }
}
