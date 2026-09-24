import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, ArrowRight, Ban, Fuel, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const categoryLabels = {
  berline: 'Berline',
  suv: 'SUV',
  citadine: 'Citadine',
  utilitaire: 'Utilitaire',
  monospace: 'Monospace',
  cabriolet: 'Cabriolet',
  pickup: 'Pick-up',
};

export default function VehicleCard({ vehicle, index, onSelect }) {
  const isDisponible = vehicle.statut === 'disponible';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`group bg-[#0f1e35] rounded-2xl overflow-hidden border transition-all duration-500 ${
        isDisponible
          ? 'border-white/5 hover:border-[#2563eb]/40 hover:shadow-xl hover:shadow-[#2563eb]/10 hover:-translate-y-1'
          : 'border-red-500/10 opacity-75'
      }`}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#1b2a4a]">
        {vehicle.images?.facade ? (
          <img
            src={vehicle.images?.facade}
            alt={`${vehicle.marque} ${vehicle.modele}`}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isDisponible ? 'group-hover:scale-105' : 'grayscale opacity-60'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/5 flex items-center justify-center">
                <Settings2 className="w-8 h-8 text-white/20" />
              </div>
              <span className="text-sm text-white/20">Image non disponible</span>
            </div>
          </div>
        )}

        {vehicle.type_transport && (
          <Badge className="absolute top-4 left-4 bg-[#2563eb] text-white border-0 text-xs font-medium">
            {categoryLabels[vehicle.type_transport] || vehicle.type_transport}
          </Badge>
        )}

        {!isDisponible && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-red-500/90 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
              <Ban className="w-4 h-4" />
              Déjà réservé
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4 bg-[#0a1628]/90 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10">
          <span className="text-white font-bold text-lg">{vehicle.tarif_journalier}</span>
          <span className="text-white/50 text-xs ml-1">DH/jour</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <p className="text-xs text-[#4a90d9] font-semibold tracking-wider uppercase">{vehicle.marque}</p>
          <h3 className="text-lg font-bold text-white mt-0.5">{vehicle.modele}</h3>
        </div>

        <div className="flex items-center gap-4 mb-4 text-white/40 text-xs">
          {vehicle.annee && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{vehicle.annee}</span>
            </div>
          )}
          {vehicle.nombre_passagers && (
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{vehicle.nombre_passagers} places</span>
            </div>
          )}
          {vehicle.capacite_bagages && (
            <div className="flex items-center gap-1">
              <span>🧳</span>
              <span>{vehicle.capacite_bagages} bag.</span>
            </div>
          )}
        </div>

        {(vehicle.couleur || vehicle.boite_vitesse || vehicle.carburant) && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {vehicle.couleur && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/10">
                {vehicle.couleur}
              </span>
            )}
            {vehicle.boite_vitesse && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/10 flex items-center gap-1">
                <Settings2 className="w-2.5 h-2.5" />
                {vehicle.boite_vitesse === 'automatique' ? 'Auto' : 'Manuelle'}
              </span>
            )}
            {vehicle.carburant && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/10 flex items-center gap-1">
                <Fuel className="w-2.5 h-2.5" />
                {vehicle.carburant}
              </span>
            )}
          </div>
        )}

        <Button
          type="button"
          onClick={() => isDisponible ? onSelect(vehicle) : null}
          disabled={!isDisponible}
          className={`w-full rounded-xl h-11 font-medium transition-all duration-300 ${
            isDisponible
              ? 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white group/btn'
              : 'bg-white/5 text-white/20 cursor-not-allowed'
          }`}
        >
          {isDisponible ? (
            <>
              Louer
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </>
          ) : (
            <>
              <Ban className="w-4 h-4 mr-2" />
              Non disponible
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}