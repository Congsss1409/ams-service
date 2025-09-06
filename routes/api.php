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
// Handles user login and returns an authentication token.
Route::post('/login', [AuthController::class, 'login']);


// --- Protected Routes ---
// All routes within this group require a valid Sanctum authentication token.
Route::middleware('auth:sanctum')->group(function () {
    
    // Authentication & User Profile
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Program and Document Management
    Route::apiResource('programs', ProgramController::class);
    Route::get('programs/{program}/documents', [DocumentController::class, 'index']);
    Route::post('programs/{program}/documents', [DocumentController::class, 'store']);
    Route::delete('documents/{document}', [DocumentController::class, 'destroy']);

    // Action Plans (Nested under Programs)
    Route::get('programs/{program}/action-plans', [ActionPlanController::class, 'index']);
    Route::post('programs/{program}/action-plans', [ActionPlanController::class, 'store']);
    // Routes for updating, showing, and deleting a specific action plan
    Route::apiResource('action-plans', ActionPlanController::class)->except(['index', 'store']);

    // User Management & Faculty Qualifications
    Route::apiResource('users', UserController::class);
    Route::get('users/{user}/qualifications', [FacultyQualificationController::class, 'index']);
    Route::post('users/{user}/qualifications', [FacultyQualificationController::class, 'store']);
    Route::delete('qualifications/{qualification}', [FacultyQualificationController::class, 'destroy']);

    // Physical Facilities Monitoring
    Route::apiResource('facilities', FacilityController::class);

    // Compliance and Predictive Gap Analysis
    Route::get('programs/{program}/compliance-matrix', [ComplianceController::class, 'getComplianceMatrix']);
    Route::get('gap-analysis/overall-status', [GapAnalysisController::class, 'getOverallStatus']);

    // Scheduling for Audits and Visits
    Route::apiResource('audit-schedules', AuditScheduleController::class);
    Route::apiResource('visits', VisitController::class);
    
    // --- Notification Routes ---
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread', [NotificationController::class, 'unread']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
});

