<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'CIN',
        'telephone',
        'date_naissance',
        'adresse',
        'email',
        'num_permis',
        'date_expiration_permis',
    ];

    protected $casts = [
        'date_naissance'          => 'date',
        'date_expiration_permis'  => 'date',
    ];

    public function getFullNameAttribute(): string
    {
        return "{$this->nom} {$this->prenom}";
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'id_client');
    }
}