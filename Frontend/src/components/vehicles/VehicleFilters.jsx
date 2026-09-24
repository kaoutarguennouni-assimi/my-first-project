import React, { useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { value: 'all', label: 'Toutes catégories' },
  { value: 'berline', label: 'Berline' },
  { value: 'suv', label: 'SUV' },
  { value: 'citadine', label: 'Citadine' },
  { value: 'utilitaire', label: 'Utilitaire' },
  { value: 'monospace', label: 'Monospace' },
  { value: 'cabriolet', label: 'Cabriolet' },
  { value: 'pickup', label: 'Pick-up' },
];

export default function VehicleFilters({ filters, onFilterChange, years, vehicles = [] }) {
  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.marque !== 'all' ||
    filters.year !== 'all' ||
    filters.passengers !== 'all';

  const resetFilters = () => {
    onFilterChange({ category: 'all', marque: 'all', year: 'all', passengers: 'all' });
  };

  const marques = useMemo(() => {
    const filtered = filters.category !== 'all'
      ? vehicles.filter(v => v.type_transport === filters.category)
      : vehicles;
    const unique = [...new Set(filtered.map(v => v.marque).filter(Boolean))].sort();
    return unique;
  }, [vehicles, filters.category]);

  const passagerOptions = useMemo(() => {
    let filtered = vehicles;
    if (filters.category !== 'all') filtered = filtered.filter(v => v.type_transport === filters.category);
    if (filters.marque !== 'all') filtered = filtered.filter(v => v.marque === filters.marque);
    const uniquePassagers = [...new Set(filtered.map(v => v.nombre_passagers).filter(Boolean))].sort((a, b) => a - b);
    return uniquePassagers;
  }, [vehicles, filters.category, filters.marque]);

  const handleCategoryChange = (val) => {
    onFilterChange({ ...filters, category: val, marque: 'all', passengers: 'all' });
  };

  const handleMarqueChange = (val) => {
    onFilterChange({ ...filters, marque: val, passengers: 'all' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#0f1e35] rounded-2xl border border-white/5 p-5 mb-10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#4a90d9]" />
          <span className="text-white font-semibold text-sm tracking-wider uppercase">Filtres</span>
        </div>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-white/40 hover:text-white/70 text-xs"
          >
            <X className="w-3 h-3 mr-1" /> Réinitialiser
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        {/* Catégorie */}
        <div>
          <p className="text-white/40 text-xs mb-1.5">Catégorie</p>
          <Select value={filters.category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="h-10 bg-[#0a1628] border-white/10 text-white rounded-lg text-sm">
              <SelectValue placeholder="Toutes catégories" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1e35] border-white/10 text-white">
              {CATEGORIES.map(c => (
                <SelectItem key={c.value} value={c.value} className="focus:bg-white/10 focus:text-white">
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Marque — dynamique */}
        <div>
          <p className="text-white/40 text-xs mb-1.5">Marque</p>
          <Select value={filters.marque} onValueChange={handleMarqueChange}>
            <SelectTrigger className="h-10 bg-[#0a1628] border-white/10 text-white rounded-lg text-sm">
              <SelectValue placeholder="Toutes marques" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1e35] border-white/10 text-white">
              <SelectItem value="all" className="focus:bg-white/10 focus:text-white">Toutes marques</SelectItem>
              {marques.map(m => (
                <SelectItem key={m} value={m} className="focus:bg-white/10 focus:text-white">{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Passagers — dynamique et filtré */}
        <div>
          <p className="text-white/40 text-xs mb-1.5">Passagers</p>
          <Select value={filters.passengers} onValueChange={(v) => onFilterChange({ ...filters, passengers: v })}>
            <SelectTrigger className="h-10 bg-[#0a1628] border-white/10 text-white rounded-lg text-sm">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1e35] border-white/10 text-white">
              <SelectItem value="all" className="focus:bg-white/10 focus:text-white">Tous</SelectItem>
              {passagerOptions.map(p => (
                <SelectItem key={p} value={String(p)} className="focus:bg-white/10 focus:text-white">
                  {p} places
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Année */}
        <div>
          <p className="text-white/40 text-xs mb-1.5">Année</p>
          <Select value={filters.year} onValueChange={(v) => onFilterChange({ ...filters, year: v })}>
            <SelectTrigger className="h-10 bg-[#0a1628] border-white/10 text-white rounded-lg text-sm">
              <SelectValue placeholder="Toutes années" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1e35] border-white/10 text-white">
              <SelectItem value="all" className="focus:bg-white/10 focus:text-white">Toutes les années</SelectItem>
              {years.map(y => (
                <SelectItem key={y} value={String(y)} className="focus:bg-white/10 focus:text-white">{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>
    </motion.div>
  );
}