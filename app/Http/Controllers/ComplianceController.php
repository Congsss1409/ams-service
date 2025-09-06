<?php

namespace App\Http\Controllers;

use App\Models\ComplianceCriterion;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ComplianceController extends Controller
{
    /**
     * Get the compliance matrix for a specific program.
     */
    public function getComplianceMatrix(Program $program)
    {
        try {
            $allCriteria = ComplianceCriterion::all();
            
            if ($allCriteria->isEmpty()) {
                Log::warning('Compliance matrix requested, but no criteria are seeded in the database.');
                return response()->json([]);
            }
            
            $matrix = $allCriteria->map(function ($criterion) use ($program) {
                // Check if a document with the required name exists for the program
                $isCompliant = $program->documents()
                                       ->where('name', $criterion->document_type_needed)
                                       ->exists();

                return [
                    'id' => $criterion->id,
                    'section' => $criterion->section,
                    'criterion_code' => $criterion->criterion_code,
                    'description' => $criterion->description,
                    'document_needed' => $criterion->document_type_needed, // This is the correct property from the model
                    'status' => $isCompliant ? 'Compliant' : 'Missing',
                    'submitted_document' => $isCompliant ? $criterion->document_type_needed : null,
                ];
            });

            return response()->json($matrix);

        } catch (\Exception $e) {
            Log::error('FATAL ERROR in ComplianceController for Program ID ' . $program->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'A critical error occurred while generating the compliance matrix.'], 500);
        }
    }
}
