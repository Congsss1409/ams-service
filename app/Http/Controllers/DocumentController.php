<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DocumentController extends Controller
{
    /**
     * Display a listing of the documents for a specific program.
     */
    public function index(Program $program)
    {
        return response()->json($program->documents);
    }

    /**
     * Store a newly created document in storage.
     */
    public function store(Request $request, Program $program)
    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|file|mimes:pdf,doc,docx,jpg,png|max:10240', // 10MB Max
            'section' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $file = $request->file('document');
        $originalName = $file->getClientOriginalName();
        
        // Store the file in 'storage/app/documents/{program_id}'
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
        // Delete the file from storage
        Storage::delete($document->path);

        // Delete the record from the database
        $document->delete();

        return response()->json(null, 204);
    }
}
