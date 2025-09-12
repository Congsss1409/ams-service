<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class VisitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Visit::with('program')->orderBy('visit_date', 'desc')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'program_id' => 'required|exists:programs,id',
            'accreditor_name' => 'required|string|max:255',
            'visit_date' => 'required|date',
            'status' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $visit = Visit::create($validator->validated());
        $visit->load('program');

        // --- REAL-TIME NOTIFICATION LOGIC ---
        $this->notifyAdmins("A new visit by {$visit->accreditor_name} for '{$visit->program->name}' is scheduled for {$visit->visit_date}.");

        return response()->json($visit, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Visit $visit)
    {
        $validator = Validator::make($request->all(), [
            'program_id' => 'required|exists:programs,id',
            'accreditor_name' => 'required|string|max:255',
            'visit_date' => 'required|date',
            'status' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $visit->update($validator->validated());
        $visit->load('program');

        // --- REAL-TIME NOTIFICATION LOGIC ---
        $this->notifyAdmins("The visit for '{$visit->program->name}' has been updated. New date: {$visit->visit_date}.");
        
        return response()->json($visit);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Visit $visit)
    {
        $visit->delete();
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
                'type' => 'visit_update',
                'message' => $message,
                'link' => '/accreditor-visit'
            ]);
        }
    }
}
