import React, { useState } from 'react';
import api from '@/api/axios';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';
import ReservationForm from '../components/reservation/ReservationForm';
import VehicleSummary from '../components/reservation/VehicleSummary';
import { useToast } from "@/components/ui/use-toast";

export default function Reservation() {
  const { toast } = useToast();
  const urlParams = new URLSearchParams(window.location.search);
  const vehiculeId = urlParams.get('vehiculeId');
  const jours = parseInt(urlParams.get('jours') || '1');
  const prixTotal = parseFloat(urlParams.get('prixTotal') || '0');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicule', vehiculeId],
    queryFn: async () => {
      const response = await api.get(`/vehicules/${vehiculeId}`);
      return response.data?.data ?? response.data;
    },
    enabled: !!vehiculeId,
  });

  const handleSubmit = async (clientData) => {
    setIsSubmitting(true);
    try {
      const clientResponse = await api.post('/clients', clientData);
      const client = clientResponse.data?.data ?? clientResponse.data;

      const today = new Date();
      const dateDebut = format(today, 'yyyy-MM-dd');
      const dateFin = format(addDays(today, jours - 1), 'yyyy-MM-dd');

       const reservationData = {
        date_debut: dateDebut,
        date_fin: dateFin,
        montant_total: prixTotal,
        statut_contrat: 'confirme',
        id_client: client.id,
        id_vehicule: parseInt(vehiculeId),
      };

      const reservationResponse = await api.post('/reservations', reservationData);
      const reservation = reservationResponse.data?.data ?? reservationResponse.data;

      const params = new URLSearchParams({
        reservationId: reservation.id,
        clientId: client.id,
        vehiculeId: vehiculeId,
      });

      window.location.href = createPageUrl('Receipt') + '?' + params.toString();
    } catch (error) {
      const message = error.response?.data?.message || "Une erreur est survenue.";
      toast({
        title: "Erreur de réservation",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4a90d9]" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
        <div className="text-center">
          <p className="text-white/50 mb-4">Véhicule non trouvé</p>
          <Button type="button" onClick={() => window.location.href = createPageUrl('Home')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="bg-gradient-to-r from-[#0A1628] to-[#1B2A4A] text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={() => window.location.href = createPageUrl('Home')}
            className="text-white/60 hover:text-white hover:bg-white/10 mb-4 -ml-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux véhicules
          </Button>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            Formulaire de réservation
          </h1>
          <p className="text-white/50 mt-2">
            Complétez vos informations pour finaliser la réservation
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#0a1628]/5 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#2563eb]" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#0a1628]">Informations personnelles</h2>
                  <p className="text-xs text-gray-400">Tous les champs marqués * sont obligatoires</p>
                </div>
              </div>
              <ReservationForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-6">
              <VehicleSummary vehicle={vehicle} jours={jours} prixTotal={prixTotal} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}