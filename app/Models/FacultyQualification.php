<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
     * Get the user that owns the qualification.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
