<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\ComplianceCriterion;
use Illuminate\Http\Request;

class GapAnalysisController extends Controller
{
    public function getOverallStatus()
    {
        $programs = Program::with('documents')->get();
        $allCriteria = ComplianceCriterion::all();
        $totalCriteria = $allCriteria->count();

        if ($totalCriteria == 0) {
            return response()->json(['message' => 'No compliance criteria have been set up.'], 404);
        }

        $analysisResults = [];

        foreach ($programs as $program) {
            $compliantCount = 0;
            $programDocumentNames = $program->documents->pluck('name');

            foreach ($allCriteria as $criterion) {
                if ($programDocumentNames->contains($criterion->document_type_needed)) {
                    $compliantCount++;
                }
            }

            $compliancePercentage = ($compliantCount / $totalCriteria) * 100;
            
            $predictedStatus = 'On Track';
            if ($compliancePercentage < 50) {
                $predictedStatus = 'At Risk';
            } elseif ($compliancePercentage < 80) {
                $predictedStatus = 'Needs Attention';
            }

            $analysisResults[] = [
                'program_id' => $program->id,
                'program_name' => $program->name,
                'compliance_percentage' => round($compliancePercentage),
                'compliant_criteria' => $compliantCount,
                'total_criteria' => $totalCriteria,
                'predicted_status' => $predictedStatus,
            ];
        }

        return response()->json($analysisResults);
    }
}
