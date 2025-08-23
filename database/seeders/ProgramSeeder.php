<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Program;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // The Program::truncate() line has been removed.

        $programs = [
            ['name' => 'BLIS', 'description' => 'Bachelor in Library Information Science'],
            ['name' => 'BPED', 'description' => 'Bachelor in Physical Education'],
            ['name' => 'BEED', 'description' => 'Bachelor of Elementary Education'],
            ['name' => 'BSAIS', 'description' => 'Bachelor of Science in Accounting Information System'],
            ['name' => 'BSBA FM', 'description' => 'Bachelor of Science in Business Administration major in Financial Management'],
            ['name' => 'BSBA HRM', 'description' => 'Bachelor of Science in Business Administration major in Human Resource Management'],
            ['name' => 'BSBA MM', 'description' => 'Bachelor of Science in Business Administration major in Marketing Management'],
            ['name' => 'BSCPE', 'description' => 'Bachelor of Science in Computer Engineering'],
            ['name' => 'BSCRIM', 'description' => 'Bachelor of Science in Criminology'],
            ['name' => 'BSENTREP', 'description' => 'Bachelor of Science in Entrepreneurship'],
            ['name' => 'BSHM', 'description' => 'Bachelor of Science in Hospitality Management'],
            ['name' => 'BSIT', 'description' => 'Bachelor of Science in Information Technology'],
            ['name' => 'BSOA', 'description' => 'Bachelor of Science in Office Administration'],
            ['name' => 'BSP', 'description' => 'Bachelor of Science in Psychology'],
            ['name' => 'BSTM', 'description' => 'Bachelor of Science in Tourism Management'],
            ['name' => 'BSED English', 'description' => 'Bachelor of Secondary Education major in English'],
            ['name' => 'BSED Filipino', 'description' => 'Bachelor of Secondary Education major in Filipino'],
            ['name' => 'BSED Math', 'description' => 'Bachelor of Secondary Education major in Mathematics'],
            ['name' => 'BSED Science', 'description' => 'Bachelor of Secondary Education major in Science'],
            ['name' => 'BSED Social Studies', 'description' => 'Bachelor of Secondary Education major in Social Studies'],
            ['name' => 'BSED Values', 'description' => 'Bachelor of Secondary Education major in Values'],
            ['name' => 'BTLED', 'description' => 'Bachelor of Technology and Livelihood Education'],
            ['name' => 'CPE', 'description' => 'Certificate of Professional Education'],
        ];

        foreach ($programs as $program) {
            Program::create([
                'name' => $program['name'],
                'accreditation_level' => 'Candidate', // Default level
                'status' => 'Active', // Default status
            ]);
        }
    }
}