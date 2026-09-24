<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VehiculeController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\MaintenanceController;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/vehicules',             [VehiculeController::class, 'index']);
Route::get('/vehicules/{vehicule}',  [VehiculeController::class, 'show']);

Route::post('/clients',              [ClientController::class, 'store']);
Route::get('/clients/{client}',      [ClientController::class, 'show']);

Route::post('/reservations',              [ReservationController::class, 'store']);
Route::get('/reservations/{reservation}', [ReservationController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/auth/me',        [AuthController::class, 'me']);
    Route::post('/auth/logout',   [AuthController::class, 'logout']);
    Route::get('/dashboard',      [AuthController::class, 'dashboard']);

    Route::post('/vehicules',              [VehiculeController::class, 'store']);
    Route::post('/vehicules/{vehicule}',   [VehiculeController::class, 'update']);
    Route::put('/vehicules/{vehicule}',    [VehiculeController::class, 'update']);
    Route::delete('/vehicules/{vehicule}', [VehiculeController::class, 'destroy']);

    Route::get('/clients',             [ClientController::class, 'index']);
    Route::put('/clients/{client}',    [ClientController::class, 'update']);
    Route::delete('/clients/{client}', [ClientController::class, 'destroy']);

    Route::get('/reservations',                  [ReservationController::class, 'index']);
    Route::put('/reservations/{reservation}',    [ReservationController::class, 'update']);
    Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy']);

    Route::get('/paiements',               [PaiementController::class, 'index']);
    Route::post('/paiements',              [PaiementController::class, 'store']);
    Route::get('/paiements/{paiement}',    [PaiementController::class, 'show']);
    Route::put('/paiements/{paiement}',    [PaiementController::class, 'update']);
    Route::delete('/paiements/{paiement}', [PaiementController::class, 'destroy']);

    Route::get('/maintenances',                  [MaintenanceController::class, 'index']);
    Route::post('/maintenances',                 [MaintenanceController::class, 'store']);
    Route::get('/maintenances/{maintenance}',    [MaintenanceController::class, 'show']);
    Route::put('/maintenances/{maintenance}',    [MaintenanceController::class, 'update']);
    Route::delete('/maintenances/{maintenance}', [MaintenanceController::class, 'destroy']);
});