<?php

namespace App\Http\Controllers;

use App\Models\FacultyQualification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FacultyQualificationController extends Controller
{
    /**
     * Display a listing of the qualifications for a specific user.
     */
    public function index(User $user)
    {
        return $user->qualifications()->orderBy('year_obtained', 'desc')->get();
    }

    /**
     * Store a newly created qualification in storage.
     */
    public function store(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|string|in:Degree,Certification,Training',
            'name' => 'required|string|max:255',
            'institution' => 'required|string|max:255',
            'year_obtained' => 'required|integer|digits:4',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $qualification = $user->qualifications()->create($request->all());

        return response()->json($qualification, 201);
    }

    /**
     * Remove the specified qualification from storage.
     */
    public function destroy(FacultyQualification $qualification)
    {
        // Optional: Add authorization check to ensure user can delete
        $qualification->delete();
        return response()->json(null, 204);
    }
}
