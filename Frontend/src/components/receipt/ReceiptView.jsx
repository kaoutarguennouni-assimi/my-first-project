import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ReceiptView({ reservation, vehicle, client }) {
  const handlePrint = () => {
    window.print();
  };

  if (!reservation || !vehicle || !client) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="no-print flex items-center justify-between mb-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.location.href = createPageUrl('Home')}
          className="rounded-xl border-gray-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Button>
        <Button
          type="button"
          onClick={handlePrint}
          className="bg-[#0A1628] hover:bg-[#1B2A4A] text-white rounded-xl"
        >
          <Printer className="w-4 h-4 mr-2" />
          Imprimer le reçu
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden print:shadow-none print:border print:rounded-none">
        <div className="bg-gradient-to-r from-[#0A1628] to-[#1B2A4A] text-white p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold">
                AARS<span className="text-[#4a90d9]">CAR</span>
              </h1>
              <p className="text-white/50 text-sm mt-1">Location de voiture</p>
            </div>
            <div className="text-right text-sm text-white/60">
              <p>ICE : 003419759000031</p>
              <p>RC : 60885</p>
              <p>N° {reservation.numero_contrat || '000136'}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0A1628]">Reçu de Réservation</h2>
            <p className="text-gray-400 text-sm mt-1">
              Date : {format(new Date(reservation.created_at || new Date()), 'dd MMMM yyyy', { locale: fr })}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-[#4a90d9] tracking-wider uppercase mb-3">
              Informations du véhicule
            </h3>
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Marque</p>
                  <p className="font-semibold text-[#0A1628]">{vehicle.marque}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Modèle</p>
                  <p className="font-semibold text-[#0A1628]">{vehicle.modele}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Matricule</p>
                  <p className="font-semibold text-[#0A1628]">{vehicle.matricule}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-[#4a90d9] tracking-wider uppercase mb-3">
              Informations du client
            </h3>
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Nom complet</p>
                  <p className="font-semibold text-[#0A1628]">{client.prenom} {client.nom}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">CIN</p>
                  <p className="font-semibold text-[#0A1628]">{client.CIN}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Téléphone</p>
                  <p className="font-semibold text-[#0A1628]">{client.telephone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="font-semibold text-[#0A1628]">{client.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">N° Permis</p>
                  <p className="font-semibold text-[#0A1628]">{client.num_permis}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Adresse</p>
                  <p className="font-semibold text-[#0A1628]">{client.adresse || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-[#4a90d9] tracking-wider uppercase mb-3">
              Détails de la location
            </h3>
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date de début</span>
                  <span className="font-medium text-[#0A1628]">
                    {reservation.date_debut ? format(new Date(reservation.date_debut), 'dd/MM/yyyy') : '—'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date de fin</span>
                  <span className="font-medium text-[#0A1628]">
                    {reservation.date_fin ? format(new Date(reservation.date_fin), 'dd/MM/yyyy') : '—'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Nombre de jours</span>
                  <span className="font-medium text-[#0A1628]">{reservation.nombre_jours} jour(s)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tarif journalier</span>
                  <span className="font-medium text-[#0A1628]">{vehicle.tarif_journalier} MAD</span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold text-[#0A1628]">Prix total</span>
                  <span className="text-xl font-bold text-[#4a90d9]">{reservation.montant_total?.toLocaleString()} MAD</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="text-center text-xs text-gray-400 space-y-1">
              <p className="font-semibold text-gray-500">AARSCAR — Location de voiture</p>
              <p>N° 461 Appt 1, Lot Zerhounia, 4ème Tranche, Meknès</p>
              <p>Tél : 06 61 34 48 91 / 05 26 02 94 36 — Email : aars.car.as@gmail.com</p>
              <p>ICE : 003419759000031 — RC : 60885</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}