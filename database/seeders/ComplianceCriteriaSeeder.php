<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ComplianceCriterion;

class ComplianceCriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear the table before seeding to avoid duplicates
        ComplianceCriterion::truncate();

        ComplianceCriterion::insert([
            // Section 1 Examples
            ['section' => 1, 'criterion_code' => 'SEC1-A1', 'description' => 'Vision, Mission, Goals, and Objectives', 'document_type_needed' => 'VMGO Document'],
            ['section' => 1, 'criterion_code' => 'SEC1-A2', 'description' => 'University Organizational Chart', 'document_type_needed' => 'Organizational Chart'],
            
            // Section 2 Examples
            ['section' => 2, 'criterion_code' => 'SEC2-B1', 'description' => 'Faculty Profile with Credentials', 'document_type_needed' => 'Faculty Profile'],
            ['section' => 2, 'criterion_code' => 'SEC2-B2', 'description' => 'Faculty Development Program Plan', 'document_type_needed' => 'Development Plan'],
            
            // Section 3 Examples
            ['section' => 3, 'criterion_code' => 'SEC3-C1', 'description' => 'Curriculum and Program of Studies', 'document_type_needed' => 'Curriculum'],
            ['section' => 3, 'criterion_code' => 'SEC3-C2', 'description' => 'Sample Syllabi for Major Courses', 'document_type_needed' => 'Syllabus'],
        ]);
    }
}
