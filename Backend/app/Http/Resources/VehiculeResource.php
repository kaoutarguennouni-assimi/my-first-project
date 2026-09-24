<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehiculeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'matricule'        => $this->matricule,
            'marque'           => $this->marque,
            'modele'           => $this->modele,
            'annee'            => $this->annee,
            'type_transport'   => $this->type_transport,
            'nombre_passagers' => $this->nombre_passagers,
            'capacite_bagages' => $this->capacite_bagages,
            'tarif_journalier' => $this->tarif_journalier,
            'kilometrage'      => $this->kilometrage,
            'couleur'          => $this->couleur,
            'boite_vitesse'    => $this->boite_vitesse,
            'carburant'        => $this->carburant,
            'statut'           => $this->statut,
            'images'           => [
                'facade'    => $this->image_facade,
                'arriere'   => $this->image_arriere,
                'interieur' => $this->image_interieur,
            ],
            'created_at' => $this->created_at->toDateString(),
        ];
    }
}