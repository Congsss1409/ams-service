<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'accreditation_level', 'status'];

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function actionPlans()
    {
        return $this->hasMany(ActionPlan::class);
    }
}
