import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Calendar, Minus, Plus, ArrowRight, Ban, ChevronLeft, ChevronRight, Fuel, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createPageUrl } from '@/utils';

const categoryLabels = {
  berline: 'Berline', suv: 'SUV', citadine: 'Citadine',
  utilitaire: 'Utilitaire', monospace: 'Monospace', cabriolet: 'Cabriolet', pickup: 'Pick-up',
};

const IMAGE_LABELS = ['Façade', 'Arrière', 'Intérieur'];

export default function VehicleDetailModal({ vehicle, isOpen, onClose }) {
  const [jours, setJours] = useState(1);
  const [step] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);

  if (!vehicle) return null;

  const isDisponible = vehicle.statut === 'disponible';
  const prixTotal = vehicle.tarif_journalier * jours;

  const images = [
    vehicle.images?.facade,
    vehicle.images?.arriere,
    vehicle.images?.interieur,
  ].filter(Boolean);

  const prevImage = () => setImageIndex(i => (i - 1 + images.length) % images.length);
  const nextImage = () => setImageIndex(i => (i + 1) % images.length);

  const handleReserver = () => {
    if (!isDisponible) return;
    const params = new URLSearchParams({
      vehiculeId: vehicle.id,
      jours: String(jours),
      prixTotal: String(prixTotal),
    });
    window.location.href = createPageUrl('Reservation') + '?' + params.toString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-[#0f1e35] rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#162440] px-6 py-5 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#4a90d9] text-xs font-semibold tracking-widest uppercase">{vehicle.marque}</p>
                  <h2 className="text-2xl font-bold text-white mt-1">{vehicle.modele}</h2>
                  <div className="flex items-center gap-4 mt-2 text-white/40 text-sm">
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
                        <span>{vehicle.capacite_bagages} bagages</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <div className="h-1 flex-1 rounded-full bg-[#2563eb]" />
                <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-[#2563eb]' : 'bg-white/10'}`} />
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Images */}
              {images.length > 0 && (
                <div className="mb-6">
                  <div className="relative h-52 rounded-2xl overflow-hidden bg-[#0a1628]">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={imageIndex}
                        src={images[imageIndex]}
                        alt={`${vehicle.marque} ${vehicle.modele} - ${IMAGE_LABELS[imageIndex]}`}
                        className={`w-full h-full object-cover ${!isDisponible ? 'grayscale opacity-60' : ''}`}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.25 }}
                      />
                    </AnimatePresence>

                    {vehicle.type_transport && (
                      <Badge className="absolute top-3 left-3 bg-[#2563eb] text-white border-0 font-semibold text-xs">
                        {categoryLabels[vehicle.type_transport] || vehicle.type_transport}
                      </Badge>
                    )}

                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                      {IMAGE_LABELS[imageIndex] || `Photo ${imageIndex + 1}`}
                    </div>

                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {!isDisponible && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="bg-red-500/90 text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
                          <Ban className="w-4 h-4" />
                          Déjà réservé
                        </div>
                      </div>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-3">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setImageIndex(i)}
                          className={`transition-all duration-200 rounded-full ${
                            i === imageIndex
                              ? 'w-6 h-2 bg-[#2563eb]'
                              : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!isDisponible && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <Ban className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-red-400 font-semibold text-sm">Véhicule non disponible</p>
                    <p className="text-red-400/70 text-xs mt-0.5">Cette voiture est déjà réservée. Veuillez choisir un autre véhicule.</p>
                  </div>
                </div>
              )}

              {(vehicle.boite_vitesse || vehicle.carburant || vehicle.couleur) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {vehicle.couleur && (
                    <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/50 border border-white/10">
                      {vehicle.couleur}
                    </span>
                  )}
                  {vehicle.boite_vitesse && (
                    <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/50 border border-white/10 flex items-center gap-1.5">
                      <Settings2 className="w-3 h-3" />
                      {vehicle.boite_vitesse === 'automatique' ? 'Automatique' : 'Manuelle'}
                    </span>
                  )}
                  {vehicle.carburant && (
                    <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/50 border border-white/10 flex items-center gap-1.5">
                      <Fuel className="w-3 h-3" />
                      {vehicle.carburant}
                    </span>
                  )}
                </div>
              )}

              {/* Durée */}
              <div className="mb-6">
                <h3 className="text-white font-semibold text-lg mb-1">Durée de la Location</h3>
                <p className="text-white/40 text-sm mb-5">Choisissez le nombre de jours</p>

                <div className="flex items-center justify-center gap-8 mb-5">
                  <button
                    type="button"
                    onClick={() => setJours(Math.max(1, jours - 1))}
                    disabled={!isDisponible}
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="text-center">
                    <span className="text-5xl font-bold text-white">{jours}</span>
                    <p className="text-white/40 text-sm mt-1">jour{jours > 1 ? 's' : ''}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setJours(jours + 1)}
                    disabled={!isDisponible}
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-[#0a1628] rounded-xl p-4 border border-white/5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Tarif journalier</span>
                    <span className="text-white">{vehicle.tarif_journalier} DH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Durée</span>
                    <span className="text-white">× {jours} jour{jours > 1 ? 's' : ''}</span>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-[#4a90d9] font-bold text-xl">{prixTotal.toLocaleString()} DH</span>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleReserver}
                disabled={!isDisponible}
                className={`w-full font-semibold h-12 rounded-xl text-base transition-all duration-300 ${
                  isDisponible
                    ? 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white'
                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                }`}
              >
                {isDisponible ? (
                  <>
                    Continuer
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4 mr-2" />
                    Véhicule non disponible
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}