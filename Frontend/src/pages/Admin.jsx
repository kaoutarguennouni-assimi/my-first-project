import React, { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Car, Users, CalendarCheck, CreditCard, Wrench,
    LogOut, ShieldCheck, Loader2, Plus, Pencil, Trash2,
    X, Check, AlertTriangle, ChevronDown, Search,
    ChevronLeft, ChevronRight, TrendingUp, BarChart3
} from 'lucide-react';
import api from '@/api/axios';
import { useAuth } from '@/lib/AuthContext';
import { usePaginatedQuery, useAllQuery } from '@/hooks/usePaginatedQuery';

const TABS = [
    { key: 'vehicules',    label: 'Véhicules',    icon: Car },
    { key: 'clients',      label: 'Clients',       icon: Users },
    { key: 'reservations', label: 'Réservations',  icon: CalendarCheck },
    { key: 'paiements',    label: 'Paiements',     icon: CreditCard },
    { key: 'maintenances', label: 'Maintenances',  icon: Wrench },
];

const IMAGE_FIELDS = ['image_facade', 'image_arriere', 'image_interieur'];

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
    <div className="bg-[#0f1e35] rounded-2xl border border-white/5 p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-white/40 text-xs">{label}</p>
            <p className="text-white font-bold text-2xl">{value ?? '—'}</p>
            {sub && <p className="text-white/30 text-xs mt-0.5">{sub}</p>}
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const map = {
        disponible:  { label: 'Disponible',  cls: 'bg-green-500/10 text-green-400 border-green-500/20' },
        loue:        { label: 'Loué',        cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
        maintenance: { label: 'Maintenance', cls: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
        confirme:    { label: 'Confirmé',    cls: 'bg-green-500/10 text-green-400 border-green-500/20' },
        en_attente:  { label: 'En attente',  cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
        en_cours:    { label: 'En cours',    cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
        termine:     { label: 'Terminé',     cls: 'bg-white/10 text-white/50 border-white/10' },
        annule:      { label: 'Annulé',      cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
        paye:        { label: 'Payé',        cls: 'bg-green-500/10 text-green-400 border-green-500/20' },
        impaye:      { label: 'Impayé',      cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
        rembourse:   { label: 'Remboursé',   cls: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    };
    const s = map[status] || { label: status, cls: 'bg-white/5 text-white/40 border-white/10' };
    return <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${s.cls}`}>{s.label}</span>;
};

const Input = ({ label, ...props }) => (
    <div className="flex flex-col gap-1">
        {label && <label className="text-white/60 text-xs font-medium">{label}</label>}
        <input
            {...props}
            className="bg-[#0a1628] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors placeholder:text-white/20"
        />
    </div>
);

const SelectField = ({ label, children, ...props }) => (
    <div className="flex flex-col gap-1">
        {label && <label className="text-white/60 text-xs font-medium">{label}</label>}
        <div className="relative">
            <select
                {...props}
                className="w-full bg-[#0a1628] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors appearance-none pr-8"
            >
                {children}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
        </div>
    </div>
);

const Textarea = ({ label, ...props }) => (
    <div className="flex flex-col gap-1">
        {label && <label className="text-white/60 text-xs font-medium">{label}</label>}
        <textarea
            {...props}
            className="bg-[#0a1628] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors placeholder:text-white/20 resize-none"
        />
    </div>
);

const Modal = ({ isOpen, onClose, title, children, onSubmit, isLoading }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-[#0f1e35] rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <h3 className="text-white font-bold text-lg">{title}</h3>
                        <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="p-6 space-y-4">{children}</div>
                        <div className="flex gap-3 px-6 pb-6">
                            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-colors">
                                Annuler
                            </button>
                            <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const ConfirmDelete = ({ isOpen, onClose, onConfirm, isLoading, label }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#0f1e35] rounded-2xl border border-red-500/20 w-full max-w-sm p-6 shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">Confirmer la suppression</h3>
                            <p className="text-white/40 text-xs mt-0.5">{label}</p>
                        </div>
                    </div>
                    <p className="text-white/60 text-sm mb-6">Cette action est irréversible.</p>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm transition-colors">
                            Annuler
                        </button>
                        <button type="button" onClick={onConfirm} disabled={isLoading} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Supprimer
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const ActionButtons = ({ onEdit, onDelete }) => (
    <div className="flex items-center gap-1">
        <button type="button" onClick={onEdit} className="w-7 h-7 rounded-lg bg-[#2563eb]/10 hover:bg-[#2563eb]/20 flex items-center justify-center text-[#4a90d9] transition-colors">
            <Pencil className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={onDelete} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
        </button>
    </div>
);

const Pagination = ({ page, totalPages, onPageChange, totalItems }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <p className="text-white/30 text-xs">{totalItems} résultats</p>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 disabled:opacity-30 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-white/50 text-xs px-2">
                    {page} / {totalPages}
                </span>
                <button
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 disabled:opacity-30 transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const SearchBar = ({ value, onChange, placeholder }) => (
    <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#0a1628] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-colors placeholder:text-white/20"
        />
    </div>
);

const VehiculeFormFields = ({ form, onChange, onImageChange }) => (
    <>
        <div className="grid grid-cols-2 gap-3">
            <Input label="Matricule" value={form.matricule || ''} onChange={e => onChange('matricule', e.target.value)} placeholder="Saisir le matricule" />
            <Input label="Marque" value={form.marque || ''} onChange={e => onChange('marque', e.target.value)} placeholder="Saisir la marque" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
            <Input label="Modèle" value={form.modele || ''} onChange={e => onChange('modele', e.target.value)} placeholder="Saisir le modèle" required />
            <Input label="Année" type="number" value={form.annee || ''} onChange={e => onChange('annee', e.target.value)} placeholder="Choisir l'année" />
        </div>
        <div className="grid grid-cols-2 gap-3">
            <SelectField label="Catégorie" value={form.type_transport || ''} onChange={e => onChange('type_transport', e.target.value)}>
                <option value="">-- Choisir --</option>
                {['berline', 'suv', 'citadine', 'utilitaire', 'monospace', 'cabriolet', 'pickup'].map(t => (
                    <option key={t} value={t}>{t}</option>
                ))}
            </SelectField>
            <SelectField label="Boîte" value={form.boite_vitesse || ''} onChange={e => onChange('boite_vitesse', e.target.value)}>
                <option value="">-- Choisir --</option>
                <option value="manuelle">Manuelle</option>
                <option value="automatique">Automatique</option>
            </SelectField>
        </div>
        <div className="grid grid-cols-2 gap-3">
            <SelectField label="Carburant" value={form.carburant || ''} onChange={e => onChange('carburant', e.target.value)}>
                <option value="">-- Choisir --</option>
                {['essence', 'diesel', 'hybride', 'electrique'].map(t => (
                    <option key={t} value={t}>{t}</option>
                ))}
            </SelectField>
            <SelectField label="Statut" value={form.statut || 'disponible'} onChange={e => onChange('statut', e.target.value)}>
                <option value="disponible">Disponible</option>
                <option value="loue">Loué</option>
                <option value="maintenance">Maintenance</option>
            </SelectField>
        </div>
        <div className="grid grid-cols-3 gap-3">
            <Input label="Tarif/j (DH)" type="number" value={form.tarif_journalier || ''} onChange={e => onChange('tarif_journalier', e.target.value)} placeholder="Entrer le tarif journalier" required />
            <Input label="Passagers" type="number" value={form.nombre_passagers || ''} onChange={e => onChange('nombre_passagers', e.target.value)} placeholder="Nombre de passagers" />
            <Input label="Bagages" type="number" value={form.capacite_bagages || ''} onChange={e => onChange('capacite_bagages', e.target.value)} placeholder="Capacité de bagages" />
        </div>
        <div className="grid grid-cols-2 gap-3">
            <Input label="Couleur" value={form.couleur || ''} onChange={e => onChange('couleur', e.target.value)} placeholder="Saisir la couleur" />
            <Input label="Kilométrage" type="number" value={form.kilometrage || ''} onChange={e => onChange('kilometrage', e.target.value)} placeholder="Entrer le kilométrage" />
        </div>
        <div className="border-t border-white/5 pt-3">
            <p className="text-white/40 text-xs mb-3">Images (optionnel)</p>
            <div className="grid grid-cols-3 gap-3">
                {IMAGE_FIELDS.map(img => (
                    <div key={img} className="flex flex-col gap-1">
                        <label className="text-white/40 text-[10px]">{img.replace('image_', '').replace('_', ' ')}</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => onImageChange(img, e.target.files[0])}
                            className="text-white/40 text-[10px] file:bg-[#2563eb]/10 file:border-0 file:text-[#4a90d9] file:text-[10px] file:px-2 file:py-1 file:rounded-lg"
                        />
                    </div>
                ))}
            </div>
        </div>
    </>
);

const ClientFormFields = ({ form, onChange }) => (
    <>
        <div className="grid grid-cols-2 gap-3">
            <Input label="Nom" value={form.nom || ''} onChange={e => onChange('nom', e.target.value)} placeholder="Saisir le nom" required />
            <Input label="Prénom" value={form.prenom || ''} onChange={e => onChange('prenom', e.target.value)} placeholder="Saisir le prénom" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
            <Input label="CIN" value={form.CIN || ''} onChange={e => onChange('CIN', e.target.value)} placeholder="Entrer le n° de la carte d'identité" required />
            <Input label="Téléphone" value={form.telephone || ''} onChange={e => onChange('telephone', e.target.value)} placeholder="Saisir le numéro de téléphone" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
            <Input label="Email" type="email" value={form.email || ''} onChange={e => onChange('email', e.target.value)} placeholder="Saisir l'adresse email" />
            <Input label="Date de naissance" type="date" value={form.date_naissance || ''} onChange={e => onChange('date_naissance', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
            <Input label="N° Permis" value={form.num_permis || ''} onChange={e => onChange('num_permis', e.target.value)} placeholder="Entrer le numéro du permis" />
            <Input label="Exp. Permis" type="date" value={form.date_expiration_permis || ''} onChange={e => onChange('date_expiration_permis', e.target.value)} />
        </div>
        <Input label="Adresse" value={form.adresse || ''} onChange={e => onChange('adresse', e.target.value)} placeholder="Saisir l'adresse" />
    </>
);

const ReservationFormFields = ({ form, onChange, vehicules, clients }) => (
    <>
        <div className="grid grid-cols-2 gap-3">
            <SelectField label="Client" value={form.id_client || ''} onChange={e => onChange('id_client', e.target.value)} required>
                <option value="">-- Choisir client --</option>
                {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.nom} {c.prenom} — {c.CIN}</option>
                ))}
            </SelectField>
            <SelectField label="Véhicule" value={form.id_vehicule || ''} onChange={e => onChange('id_vehicule', e.target.value)} required>
                <option value="">-- Choisir véhicule --</option>
                {vehicules.map(v => (
                    <option key={v.id} value={v.id}>{v.marque} {v.modele} — {v.matricule}</option>
                ))}
            </SelectField>
        </div>
        <div className="grid grid-cols-2 gap-3">
            <Input label="Date début" type="date" value={form.date_debut || ''} onChange={e => onChange('date_debut', e.target.value)} required />
            <Input label="Date fin" type="date" value={form.date_fin || ''} onChange={e => onChange('date_fin', e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
            <Input label="Nombre de jours" type="number" value={form.nombre_jours || ''} onChange={e => onChange('nombre_jours', e.target.value)} required />
            <Input label="Montant total (DH)" type="number" value={form.montant_total || ''} onChange={e => onChange('montant_total', e.target.value)} required />
        </div>
        <SelectField label="Statut" value={form.statut_contrat || 'confirme'} onChange={e => onChange('statut_contrat', e.target.value)}>
            {['confirme', 'en_attente', 'en_cours', 'termine', 'annule'].map(s => (
                <option key={s} value={s}>{s}</option>
            ))}
        </SelectField>
    </>
);

const PaiementFormFields = ({ form, onChange, reservations }) => (
    <>
        <SelectField label="Réservation" value={form.id_reservation || ''} onChange={e => onChange('id_reservation', e.target.value)} required>
            <option value="">-- Choisir réservation --</option>
            {reservations.map(r => (
                <option key={r.id} value={r.id}>
                    {r.numero_contrat} — {r.client ? `${r.client.nom} ${r.client.prenom}` : `#${r.id_client}`}
                </option>
            ))}
        </SelectField>
        <div className="grid grid-cols-2 gap-3">
            <Input label="Date paiement" type="date" value={form.date_paiement || ''} onChange={e => onChange('date_paiement', e.target.value)} required />
            <Input label="Montant (DH)" type="number" value={form.montant || ''} onChange={e => onChange('montant', e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
            <SelectField label="Mode paiement" value={form.mode_paiement || ''} onChange={e => onChange('mode_paiement', e.target.value)} required>
                <option value="">-- Choisir --</option>
                {['especes', 'carte', 'virement', 'cheque'].map(m => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </SelectField>
            <SelectField label="Statut" value={form.statut || 'paye'} onChange={e => onChange('statut', e.target.value)}>
                <option value="paye">Payé</option>
                <option value="impaye">Impayé</option>
                <option value="rembourse">Remboursé</option>
            </SelectField>
        </div>
    </>
);

const MaintenanceFormFields = ({ form, onChange, vehicules }) => (
    <>
        <SelectField label="Véhicule" value={form.id_vehicule || ''} onChange={e => onChange('id_vehicule', e.target.value)} required>
            <option value="">-- Choisir véhicule --</option>
            {vehicules.map(v => (
                <option key={v.id} value={v.id}>{v.marque} {v.modele} — {v.matricule}</option>
            ))}
        </SelectField>
        <Textarea label="Description" value={form.description || ''} onChange={e => onChange('description', e.target.value)} rows={3} required />
        <div className="grid grid-cols-2 gap-3">
            <Input label="Date début" type="date" value={form.date_debut || ''} onChange={e => onChange('date_debut', e.target.value)} required />
            <Input label="Date fin" type="date" value={form.date_fin || ''} onChange={e => onChange('date_fin', e.target.value)} />
        </div>
        <Input label="Coût (DH)" type="number" value={form.cout || ''} onChange={e => onChange('cout', e.target.value)} placeholder="Optionnel" />
    </>
);

function VehiculesSection() {
    const qc = useQueryClient();
    const { toast } = useToast();
    const [modal, setModal]           = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm]             = useState({});
    const [images, setImages]         = useState({});

    const { items, meta, isLoading, page, setPage, search, setSearch, totalPages, totalItems } =
        usePaginatedQuery(['admin-vehicules'], '/vehicules', { perPage: 12 });

    const f            = useCallback((k, v) => setForm(p => ({ ...p, [k]: v })), []);
    const onImageChange = useCallback((k, v) => setImages(p => ({ ...p, [k]: v })), []);

    const openCreate = () => { setForm({}); setImages({}); setModal('create'); };
    const openEdit   = v => { setForm({ ...v }); setImages({}); setModal('edit'); };

    const mutation = useMutation({
        mutationFn: async (payload) => {
            const fd = new FormData();
            Object.entries(payload.data).forEach(([k, v]) => {
                if (IMAGE_FIELDS.includes(k)) return;
                if (v !== undefined && v !== null && v !== '') fd.append(k, v);
            });
            Object.entries(images).forEach(([k, v]) => { if (v) fd.append(k, v); });
            if (payload.id) {
                fd.append('_method', 'PUT');
                return api.post(`/vehicules/${payload.id}`, fd);
            }
            return api.post('/vehicules', fd);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-vehicules'] });
            qc.invalidateQueries({ queryKey: ['vehicules'] });
            setModal(null);
            toast({ title: "✅ Succès", description: "Véhicule enregistré avec succès." });
        },
        onError: (error) => {
            toast({ title: "❌ Erreur", description: error?.response?.data?.message || "Une erreur est survenue.", variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: id => api.delete(`/vehicules/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-vehicules'] });
            qc.invalidateQueries({ queryKey: ['vehicules'] });
            setDeleteTarget(null);
            toast({ title: "✅ Supprimé", description: "Véhicule supprimé avec succès." });
        },
        onError: (error) => {
            toast({ title: "❌ Erreur", description: error?.response?.data?.message || "Impossible de supprimer.", variant: "destructive" });
        },
    });

    const handleSubmit = e => {
        e.preventDefault();
        mutation.mutate({ id: modal === 'edit' ? form.id : null, data: form });
    };

    return (
        <>
            <div className="flex items-center justify-between p-4 border-b border-white/5 gap-3">
                <SearchBar value={search} onChange={setSearch} placeholder="Rechercher marque, modèle, matricule..." />
                <button type="button" onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap">
                    <Plus className="w-4 h-4" /> Ajouter
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin text-[#4a90d9]" />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                {['ID', 'Matricule', 'Marque', 'Modèle', 'Année', 'Catégorie', 'Tarif/j', 'Statut', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-white/40 font-medium py-3 px-4 text-xs uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr><td colSpan={9} className="py-10 text-center text-white/30">Aucun véhicule trouvé</td></tr>
                            ) : items.map((v, i) => (
                                <tr key={v.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 !== 0 ? 'bg-white/[0.01]' : ''}`}>
                                    <td className="py-3 px-4 text-white/40">{v.id}</td>
                                    <td className="py-3 px-4 text-white font-mono text-xs">{v.matricule || '—'}</td>
                                    <td className="py-3 px-4 text-white font-medium">{v.marque}</td>
                                    <td className="py-3 px-4 text-white">{v.modele}</td>
                                    <td className="py-3 px-4 text-white/60">{v.annee}</td>
                                    <td className="py-3 px-4 text-white/60">{v.type_transport}</td>
                                    <td className="py-3 px-4 text-[#4a90d9] font-semibold">{v.tarif_journalier} DH</td>
                                    <td className="py-3 px-4"><StatusBadge status={v.statut} /></td>
                                    <td className="py-3 px-4">
                                        <ActionButtons onEdit={() => openEdit(v)} onDelete={() => setDeleteTarget(v)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} />

            <Modal isOpen={modal === 'create'} onClose={() => setModal(null)} title="Ajouter un véhicule" onSubmit={handleSubmit} isLoading={mutation.isPending}>
                <VehiculeFormFields form={form} onChange={f} onImageChange={onImageChange} />
            </Modal>
            <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title="Modifier le véhicule" onSubmit={handleSubmit} isLoading={mutation.isPending}>
                <VehiculeFormFields form={form} onChange={f} onImageChange={onImageChange} />
            </Modal>
            <ConfirmDelete
                isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
                onConfirm={() => deleteMutation.mutate(deleteTarget?.id)}
                isLoading={deleteMutation.isPending}
                label={`${deleteTarget?.marque} ${deleteTarget?.modele}`}
            />
        </>
    );
}

function ClientsSection() {
    const qc = useQueryClient();
    const { toast } = useToast();
    const [modal, setModal]           = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm]             = useState({});

    const { items, isLoading, page, setPage, search, setSearch, totalPages, totalItems } =
        usePaginatedQuery(['admin-clients'], '/clients', { perPage: 15 });

    const f = useCallback((k, v) => setForm(p => ({ ...p, [k]: v })), []);
    const openCreate = () => { setForm({}); setModal('create'); };
    const openEdit   = c => { setForm({ ...c }); setModal('edit'); };

    const mutation = useMutation({
        mutationFn: payload => payload.id
            ? api.put(`/clients/${payload.id}`, payload.data)
            : api.post('/clients', payload.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-clients'] });
            setModal(null);
            toast({ title: "✅ Succès", description: "Client enregistré avec succès." });
        },
        onError: (error) => {
            toast({ title: "❌ Erreur", description: error?.response?.data?.message || "Une erreur est survenue.", variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: id => api.delete(`/clients/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-clients'] });
            setDeleteTarget(null);
            toast({ title: "✅ Supprimé", description: "Client supprimé avec succès." });
        },
        onError: (error) => {
            toast({ title: "❌ Erreur", description: error?.response?.data?.message || "Impossible de supprimer.", variant: "destructive" });
        },
    });

    const handleSubmit = e => {
        e.preventDefault();
        mutation.mutate({ id: modal === 'edit' ? form.id : null, data: form });
    };

    return (
        <>
            <div className="flex items-center justify-between p-4 border-b border-white/5 gap-3">
                <SearchBar value={search} onChange={setSearch} placeholder="Rechercher nom, CIN, téléphone..." />
                <button type="button" onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap">
                    <Plus className="w-4 h-4" /> Ajouter
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[#4a90d9]" /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                {['ID', 'Nom', 'Prénom', 'CIN', 'Téléphone', 'Email', 'N° Permis', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-white/40 font-medium py-3 px-4 text-xs uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr><td colSpan={8} className="py-10 text-center text-white/30">Aucun client trouvé</td></tr>
                            ) : items.map((c, i) => (
                                <tr key={c.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 !== 0 ? 'bg-white/[0.01]' : ''}`}>
                                    <td className="py-3 px-4 text-white/40">{c.id}</td>
                                    <td className="py-3 px-4 text-white font-medium">{c.nom}</td>
                                    <td className="py-3 px-4 text-white">{c.prenom}</td>
                                    <td className="py-3 px-4 text-white font-mono text-xs">{c.CIN}</td>
                                    <td className="py-3 px-4 text-white/60">{c.telephone}</td>
                                    <td className="py-3 px-4 text-white/60">{c.email}</td>
                                    <td className="py-3 px-4 text-white font-mono text-xs">{c.num_permis}</td>
                                    <td className="py-3 px-4">
                                        <ActionButtons onEdit={() => openEdit(c)} onDelete={() => setDeleteTarget(c)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} />

            <Modal isOpen={modal === 'create'} onClose={() => setModal(null)} title="Ajouter un client" onSubmit={handleSubmit} isLoading={mutation.isPending}>
                <ClientFormFields form={form} onChange={f} />
            </Modal>
            <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title="Modifier le client" onSubmit={handleSubmit} isLoading={mutation.isPending}>
                <ClientFormFields form={form} onChange={f} />
            </Modal>
            <ConfirmDelete
                isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
                onConfirm={() => deleteMutation.mutate(deleteTarget?.id)}
                isLoading={deleteMutation.isPending}
                label={`${deleteTarget?.nom} ${deleteTarget?.prenom}`}
            />
        </>
    );
}

function ReservationsSection() {
    const qc = useQueryClient();
    const { toast } = useToast();
    const [modal, setModal]           = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm]             = useState({});

    const { items, isLoading, page, setPage, totalPages, totalItems } =
        usePaginatedQuery(['admin-reservations'], '/reservations', { perPage: 15 });

    const { data: allVehicules = [] } = useAllQuery(['all-vehicules-all'], '/vehicules');
    const { data: allClients = [] }   = useAllQuery(['all-clients'], '/clients');

    const f = useCallback((k, v) => setForm(p => ({ ...p, [k]: v })), []);
    const openCreate = () => { setForm({ statut_contrat: 'confirme' }); setModal('create'); };
    const openEdit   = r => { setForm({ ...r }); setModal('edit'); };

    const mutation = useMutation({
        mutationFn: payload => payload.id
            ? api.put(`/reservations/${payload.id}`, payload.data)
            : api.post('/reservations', payload.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-reservations'] });
            qc.invalidateQueries({ queryKey: ['admin-vehicules'] });
            qc.invalidateQueries({ queryKey: ['vehicules'] });
            setModal(null);
            toast({ title: "✅ Succès", description: "Réservation enregistrée avec succès." });
        },
        onError: (error) => {
            toast({ title: "❌ Erreur", description: error?.response?.data?.message || "Une erreur est survenue.", variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: id => api.delete(`/reservations/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-reservations'] });
            qc.invalidateQueries({ queryKey: ['admin-vehicules'] });
            qc.invalidateQueries({ queryKey: ['vehicules'] });
            setDeleteTarget(null);
            toast({ title: "✅ Supprimé", description: "Réservation supprimée avec succès." });
        },
        onError: (error) => {
            toast({ title: "❌ Erreur", description: error?.response?.data?.message || "Impossible de supprimer.", variant: "destructive" });
        },
    });

    const handleSubmit = e => {
        e.preventDefault();
        mutation.mutate({
            id: modal === 'edit' ? form.id : null,
            data: {
                ...form,
                id_client:     parseInt(form.id_client),
                id_vehicule:   parseInt(form.id_vehicule),
                nombre_jours:  parseInt(form.nombre_jours),
                montant_total: parseFloat(form.montant_total),
            },
        });
    };

    return (
        <>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
                <p className="text-white/40 text-sm">{totalItems} réservations</p>
                <button type="button" onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium rounded-xl transition-colors">
                    <Plus className="w-4 h-4" /> Ajouter
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[#4a90d9]" /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                {['N° Contrat', 'Client', 'Véhicule', 'Début', 'Fin', 'Jours', 'Montant', 'Statut', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-white/40 font-medium py-3 px-4 text-xs uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr><td colSpan={9} className="py-10 text-center text-white/30">Aucune réservation</td></tr>
                            ) : items.map((r, i) => (
                                <tr key={r.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 !== 0 ? 'bg-white/[0.01]' : ''}`}>
                                    <td className="py-3 px-4 text-[#4a90d9] font-mono text-xs font-semibold">{r.numero_contrat}</td>
                                    <td className="py-3 px-4 text-white">{r.client ? `${r.client.nom} ${r.client.prenom}` : `#${r.id_client}`}</td>
                                    <td className="py-3 px-4 text-white">{r.vehicule ? `${r.vehicule.marque} ${r.vehicule.modele}` : `#${r.id_vehicule}`}</td>
                                    <td className="py-3 px-4 text-white/60">{r.date_debut}</td>
                                    <td className="py-3 px-4 text-white/60">{r.date_fin}</td>
                                    <td className="py-3 px-4 text-white/60">{r.nombre_jours}j</td>
                                    <td className="py-3 px-4 text-[#4a90d9] font-semibold">{Number(r.montant_total).toLocaleString()} DH</td>
                                    <td className="py-3 px-4"><StatusBadge status={r.statut_contrat} /></td>
                                    <td className="py-3 px-4">
                                        <ActionButtons onEdit={() => openEdit(r)} onDelete={() => setDeleteTarget(r)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} />

            <Modal isOpen={modal === 'create'} onClose={() => setModal(null)} title="Ajouter une réservation" onSubmit={handleSubmit} isLoading={mutation.isPending}>
                <ReservationFormFields form={form} onChange={f} vehicules={allVehicules} clients={allClients} />
            </Modal>
            <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title="Modifier la réservation" onSubmit={handleSubmit} isLoading={mutation.isPending}>
                <ReservationFormFields form={form} onChange={f} vehicules={allVehicules} clients={allClients} />
            </Modal>
            <ConfirmDelete
                isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
                onConfirm={() => deleteMutation.mutate(deleteTarget?.id)}
                isLoading={deleteMutation.isPending}
                label={`Réservation ${deleteTarget?.numero_contrat}`}
            />
        </>
    );
}

function PaiementsSection() {
    const qc = useQueryClient();
    const { toast } = useToast();
    const [modal, setModal]           = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm]             = useState({});

    const { items, isLoading, page, setPage, totalPages, totalItems } =
        usePaginatedQuery(['admin-paiements'], '/paiements', { perPage: 15 });

    const { data: allReservations = [] } = useAllQuery(['all-reservations'], '/reservations');

    const f = useCallback((k, v) => setForm(p => ({ ...p, [k]: v })), []);
    const openCreate = () => { setForm({ statut: 'paye', date_paiement: new Date().toISOString().split('T')[0] }); setModal('create'); };
    const openEdit   = p => { setForm({ ...p }); setModal('edit'); };

    const mutation = useMutation({
        mutationFn: payload => payload.id
            ? api.put(`/paiements/${payload.id}`, payload.data)
            : api.post('/paiements', payload.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-paiements'] });
            setModal(null);
            toast({ title: "✅ Succès", description: "Paiement enregistré avec succès." });
        },
        onError: (error) => {
            toast({ title: "❌ Erreur", description: error?.response?.data?.message || "Une erreur est survenue.", variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: id => api.delete(`/paiements/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-paiements'] });
            setDeleteTarget(null);
            toast({ title: "✅ Supprimé", description: "Paiement supprimé avec succès." });
        },
        onError: (error) => {
            toast({ title: "❌ Erreur", description: error?.response?.data?.message || "Impossible de supprimer.", variant: "destructive" });
        },
    });

    const handleSubmit = e => {
        e.preventDefault();
        mutation.mutate({
            id: modal === 'edit' ? form.id : null,
            data: { ...form, id_reservation: parseInt(form.id_reservation), montant: parseFloat(form.montant) },
        });
    };

    return (
        <>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
                <p className="text-white/40 text-sm">{totalItems} paiements</p>
                <button type="button" onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium rounded-xl transition-colors">
                    <Plus className="w-4 h-4" /> Ajouter
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[#4a90d9]" /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                {['ID', 'Réservation', 'Date', 'Montant', 'Mode', 'Statut', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-white/40 font-medium py-3 px-4 text-xs uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr><td colSpan={7} className="py-10 text-center text-white/30">Aucun paiement enregistré</td></tr>
                            ) : items.map((p, i) => (
                                <tr key={p.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 !== 0 ? 'bg-white/[0.01]' : ''}`}>
                                    <td className="py-3 px-4 text-white/40">{p.id}</td>
                                    <td className="py-3 px-4 text-[#4a90d9] font-mono text-xs">
  {p.reservation?.numero_contrat ?? `#${p.id_reservation}`}
</td>
                                    <td className="py-3 px-4 text-white/60">{p.date_paiement}</td>
                                    <td className="py-3 px-4 text-[#4a90d9] font-semibold">{Number(p.montant).toLocaleString()} DH</td>
                                    <td className="py-3 px-4 text-white/60">{p.mode_paiement}</td>
                                    <td className="py-3 px-4"><StatusBadge status={p.statut} /></td>
                                    <td className="py-3 px-4">
                                        <ActionButtons onEdit={() => openEdit(p)} onDelete={() => setDeleteTarget(p)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} />

            <Modal isOpen={modal === 'create'} onClose={() => setModal(null)} title="Ajouter un paiement" onSubmit={handleSubmit} isLoading={mutation.isPending}>
                <PaiementFormFields form={form} onChange={f} reservations={allReservations} />
            </Modal>
            <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title="Modifier le paiement" onSubmit={handleSubmit} isLoading={mutation.isPending}>
                <PaiementFormFields form={form} onChange={f} reservations={allReservations} />
            </Modal>
            <ConfirmDelete
                isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
                onConfirm={() => deleteMutation.mutate(deleteTarget?.id)}
                isLoading={deleteMutation.isPending}
                label={`Paiement #${deleteTarget?.id}`}
            />
        </>
    );
}

function MaintenancesSection() {
    const qc = useQueryClient();
    const { toast } = useToast();
    const [modal, setModal]           = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm]             = useState({});

    const { items, isLoading, page, setPage, totalPages, totalItems } =
        usePaginatedQuery(['admin-maintenances'], '/maintenances', { perPage: 15 });

    const { data: allVehicules = [] } = useAllQuery(['all-vehicules'], '/vehicules');

    const f = useCallback((k, v) => setForm(p => ({ ...p, [k]: v })), []);
    const openCreate = () => { setForm({ date_debut: new Date().toISOString().split('T')[0] }); setModal('create'); };
    const openEdit   = m => { setForm({ ...m }); setModal('edit'); };

    const mutation = useMutation({
        mutationFn: payload => payload.id
            ? api.put(`/maintenances/${payload.id}`, payload.data)
            : api.post('/maintenances', payload.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-maintenances'] });
            qc.invalidateQueries({ queryKey: ['admin-vehicules'] });
            qc.invalidateQueries({ queryKey: ['vehicules'] });
            setModal(null);
            toast({ title: "✅ Succès", description: "Maintenance enregistrée avec succès." });
        },
        onError: (error) => {
            toast({ title: "❌ Erreur", description: error?.response?.data?.message || "Une erreur est survenue.", variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: id => api.delete(`/maintenances/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-maintenances'] });
            qc.invalidateQueries({ queryKey: ['admin-vehicules'] });
            qc.invalidateQueries({ queryKey: ['vehicules'] });
            setDeleteTarget(null);
            toast({ title: "✅ Supprimé", description: "Maintenance supprimée avec succès." });
        },
        onError: (error) => {
            toast({ title: "❌ Erreur", description: error?.response?.data?.message || "Impossible de supprimer.", variant: "destructive" });
        },
    });

    const handleSubmit = e => {
        e.preventDefault();
        mutation.mutate({
            id: modal === 'edit' ? form.id : null,
            data: { ...form, id_vehicule: parseInt(form.id_vehicule), cout: form.cout ? parseFloat(form.cout) : null },
        });
    };

    return (
        <>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
                <p className="text-white/40 text-sm">{totalItems} maintenances</p>
                <button type="button" onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium rounded-xl transition-colors">
                    <Plus className="w-4 h-4" /> Ajouter
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[#4a90d9]" /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                {['ID', 'Véhicule', 'Description', 'Début', 'Fin', 'Coût', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-white/40 font-medium py-3 px-4 text-xs uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr><td colSpan={7} className="py-10 text-center text-white/30">Aucune maintenance enregistrée</td></tr>
                            ) : items.map((m, i) => (
                                <tr key={m.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 !== 0 ? 'bg-white/[0.01]' : ''}`}>
                                    <td className="py-3 px-4 text-white/40">{m.id}</td>
                                    <td className="py-3 px-4 text-white">{m.vehicule ? `${m.vehicule.marque} ${m.vehicule.modele}` : `#${m.id_vehicule}`}</td>
                                    <td className="py-3 px-4 text-white/70 max-w-xs truncate">{m.description}</td>
                                    <td className="py-3 px-4 text-white/60">{m.date_debut}</td>
                                    <td className="py-3 px-4 text-white/60">{m.date_fin || '—'}</td>
                                    <td className="py-3 px-4 text-[#4a90d9] font-semibold">{m.cout ? `${Number(m.cout).toLocaleString()} DH` : '—'}</td>
                                    <td className="py-3 px-4">
                                        <ActionButtons onEdit={() => openEdit(m)} onDelete={() => setDeleteTarget(m)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} />

            <Modal isOpen={modal === 'create'} onClose={() => setModal(null)} title="Ajouter une maintenance" onSubmit={handleSubmit} isLoading={mutation.isPending}>
                <MaintenanceFormFields form={form} onChange={f} vehicules={allVehicules} />
            </Modal>
            <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title="Modifier la maintenance" onSubmit={handleSubmit} isLoading={mutation.isPending}>
                <MaintenanceFormFields form={form} onChange={f} vehicules={allVehicules} />
            </Modal>
            <ConfirmDelete
                isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
                onConfirm={() => deleteMutation.mutate(deleteTarget?.id)}
                isLoading={deleteMutation.isPending}
                label={`Maintenance #${deleteTarget?.id}`}
            />
        </>
    );
}

export default function Admin() {
    const { user, logout, isAuthenticated, isLoadingAuth } = useAuth();
    const [activeTab, setActiveTab] = useState('vehicules');

    const { data: stats } = useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => (await api.get('/dashboard')).data,
        staleTime: 60_000,
    });

    useEffect(() => {
        if (!isLoadingAuth && !isAuthenticated) {
            window.location.href = '/AdminLogin';
        }
    }, [isLoadingAuth, isAuthenticated]);

    if (isLoadingAuth || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#4a90d9]" />
            </div>
        );
    }

    const tabCounts = {
        vehicules:    stats?.vehicules?.total,
        clients:      stats?.clients,
        reservations: stats?.reservations?.total,
        paiements:    stats?.paiements,
        maintenances: stats?.maintenances,
    };

    return (
        <div className="min-h-screen bg-[#0a1628]">
            <header className="bg-[#0f1e35] border-b border-white/5 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#2563eb]/10 border border-[#2563eb]/20 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-[#2563eb]" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-sm">AARSCAR Admin</h1>
                            <p className="text-white/30 text-xs">{user?.email}</p>
                        </div>
                    </div>
                    <button type="button" onClick={logout} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                        <LogOut className="w-4 h-4" /> Déconnexion
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={Car}           label="Véhicules"      value={stats?.vehicules?.total}       sub={`${stats?.vehicules?.disponibles ?? 0} disponibles`} color="bg-[#2563eb]/10 text-[#4a90d9]" />
                    <StatCard icon={Users}         label="Clients"        value={stats?.clients}                color="bg-purple-500/10 text-purple-400" />
                    <StatCard icon={CalendarCheck} label="Réservations"   value={stats?.reservations?.total}    sub={`${stats?.reservations?.ce_mois ?? 0} ce mois`}  color="bg-green-500/10 text-green-400" />
                    <StatCard icon={TrendingUp}    label="Revenus (mois)" value={stats?.revenus?.ce_mois ? `${Number(stats.revenus.ce_mois).toLocaleString()} DH` : '0 DH'} color="bg-yellow-500/10 text-yellow-400" />
                </div>

                <div className="bg-[#0f1e35] rounded-2xl border border-white/5 overflow-hidden">
                    <div className="flex overflow-x-auto border-b border-white/5">
                        {TABS.map(({ key, label, icon: Icon }) => (
                            <button key={key} type="button" onClick={() => setActiveTab(key)}
                                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                                    activeTab === key
                                        ? 'text-white border-[#2563eb] bg-[#2563eb]/5'
                                        : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                                {tabCounts[key] != null && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === key ? 'bg-[#2563eb]/20 text-[#4a90d9]' : 'bg-white/5 text-white/30'}`}>
                                        {tabCounts[key]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
                        {activeTab === 'vehicules'    && <VehiculesSection />}
                        {activeTab === 'clients'      && <ClientsSection />}
                        {activeTab === 'reservations' && <ReservationsSection />}
                        {activeTab === 'paiements'    && <PaiementsSection />}
                        {activeTab === 'maintenances' && <MaintenancesSection />}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}