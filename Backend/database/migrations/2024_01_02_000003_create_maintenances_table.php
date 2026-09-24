<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id();
            $table->text('description');
            $table->date('date_debut');
            $table->date('date_fin')->nullable(); 
            $table->decimal('cout', 10, 2)->nullable();

            
            $table->foreignId('id_vehicule')
                  ->constrained('vehicules')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenances');
    }
};
