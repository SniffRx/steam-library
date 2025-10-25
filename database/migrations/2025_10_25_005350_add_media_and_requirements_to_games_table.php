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
        Schema::table('games', function (Blueprint $table) {
            $table->json('screenshots')->nullable()->after('categories');
            $table->json('movies')->nullable()->after('screenshots');
            $table->json('pc_requirements')->nullable()->after('movies');
            $table->json('mac_requirements')->nullable()->after('pc_requirements');
            $table->json('linux_requirements')->nullable()->after('mac_requirements');
            $table->json('platforms')->nullable()->after('linux_requirements');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn([
                'screenshots',
                'movies',
                'pc_requirements',
                'mac_requirements',
                'linux_requirements',
                'platforms',
            ]);
        });
    }
};
