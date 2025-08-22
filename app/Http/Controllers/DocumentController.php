<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Program;
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
     */
    public function store(Request $request, Program $program)
    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|file|mimes:pdf,doc,docx,jpg,png,zip|max:20480', // 20MB Max
            'section' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('document');
        $originalName = $file->getClientOriginalName();
        
        $path = $file->store('documents/' . $program->id);

        $document = $program->documents()->create([
            'name' => $originalName,
            'path' => $path,
            'section' => $request->section,
        ]);

        return response()->json($document, 201);
    }

    /**
     * Remove the specified document from storage.
     */
    public function destroy(Document $document)
    {
        try {
            Storage::delete($document->path);
            $document->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            Log::error('Failed to delete document ' . $document->id . ': ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while deleting the document.'], 500);
        }
    }
}