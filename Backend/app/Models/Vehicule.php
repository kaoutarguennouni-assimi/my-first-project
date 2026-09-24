<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Vehicule extends Model
{
    protected $fillable = [
        'matricule',
        'marque',
        'modele',
        'annee',
        'type_transport',
        'nombre_passagers',
        'capacite_bagages',
        'tarif_journalier',
        'kilometrage',
        'couleur',
        'boite_vitesse',
        'carburant',
        'statut',
        'image_facade',
        'image_arriere',
        'image_interieur',
    ];

    protected $casts = [
        'annee'            => 'integer',
        'nombre_passagers' => 'integer',
        'capacite_bagages' => 'integer',
        'tarif_journalier' => 'decimal:2',
        'kilometrage'      => 'integer',
    ];

    public function getImageFacadeAttribute($value): ?string
    {
        if (!$value) return null;
        if (str_starts_with($value, 'http')) return $value;
        return Storage::disk('public')->url($value);
    }

    public function getImageArriereAttribute($value): ?string
    {
        if (!$value) return null;
        if (str_starts_with($value, 'http')) return $value;
        return Storage::disk('public')->url($value);
    }

    public function getImageInterieurAttribute($value): ?string
    {
        if (!$value) return null;
        if (str_starts_with($value, 'http')) return $value;
        return Storage::disk('public')->url($value);
    }

    public function scopeDisponible($query)
    {
        return $query->where('statut', 'disponible');
    }

    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('marque', 'like', "%{$term}%")
              ->orWhere('modele', 'like', "%{$term}%")
              ->orWhere('matricule', 'like', "%{$term}%");
        });
    }

    public function scopeFilterType($query, ?string $type)
    {
        if ($type) {
            $query->where('type_transport', $type);
        }
        return $query;
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'id_vehicule');
    }

    public function maintenances()
    {
        return $this->hasMany(Maintenance::class, 'id_vehicule');
    }
}