<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // In database/migrations/YYYY_MM_DD_HHMMSS_create_compliance_criteria_table.php

public function up(): void
{
    Schema::create('compliance_criteria', function (Blueprint $table) {
        $table->id();
        $table->integer('section'); // The accreditation section (1-9)
        $table->string('criterion_code')->unique(); // A unique code like 'SEC1-A1'
        $table->text('description'); // The detailed requirement
        $table->string('document_type_needed'); // e.g., "Faculty Profile", "Syllabus"
        $table->timestamps();
    });
}   

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compliance_criteria');
    }
};
