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
        Schema::create('faculty_qualifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('type'); // e.g., 'Degree', 'Certification', 'Training'
            $table->string('name'); // e.g., 'BS in Computer Science', 'AWS Certified Developer'
            $table->string('institution'); // e.g., 'Bestlink College of the Philippines'
            $table->year('year_obtained');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty_qualifications');
    }
};
