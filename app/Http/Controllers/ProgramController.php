<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // This is our hard-coded sample data for now.
        // In Sprint 2, we will get this from the database.
        $programs = [
            [
                'id' => 1,
                'name' => 'BS Information Technology',
                'accreditation_level' => 'Candidate Status',
                'status' => 'In Progress'
            ],
            [
                'id' => 2,
                'name' => 'BS Business Administration',
                'accreditation_level' => 'Level 2',
                'status' => 'Accredited'
            ],
            [
                'id' => 3,
                'name' => 'BS Criminology',
                'accreditation_level' => 'Level 2',
                'status' => 'Accredited'
            ],
        ];

        // Return the data as a JSON response
        return response()->json($programs);
    }
}
