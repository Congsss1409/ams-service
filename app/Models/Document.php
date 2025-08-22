<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_id',
        'name',
        'path',
        'section',
    ];

    /**
     * Get the program that owns the document.
     */
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }
}