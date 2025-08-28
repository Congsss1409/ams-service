<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_id',
        'title',
        'description',
        'status',
        'due_date',
        'assigned_to_user_id',
    ];

    /**
     * Get the program that the action plan belongs to.
     */
    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    /**
     * Get the user assigned to the action plan.
     */
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }
}
