<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Vehicule;
use App\Http\Resources\ReservationResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Carbon\Carbon;

class ReservationController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Reservation::with(['client', 'vehicule'])
            ->orderBy('created_at', 'desc');

        if ($statut = $request->query('statut')) {
            $query->where('statut_contrat', $statut);
        }

        if ($request->query('all') === 'true') {
            return ReservationResource::collection($query->get());
        }

        $perPage = min((int) $request->query('per_page', 15), 50);
        return ReservationResource::collection($query->paginate($perPage));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'date_debut'     => 'required|date',
            'date_fin'       => 'required|date|after_or_equal:date_debut',
            'montant_total'  => 'required|numeric|min:0',
            'statut_contrat' => 'nullable|in:confirme,en_attente,en_cours,termine,annule',
            'id_client'      => 'required|exists:clients,id',
            'id_vehicule'    => 'required|exists:vehicules,id',
        ]);

        $data['nombre_jours'] = Carbon::parse($data['date_debut'])
            ->diffInDays(Carbon::parse($data['date_fin'])) + 1;

        $vehicule = Vehicule::findOrFail($data['id_vehicule']);

        if ($vehicule->statut !== 'disponible') {
            return response()->json([
                'message' => 'Ce véhicule n\'est pas disponible à la location.',
            ], 422);
        }

        $data['numero_contrat'] = 'AARS-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
        $data['statut_contrat'] = $data['statut_contrat'] ?? 'confirme';

        $reservation = Reservation::create($data);
        $vehicule->update(['statut' => 'loue']);
        $reservation->load(['client', 'vehicule']);

        return (new ReservationResource($reservation))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Reservation $reservation): ReservationResource
    {
        $reservation->load(['client', 'vehicule']);
        return new ReservationResource($reservation);
    }

    public function update(Request $request, Reservation $reservation): ReservationResource
    {
        $data = $request->validate([
            'date_debut'     => 'sometimes|required|date',
            'date_fin'       => 'sometimes|required|date|after_or_equal:date_debut',
            'montant_total'  => 'sometimes|required|numeric|min:0',
            'statut_contrat' => 'sometimes|required|in:confirme,en_attente,en_cours,termine,annule',
            'id_client'      => 'sometimes|required|exists:clients,id',
            'id_vehicule'    => 'sometimes|required|exists:vehicules,id',
        ]);

        if (isset($data['date_debut']) || isset($data['date_fin'])) {
            $debut = Carbon::parse($data['date_debut'] ?? $reservation->date_debut);
            $fin   = Carbon::parse($data['date_fin']   ?? $reservation->date_fin);
            $data['nombre_jours'] = $debut->diffInDays($fin) + 1;
        }

        $oldStatut = $reservation->statut_contrat;
        $reservation->update($data);

        if (isset($data['statut_contrat']) && $oldStatut !== $data['statut_contrat']) {
            if (in_array($data['statut_contrat'], ['annule', 'termine'])) {
                $reservation->vehicule->update(['statut' => 'disponible']);
            }
        }

        $reservation->load(['client', 'vehicule']);
        return new ReservationResource($reservation);
    }

    public function destroy(Reservation $reservation): JsonResponse
    {
        $reservation->vehicule->update(['statut' => 'disponible']);
        $reservation->delete();

        return response()->json(['message' => 'Réservation supprimée avec succès.']);
    }
}