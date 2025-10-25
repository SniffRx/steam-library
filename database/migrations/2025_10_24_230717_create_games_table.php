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
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('appid')->unsigned()->unique();
            $table->string('name');
            $table->string('header_image')->nullable();
            $table->text('short_description')->nullable();
            $table->json('developers')->nullable();
            $table->json('publishers')->nullable();
            $table->json('genres')->nullable();
            $table->json('categories')->nullable();
            $table->date('release_date')->nullable();
            $table->integer('metacritic_score')->nullable();
            $table->string('price_currency', 10)->nullable();
            $table->integer('price_initial')->nullable(); // в центах
            $table->integer('price_final')->nullable(); // в центах
            $table->boolean('is_free')->default(false);
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();

            // Индексы для быстрого поиска
            $table->index('appid');
            $table->index('name');
            $table->index(['is_free', 'price_final']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
