<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('numero_contrat')->unique();             
            $table->date('date_debut');
            $table->date('date_fin');
            $table->unsignedInteger('nombre_jours');
            $table->decimal('montant_total', 10, 2);
            $table->enum('statut_contrat', [
                'en_attente', 'confirme', 'en_cours', 'termine', 'annule'
            ])->default('confirme');

            
            $table->foreignId('id_client')
                  ->constrained('clients')
                  ->onDelete('cascade');

            $table->foreignId('id_vehicule')
                  ->constrained('vehicules')
                  ->onDelete('restrict');

            $table->timestamps(); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
