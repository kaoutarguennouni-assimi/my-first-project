<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaiementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'date_paiement'  => $this->date_paiement?->toDateString(),
            'montant'        => $this->montant,
            'mode_paiement'  => $this->mode_paiement,
            'statut'         => $this->statut,
            'id_reservation' => $this->id_reservation,
            'reservation'    => new ReservationResource($this->whenLoaded('reservation')),
            'created_at'     => $this->created_at->toDateString(),
        ];
    }
}