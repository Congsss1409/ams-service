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
        // 1. Create the roles table to store different user roles
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., admin, faculty, staff
            $table->string('description')->nullable(); // A brief description of the role's purpose
            $table->timestamps();
        });

        // 2. Add the 'role_id' column to the users table
        Schema::table('users', function (Blueprint $table) {
            // This sets up the foreign key relationship to the 'roles' table.
            // If a role is deleted, the user's role_id will be set to null.
            $table->foreignId('role_id')->nullable()->after('remember_token')->constrained('roles')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // To reverse the migration, we first drop the foreign key and the column
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });

        // Then, we drop the roles table
        Schema::dropIfExists('roles');
    }
};
