<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('completed_games', function (Blueprint $table) {
            // Составной индекс для быстрого поиска по user_id + game_appid
            // Используется в: toggle(), status(), autoCompleteIfAllAchievementsDone()
            $table->index(['user_id', 'game_appid'], 'idx_user_game_appid');

            // Составной индекс для поиска по user_id + game_id
            // Используется в: Job для проверки существующих записей
            $table->index(['user_id', 'game_id'], 'idx_user_game_id');

            // Индекс для фильтрации по user_id + is_completed
            // Используется при получении списка пройденных игр
            $table->index(['user_id', 'is_completed'], 'idx_user_completed');

            // Индекс для проверки недавно обновленных записей
            // Используется в Job для пропуска недавно проверенных игр
            $table->index(['user_id', 'updated_at'], 'idx_user_updated');

            // Индекс для сортировки по дате завершения
            $table->index(['user_id', 'completed_at'], 'idx_user_completed_at');
        });
    }

    public function down(): void
    {
        Schema::table('completed_games', function (Blueprint $table) {
            $table->dropIndex('idx_user_game_appid');
            $table->dropIndex('idx_user_game_id');
            $table->dropIndex('idx_user_completed');
            $table->dropIndex('idx_user_updated');
            $table->dropIndex('idx_user_completed_at');
        });
    }
};
