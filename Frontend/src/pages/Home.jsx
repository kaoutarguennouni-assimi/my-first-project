import React, { useState, useRef, useMemo } from 'react';
import api from '@/api/axios';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Car } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import Footer from '../components/home/Footer';
import VehicleFilters from '../components/vehicles/VehicleFilters';
import VehicleCard from '../components/vehicles/VehicleCard';
import VehicleDetailModal from '../components/vehicles/VehicleDetailModal';

export default function Home() {
  const vehiclesRef = useRef(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    marque: 'all',
    year: 'all',
    passengers: 'all',
  });

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicules'],
    queryFn: async () => {
      const response = await api.get('/vehicules?all=true');
      return response.data?.data ?? [];
    },
  });

  const scrollToVehicles = () => {
    vehiclesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const years = useMemo(() => {
    const uniqueYears = [...new Set(vehicles.map(v => v.annee).filter(Boolean))];
    return uniqueYears.sort((a, b) => b - a);
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      if (filters.category !== 'all' && v.type_transport !== filters.category) return false;
      if (filters.marque !== 'all' && v.marque !== filters.marque) return false;
      if (filters.year !== 'all' && String(v.annee) !== filters.year) return false;
      if (filters.passengers !== 'all') {
        const target = parseInt(filters.passengers);
        if (v.nombre_passagers !== target) return false;
      }
      return true;
    });
  }, [vehicles, filters]);

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <HeroSection onScrollToVehicles={scrollToVehicles} />

      <section ref={vehiclesRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#4a90d9]" />
            <span className="text-[#4a90d9] text-xs font-semibold tracking-[0.3em] uppercase">
              Notre flotte
            </span>
            <div className="h-px w-8 bg-[#4a90d9]" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Choisissez Votre <span className="font-extrabold">Véhicule</span>
          </h2>
          <p className="text-white/40 mt-3 max-w-lg mx-auto">
            Parcourez notre sélection de véhicules et trouvez celui qui correspond à vos besoins.
          </p>
        </div>

        {/* Filters — reçoit vehicles pour options dynamiques */}
        <VehicleFilters
          filters={filters}
          onFilterChange={setFilters}
          years={years}
          vehicles={vehicles}
        />

        {!isLoading && (
          <div className="flex items-center gap-2 mb-6 text-white/50 text-sm">
            <Car className="w-4 h-4 text-[#4a90d9]" />
            <span>
              {filteredVehicles.length} véhicule{filteredVehicles.length !== 1 ? 's' : ''} trouvé{filteredVehicles.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#4a90d9]" />
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg">Aucun véhicule trouvé avec ces critères.</p>
            <p className="text-white/20 text-sm mt-1">Essayez de modifier vos filtres.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle, index) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                index={index}
                onSelect={setSelectedVehicle}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />

      <VehicleDetailModal
        vehicle={selectedVehicle}
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />
    </div>
  );
}