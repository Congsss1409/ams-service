<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'Admin',
        ]);

        $this->call(ComplianceCriteriaSeeder::class);
        $this->call(ProgramSeeder::class);
        $this->call(DocumentSeeder::class); // <-- Add this line
    }
}
