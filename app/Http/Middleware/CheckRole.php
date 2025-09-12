<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request to check for a user's role.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles  A list of roles that are allowed to access the route.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // First, check if the user is authenticated.
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = Auth::user();

        // Loop through the roles specified in the route's middleware definition.
        foreach ($roles as $role) {
            // Use the hasRole() method from the User model to check the role.
            if ($user->hasRole($role)) {
                // If the user has the required role, allow the request to proceed.
                return $next($request);
            }
        }

        // If the user does not have any of the required roles, return a Forbidden response.
        return response()->json(['message' => 'Forbidden: You do not have the required permissions for this action.'], 403);
    }
}
