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
        Schema::table('completed_games', function (Blueprint $table) {
            // Добавляем game_id как альтернативу game_appid
            $table->foreignId('game_id')->nullable()->after('game_appid')->constrained()->onDelete('cascade');

            // Делаем game_appid nullable (временно для миграции данных)
            $table->bigInteger('game_appid')->unsigned()->nullable()->change();

            // Добавляем индекс для game_id
            $table->index('game_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('completed_games', function (Blueprint $table) {
            $table->dropForeign(['game_id']);
            $table->dropColumn('game_id');
            $table->bigInteger('game_appid')->unsigned()->nullable(false)->change();
        });
    }
};
