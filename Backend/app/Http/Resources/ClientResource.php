<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                     => $this->id,
            'nom'                    => $this->nom,
            'prenom'                 => $this->prenom,
            'full_name'              => $this->full_name,
            'CIN'                    => $this->CIN,
            'telephone'              => $this->telephone,
            'email'                  => $this->email,
            'adresse'                => $this->adresse,
            'date_naissance'         => $this->date_naissance?->toDateString(),
            'num_permis'             => $this->num_permis,
            'date_expiration_permis' => $this->date_expiration_permis?->toDateString(),
            'created_at'             => $this->created_at->toDateString(),
        ];
    }
}