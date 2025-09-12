<?php

namespace App\Http\Controllers;

use App\Models\AuditSchedule;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuditScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
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
        $audit->load('program'); // Load program relationship for the message

        // --- REAL-TIME NOTIFICATION LOGIC ---
        $this->notifyAdmins("A new audit for '{$audit->program->name}' has been scheduled for {$audit->audit_date}.");

        return response()->json($audit, 201);
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
        $auditSchedule->load('program');

        // --- REAL-TIME NOTIFICATION LOGIC ---
        $this->notifyAdmins("The audit for '{$auditSchedule->program->name}' has been updated. New date: {$auditSchedule->audit_date}.");

        return response()->json($auditSchedule);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AuditSchedule $auditSchedule)
    {
        $auditSchedule->delete();
        return response()->json(null, 204);
    }

    /**
     * Helper function to notify all admins except the current one.
     */
    private function notifyAdmins(string $message)
    {
        $currentUser = Auth::user();
        $adminsToNotify = User::whereHas('role', fn($query) => $query->where('name', 'admin'))
                               ->where('id', '!=', $currentUser->id)
                               ->get();

        foreach ($adminsToNotify as $admin) {
            $admin->notifications()->create([
                'type' => 'audit_update',
                'message' => $message,
                'link' => '/audit-schedule'
            ]);
        }
    }
}
