<?php

namespace App\Http\Controllers;

use App\Models\Paiement;
use App\Http\Resources\PaiementResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PaiementController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Paiement::with('reservation.client')->orderBy('created_at', 'desc');

        if ($statut = $request->query('statut')) {
            $query->where('statut', $statut);
        }

        if ($request->query('all') === 'true') {
            return PaiementResource::collection($query->get());
        }

        $perPage = min((int) $request->query('per_page', 15), 50);
        return PaiementResource::collection($query->paginate($perPage));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'date_paiement'  => 'required|date',
            'montant'        => 'required|numeric|min:0|max:999999',
            'mode_paiement'  => 'required|in:especes,carte,virement,cheque',
            'statut'         => 'nullable|in:paye,impaye,rembourse',
            'id_reservation' => 'required|exists:reservations,id',
        ]);

        $data['statut'] = $data['statut'] ?? 'paye';

        $paiement = Paiement::create($data);
        $paiement->load('reservation.client');

        return (new PaiementResource($paiement))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Paiement $paiement): PaiementResource
    {
        $paiement->load('reservation.client');
        return new PaiementResource($paiement);
    }

    public function update(Request $request, Paiement $paiement): PaiementResource
    {
        $data = $request->validate([
            'date_paiement'  => 'sometimes|required|date',
            'montant'        => 'sometimes|required|numeric|min:0|max:999999',
            'mode_paiement'  => 'sometimes|required|in:especes,carte,virement,cheque',
            'statut'         => 'sometimes|required|in:paye,impaye,rembourse',
            'id_reservation' => 'sometimes|required|exists:reservations,id',
        ]);

        $paiement->update($data);
        $paiement->load('reservation.client');

        return new PaiementResource($paiement);
    }

    public function destroy(Paiement $paiement): JsonResponse
    {
        $paiement->delete();

        return response()->json(['message' => 'Paiement supprimé avec succès.']);
    }
}