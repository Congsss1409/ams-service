<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ComplianceController;
use App\Http\Controllers\GapAnalysisController;
use App\Http\Controllers\AuditScheduleController;
use App\Http\Controllers\VisitController;
use App\Http\Controllers\FacultyQualificationController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\ActionPlanController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RoleController; // Import the new RoleController

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// --- Public Routes ---
Route::post('/login', [AuthController::class, 'login']);

// --- Protected Routes ---
Route::middleware('auth:sanctum')->group(function () {
    // General Authenticated Routes
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('programs', [ProgramController::class, 'index']);
    Route::get('programs/{program}', [ProgramController::class, 'show']);
    Route::get('programs/{program}/documents', [DocumentController::class, 'index']);
    Route::post('programs/{program}/documents', [DocumentController::class, 'store']);
    Route::get('programs/{program}/compliance-matrix', [ComplianceController::class, 'getComplianceMatrix']);
    Route::get('gap-analysis/overall-status', [GapAnalysisController::class, 'getOverallStatus']);
    
    // Notification Routes (for all authenticated users)
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread', [NotificationController::class, 'unread']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::delete('/notifications/clear-all', [NotificationController::class, 'clearAll']);
    
    // --- Admin-Only Routes ---
    Route::middleware('role:admin')->group(function() {
        // Program Management
        Route::post('programs', [ProgramController::class, 'store']);
        Route::put('programs/{program}', [ProgramController::class, 'update']);
        Route::delete('programs/{program}', [ProgramController::class, 'destroy']);
        
        // Document Deletion
        Route::delete('documents/{document}', [DocumentController::class, 'destroy']);
        
        // Full User Management
        Route::apiResource('users', UserController::class);
        
        // Add the new route to get all roles
        Route::get('/roles', [RoleController::class, 'index']);

        // Faculty Qualifications Management
        Route::get('users/{user}/qualifications', [FacultyQualificationController::class, 'index']);
        Route::post('users/{user}/qualifications', [FacultyQualificationController::class, 'store']);
        Route::delete('qualifications/{qualification}', [FacultyQualificationController::class, 'destroy']);
        
        // Facilities Management
        Route::apiResource('facilities', FacilityController::class);
        
        // Action Plans Management
        Route::get('programs/{program}/action-plans', [ActionPlanController::class, 'index']);
        Route::post('programs/{program}/action-plans', [ActionPlanController::class, 'store']);
        Route::apiResource('action-plans', ActionPlanController::class)->except(['index', 'store']);
        
        // Audit and Visit Scheduling
        Route::apiResource('audit-schedules', AuditScheduleController::class);
        Route::apiResource('visits', VisitController::class);
        
        // Admin-only Notification Broadcast
        Route::post('/notifications/broadcast', [NotificationController::class, 'sendBroadcast']);
    });
});

