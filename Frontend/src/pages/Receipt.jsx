import React from 'react';
import api from '@/api/axios'; 
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import ReceiptView from '../components/receipt/ReceiptView';

export default function Receipt() {
  const urlParams = new URLSearchParams(window.location.search);
  const reservationId = urlParams.get('reservationId');
  const clientId = urlParams.get('clientId');
  const vehiculeId = urlParams.get('vehiculeId');

  
  const { data: reservation, isLoading: loadingRes } = useQuery({
    queryKey: ['reservation', reservationId],
    queryFn: async () => {
      const response = await api.get(`/reservations/${reservationId}`);
      return response.data?.data ?? response.data;
    },
    enabled: !!reservationId,
  });

  const { data: client, isLoading: loadingClient } = useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      const response = await api.get(`/clients/${clientId}`);
      return response.data?.data ?? response.data;
    },
    enabled: !!clientId,
  });

  const { data: vehicle, isLoading: loadingVehicle } = useQuery({
    queryKey: ['vehicule', vehiculeId],
    queryFn: async () => {
      const response = await api.get(`/vehicules/${vehiculeId}`);
      return response.data?.data ?? response.data;
    },
    enabled: !!vehiculeId,
  });

  const isLoading = loadingRes || loadingClient || loadingVehicle;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1B2A4A] mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Chargement du reçu...</p>
        </div>
      </div>
    );
  }

  if (!reservation || !client || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Données du reçu introuvables.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="text-[#1B2A4A] font-medium underline"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6">
      <ReceiptView
        reservation={reservation}
        vehicle={vehicle}
        client={client}
      />
    </div>
  );
}