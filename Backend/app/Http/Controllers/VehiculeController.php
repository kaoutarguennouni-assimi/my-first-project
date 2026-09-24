<?php

namespace App\Http\Controllers;

use App\Models\Vehicule;
use App\Http\Resources\VehiculeResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class VehiculeController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Vehicule::query()->orderBy('created_at', 'desc');

        if ($search = $request->query('search')) {
            $query->search($search);
        }

        if ($type = $request->query('type_transport')) {
            $query->filterType($type);
        }

        if ($request->query('disponible') === 'true') {
            $query->disponible();
        }

        if ($request->query('all') === 'true') {
            return VehiculeResource::collection($query->get());
        }

        $perPage = min((int) $request->query('per_page', 12), 50);
        return VehiculeResource::collection($query->paginate($perPage));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'matricule'        => 'nullable|string|max:20|unique:vehicules,matricule',
            'marque'           => 'required|string|max:100',
            'modele'           => 'required|string|max:100',
            'annee'            => 'nullable|integer|min:1900|max:2100',
            'type_transport'   => 'nullable|in:berline,suv,citadine,utilitaire,monospace,cabriolet,pickup',
            'nombre_passagers' => 'nullable|integer|min:1|max:20',
            'capacite_bagages' => 'nullable|integer|min:0|max:100',
            'tarif_journalier' => 'required|numeric|min:0|max:99999',
            'kilometrage'      => 'nullable|integer|min:0',
            'couleur'          => 'nullable|string|max:50',
            'boite_vitesse'    => 'nullable|in:manuelle,automatique',
            'carburant'        => 'nullable|in:essence,diesel,hybride,electrique',
            'statut'           => 'nullable|in:disponible,loue,maintenance',
            'image_facade'     => 'nullable|file|mimes:jpeg,png,jpg,webp|max:10240',
            'image_arriere'    => 'nullable|file|mimes:jpeg,png,jpg,webp|max:10240',
            'image_interieur'  => 'nullable|file|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        foreach (['image_facade', 'image_arriere', 'image_interieur'] as $field) {
            if ($request->hasFile($field)) {
                $data[$field] = $request->file($field)->store('vehicules', 'public');
            }
        }

        $vehicule = Vehicule::create($data);

        return (new VehiculeResource($vehicule))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Vehicule $vehicule): VehiculeResource
    {
        return new VehiculeResource($vehicule);
    }

    public function update(Request $request, Vehicule $vehicule): VehiculeResource
    {
        $data = $request->validate([
            'matricule'        => 'nullable|string|max:20|unique:vehicules,matricule,' . $vehicule->id,
            'marque'           => 'nullable|string|max:100',
            'modele'           => 'nullable|string|max:100',
            'annee'            => 'nullable|integer|min:1900|max:2100',
            'type_transport'   => 'nullable|in:berline,suv,citadine,utilitaire,monospace,cabriolet,pickup',
            'nombre_passagers' => 'nullable|integer|min:1|max:20',
            'capacite_bagages' => 'nullable|integer|min:0|max:100',
            'tarif_journalier' => 'nullable|numeric|min:0|max:99999',
            'kilometrage'      => 'nullable|integer|min:0',
            'couleur'          => 'nullable|string|max:50',
            'boite_vitesse'    => 'nullable|in:manuelle,automatique',
            'carburant'        => 'nullable|in:essence,diesel,hybride,electrique',
            'statut'           => 'nullable|in:disponible,loue,maintenance',
            'image_facade'     => 'nullable|file|mimes:jpeg,png,jpg,webp|max:10240',
            'image_arriere'    => 'nullable|file|mimes:jpeg,png,jpg,webp|max:10240',
            'image_interieur'  => 'nullable|file|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        foreach (['image_facade', 'image_arriere', 'image_interieur'] as $field) {
            if ($request->hasFile($field)) {
                $old = $vehicule->getRawOriginal($field);
                if ($old) Storage::disk('public')->delete($old);
                $data[$field] = $request->file($field)->store('vehicules', 'public');
            }
        }

        $vehicule->update($data);

        return new VehiculeResource($vehicule);
    }

    public function destroy(Vehicule $vehicule): JsonResponse
    {
        foreach (['image_facade', 'image_arriere', 'image_interieur'] as $field) {
            $old = $vehicule->getRawOriginal($field);
            if ($old) Storage::disk('public')->delete($old);
        }

        $vehicule->delete();

        return response()->json(['message' => 'Véhicule supprimé avec succès.']);
    }
}