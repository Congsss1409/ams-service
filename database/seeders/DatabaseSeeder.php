<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role; // Import the Role model
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash; // Import Hash facade for password hashing

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * This method orchestrates the seeding of all necessary data.
     */
    public function run(): void
    {
        // 1. Create the user roles first.
        // It's good practice to use firstOrCreate to avoid creating duplicate roles.
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            ['description' => 'Administrator with full access to the system.']
        );

        $userRole = Role::firstOrCreate(
            ['name' => 'user'],
            ['description' => 'Regular user with limited, view-only access.']
        );

        // 2. Create a default Administrator User.
        // Using firstOrCreate ensures you don't create a duplicate admin on re-seeding.
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'last_name' => 'User',
                'password' => Hash::make('password'), // Use a secure default password
                'role_id' => $adminRole->id, // Assign the admin role
            ]
        );

        // 3. Create a default Regular User.
        User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Regular',
                'last_name' => 'User',
                'password' => Hash::make('password'), // Use a secure default password
                'role_id' => $userRole->id, // Assign the user role
            ]
        );
        
        // 4. Call other seeders to populate the rest of the database.
        $this->call([
            ProgramSeeder::class,
            DocumentSeeder::class,
            ComplianceCriteriaSeeder::class,
        ]);
    }
}