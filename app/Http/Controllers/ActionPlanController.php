<?php

namespace App\Http\Controllers;

use App\Models\ActionPlan;
use App\Models\Program;
use App\Models\User; // Import the User model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ActionPlanController extends Controller
{
    /**
     * Display a listing of the resource for a specific program.
     */
    public function index(Program $program)
    {
        // Eager load the assigned user to prevent extra queries
        return $program->actionPlans()->with('assignedUser')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Program $program)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:Not Started,In Progress,Completed',
            'due_date' => 'nullable|date',
            'assigned_to_user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $actionPlan = $program->actionPlans()->create($validator->validated());

        // --- NOTIFICATION LOGIC: New Assignment ---
        if ($actionPlan->assigned_to_user_id) {
            $assignedUser = User::find($actionPlan->assigned_to_user_id);
            if ($assignedUser) {
                $assignedUser->notifications()->create([
                    'type' => 'assignment',
                    'message' => "You have been assigned a new action plan: '{$actionPlan->title}' for the program '{$program->name}'.",
                    'link' => "/action-plans", // A generic link for now
                ]);
            }
        }

        return response()->json($actionPlan->load('assignedUser'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ActionPlan $actionPlan)
    {
        return $actionPlan->load('assignedUser');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ActionPlan $actionPlan)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:Not Started,In Progress,Completed',
            'due_date' => 'nullable|date',
            'assigned_to_user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // --- NOTIFICATION LOGIC ---
        // Get original values before the update to compare them
        $originalAssigneeId = $actionPlan->getOriginal('assigned_to_user_id');
        $originalStatus = $actionPlan->getOriginal('status');
        
        // Get new values from the incoming request
        $newAssigneeId = $request->input('assigned_to_user_id');
        $newStatus = $request->input('status');

        // Perform the update on the action plan
        $actionPlan->update($validator->validated());
        
        $program = $actionPlan->program; // Get the associated program for context

        // 1. Notify about re-assignment
        if ($newAssigneeId && $newAssigneeId != $originalAssigneeId) {
            $assignedUser = User::find($newAssigneeId);
            if ($assignedUser) {
                $assignedUser->notifications()->create([
                    'type' => 'assignment',
                    'message' => "An action plan has been assigned to you: '{$actionPlan->title}' for the program '{$program->name}'.",
                    'link' => "/action-plans",
                ]);
            }
        }

        // 2. Notify about status change
        if ($newStatus && $newStatus !== $originalStatus && $actionPlan->assigned_to_user_id) {
            $assignedUser = User::find($actionPlan->assigned_to_user_id);
            // Ensure we don't notify a user if the plan is unassigned
            if ($assignedUser) {
                $assignedUser->notifications()->create([
                    'type' => 'status_update',
                    'message' => "The status of your action plan '{$actionPlan->title}' has been updated to '{$newStatus}'.",
                    'link' => "/action-plans",
                ]);
            }
        }
        
        return response()->json($actionPlan->load('assignedUser'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ActionPlan $actionPlan)
    {
        $actionPlan->delete();

        return response()->json(null, 204);
    }
}
