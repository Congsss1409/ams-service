<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $programs = Program::all();
        return response()->json($programs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'accreditation_level' => 'required|string|max:255',
            'status' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // **FIX:** Use the validated data to create the new program.
        $program = Program::create($validator->validated());

        return response()->json($program, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Program $program)
    {
        return response()->json($program);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Program $program)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'accreditation_level' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Use the validated data to update the program.
        $program->update($validator->validated());

        return response()->json($program);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Program $program)
    {
        $program->delete();

        return response()->json(null, 204);
    }
}
