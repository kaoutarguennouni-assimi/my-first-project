<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    protected $fillable = [
        'date_paiement',
        'montant',
        'mode_paiement',
        'statut',
        'id_reservation',
    ];

    protected $casts = [
        'date_paiement' => 'date',
        'montant'       => 'decimal:2',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'id_reservation');
    }
}