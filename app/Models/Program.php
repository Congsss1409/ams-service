<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Program extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'accreditation_level',
        'status',
    ];

    /**
     * Get the documents for the program.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
