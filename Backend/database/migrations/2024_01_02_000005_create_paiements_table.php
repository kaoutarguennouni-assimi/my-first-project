<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->date('date_paiement');
            $table->decimal('montant', 10, 2);
            $table->enum('mode_paiement', ['especes', 'carte', 'virement', 'cheque'])->default('especes');
            $table->enum('statut', ['paye', 'impaye', 'rembourse'])->default('paye');

    
            $table->foreignId('id_reservation')
                  ->constrained('reservations')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
