<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicules', function (Blueprint $table) {
            $table->id();
            $table->string('matricule', 20)->nullable()->unique();
            $table->string('marque', 100);
            $table->string('modele', 100);
            $table->unsignedSmallInteger('annee')->nullable();
            $table->enum('type_transport', [
                'berline', 'suv', 'citadine', 'utilitaire',
                'monospace', 'cabriolet', 'pickup'
            ])->nullable();
            $table->unsignedTinyInteger('nombre_passagers')->nullable();
            $table->unsignedTinyInteger('capacite_bagages')->nullable();
            $table->decimal('tarif_journalier', 10, 2);
            $table->unsignedInteger('kilometrage')->nullable();
            $table->string('couleur', 50)->nullable();
            $table->enum('boite_vitesse', ['manuelle', 'automatique'])->nullable();
            $table->enum('carburant', ['essence', 'diesel', 'hybride', 'electrique'])->nullable();
            $table->enum('statut', ['disponible', 'loue', 'maintenance'])->default('disponible');
            $table->string('image_facade')->nullable();
            $table->string('image_arriere')->nullable();
            $table->string('image_interieur')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicules');
    }
};