/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { formatCurrency } from '../utils/categories';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  ArrowUpRight, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  CreditCard,
  Percent,
  Calculator,
  ShieldAlert,
  CheckCircle,
  ChevronRight,
  TrendingUp,
  Sliders,
  DollarSign,
  Gauge
} from 'lucide-react';
import { Debt } from '../types/finance';

interface DebtsPageProps {
  onOpenModal: (type: 'transaction' | 'debt' | 'goal' | 'reminder') => void;
}

export default function DebtsPage({ onOpenModal }: DebtsPageProps) {
  const { 
    debts, 
    profile, 
    payrollIncomes,
    payDebtInstallment, 
    deleteDebt
  } = useFinanceStore();

  const [activeSubTab, setActiveSubTab] = useState<'list' | 'simulator'>('list');

  // 1. Core aggregates calculation
  const totalRemainingLiabilities = debts.reduce((sum, d) => sum + d.remainingAmount, 0);
  const totalOriginalLiabilities = debts.reduce((sum, d) => sum + d.totalAmount, 0);
  const combinedMonthlyPayments = debts.reduce((sum, d) => sum + (d.remainingAmount > 0 ? d.monthlyPayment : 0), 0);
  
  const progressPercent = totalOriginalLiabilities > 0 
    ? Math.round(((totalOriginalLiabilities - totalRemainingLiabilities) / totalOriginalLiabilities) * 100)
    : 100;

  // Total payroll income calculation
  const totalMonthlyIncome = payrollIncomes
    .filter(pi => pi.isActive)
    .reduce((sum, pi) => {
      if (pi.frequency === 'monthly') return sum + pi.amount;
      if (pi.frequency === 'biweekly') return sum + (pi.amount * 2);
      if (pi.frequency === 'weekly') return sum + (pi.amount * 4);
      return sum + pi.amount; // variable standard Monthly
    }, 0) || 4450000; // Fallback optimal Brandon income if empty

  // Debt ratio (Relación Deuda-Ingreso RDI)
  const debtToIncomeRatio = totalMonthlyIncome > 0 
    ? Math.round((combinedMonthlyPayments / totalMonthlyIncome) * 100)
    : 0;

  const triggerEditDebt = (debt: Debt) => {
    useFinanceStore.setState({ selectedDebtToEdit: debt });
    onOpenModal('debt');
  };

  // 2. Custom inline installment payment state
  const [customPayDebtId, setCustomPayDebtId] = useState<string | null>(null);
  const [customPayAmt, setCustomPayAmt] = useState('');

  // 3. Debt prepayment simulator states
  const [simSelectedDebtId, setSimSelectedDebtId] = useState('');
  const [simPrepayAmount, setSimPrepayAmount] = useState('');
  
  // 4. New credit prospective states
  const [simNewAmount, setSimNewAmount] = useState('');
  const [simNewInterest, setSimNewInterest] = useState('18'); // EA %
  const [simNewMonths, setSimNewMonths] = useState('24');

  const executeCustomPayment = (id: string, defAmt: number) => {
    const parsed = parseFloat(customPayAmt);
    const finalAmount = isNaN(parsed) || parsed <= 0 ? defAmt : parsed;
    payDebtInstallment(id, finalAmount);
    setCustomPayDebtId(null);
    setCustomPayAmt('');
  };

  // 5. Calculation Logic for Simulator
  // Debt Prepayment calculations (Amortización acelerada)
  const activeDebtForSim = debts.find(d => d.id === simSelectedDebtId);
  const prepayValue = parseFloat(simPrepayAmount) || 0;

  let simMonthsSaved = 0;
  let simInterestAvoided = 0;
  let prospectiveMonthsLeft = 0;
  let prospectiveBalance = 0;

  if (activeDebtForSim && prepayValue > 0) {
    const currentMonthsLeft = Math.max(0, activeDebtForSim.totalInstallments - activeDebtForSim.paidInstallments);
    prospectiveBalance = Math.max(0, activeDebtForSim.remainingAmount - prepayValue);
    
    // Approximate monthly amortized factor
    if (activeDebtForSim.monthlyPayment > 0) {
      prospectiveMonthsLeft = Math.ceil(prospectiveBalance / activeDebtForSim.monthlyPayment);
      simMonthsSaved = Math.max(0, currentMonthsLeft - prospectiveMonthsLeft);
      
      // Saved interest approximation based on remaining monthly payments
      const approxInterestSaved = prepayValue * ((activeDebtForSim.interestRate / 100) / 12) * (currentMonthsLeft / 2);
      simInterestAvoided = Math.round(Math.min(approxInterestSaved, prospectiveBalance * 0.3));
    }
  }

  // Prospective Debt Simulation (Capacidad de endeudamiento)
  const newCreditPrincipal = parseFloat(simNewAmount) || 0;
  const newCreditInterestEA = parseFloat(simNewInterest) || 18;
  const newCreditMonthsFlat = parseInt(simNewMonths) || 24;

  let simulatedNewMonthlyPayment = 0;
  if (newCreditPrincipal > 0 && newCreditMonthsFlat > 0) {
    // Standard approximation: PMT formula with EA translated to Monthly simple rate
    const simpleMonthlyRate = (newCreditInterestEA / 100) / 12;
    if (simpleMonthlyRate > 0) {
      simulatedNewMonthlyPayment = Math.round(
        (newCreditPrincipal * simpleMonthlyRate) / (1 - Math.pow(1 + simpleMonthlyRate, -newCreditMonthsFlat))
      );
    } else {
      simulatedNewMonthlyPayment = Math.round(newCreditPrincipal / newCreditMonthsFlat);
    }
  }

  const prospectiveCombinedPayments = combinedMonthlyPayments + simulatedNewMonthlyPayment;
  const prospectiveDebtToIncomeRatio = totalMonthlyIncome > 0
    ? Math.round((prospectiveCombinedPayments / totalMonthlyIncome) * 100)
    : 0;

  // Debt ratio underwriting traffic light evaluation
  const getUnderwritingStatus = (ratio: number) => {
    if (ratio <= 20) {
      return { 
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', 
        label: 'SALUDABLE (Bajo Riesgo)', 
        action: 'Tienes un margen excelente de endeudamiento. Adquirir nuevos créditos es viable sin asfixiar tus gastos fijos.',
        colorBadge: 'bg-emerald-500'
      };
    } else if (ratio <= 35) {
      return { 
        color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', 
        label: 'MODERADO (Riesgo Aceptable)', 
        action: 'Estás en el límite recomendado por la regla del 35%. Es seguro, pero mantén un presupuesto estricto.',
        colorBadge: 'bg-indigo-500'
      };
    } else if (ratio <= 50) {
      return { 
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', 
        label: 'COMPROMETIDO (Riesgo Alto)', 
        action: 'Saturación en camino. Destinas casi la mitad de tus ingresos a deudas. Evita tarjetas nuevas y gastos de estilo.',
        colorBadge: 'bg-amber-500'
      };
    } else {
      return { 
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', 
        label: 'CRÍTICO (Saturación de Pago)', 
        action: '¡Peligro de sobreendeudamiento! Tus pasivos se tragan más del 50% de tu sueldo. Prioriza amortizar saldos pequeños.',
        colorBadge: 'bg-rose-500'
      };
    }
  };

  const currentRiskBadge = getUnderwritingStatus(debtToIncomeRatio);
  const prospectiveRiskBadge = getUnderwritingStatus(prospectiveDebtToIncomeRatio);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col space-y-4">
      
      {/* 2-way subtabs selector */}
      <div className="grid grid-cols-2 p-1 bg-[#0F0F11] border border-white/5 rounded-2xl shrink-0">
        <button
          onClick={() => setActiveSubTab('list')}
          className={`py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-center space-x-1.5 ${
            activeSubTab === 'list' 
              ? 'bg-indigo-600 text-white shadow-md font-bold' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Mis Deudas ({debts.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('simulator')}
          className={`py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-center space-x-1.5 ${
            activeSubTab === 'simulator' 
              ? 'bg-indigo-600 text-white shadow-md font-bold' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Simulador Inteligente 🪄</span>
        </button>
      </div>

      {/* SUBTAB 1: DEBTS LEDGER */}
      {activeSubTab === 'list' && (
        <div className="flex-1 flex flex-col space-y-4">
          
          {/* Header row */}
          <div className="flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-base font-bold text-zinc-100 tracking-tight">Pasivos & Tarjetas</h2>
              <p className="text-[11px] text-zinc-500">Administra pasivos, amortiza capital y evita intereses</p>
            </div>
            <button
              onClick={() => {
                useFinanceStore.setState({ selectedDebtToEdit: null });
                onOpenModal('debt');
              }}
              className="flex items-center space-x-1.5 py-1.5 px-3 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-[10.5px] text-emerald-400 font-bold border border-emerald-500/15 transition-colors cursor-pointer select-none"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Pasivo</span>
            </button>
          </div>

          {/* Aggregate leverage scorecard with RDI Traffic Light */}
          <div className="bg-[#0F0F11] border border-white/5 p-5 rounded-[24px] space-y-4 shadow-xl relative overflow-hidden shrink-0">
            {/* Glow corner decoration */}
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider font-sans block">Pasivo Total Pendiente</span>
                <p className="text-xl font-bold font-mono text-zinc-200 mt-1">
                  {formatCurrency(totalRemainingLiabilities, profile.currency)}
                </p>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider font-sans block">Amortización Estimada (Mes)</span>
                <p className="text-xl font-bold font-mono text-indigo-400 mt-1">
                  {formatCurrency(combinedMonthlyPayments, profile.currency)}
                </p>
              </div>
            </div>

            {/* Global Progression meter */}
            <div className="space-y-1.5 pt-1.5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-500 font-sans">Amortización Histórica Amortizada</span>
                <span className="font-mono font-bold text-emerald-400">{progressPercent}% Solventado</span>
              </div>
              <div className="w-full h-1.5 bg-[#050505] rounded-full overflow-hidden">
                <div 
                  style={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 rounded-full transition-all duration-500"
                />
              </div>
            </div>

            {/* Underwriting Debt Ratio Indicator bar */}
            <div className="pt-3 border-t border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-1.5">
                  <Gauge className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-[10px] text-zinc-450 uppercase font-sans">Índice Deuda/Nómina (RDI)</span>
                </div>
                <div className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border ${currentRiskBadge.color}`}>
                  {currentRiskBadge.label} • {debtToIncomeRatio}%
                </div>
              </div>
              {/* Proportional visual gauge representing leverage traffic lights context */}
              <div className="w-full h-2 bg-[#050505] rounded-full flex overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '20%' }} />
                <div className="h-full bg-indigo-500" style={{ width: '15%' }} />
                <div className="h-full bg-amber-500" style={{ width: '15%' }} />
                <div className="h-full bg-rose-500" style={{ width: '50%' }} />
              </div>
              {/* Dynamic thumb marker position */}
              <div className="relative">
                <div 
                  className="absolute -top-[13px] w-2.5 h-2.5 rounded-full bg-white border border-black shadow" 
                  style={{ left: `calc(${Math.min(100, Math.max(2, debtToIncomeRatio))}% - 5px)` }}
                />
              </div>

              <p className="text-[10px] text-zinc-400 leading-snug font-sans pt-1">
                <span className="font-bold">Análisis Underwriting:</span> {currentRiskBadge.action}
              </p>
            </div>
          </div>

          {/* Individual debt cards list */}
          <div className="space-y-3 flex-1 min-h-[250px]">
            <h3 className="text-xs font-bold text-zinc-500 tracking-widest uppercase">Créditos de Brandon</h3>
            
            {debts.length === 0 ? (
              <div className="bg-[#0F0F11]/40 border border-white/5 border-dashed rounded-2xl p-8 text-center text-zinc-500 text-xs">
                No tienes deudas o tarjetas registradas. Usa el botón "Registrar Pasivo" para añadir una.
              </div>
            ) : (
              debts.map((d) => {
                const isSettled = d.remainingAmount <= 0;
                const pct = d.totalAmount > 0
                  ? Math.min(Math.round(((d.totalAmount - d.remainingAmount) / d.totalAmount) * 100), 100)
                  : 100;
                const nextInst = d.paidInstallments + 1;
                const isInlinePaying = customPayDebtId === d.id;

                const debtNameEmojiMap: Record<string, string> = {
                  credit_card: 'Tarj. Crédito 💳',
                  addi: 'Crédito Addi 🚀',
                  sistecrédito: 'Sistecrédito 🛍️',
                  nequi: 'Préstamo Nequi 📱',
                  vehicle: 'Vehículo 🚗',
                  loan: 'Crédito Bancario 🏦',
                  personal: 'Deuda Personal 🤝',
                  study: 'Estudios 📚',
                  free_investment: 'Libre Inversión 💸',
                  other: 'Pasivo General 📁'
                };

                return (
                  <div 
                    key={d.id}
                    className={`bg-[#0F0F11] border p-5 rounded-[22px] transition-all relative overflow-hidden flex flex-col space-y-3 ${
                      isSettled 
                        ? 'border-white/5 opacity-45 bg-[#0F0F11]/10' 
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    {/* Header values */}
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 pr-2">
                        <span className="text-[8.5px] uppercase font-mono font-bold text-zinc-550 block">
                          {debtNameEmojiMap[d.type] || 'PASIVO'} • {d.entity}
                        </span>
                        <h4 className="text-xs font-bold text-zinc-200 truncate mt-0.5">{d.name}</h4>
                      </div>

                      {/* Tool edit buttons */}
                      <div className="flex items-center space-x-1.5 bg-[#050505]/60 p-1 rounded-xl border border-white/5 select-none shrink-0">
                        <button 
                          onClick={() => triggerEditDebt(d)} 
                          className="p-1 rounded hover:bg-zinc-900 text-zinc-500 hover:text-zinc-350 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => deleteDebt(d.id)} 
                          className="p-1 rounded hover:bg-zinc-900 text-rose-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Numeric targets */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-white/5 text-center text-zinc-300 font-mono text-[11px]">
                      <div>
                        <span className="text-[8px] text-zinc-550 uppercase font-sans font-medium block">Deuda Pendiente</span>
                        <span className="font-bold text-zinc-250 mt-1 block">
                          {isSettled ? '$0' : formatCurrency(d.remainingAmount, profile.currency)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-zinc-550 uppercase font-sans font-medium block">Interés Anual</span>
                        <span className="font-bold text-indigo-400 mt-1 block">
                          {d.interestRate}% <span className="text-[7.5px] font-sans text-zinc-550">EA</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-zinc-550 uppercase font-sans font-medium block">Sugerida / Mínimo</span>
                        <span className="font-bold text-emerald-400 mt-1 block">
                          {formatCurrency(d.minimumPayment || d.monthlyPayment, profile.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Progression tracking */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9.5px]">
                        <span className="text-zinc-500">
                          Cuotas pagadas: <span className="font-bold text-zinc-300 font-mono">{d.paidInstallments}/{d.totalInstallments}</span>
                        </span>
                        <span className="font-mono font-bold text-emerald-400">{pct}%</span>
                      </div>
                      <div className="w-full h-1 bg-[#050505] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    {/* Installments controllers */}
                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="text-zinc-550 font-mono">
                        {isSettled ? '🎉 ¡Obligación Liquidada!' : `Vence: ${d.dueDate}`}
                      </span>

                      {!isSettled && !isInlinePaying && (
                        <div className="flex space-x-2">
                          {/* Amortize custom target */}
                          <button
                            onClick={() => setCustomPayDebtId(d.id)}
                            className="py-1 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 selection-none font-bold text-[9px] cursor-pointer"
                          >
                            Abonar Capital
                          </button>
                          
                          <button
                            onClick={() => payDebtInstallment(d.id)}
                            className="py-1 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[9px] hover:shadow transition-all cursor-pointer"
                          >
                            Pagar Cuota {nextInst}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* INLINE ADVANCED PAYMENT SHEET */}
                    {isInlinePaying && (
                      <div className="bg-[#050505] p-3 rounded-xl border border-indigo-500/10 space-y-2 mt-2">
                        <div className="flex justify-between items-center text-[9px] uppercase font-bold text-indigo-400">
                          <span>Abono Extraordinario a Capital</span>
                          <button onClick={() => setCustomPayDebtId(null)} className="text-zinc-500 hover:text-zinc-300">
                            Cancelar
                          </button>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-snug font-sans">
                          Abona un valor superior a la cuota recomendada. El excedente disminuirá directamente tu saldo real restante sin intereses de cuota.
                        </p>
                        <div className="flex space-x-2 items-center">
                          <div className="relative flex-1">
                            <span className="absolute left-2.5 top-2 text-[10px] text-zinc-650">{profile.currency}</span>
                            <input
                              type="number"
                              required
                              placeholder={String(d.minimumPayment || d.monthlyPayment)}
                              value={customPayAmt}
                              onChange={(e) => setCustomPayAmt(e.target.value)}
                              className="w-full bg-[#0E0E10] border border-white/10 rounded-lg pl-6 pr-2 py-1 text-xs text-zinc-200 mt-1 outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => executeCustomPayment(d.id, d.minimumPayment || d.monthlyPayment)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg mt-1 cursor-pointer transition-colors"
                          >
                            Confirmar Abono
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: INTEGRATIVE SIMULATOR */}
      {activeSubTab === 'simulator' && (
        <div className="flex-1 flex flex-col space-y-5">
          
          {/* Header titles */}
          <div>
            <h3 className="text-sm font-bold text-zinc-150 leading-none">Simulación de Amortización & Cupo</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Simula pagar tus deudas rápido, proyecta ahorros de intereses y evalúa tu capacidad crediticia</p>
          </div>

          {/* SIMULATOR MODULATOR A: EXTRA CAPITAL PREPAYMENT (Debt Shaver) */}
          <div className="bg-[#0F0F11] border border-white/5 p-5 rounded-[22px] space-y-4 shadow-md">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider">Acelerador Bola de Nieve (Abonar Más)</h4>
            </div>

            <p className="text-[10px] text-zinc-400 leading-snug">
              Selecciona una deuda activa y digita un valor extra de abono único. Descubrirás cuántos meses de sufrimiento te ahorras y cuántos intereses evitas pagar en el futuro.
            </p>

            <div className="grid grid-cols-2 gap-3 pb-1 border-b border-white/5">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase text-zinc-500 tracking-wide font-extrabold block">Elije Obligación</label>
                <select
                  value={simSelectedDebtId}
                  onChange={(e) => setSimSelectedDebtId(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-300 text-xs py-2 px-2 border border-white/10 rounded-xl outline-none cursor-pointer"
                >
                  <option value="">Seleccionar crédito...</option>
                  {debts.filter(d => d.remainingAmount > 0).map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({formatCurrency(d.remainingAmount, profile.currency)})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase text-zinc-500 tracking-wide font-extrabold block">Abono Extraordinario</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-xs text-zinc-650">{profile.currency}</span>
                  <input
                    type="number"
                    placeholder="Ej: 500000"
                    value={simPrepayAmount}
                    onChange={(e) => setSimPrepayAmount(e.target.value)}
                    className="w-full bg-[#050505] font-mono pl-6 pr-2 py-2 border border-white/10 rounded-xl text-xs text-zinc-200 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Calculations comparative outputs */}
            {activeDebtForSim && prepayValue > 0 ? (
              <div className="bg-indigo-500/5 border border-indigo-500/10 p-3.5 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="font-bold text-indigo-400">⚡ Impacto de Prepago Estimado:</span>
                  <span className="text-[10px] font-mono text-zinc-400 block font-semibold">Base: {activeDebtForSim.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-black/45 border border-white/5 p-2 rounded-xl">
                    <span className="text-[8px] text-zinc-550 uppercase font-sans">Cuotas Recortadas</span>
                    <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5 mt-0.5">-{simMonthsSaved} meses</p>
                    <span className="text-[7.5px] text-zinc-500 uppercase block font-sans">Menos de cobranzas</span>
                  </div>
                  <div className="bg-black/45 border border-white/5 p-2 rounded-xl">
                    <span className="text-[8px] text-zinc-550 uppercase font-sans">Intereses Ahogados</span>
                    <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5 mt-0.5">
                      {formatCurrency(simInterestAvoided, profile.currency)}
                    </p>
                    <span className="text-[7.5px] text-zinc-500 uppercase block font-sans">Ahorrados de tu bolsillo</span>
                  </div>
                </div>

                <div className="text-[10.5px] text-zinc-300 font-sans leading-snug">
                  📌 Tu saldo restante se reduciría inmediatamente de <span className="font-bold text-zinc-100">{formatCurrency(activeDebtForSim.remainingAmount, profile.currency)}</span> a <span className="font-bold text-indigo-400">{formatCurrency(prospectiveBalance, profile.currency)}</span>. Tu tiempo estimado para liquidar pasa a ser de <span className="font-bold text-indigo-400">{prospectiveMonthsLeft} meses</span> en lugar de {activeDebtForSim.totalInstallments - activeDebtForSim.paidInstallments} meses.
                </div>
              </div>
            ) : (
              <div className="bg-[#050505]/45 border border-dashed border-white/5 p-4 rounded-xl text-center text-zinc-600 text-[10.5px]">
                Configura un abono arriba para contrastar los recortes de plazo.
              </div>
            )}
          </div>

          {/* SIMULATOR MODULATOR B: NEW DEBT RISK EVALUATOR (Prospective Credit Capacity) */}
          <div className="bg-[#0F0F11] border border-white/5 p-5 rounded-[22px] space-y-4 shadow-md relative">
            <div className="flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">Simulador de Capacidad de Compra (Nuevo Crédito)</h4>
            </div>

            <p className="text-[10px] text-zinc-400 leading-snug">
              ¿Estás planeando sacar una moto, un celular con Addi o un crédito de estudios? Digita los datos abajo para evaluar instantáneamente tu cuota y si tu sueldo de Brandon tiene capacidad real de responder sin impagos.
            </p>

            <div className="grid grid-cols-3 gap-2 pb-1 border-b border-white/5 text-xs">
              <div className="space-y-1">
                <label className="text-[8.5px] text-zinc-550 uppercase font-bold block">Valor Estimado</label>
                <div className="relative">
                  <span className="absolute left-1.5 top-2 text-[10px] text-zinc-650">{profile.currency}</span>
                  <input
                    type="number"
                    placeholder="Monto"
                    value={simNewAmount}
                    onChange={(e) => setSimNewAmount(e.target.value)}
                    className="w-full bg-[#050505] font-mono pl-4 pr-1 py-1.5 border border-white/10 rounded-lg text-[11px] text-zinc-200 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8.5px] text-zinc-550 uppercase font-bold block">Tasa Interés EA%</label>
                <input
                  type="number"
                  placeholder="18"
                  value={simNewInterest}
                  onChange={(e) => setSimNewInterest(e.target.value)}
                  className="w-full bg-[#050505] font-mono px-2 py-1.5 border border-white/10 rounded-lg text-[11px] text-zinc-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[8.5px] text-zinc-550 uppercase font-bold block">Cuotas (Meses)</label>
                <input
                  type="number"
                  placeholder="24"
                  value={simNewMonths}
                  onChange={(e) => setSimNewMonths(e.target.value)}
                  className="w-full bg-[#050505] font-mono px-2 py-1.5 border border-white/10 rounded-lg text-[11px] text-zinc-200 outline-none"
                />
              </div>
            </div>

            {/* Simulated credit indicators projection */}
            {newCreditPrincipal > 0 && newCreditMonthsFlat > 0 ? (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-2 gap-3.5 items-center">
                  <div className="bg-zinc-950 p-3.5 border border-white/5 rounded-2xl flex flex-col justify-center text-center">
                    <span className="text-[8px] text-zinc-550 uppercase tracking-wide block">Cuota Mensual Nueva</span>
                    <p className="text-lg font-bold font-mono text-zinc-150 mt-1">
                      {formatCurrency(simulatedNewMonthlyPayment, profile.currency)}
                    </p>
                    <span className="text-[7px] text-zinc-500 uppercase block font-sans tracking-wide mt-0.5">Interés simple aplicado</span>
                  </div>

                  <div className="bg-zinc-950 p-3.5 border border-white/5 rounded-2xl flex flex-col justify-center text-center">
                    <span className="text-[8px] text-zinc-550 uppercase tracking-wide block">Interés Total del Plazo</span>
                    <p className="text-lg font-bold font-mono text-rose-450 mt-1">
                      {formatCurrency(Math.max(0, (simulatedNewMonthlyPayment * newCreditMonthsFlat) - newCreditPrincipal), profile.currency)}
                    </p>
                    <span className="text-[7px] text-zinc-500 uppercase block font-sans tracking-wide mt-0.5">Costo real de financiación</span>
                  </div>
                </div>

                {/* Comparative Risk Traffic Light */}
                <div className="bg-black/55 border border-white/5 rounded-2xl p-4 space-y-3.5">
                  <h5 className="text-[10.5px] font-bold text-zinc-400">🚦 Comparativa de Endeudamiento de Brandon:</h5>
                  
                  {/* Transition visual flow contrast */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[8.5px] text-zinc-550 block font-sans uppercase">Índice Actual (RDI)</span>
                      <span className="text-sm font-bold text-zinc-200">{debtToIncomeRatio}%</span>
                      <span className="text-[9px] text-zinc-500 block font-sans">{currentRiskBadge.label}</span>
                    </div>

                    <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-indigo-500/20">
                      <span className="text-[8.5px] text-indigo-400 block font-sans uppercase">Proyectado (RDI + Nuevo)</span>
                      <span className="text-sm font-bold text-indigo-400">{prospectiveDebtToIncomeRatio}%</span>
                      <span className="text-[9px] text-indigo-400 block font-sans">{prospectiveRiskBadge.label}</span>
                    </div>
                  </div>

                  {/* Leverage Traffic Light message */}
                  <div className="p-3 bg-[#050505] border border-white/5 rounded-xl space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${prospectiveRiskBadge.colorBadge} animate-pulse`} />
                      <span className="text-[9.5px] font-bold text-zinc-300 uppercase tracking-wider">Resolución Financiera: {prospectiveRiskBadge.label}</span>
                    </div>
                    <p className="text-[10px] text-zinc-450 leading-relaxed font-sans mt-1">
                      {prospectiveRiskBadge.action}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#050505]/45 border border-dashed border-white/5 p-4 rounded-xl text-center text-zinc-600 text-[10.5px]">
                Escribe un monto y plazo para proyectar tu semáforo de aprobación.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
