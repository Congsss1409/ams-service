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
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., 'Computer Laboratory 1', 'Library'
            $table->string('location'); // e.g., 'Main Building, Room 301'
            $table->string('type'); // e.g., 'Laboratory', 'Classroom', 'Office'
            $table->integer('capacity')->nullable();
            $table->string('condition_status'); // e.g., 'Excellent', 'Good', 'Needs Repair'
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facilities');
    }
};
