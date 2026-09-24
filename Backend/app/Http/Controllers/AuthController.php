<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Vehicule;
use App\Models\Client;
use App\Models\Reservation;
use App\Models\Paiement;
use App\Models\Maintenance;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email ou mot de passe incorrect.'],
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('aarscar-token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }

    public function dashboard(): JsonResponse
    {
        $vehicules    = Vehicule::query();
        $reservations = Reservation::query();
        $paiements    = Paiement::query();

        $coutMaintenanceMois = Maintenance::whereMonth('date_debut', now()->month)
            ->whereYear('date_debut', now()->year)
            ->whereNotNull('cout')
            ->sum('cout');

        $coutMaintenanceTotal = Maintenance::whereYear('date_debut', now()->year)
            ->whereNotNull('cout')
            ->sum('cout');

        return response()->json([
            'vehicules' => [
                'total'       => (clone $vehicules)->count(),
                'disponibles' => (clone $vehicules)->where('statut', 'disponible')->count(),
                'loues'       => (clone $vehicules)->where('statut', 'loue')->count(),
                'maintenance' => (clone $vehicules)->where('statut', 'maintenance')->count(),
            ],
            'clients'      => Client::count(),
            'reservations' => [
                'total'      => (clone $reservations)->count(),
                'en_cours'   => (clone $reservations)->where('statut_contrat', 'en_cours')->count(),
                'ce_mois'    => (clone $reservations)->whereMonth('created_at', now()->month)->count(),
            ],
            'revenus' => [
                'total' => max(0, (clone $paiements)->where('statut', 'paye')
                    ->whereYear('date_paiement', now()->year)
                    ->sum('montant') - $coutMaintenanceTotal),
                'ce_mois' => max(0, (clone $paiements)->where('statut', 'paye')
                    ->whereMonth('date_paiement', now()->month)
                    ->whereYear('date_paiement', now()->year)
                    ->sum('montant') - $coutMaintenanceMois),
            ],
            'maintenances' => Maintenance::count(),
            'paiements'    => Paiement::count(),
        ]);
    }
}