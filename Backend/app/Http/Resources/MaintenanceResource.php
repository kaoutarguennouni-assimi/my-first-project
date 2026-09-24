<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaintenanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'description' => $this->description,
            'date_debut'  => $this->date_debut?->toDateString(),
            'date_fin'    => $this->date_fin?->toDateString(),
            'cout'        => $this->cout,
            'id_vehicule' => $this->id_vehicule,
            'vehicule'    => new VehiculeResource($this->whenLoaded('vehicule')),
            'created_at'  => $this->created_at->toDateString(),
        ];
    }
}