<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ComplianceController;
use App\Http\Controllers\GapAnalysisController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Program Routes
    Route::apiResource('programs', ProgramController::class);

    // Document Routes
    Route::post('/programs/{program}/documents', [DocumentController::class, 'store']);
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);
    Route::get('/programs/{program}/documents', [DocumentController::class, 'index']);

    // Compliance Matrix Route
    Route::get('/programs/{program}/compliance-matrix', [ComplianceController::class, 'getComplianceMatrix']);

    // Gap Analysis Route
    Route::get('/gap-analysis/overall-status', [GapAnalysisController::class, 'getOverallStatus']);
});
