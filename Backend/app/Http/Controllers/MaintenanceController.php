<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use App\Http\Resources\MaintenanceResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MaintenanceController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Maintenance::with('vehicule')->orderBy('date_debut', 'desc');

        if ($request->query('all') === 'true') {
            return MaintenanceResource::collection($query->get());
        }

        $perPage = min((int) $request->query('per_page', 15), 50);
        return MaintenanceResource::collection($query->paginate($perPage));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'description' => 'required|string|max:1000',
            'date_debut'  => 'required|date',
            'date_fin'    => 'nullable|date|after_or_equal:date_debut',
            'cout'        => 'nullable|numeric|min:0|max:999999',
            'id_vehicule' => 'required|exists:vehicules,id',
        ]);

        $maintenance = Maintenance::create($data);
        $maintenance->load('vehicule');

        if (!empty($data['date_fin'])) {
            $maintenance->vehicule->update(['statut' => 'disponible']);
        } elseif (!$maintenance->date_fin) {
            $maintenance->vehicule->update(['statut' => 'maintenance']);
        }

        return (new MaintenanceResource($maintenance))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Maintenance $maintenance): MaintenanceResource
    {
        $maintenance->load('vehicule');
        return new MaintenanceResource($maintenance);
    }

    public function update(Request $request, Maintenance $maintenance): MaintenanceResource
    {
        $data = $request->validate([
            'description' => 'sometimes|required|string|max:1000',
            'date_debut'  => 'sometimes|required|date',
            'date_fin'    => 'sometimes|nullable|date|after_or_equal:date_debut',
            'cout'        => 'sometimes|nullable|numeric|min:0|max:999999',
            'id_vehicule' => 'sometimes|required|exists:vehicules,id',
        ]);

        if (isset($data['id_vehicule']) && $data['id_vehicule'] != $maintenance->id_vehicule) {
            $maintenance->vehicule->update(['statut' => 'disponible']);
        }

        $maintenance->update($data);
        $maintenance->load('vehicule');

        if (!empty($data['date_fin'])) {
            $maintenance->vehicule->update(['statut' => 'disponible']);
        } elseif (!$maintenance->date_fin) {
            $maintenance->vehicule->update(['statut' => 'maintenance']);
        }

        return new MaintenanceResource($maintenance);
    }

    public function destroy(Maintenance $maintenance): JsonResponse
    {
        $maintenance->vehicule->update(['statut' => 'disponible']);
        $maintenance->delete();

        return response()->json(['message' => 'Maintenance supprimée avec succès.']);
    }
}
