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
        Schema::table('notifications', function (Blueprint $table) {
            // Remove the old boolean column
            $table->dropColumn('is_read');
            
            // Add the new timestamp column, which can be null (meaning it's unread)
            $table->timestamp('read_at')->nullable()->after('link');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            // Add the old column back if we need to rollback
            $table->boolean('is_read')->default(false);

            // Remove the new timestamp column
            $table->dropColumn('read_at');
        });
    }
};
