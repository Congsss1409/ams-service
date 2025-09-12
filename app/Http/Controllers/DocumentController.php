<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Program;
use App\Models\ComplianceCriterion;
use App\Models\User; // Import the User model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Import the Auth facade
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
            return response()->json($program->load('documents')->documents);
        } catch (\Exception $e) {
            Log::error('Failed to fetch documents for program ' . $program->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while fetching documents.'], 500);
        }
    }

    /**
     * Store a newly created document in storage.
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
        $originalFileName = $file->getClientOriginalName(); // Get the original file name

        $criterion = ComplianceCriterion::where('section', $request->section)->first();
        if (!$criterion) {
            return response()->json(['message' => 'No compliance criterion found for the selected section.'], 422);
        }

        $documentName = $criterion->document_type_needed;
        $path = $file->store('documents/' . $program->id, 'public');

        $document = $program->documents()->updateOrCreate(
            [
                'name' => $documentName,
                'section' => $request->section,
            ],
            [
                'path' => $path,
            ]
        );

        // --- REAL-TIME NOTIFICATION LOGIC ---
        $uploader = Auth::user();
        $adminsToNotify = User::whereHas('role', fn($query) => $query->where('name', 'admin'))
                               ->where('id', '!=', $uploader->id) // Don't notify the person who uploaded
                               ->get();

        foreach ($adminsToNotify as $admin) {
            $admin->notifications()->create([
                'type' => 'document_upload',
                'message' => "{$uploader->name} uploaded '{$originalFileName}' for the program '{$program->name}'.",
                'link' => '/documents' // A generic link to the documents area
            ]);
        }

        return response()->json($document, 201);
    }

    /**
     * Remove the specified document from storage.
     */
    public function destroy(Document $document)
    {
        try {
            Storage::disk('public')->delete($document->path);
            $document->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            Log::error('Failed to delete document ' . $document->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while deleting the document.'], 500);
        }
    }
}
