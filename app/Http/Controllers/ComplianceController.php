<?php

namespace App\Http\Controllers;

use App\Models\ComplianceCriterion;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ComplianceController extends Controller
{
    public function getComplianceMatrix(Program $program)
    {
        try {
            $allCriteria = ComplianceCriterion::all();
            
            if ($allCriteria->isEmpty()) {
                Log::warning('Compliance matrix requested, but no criteria are seeded in the database.');
                return response()->json([]);
            }
            
            $matrix = $allCriteria->map(function ($criterion) use ($program) {
                // This is the new, more reliable logic.
                // It directly checks the database to see if a document with the
                // exact required name exists for the current program.
                $isCompliant = $program->documents()
                                       ->where('name', $criterion->document_type_needed)
                                       ->exists();

                return [
                    'id' => $criterion->id,
                    'section' => $criterion->section,
                    'criterion_code' => $criterion->criterion_code,
                    'description' => $criterion->description,
                    'document_needed' => $criterion->document_type_needed,
                    'status' => $isCompliant ? 'Compliant' : 'Missing',
                    'submitted_document' => $isCompliant ? $criterion->document_type_needed : null,
                ];
            });

            return response()->json($matrix);

        } catch (\Exception $e) {
            Log::error('FATAL ERROR in ComplianceController for Program ID ' . $program->id . ': ' . $e->getMessage() . ' on line ' . $e->getLine() . ' in ' . $e->getFile());
            return response()->json(['message' => 'A critical error occurred on the server while generating the compliance matrix.'], 500);
        }
    }
}
