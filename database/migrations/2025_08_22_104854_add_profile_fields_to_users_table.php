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
        Schema::table('users', function (Blueprint $table) {
            $table->string('middle_name')->nullable()->after('name');
            $table->string('last_name')->nullable()->after('middle_name');
            $table->string('suffix')->nullable()->after('last_name');
            $table->string('personal_email')->nullable()->after('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['middle_name', 'last_name', 'suffix', 'personal_email']);
        });
    }
};