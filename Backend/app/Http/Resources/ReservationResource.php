<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'numero_contrat' => $this->numero_contrat,
            'date_debut'     => $this->date_debut?->toDateString(),
            'date_fin'       => $this->date_fin?->toDateString(),
            'nombre_jours'   => $this->nombre_jours,
            'montant_total'  => $this->montant_total,
            'statut_contrat' => $this->statut_contrat,
            'id_client'      => $this->id_client,
            'id_vehicule'    => $this->id_vehicule,
            'client'         => new ClientResource($this->whenLoaded('client')),
            'vehicule'       => new VehiculeResource($this->whenLoaded('vehicule')),
            'created_at'     => $this->created_at->toDateString(),
        ];
    }
}