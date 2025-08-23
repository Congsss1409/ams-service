<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Visit extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_id',
        'accreditor_name',
        'visit_date',
        'status',
        'notes',
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }
}
