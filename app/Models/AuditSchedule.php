<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditSchedule extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'program_id',
        'audit_date',
        'status',
        'notes',
    ];

    /**
     * Get the program that owns the audit schedule.
     */
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }
}
