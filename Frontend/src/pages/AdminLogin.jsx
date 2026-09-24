import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/api/axios';
import { useAuth } from '@/lib/AuthContext';

export default function AdminLogin() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', form);
      login(response.data.token, response.data.user);
      window.location.href = '/Admin';
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4">
      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#2563eb]/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2563eb]/10 border border-[#2563eb]/20 mb-4">
            <ShieldCheck className="w-8 h-8 text-[#2563eb]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Espace Admin</h1>
          <p className="text-white/40 text-sm mt-1">AARSCAR — Location de voiture</p>
        </div>

        {/* Card */}
        <div className="bg-[#0f1e35] rounded-2xl border border-white/5 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="text-white/60 text-xs font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  type="email"
                  placeholder="admin@aarscar.ma"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="pl-10 h-11 bg-[#0a1628] border-white/10 text-white placeholder:text-white/20 focus:border-[#2563eb] rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-white/60 text-xs font-medium mb-1.5 block">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="pl-10 pr-10 h-11 bg-[#0a1628] border-white/10 text-white placeholder:text-white/20 focus:border-[#2563eb] rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl transition-all duration-300"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connexion...</>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          AARSCAR © {new Date().getFullYear()} — Accès réservé aux administrateurs
        </p>
      </motion.div>
    </div>
  );
}