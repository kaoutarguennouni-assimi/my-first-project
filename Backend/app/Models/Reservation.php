<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'numero_contrat',
        'date_debut',
        'date_fin',
        'nombre_jours',
        'montant_total',
        'statut_contrat',
        'id_client',
        'id_vehicule',
    ];

    protected $casts = [
        'date_debut'   => 'date',
        'date_fin'     => 'date',
        'nombre_jours' => 'integer',
        'montant_total'=> 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'id_client');
    }

    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class, 'id_vehicule');
    }

    public function paiement()
    {
        return $this->hasOne(Paiement::class, 'id_reservation');
    }
}