<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\ComplianceCriterion;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\Cache;

class GapAnalysisController extends Controller
{
    public function getOverallStatus()
    {
        $programs = Program::with('documents')->get();
        $totalCriteriaCount = ComplianceCriterion::count();

        if ($totalCriteriaCount === 0) {
            return response()->json([]);
        }

        $statusData = $programs->map(function ($program) use ($totalCriteriaCount) {
            $compliantCount = $program->documents->unique('name')->count();
            $compliancePercentage = round(($compliantCount / $totalCriteriaCount) * 100);

            $status = 'On Track';
            if ($compliancePercentage < 75) {
                $status = 'Needs Attention';
            }
            if ($compliancePercentage < 50) {
                $status = 'At Risk';
            }
            
            // --- Notification Logic ---
            // Check if the program has just become "At Risk"
            $cacheKey = "program_{$program->id}_status";
            $previousStatus = Cache::get($cacheKey);

            if ($status === 'At Risk' && $previousStatus !== 'At Risk') {
                $this->createAtRiskNotification($program);
            }
            // Update the cache with the new status
            Cache::put($cacheKey, $status, now()->addHours(24));
            // --- End Notification Logic ---


            return [
                'program_id' => $program->id,
                'program_name' => $program->name,
                'compliance_percentage' => $compliancePercentage,
                'predicted_status' => $status,
                'compliant_criteria' => $compliantCount,
                'total_criteria' => $totalCriteriaCount,
            ];
        });

        return response()->json($statusData);
    }
    
    /**
     * Create a notification for all users when a program is at risk.
     */
    private function createAtRiskNotification(Program $program)
    {
        $users = User::all();
        $message = "Alert: The program '{$program->name}' is now At Risk with low compliance.";

        foreach ($users as $user) {
            Notification::create([
                'user_id' => $user->id,
                'type' => 'warning',
                'message' => $message,
                'link' => '/dashboard' 
            ]);
        }
    }
}
