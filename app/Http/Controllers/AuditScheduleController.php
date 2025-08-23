<?php

namespace App\Http\Controllers;

use App\Models\AuditSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuditScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Eager load the program relationship to avoid extra queries and order by the newest
        return AuditSchedule::with('program')->orderBy('audit_date', 'desc')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'program_id' => 'required|exists:programs,id',
            'audit_date' => 'required|date',
            'status' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $audit = AuditSchedule::create($validator->validated());

        // Return the new audit with the program data loaded
        return response()->json($audit->load('program'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(AuditSchedule $auditSchedule)
    {
        // Return the specific audit with its program data
        return $auditSchedule->load('program');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AuditSchedule $auditSchedule)
    {
        $validator = Validator::make($request->all(), [
            'program_id' => 'required|exists:programs,id',
            'audit_date' => 'required|date',
            'status' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $auditSchedule->update($validator->validated());

        return response()->json($auditSchedule->load('program'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AuditSchedule $auditSchedule)
    {
        $auditSchedule->delete();

        return response()->json(null, 204);
    }
}
