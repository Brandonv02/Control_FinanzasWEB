/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency, getCategoryDetails } from '../utils/categories';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Minus, 
  Search, 
  BellRing, 
  TrendingUp, 
  CreditCard,
  ChevronRight,
  Sparkles,
  Layers,
  CalendarDays,
  Gauge,
  Activity,
  Hourglass,
  Scale,
  Sun,
  Moon
} from 'lucide-react';

interface DashboardProps {
  onOpenModal: (type: 'transaction' | 'debt' | 'goal' | 'reminder') => void;
}

export default function Dashboard({ onOpenModal }: DashboardProps) {
  const { theme, setThemePreference } = useTheme();
  const { 
    transactions, 
    debts, 
    billReminders, 
    payrollIncomes,
    notifications,
    profile, 
    currentCycleStart,
    currentCycleEnd,
    cycleAnchorDay,
    setActiveTab, 
    deleteTransaction,
    markNotificationAsRead,
    clearAllNotifications
  } = useFinanceStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotificationTray, setShowNotificationTray] = useState(false);

  // 1. FILTER TRANSACTIONS BY PAYROLL CYCLE PERIOD ONLY (Critical user requested feature)
  const currentCycleTransactions = transactions.filter(t => {
    return t.date >= currentCycleStart && t.date <= currentCycleEnd;
  });

  const totalIncome = currentCycleTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = currentCycleTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Total balance = Current Cycle Income - Current Cycle Expenses
  const totalBalance = totalIncome - totalExpense;

  const unpaidReminders = billReminders.filter(r => !r.isPaid);

  // 2. PAYROLL & FIXED BILLS PROJECTIONS ENGINE
  // Calculate total monthly expected payroll income
  const totalExpectedPayrollIncome = payrollIncomes
    .filter(pi => pi.isActive)
    .reduce((sum, pi) => {
      if (pi.frequency === 'monthly') return sum + pi.amount;
      if (pi.frequency === 'biweekly') return sum + (pi.amount * 2);
      if (pi.frequency === 'weekly') return sum + (pi.amount * 4);
      return sum + pi.amount;
    }, 0) || 4450000; // Optimal fallback if empty

  // Combined fixed debt payments
  const combinedMonthlyDebtPayments = debts
    .filter(d => d.remainingAmount > 0)
    .reduce((sum, d) => sum + d.monthlyPayment, 0);

  // Total unpaid bills
  const combinedMonthlyUnpaidBills = unpaidReminders.reduce((sum, r) => sum + r.amount, 0);

  // Free Money formula: Expected payroll - Combined debts - Combined unpaid bills - Current expenses
  const freeMoney = totalExpectedPayrollIncome - combinedMonthlyDebtPayments - combinedMonthlyUnpaidBills - totalExpense;

  // Debt index percentage of expected payroll
  const debtToIncomeRatio = totalExpectedPayrollIncome > 0
    ? Math.round((combinedMonthlyDebtPayments / totalExpectedPayrollIncome) * 100)
    : 0;

  // Calculate savings capacity percentage
  const savingsCapacityPercent = totalExpectedPayrollIncome > 0
    ? Math.max(0, Math.round((freeMoney / totalExpectedPayrollIncome) * 100))
    : 0;

  // Underwriting Traffic Light evaluation for risk scorecard
  const getRiskEvaluator = () => {
    if (debtToIncomeRatio > 50 || freeMoney < 0) {
      return { label: 'CRÍTICO 🚨', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', note: 'Pasivos asfixian tus ingresos. Congela tus gastos.' };
    }
    if (debtToIncomeRatio > 35) {
      return { label: 'ALTO ⚠️', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', note: 'Deudas ocupan más del 35% de tu sueldo.' };
    }
    if (debtToIncomeRatio > 20) {
      return { label: 'MODERADO 📈', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', note: 'Estable. Recomendamos ahorrar el remanente.' };
    }
    return { label: 'EXCELENTE 🛡️', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', note: 'Tu libertad financiera e índice de caja están limpios.' };
  };

  const riskAssessment = getRiskEvaluator();

  // Days left helper
  const calculateDaysLeft = () => {
    const end = new Date(currentCycleEnd + 'T12:00:00');
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Recent transactions scoped to current cycle
  const filteredCycleTx = currentCycleTransactions
    .filter(t => {
      const matchSearch = t.notes?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    })
    .slice(0, 4);

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
      
      {/* Header welcome profile with Smart notification bell trigger */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src={profile.avatarUrl} 
              alt={profile.name} 
              className="w-10 h-10 rounded-full border border-white/15 object-cover" 
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border border-[#050505]" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-sans tracking-tight">Hola, buen día</p>
            <h1 className="text-sm font-bold text-zinc-100 tracking-tight leading-none mt-0.5">{profile.name}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Elegant Theme Switcher */}
          <button
            onClick={() => setThemePreference(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#0F0F11] border border-zinc-200 dark:border-white/5 flex items-center justify-center cursor-pointer text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors shadow-sm"
            aria-label="Toggle Theme"
            title="Cambiar tema visual"
          >
            {theme === 'dark' ? (
              <Sun className="w-[17px] h-[17px] text-amber-500 animate-spin-slow" />
            ) : (
              <Moon className="w-[17px] h-[17px] text-indigo-600" />
            )}
          </button>

          {/* Intelligent Push Notifications Tray Trigger */}
          <button
            onClick={() => setShowNotificationTray(!showNotificationTray)}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#0F0F11] border border-zinc-200 dark:border-white/5 flex items-center justify-center relative cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors shadow-sm"
          >
            <BellRing className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-650 border border-black text-[9px] font-extrabold text-white flex items-center justify-center animate-bounce">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Quick Insight analysis */}
          <button 
            onClick={() => setActiveTab('analytics')}
            className="flex items-center space-x-1 py-2 px-3 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-[10.5px] font-bold text-indigo-400 cursor-pointer select-none transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Coach AI</span>
          </button>
        </div>
      </div>

      {/* INTELLIGENT PUSH NOTIFICATIONS CENTER DISPLAY (iOS Style Overlay Banner) */}
      {showNotificationTray && (
        <div className="bg-[#0F0F11]/95 border border-indigo-500/20 rounded-[22px] p-4 space-y-3 shadow-2xl relative">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div className="flex items-center space-x-1.5 text-xs text-indigo-400 font-extrabold pb-0.5">
              <BellRing className="w-4.5 h-4.5" />
              <span>Notificaciones de Brandon (PWA Push)</span>
            </div>
            <button 
              onClick={() => {
                clearAllNotifications();
                setShowNotificationTray(false);
              }}
              className="text-[9.5px] uppercase font-bold text-zinc-500 hover:text-zinc-300 pointer-events-auto cursor-pointer"
            >
              Limpiar todo
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
            {notifications.length === 0 ? (
              <div className="text-center text-[10px] text-zinc-500 py-3 font-sans">
                No tienes alertas de ciclo o recordatorios pendientes. ¡Todo al día!
              </div>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={`p-3 rounded-xl border text-[11px] leading-relaxed transition-all cursor-pointer relative ${n.isRead ? 'bg-black/20 border-white/5 opacity-55' : 'bg-[#050505] border-indigo-500/10 shadow-sm'}`}
                >
                  <div className="flex justify-between items-center text-[9px] uppercase font-bold text-zinc-500">
                    <span className={n.type === 'cycle_restart' ? 'text-indigo-400' : 'text-rose-400'}>
                      {n.type === 'cycle_restart' ? '🗓️ Reset Ciclo' : '⚠️ Alerta Gasto'}
                    </span>
                    <span className="font-mono text-zinc-650">{n.date}</span>
                  </div>
                  <p className="font-semibold text-zinc-200 mt-1">{n.title}</p>
                  <p className="text-zinc-400 font-sans mt-0.5 text-[10.5px]">{n.body}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* PAYROLL CYCLE PROGRESS SPEEDMETER CARD */}
      <div className="bg-[#0F0F11] border border-white/5 px-4.5 py-3 rounded-2xl flex items-center justify-between shadow-inner shrink-0 select-none">
        <div className="flex items-center space-x-2.5">
          <CalendarDays className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
          <div>
            <span className="text-[8.5px] text-zinc-500 font-bold uppercase tracking-widest block">Periodo de Nómina Vigente</span>
            <span className="text-[10.5px] text-zinc-300 font-mono">
              Inicia el {cycleAnchorDay} de cada mes ({currentCycleStart.split('-').reverse().slice(0, 2).join('/')} - {currentCycleEnd.split('-').reverse().slice(0, 2).join('/')})
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[8.5px] block text-zinc-500 font-bold uppercase">Quedan</span>
          <span className="text-xs font-mono font-bold text-indigo-400">{calculateDaysLeft()} Días</span>
        </div>
      </div>

      {/* APPLE WALLET COCONUT PREMIUM CARD */}
      <div className="relative group overflow-hidden bg-gradient-to-br from-[#121214] via-[#0D0D10] to-[#060608] p-6 rounded-[28px] border border-white/5 shadow-2xl transition-all duration-300 hover:scale-[1.01]">
        
        {/* Iridescent background noise card effect */}
        <div className="absolute -right-5 -top-5 w-48 h-48 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-emerald-500/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
        
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest font-sans">Efectivo de Ciclo Disponible</span>
            <p className="text-3xl font-bold text-zinc-100 tracking-tight font-mono mt-1 select-all">
              {formatCurrency(totalBalance, profile.currency)}
            </p>
          </div>
          <div className="w-10 h-7 bg-black/40 rounded-lg flex items-center justify-center border border-white/5 font-mono text-[9px] font-bold tracking-widest text-zinc-400 shadow-sm">
            VISA
          </div>
        </div>

        {/* Card numbers display and details */}
        <div className="mt-10 flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[9px] font-mono text-zinc-650 tracking-wider">CUENTA DE AHORROS CONECTADA</p>
            <p className="text-xs font-mono font-medium text-zinc-505 tracking-widest">••••  ••••  ••••  2026</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold text-zinc-650 tracking-widest font-sans">TITULAR</span>
            <p className="text-[11px] font-sans font-bold text-zinc-300 tracking-tight uppercase leading-none mt-1">
              {profile.name}
            </p>
          </div>
        </div>
      </div>

      {/* QUICK TRANSACTIONS TOTALS BANNER (Income vs Expenses in current Cycle) */}
      <div className="grid grid-cols-2 gap-3.5">
        
        {/* Income Indicator Card */}
        <div className="bg-[#0F0F11] border border-white/5 p-4 rounded-2xl flex items-center space-x-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Ingresado</span>
            <span className="text-xs font-mono font-bold text-zinc-200 truncate block mt-0.5">
              {formatCurrency(totalIncome, profile.currency)}
            </span>
          </div>
        </div>

        {/* Expense Indicator Card */}
        <div className="bg-[#0F0F11] border border-white/5 p-4 rounded-2xl flex items-center space-x-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
            <ArrowDownLeft className="w-5 h-5 text-rose-400" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Gastado</span>
            <span className="text-xs font-mono font-bold text-zinc-200 truncate block mt-0.5">
              {formatCurrency(totalExpense, profile.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* INTUITIVE FINANCIAL PROJECTIONS WIDGET (Crucial requested SaaS item of task) */}
      <div className="bg-[#0F0F11] border border-white/5 p-5 rounded-[24px] space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-indigo-400 animate-pulse" />
            <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest">Proyecciones Inteligentes</h3>
          </div>
          <div className="flex items-center space-x-1.5 py-0.5 px-2.5 rounded-full border border-zinc-800 bg-[#050505] text-[9px] font-bold text-zinc-500 font-mono uppercase tracking-wide">
            IA Activa
          </div>
        </div>

        <p className="text-[10.5px] text-zinc-400 leading-snug font-sans">
          Nuestra suite calcula tus pasivos fijos contra tu nómina bruta esperada de <span className="font-bold text-zinc-100">{formatCurrency(totalExpectedPayrollIncome, profile.currency)}</span>.
        </p>

        <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
          <div className="bg-[#050505] p-3 rounded-2xl border border-white/5 flex flex-col justify-between">
            <span className="text-[8.5px] uppercase font-sans text-zinc-500">Efectivo Real Libre</span>
            <p className={`text-xs font-bold font-mono mt-2 ${freeMoney < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatCurrency(freeMoney, profile.currency)}
            </p>
            <span className="text-[7px] text-zinc-650 uppercase font-sans block mt-1 tracking-wider">Abonos netos</span>
          </div>

          <div className="bg-[#050505] p-3 rounded-2xl border border-white/5 flex flex-col justify-between">
            <span className="text-[8.5px] uppercase font-sans text-zinc-500">Capacidad Ahorro</span>
            <p className="text-xs font-bold font-mono text-indigo-400 mt-2">
              {savingsCapacityPercent}%
            </p>
            <span className="text-[7px] text-zinc-650 uppercase font-sans block mt-1 tracking-wider">De tus ingresos</span>
          </div>

          <div className="bg-[#050505] p-3 rounded-2xl border border-white/5 flex flex-col justify-between">
            <span className="text-[8.5px] uppercase font-sans text-zinc-500">Riesgo Financiero</span>
            <p className="text-[9.5px] font-extrabold mt-2 uppercase font-sans tracking-wide">
              {riskAssessment.label}
            </p>
            <span className="text-[7.5px] text-zinc-650 block mt-1 font-sans">{debtToIncomeRatio}% RDI</span>
          </div>
        </div>

        <div className="bg-[#050505]/45 p-3 rounded-xl border border-white/5">
          <p className="text-[10px] text-zinc-300 font-sans leading-relaxed">
            💡 <span className="font-bold">Nota de Alerta:</span> {riskAssessment.note} Tu capacidad de endeudamiento es del {100 - debtToIncomeRatio}%. Evita sobredimensionar pasivos a corto plazo.
          </p>
        </div>
      </div>

      {/* QUICK INTERACTION BUTTONS */}
      <div className="space-y-2 select-none">
        <h3 className="text-xs font-bold text-zinc-500 tracking-widest uppercase">Operaciones rápidas</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onOpenModal('transaction')}
            className="flex flex-col items-center justify-center bg-[#0F0F11] hover:bg-[#18181B] border border-white/5 rounded-2xl py-3.5 cursor-pointer transition-all active:scale-95 text-zinc-350 hover:text-zinc-100 shadow-md"
          >
            <Plus className="w-5 h-5 text-indigo-400 animate-pulse" />
            <span className="text-[9.5px] font-semibold mt-1">Gasto / Ingreso</span>
          </button>
          <button
            onClick={() => onOpenModal('debt')}
            className="flex flex-col items-center justify-center bg-[#0F0F11] hover:bg-[#18181B] border border-white/5 rounded-2xl py-3.5 cursor-pointer transition-all active:scale-95 text-zinc-350 hover:text-zinc-100 shadow-md"
          >
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <span className="text-[9.5px] font-semibold mt-1">Nueva Deuda</span>
          </button>
          <button
            onClick={() => onOpenModal('goal')}
            className="flex flex-col items-center justify-center bg-[#0F0F11] hover:bg-[#18181B] border border-white/5 rounded-2xl py-3.5 cursor-pointer transition-all active:scale-95 text-zinc-350 hover:text-zinc-100 shadow-md"
          >
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <span className="text-[9.5px] font-semibold mt-1">Crear Meta</span>
          </button>
        </div>
      </div>

      {/* RECENT USER LEDGER ACTIVITIES SECTION */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-500 tracking-widest uppercase">Gastos de este Ciclo</h3>
          <button 
            onClick={() => setActiveTab('transactions')}
            className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer flex items-center"
          >
            <span>Ver todo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Activity Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por notas o categorías locales..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0F0F11] hover:bg-[#121214] border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-xs text-zinc-250 placeholder-zinc-550 focus:border-indigo-500 transition-all outline-none shadow-inner"
          />
        </div>

        {/* Transactions list layout */}
        {filteredCycleTx.length === 0 ? (
          <div className="bg-[#0F0F11]/40 border border-dashed border-white/5 rounded-2xl p-6 text-center text-zinc-550 text-xs">
            No encontramos deudas o gastos locales mapeados en este ciclo quincenal/mensual. ¡Excelente gestión de caja!
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCycleTx.map((tx) => {
              const cat = getCategoryDetails(tx.category, tx.type);
              const isExpense = tx.type === 'expense';

              return (
                <div 
                  key={tx.id}
                  className="w-full bg-[#0F0F11] hover:bg-[#131317] border border-white/5 p-3 rounded-2xl flex items-center justify-between transition-all shadow-sm"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cat.bgColor} ${cat.textColor} ring-1 ring-white/5`}>
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-200 truncate">
                        {tx.notes || cat.label}
                      </p>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tight block mt-0.5">
                        {tx.date} • {tx.paymentMethod}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <span className={`text-xs font-mono font-bold ${isExpense ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {isExpense ? '-' : '+'}{formatCurrency(tx.amount, profile.currency)}
                    </span>
                    <span className={`text-[9px] block ${cat.textColor} font-sans font-medium mt-0.5`}>
                      {cat.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
