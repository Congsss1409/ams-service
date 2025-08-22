<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComplianceCriterion extends Model
{
    use HasFactory;

    protected $fillable = [
        'section',
        'criterion_code',
        'description',
        'document_type_needed',
    ];
}
