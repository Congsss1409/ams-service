<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Program;
use App\Models\ComplianceCriterion; // <-- Import the ComplianceCriterion model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DocumentController extends Controller
{
    /**
     * Display a listing of the documents for a specific program.
     */
    public function index(Program $program)
    {
        try {
            // Eager load the documents to prevent issues
            return response()->json($program->load('documents')->documents);
        } catch (\Exception $e) {
            Log::error('Failed to fetch documents for program ' . $program->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while fetching documents.'], 500);
        }
    }

    /**
     * Store a newly created document in storage.
     * This method has been updated to be more robust.
     */
    public function store(Request $request, Program $program)
    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|file|mimes:pdf,doc,docx,jpg,png,zip|max:20480', // 20MB Max
            'section' => 'required|integer|exists:compliance_criteria,section',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('document');

        // --- START OF THE FIX ---
        // Find the specific compliance criterion based on the selected section.
        // Note: This assumes one required document per section as per the current system design.
        $criterion = ComplianceCriterion::where('section', $request->section)->first();

        if (!$criterion) {
            return response()->json(['message' => 'No compliance criterion found for the selected section.'], 422);
        }

        // Use the official "document_type_needed" as the name, ignoring the user's original filename.
        // This guarantees the name will always match what the ComplianceController is looking for.
        $documentName = $criterion->document_type_needed;
        
        $path = $file->store('documents/' . $program->id, 'public');

        // Use updateOrCreate to either create a new document record or update the existing one for that criterion.
        // This prevents duplicate entries for the same requirement.
        $document = $program->documents()->updateOrCreate(
            [
                'name' => $documentName, // Match based on the official requirement name
                'section' => $request->section,
            ],
            [
                'path' => $path, // Update the file path
            ]
        );
        // --- END OF THE FIX ---

        return response()->json($document, 201);
    }

    /**
     * Remove the specified document from storage.
     */
    public function destroy(Document $document)
    {
        try {
            // Specify the 'public' disk when deleting the file.
            Storage::disk('public')->delete($document->path);
            $document->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            Log::error('Failed to delete document ' . $document->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while deleting the document.'], 500);
        }
    }
}
