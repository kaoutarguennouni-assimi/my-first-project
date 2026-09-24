<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('CIN')->unique();
            $table->string('telephone', 20);
            $table->date('date_naissance')->nullable();
            $table->string('adresse')->nullable();
            $table->string('email')->nullable()->unique();
            $table->string('num_permis')->nullable()->unique();
            $table->date('date_expiration_permis')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};