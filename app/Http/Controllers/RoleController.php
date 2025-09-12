<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a listing of all roles.
     * This method fetches all roles from the database.
     * It will be used to populate the role selection dropdown in the UI.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Fetch all roles from the 'roles' table.
        $roles = Role::all();

        // Return the roles as a JSON response.
        return response()->json($roles);
    }
}
