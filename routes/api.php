<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ProgramController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes for authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Routes for Program Management
    Route::apiResource('programs', ProgramController::class);

    // Routes for Document Management (nested under programs)
    Route::get('/programs/{program}/documents', [DocumentController::class, 'index']);
    Route::post('/programs/{program}/documents', [DocumentController::class, 'store']);
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);
});
