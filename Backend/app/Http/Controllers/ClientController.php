<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Http\Resources\ClientResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ClientController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Client::query()->orderBy('created_at', 'desc');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('prenom', 'like', "%{$search}%")
                  ->orWhere('CIN', 'like', "%{$search}%")
                  ->orWhere('telephone', 'like', "%{$search}%");
            });
        }

        if ($request->query('all') === 'true') {
            return ClientResource::collection($query->get());
        }

        $perPage = min((int) $request->query('per_page', 15), 50);
        return ClientResource::collection($query->paginate($perPage));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nom'                    => 'required|string|max:100',
            'prenom'                 => 'required|string|max:100',
            'CIN'                    => 'required|string|max:20|unique:clients,CIN',
            'telephone'              => 'required|string|max:20',
            'date_naissance'         => 'nullable|date|before:today',
            'adresse'                => 'nullable|string|max:255',
            'num_permis'             => 'nullable|string|max:50|unique:clients,num_permis',
            'email'                  => 'nullable|email|max:150|unique:clients,email',
            'date_expiration_permis' => 'nullable|date',
        ]);

        $client = Client::firstOrCreate(['CIN' => $data['CIN']], $data);
        $statusCode = $client->wasRecentlyCreated ? 201 : 200;

        return (new ClientResource($client))
            ->response()
            ->setStatusCode($statusCode);
    }

    public function show(Client $client): ClientResource
    {
        return new ClientResource($client);
    }

    public function update(Request $request, Client $client): ClientResource
    {
        $data = $request->validate([
            'nom'                    => 'sometimes|required|string|max:100',
            'prenom'                 => 'sometimes|required|string|max:100',
            'CIN'                    => 'sometimes|required|string|max:20|unique:clients,CIN,' . $client->id,
            'telephone'              => 'sometimes|required|string|max:20',
            'date_naissance'         => 'sometimes|nullable|date|before:today',
            'adresse'                => 'sometimes|nullable|string|max:255',
            'num_permis'             => 'sometimes|nullable|string|max:50|unique:clients,num_permis,' . $client->id,
            'email'                  => 'sometimes|nullable|email|max:150|unique:clients,email,' . $client->id,
            'date_expiration_permis' => 'sometimes|nullable|date',
        ]);

        $client->update($data);

        return new ClientResource($client);
    }

    public function destroy(Client $client): JsonResponse
    {
        $client->delete();

        return response()->json(['message' => 'Client supprimé avec succès.']);
    }
}