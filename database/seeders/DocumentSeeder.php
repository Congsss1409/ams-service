<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Program;
use App\Models\Document;
use App\Models\ComplianceCriterion;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some programs to add documents to
        $bsit = Program::where('name', 'BSIT')->first();
        $bsba = Program::where('name', 'BSBA FM')->first();
        $beed = Program::where('name', 'BEED')->first();

        // Get some criteria to match the documents against
        $criteria = ComplianceCriterion::all();

        // --- Add documents for BSIT (High Compliance) ---
        if ($bsit && $criteria->isNotEmpty()) {
            // Let's say BSIT has almost all documents
            foreach ($criteria->take(5) as $criterion) {
                Document::create([
                    'program_id' => $bsit->id,
                    'name' => $criterion->document_type_needed,
                    'path' => 'seeded_documents/dummy.pdf', // Corrected path
                    'section' => $criterion->section,
                ]);
            }
        }

        // --- Add documents for BSBA FM (Medium Compliance) ---
        if ($bsba && $criteria->isNotEmpty()) {
            // Let's say BSBA has about half the documents
            foreach ($criteria->take(3) as $criterion) {
                Document::create([
                    'program_id' => $bsba->id,
                    'name' => $criterion->document_type_needed,
                    'path' => 'seeded_documents/dummy.pdf', // Corrected path
                    'section' => $criterion->section,
                ]);
            }
        }
        
        // --- Add documents for BEED (Low Compliance) ---
        if ($beed && $criteria->isNotEmpty()) {
            // Let's say BEED has only one document
            $criterion = $criteria->first();
            if ($criterion) {
                Document::create([
                    'program_id' => $beed->id,
                    'name' => $criterion->document_type_needed,
                    'path' => 'seeded_documents/dummy.pdf', // Corrected path
                    'section' => $criterion->section,
                ]);
            }
        }
    }
}
