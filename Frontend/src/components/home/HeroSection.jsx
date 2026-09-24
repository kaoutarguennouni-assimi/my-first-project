import React from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection({ onScrollToVehicles }) {
  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/75 to-[#0a1628]/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/70 via-transparent to-transparent" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#4a90d9]" />
            <span className="text-[#4a90d9] text-sm font-medium tracking-[0.3em] uppercase">
              Location de voiture
            </span>
            <div className="h-px w-12 bg-[#4a90d9]" />
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            AARS<span className="text-[#4a90d9]">CAR</span>
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Chaque trajet, une expérience de prestige. Découvrez une flotte d'exception alliant puissance, confort, performance .
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            type="button"
            onClick={onScrollToVehicles}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-8 py-6 text-base rounded-full transition-all duration-300 shadow-lg shadow-[#2563eb]/30"
          >
            <Search className="w-5 h-5 mr-2" />
            Explorer nos véhicules
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-white/40 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}