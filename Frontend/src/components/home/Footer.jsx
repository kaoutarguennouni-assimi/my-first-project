import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-3">
              AARS<span className="text-[#4a90d9]">CAR</span>
            </h3>
            <p className="text-white/40 text-sm leading-relaxed">
              Votre destination commence ici
               — conduisez l'extraordinaire. Location de véhicules premium à Meknès.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase text-[#4a90d9] mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-white/60">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#4a90d9]" />
                <span>06 61 34 48 91 / 05 26 02 94 36</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#4a90d9]" />
                <span>aars.car.as@gmail.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#4a90d9] mt-0.5" />
                <span>N° 461 Appt 1, Lot Zerhounia, 4ème Tranche, Meknès</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase text-[#4a90d9] mb-4">Informations légales</h4>
            <div className="space-y-2 text-sm text-white/40">
              <p>ICE : 003419759000031</p>
              <p>RC : 60885</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs text-white/30">
          <p>© {new Date().getFullYear()} AARSCAR. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}