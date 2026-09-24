<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Maintenance extends Model
{
    protected $fillable = [
        'description',
        'date_debut',
        'date_fin',
        'cout',
        'id_vehicule',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin'   => 'date',
        'cout'       => 'decimal:2',
    ];

    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class, 'id_vehicule');
    }
}