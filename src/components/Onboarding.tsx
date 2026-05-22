/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFinanceStore } from '../store/financeStore';
import { 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  ChevronRight, 
  Check, 
  Eye, 
  Smartphone,
  Wallet,
  Coins
} from 'lucide-react';

export default function Onboarding() {
  const [slide, setSlide] = useState(0);
  const { setProfile, resetToMockData } = useFinanceStore();
  const [name, setName] = useState('Brandon Vides');
  const [currency, setCurrency] = useState('$');

  const slides = [
    {
      title: 'Tu Capital, Inteligente',
      description: 'Una visión general unificada de tus saldos, tarjetas de crédito, gastos diarios y deudas con un diseño minimalista premium inspirado en Apple Wallet.',
      icon: Wallet,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      title: 'Mentoría Financiera con IA',
      description: 'Un asesor financiero ultra-personalizado alimentado por Gemini AI que escanea tus hábitos reales y te propone hacks de ahorro diarios.',
      icon: Sparkles,
      color: 'from-violet-600 to-fuchsia-600',
    },
    {
      title: 'Calendario y Metas',
      description: 'Ten visibilidad de tus suscripciones mensuales recurrentes, cuotas de préstamos bancarios y tus metas de ahorro con barras de progreso hermosas.',
      icon: Calendar,
      color: 'from-emerald-600 to-teal-600',
    },
  ];

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      // Complete onboarding and apply name & currency choice!
      setProfile({
        name: name || 'Invitado',
        currency: currency,
        onboardingCompleted: true,
      });
      useFinanceStore.setState({ showOnboarding: false });
    }
  };

  const currentSlide = slides[slide];
  const Icon = currentSlide.icon;

  return (
    <div className="absolute inset-0 bg-[#050505] flex flex-col justify-between p-6 z-50 overflow-y-auto">
      {/* Top Banner */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-emerald-400 flex items-center justify-center ring-2 ring-indigo-500/30">
            <Coins className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-sm font-sans font-bold tracking-tight text-zinc-100">Serene Finance</span>
        </div>
        <button 
          onClick={resetToMockData} 
          className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer px-3 py-1.5 rounded-full bg-[#0F0F11] border border-white/5"
        >
          Saltar Onboarding
        </button>
      </div>

      {/* Slide Carousel Frame */}
      <div className="flex-1 flex flex-col justify-center my-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col items-center text-center px-4"
          >
            {/* Animated Glow Logo */}
            <div className={`w-24 h-24 rounded-[32px] bg-gradient-to-tr ${currentSlide.color} flex items-center justify-center shadow-[0_16px_50px_-8px_rgba(99,102,241,0.3)] ring-1 ring-white/10 mb-8`}>
              <Icon className="w-11 h-11 text-white animate-bounce-subtle" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white mb-3">
              {currentSlide.title}
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              {currentSlide.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Carousel indicators */}
        <div className="flex justify-center space-x-1.5 mt-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                slide === i ? 'w-6 bg-indigo-500' : 'w-1.5 bg-zinc-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Custom Profile Customization Inputs on Final Slide */}
      {slide === slides.length - 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 px-4 bg-[#0F0F11] border border-white/5 rounded-2xl p-4 space-y-4 shadow-xl"
        >
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Nombre Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/40 text-slate-100 font-sans font-medium text-sm border border-white/10 rounded-xl px-3 py-2.5 focus:border-indigo-500 transition-colors"
              placeholder="Ej: Brandon Vides"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Moneda Local</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-black/40 text-slate-100 font-sans border border-white/10 rounded-xl px-3 py-2.5 text-sm cursor-pointer outline-none focus:border-indigo-500"
              >
                <option value="$">Peso / Dólar ($)</option>
                <option value="€">Euro (€)</option>
                <option value="£">Libra (£)</option>
                <option value="S/.">Soles (S/.)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Base de Datos</label>
              <div className="w-full bg-black/20 text-slate-550 border border-white/5 rounded-xl px-3 py-2.5 text-xs font-semibold flex items-center justify-center">
                Offline-First Local
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Button controls */}
      <div className="space-y-3 pb-4">
        <button
          onClick={handleNext}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-semibold text-sm py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 transition-transform active:scale-95 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 cursor-pointer"
        >
          <span>{slide === slides.length - 1 ? 'Iniciar Experiencia Premium' : 'Siguiente'}</span>
          <ChevronRight className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
