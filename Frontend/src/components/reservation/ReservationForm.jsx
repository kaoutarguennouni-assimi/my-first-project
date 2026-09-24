import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, MapPin, CreditCard, FileText, Calendar, Loader2, ArrowRight } from 'lucide-react';

export default function ReservationForm({ onSubmit, isSubmitting }) {
  const [form, setForm] = useState({
    nom: '', prenom: '', CIN: '', telephone: '',
    date_naissance: '', adresse: '', email: '',
    num_permis: '', date_expiration_permis: '',
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const fields = [
    { name: 'nom', label: 'Nom', icon: User, type: 'text', placeholder: 'Votre nom', required: true },
    { name: 'prenom', label: 'Prénom', icon: User, type: 'text', placeholder: 'Votre prénom', required: true },
    { name: 'CIN', label: 'CIN', icon: CreditCard, type: 'text', placeholder: 'Numéro CIN', required: true },
    { name: 'telephone', label: 'Téléphone', icon: Phone, type: 'tel', placeholder: '06 XX XX XX XX', required: true },
    { name: 'date_naissance', label: 'Date de naissance', icon: Calendar, type: 'date', required: false },
    { name: 'adresse', label: 'Adresse', icon: MapPin, type: 'text', placeholder: 'Votre adresse', required: false },
    { name: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'votre@email.com', required: false },
    { name: 'num_permis', label: 'N° Permis de conduire', icon: FileText, type: 'text', placeholder: 'Numéro du permis', required: true },
    { name: 'date_expiration_permis', label: 'Date d\'expiration du permis', icon: Calendar, type: 'date', required: true },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map((field) => (
          <div key={field.name} className={field.name === 'adresse' ? 'md:col-span-2' : ''}>
            <Label htmlFor={field.name} className="text-sm font-medium text-[#0A1628] mb-2 flex items-center gap-2">
              <field.icon className="w-4 h-4 text-[#1B2A4A]/50" />
              {field.label}
              {field.required && <span className="text-red-400">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              className="h-11 border-gray-200 rounded-xl focus:border-[#2563eb] focus:ring-[#2563eb]/10"
            />
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold h-12 rounded-xl text-base transition-all duration-300 shadow-lg shadow-[#2563eb]/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Traitement en cours...
            </>
          ) : (
            <>
              Confirmer la réservation
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}