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
use App\Http\Controllers\ActionPlanController; // Import the new controller

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Program and Document routes
    Route::apiResource('programs', ProgramController::class);
    Route::get('programs/{program}/documents', [DocumentController::class, 'index']);
    Route::post('programs/{program}/documents', [DocumentController::class, 'store']);
    Route::delete('documents/{document}', [DocumentController::class, 'destroy']);

    // Action Plans (Nested under programs)
    Route::get('programs/{program}/action-plans', [ActionPlanController::class, 'index']);
    Route::post('programs/{program}/action-plans', [ActionPlanController::class, 'store']);
    Route::apiResource('action-plans', ActionPlanController::class)->except(['index', 'store']);


    // User management & Qualifications
    Route::apiResource('users', UserController::class);
    Route::get('users/{user}/qualifications', [FacultyQualificationController::class, 'index']);
    Route::post('users/{user}/qualifications', [FacultyQualificationController::class, 'store']);
    Route::delete('qualifications/{qualification}', [FacultyQualificationController::class, 'destroy']);

    // Physical Facilities
    Route::apiResource('facilities', FacilityController::class);

    // Compliance and Gap Analysis
    Route::get('programs/{program}/compliance-matrix', [ComplianceController::class, 'getComplianceMatrix']);
    Route::get('gap-analysis/overall-status', [GapAnalysisController::class, 'getOverallStatus']);

    // Scheduling
    Route::apiResource('audit-schedules', AuditScheduleController::class);
    Route::apiResource('visits', VisitController::class);
});
