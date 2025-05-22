<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompletedGame extends Model
{
    protected $fillable = [
        'user_id',
        'game_appid',
        'is_completed',
        'completed_at'
    ];
}
