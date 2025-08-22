<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Program::create([
            'name' => 'BS Information Technology',
            'accreditation_level' => 'Candidate Status',
            'status' => 'In Progress'
        ]);

        Program::create([
            'name' => 'BS Business Administration',
            'accreditation_level' => 'Level 2',
            'status' => 'Accredited'
        ]);

        Program::create([
            'name' => 'BS Criminology',
            'accreditation_level' => 'Level 2',
            'status' => 'Accredited'
        ]);
    }
}