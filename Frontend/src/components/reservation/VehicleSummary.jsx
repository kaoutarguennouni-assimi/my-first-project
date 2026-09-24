import React from 'react';
import { Calendar, Users, Gauge } from 'lucide-react';

export default function VehicleSummary({ vehicle, jours, prixTotal }) {
  if (!vehicle) return null;

  return (
    <div className="bg-gradient-to-br from-[#0A1628] to-[#1B2A4A] rounded-2xl overflow-hidden text-white">
      <div className="h-48 overflow-hidden">
        {vehicle.images?.facade ? (
          <img
            src={vehicle.images?.facade}
            alt={`${vehicle.marque} ${vehicle.modele}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            <Gauge className="w-12 h-12 text-white/10" />
          </div>
        )}
      </div>

      <div className="p-6">
        <p className="text-[#4a90d9] text-xs font-semibold tracking-wider uppercase">{vehicle.marque}</p>
        <h3 className="text-xl font-bold mt-1 mb-4">{vehicle.modele}</h3>

        <div className="space-y-3 mb-5">
          {vehicle.annee && (
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Calendar className="w-4 h-4" />
              <span>Année : {vehicle.annee}</span>
            </div>
          )}
          {vehicle.nombre_passagers && (
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Users className="w-4 h-4" />
              <span>{vehicle.nombre_passagers} passagers</span>
            </div>
          )}
        </div>

        <div className="h-px bg-white/10 my-4" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Tarif journalier</span>
            <span className="font-medium">{vehicle.tarif_journalier} MAD</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Durée de location</span>
            <span className="font-medium">{jours} jour(s)</span>
          </div>
          <div className="h-px bg-white/10 my-2" />
          <div className="flex justify-between">
            <span className="text-white/80 font-medium">Prix total</span>
            <span className="text-xl font-bold text-[#4a90d9]">{prixTotal?.toLocaleString()} MAD</span>
          </div>
        </div>
      </div>
    </div>
  );
}