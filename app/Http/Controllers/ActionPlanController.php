<?php

namespace App\Http\Controllers;

use App\Models\ActionPlan;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ActionPlanController extends Controller
{
    /**
     * Display a listing of the resource for a specific program.
     */
    public function index(Program $program)
    {
        return $program->actionPlans()->with('assignedUser')->orderBy('due_date')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Program $program)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|string',
            'due_date' => 'nullable|date',
            'assigned_to_user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $actionPlan = $program->actionPlans()->create($request->all());
        return response()->json($actionPlan->load('assignedUser'), 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ActionPlan $actionPlan)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|string',
            'due_date' => 'nullable|date',
            'assigned_to_user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $actionPlan->update($request->all());
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
