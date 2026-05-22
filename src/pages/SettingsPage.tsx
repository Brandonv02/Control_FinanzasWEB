/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { 
  Settings, 
  Trash2, 
  Download, 
  RefreshCw, 
  Smartphone, 
  Database, 
  ChevronRight, 
  Check, 
  HelpCircle,
  FileSpreadsheet,
  Award,
  Wallet
} from 'lucide-react';

export default function SettingsPage() {
  const { profile, setProfile, resetToMockData, clearAllData, transactions, debts, savingGoals, billReminders } = useFinanceStore();
  const [userName, setUserName] = useState(profile.name);
  const [currencySymbol, setCurrencySymbol] = useState(profile.currency);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<'iphone' | 'supabase' | 'about' | null>(null);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      name: userName || 'Usuario',
      currency: currencySymbol,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Offline Backups Dowloader: Export database locally
  const exportDataBackup = () => {
    const dataToExport = {
      profile,
      transactions,
      debts,
      savingGoals,
      billReminders,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Serene_Finance_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
      
      {/* Title */}
      <div>
        <h2 className="text-base font-bold text-zinc-100 tracking-tight">Configuración</h2>
        <p className="text-[11px] text-zinc-500 font-sans tracking-normal font-medium">Personaliza y gestiona tu entorno premium</p>
      </div>

      {/* 1. PROFILE DETAILS FORM */}
      <form onSubmit={handleProfileSave} className="bg-[#0F0F11] border border-white/5 p-5 rounded-[22px] space-y-4 shadow-sm">
        <h4 className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Editar Perfil & Preferencias</h4>
        
        <div className="space-y-1.5">
          <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">Nombre titular</label>
          <input
            type="text"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full bg-[#050505] text-zinc-100 font-sans border border-white/5 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">Moneda Principal</label>
            <select
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              className="w-full bg-[#050505] text-zinc-200 border border-white/5 rounded-xl px-3 py-2.5 text-xs cursor-pointer outline-none"
            >
              <option value="$">Peso / Dólar ($)</option>
              <option value="€">Euro (€)</option>
              <option value="£">Libra (£)</option>
              <option value="S/.">Soles (S/.)</option>
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">Modo Visual</label>
            <div className="w-full bg-black/40 text-zinc-500 border border-white/5 rounded-xl px-3 py-2.5 text-xs font-semibold flex items-center justify-center">
              Dark Mode Elegante
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-bold text-xs py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : null}
          <span>{saveSuccess ? 'Cambios Guardados' : 'Guardar Ajustes'}</span>
        </button>
      </form>

      {/* 2. SYSTEM DATA MANUAL TRIGGERS */}
      <div className="bg-[#0F0F11] border border-white/5 p-5 rounded-[22px] space-y-3 shadow-sm">
        <h4 className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Datos e Integridad</h4>
        
        <div className="grid grid-cols-1 gap-2.5">
          {/* Backup trigger */}
          <button
            type="button"
            onClick={exportDataBackup}
            className="w-full bg-[#050505] hover:bg-[#121214] text-zinc-200 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <Download className="w-4.5 h-4.5 text-indigo-400" />
              <span>Exportar Copia de Seguridad</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-500">JSON</span>
          </button>

          {/* Reset Mock Data trigger */}
          <button
            type="button"
            onClick={resetToMockData}
            className="w-full bg-[#050505] hover:bg-[#121214] text-zinc-200 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <RefreshCw className="w-4.5 h-4.5 text-emerald-400 animate-spin-slow" />
              <span>Restablecer Demo Premium</span>
            </div>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 rounded px-1.5 py-0.5 font-sans font-bold">MOCK</span>
          </button>

          {/* Wipe database */}
          <button
            type="button"
            onClick={clearAllData}
            className="w-full bg-[#050505] hover:bg-rose-950/20 text-rose-400 border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <Trash2 className="w-4.5 h-4.5 text-rose-500" />
              <span>Wipe out / Borrar Todo</span>
            </div>
            <span className="text-[9px] text-rose-500 font-mono">CLEAR</span>
          </button>
        </div>
      </div>

      {/* 3. PREMIUM ACCORDION RESOURCES (PWA iPhone Installation Guidelines) */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase pl-1">Documentación del Entorno</h4>

        {/* Accordion A: iPhone iOS Installation Manual */}
        <div className="bg-[#0F0F11] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => setActiveAccordion(activeAccordion === 'iphone' ? null : 'iphone')}
            className="w-full p-4 flex items-center justify-between text-xs font-bold text-zinc-200 cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <Smartphone className="w-4.5 h-4.5 text-indigo-400" />
              <span>Instalar como App en tu iPhone 📱</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-zinc-500 transition-transform ${activeAccordion === 'iphone' ? 'rotate-90' : ''}`} />
          </button>
          
          {activeAccordion === 'iphone' && (
            <div className="p-4 pt-1 border-t border-white/10 text-[11px] text-zinc-400 leading-relaxed space-y-2.5 font-sans">
              <p>Sigue estos sencillos pasos para instalar esta App en tu pantalla de inicio con formato nativo:</p>
              <ol className="list-decimal pl-4.5 space-y-1.5 font-sans">
                <li>Abre el navegador <strong>Safari</strong> en tu iPhone.</li>
                <li>Pega la URL de producción de Serene Finance.</li>
                <li>Verás la barra inferior, presiona el botón <strong>Compartir (Share)</strong> square icon with up arrow.</li>
                <li>Desplázate hacia abajo y selecciona la opción <strong>Agregar a pantalla de inicio ("Add to Home Screen")</strong>.</li>
                <li>Presiona <strong>Agregar</strong> en la esquina superior derecha.</li>
              </ol>
              <p className="bg-[#050505] p-2.5 rounded-xl text-[10px] border border-white/5">
                ✔️ ¡Listo! Ahora gozarás de pantalla completa sin márgenes de navegador, arranque amortiguado y guardado automático.
              </p>
            </div>
          )}
        </div>

        {/* Accordion B: Supabase Database Configuration and SQL rules */}
        <div className="bg-[#0F0F11] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => setActiveAccordion(activeAccordion === 'supabase' ? null : 'supabase')}
            className="w-full p-4 flex items-center justify-between text-xs font-bold text-zinc-200 cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <Database className="w-4.5 h-4.5 text-teal-400 animate-pulse" />
              <span>Conectar Backend - SQL Supabase ⚡</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-zinc-500 transition-transform ${activeAccordion === 'supabase' ? 'rotate-90' : ''}`} />
          </button>
          
          {activeAccordion === 'supabase' && (
            <div className="p-4 pt-1 border-t border-white/10 text-[11px] text-zinc-400 leading-relaxed space-y-3 font-sans">
              <p>Esta aplicación está estructurada para escalabilidad offline-first. Para habilitar guardado la nube con Supabase, crea tu proyecto en Supabase.co y corre el siguiente script SQL en el SQL Editor para estructurar las relaciones:</p>
              
              <div className="bg-[#050505] p-3 rounded-xl border border-white/5 font-mono text-[9px] text-zinc-300 overflow-x-auto space-y-3 whitespace-pre">
{`-- Crear tablas de Serene Finance
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(15, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  date DATE NOT NULLDefault CURRENT_DATE,
  payment_method VARCHAR(50),
  tags TEXT[],
  notes TEXT,
  icon VARCHAR(50)
);

CREATE TABLE debts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(100) NOT NULL,
  total_amount NUMERIC(15, 2) NOT NULL,
  remaining_amount NUMERIC(15, 2) NOT NULL,
  interest_rate NUMERIC(5, 2) DEFAULT 0,
  total_installments INTEGER DEFAULT 12,
  paid_installments INTEGER DEFAULT 0,
  due_date DATE,
  monthly_payment NUMERIC(15,2)
);

-- Habilitar RLS en Supabase
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

-- Crear políticas de privacidad
CREATE POLICY "Permitir solo lectura propia" ON transactions
  FOR ALL USING (auth.uid() = user_id);`}
              </div>

              <div className="bg-teal-900/10 border border-teal-500/20 p-3 rounded-xl text-[10px] space-y-1 text-teal-400">
                <span className="font-bold uppercase tracking-wider block">Variables de entorno requeridas:</span>
                <p>Configura las variables <code className="font-mono bg-[#050505] px-1 text-zinc-300">VITE_SUPABASE_URL</code> y <code className="font-mono bg-[#050505] px-1 text-zinc-300">VITE_SUPABASE_ANON_KEY</code> en tu panel de Netlify o archivo local .env para que la sincronización en la nube tome lugar automáticamente en forma transparente.</p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
