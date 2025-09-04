<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacultyQualification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'name',
        'institution',
        'year_obtained',
    ];

    /**
     * Get the user that owns the qualification eto ok.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

