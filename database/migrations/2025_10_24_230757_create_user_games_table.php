<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('game_id')->constrained()->onDelete('cascade');
            $table->integer('playtime_forever')->default(0); // в минутах
            $table->integer('playtime_2weeks')->nullable(); // в минутах
            $table->timestamp('last_played_at')->nullable();
            $table->timestamps();

            // Уникальная связь: один пользователь - одна игра
            $table->unique(['user_id', 'game_id']);

            // Индексы
            $table->index('user_id');
            $table->index('game_id');
            $table->index(['user_id', 'playtime_forever']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_games');
    }
};
