/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { formatCurrency } from '../utils/categories';
import { 
  PiggyBank, 
  Plus, 
  Trash2, 
  Edit2, 
  ChevronRight, 
  TrendingUp, 
  Flame, 
  Target,
  Sparkles,
  Award
} from 'lucide-react';
import { SavingGoal } from '../types/finance';

interface GoalsPageProps {
  onOpenModal: (type: 'transaction' | 'debt' | 'goal' | 'reminder') => void;
}

export default function GoalsPage({ onOpenModal }: GoalsPageProps) {
  const { 
    savingGoals, 
    profile, 
    contributeToGoal, 
    deleteGoal
  } = useFinanceStore();

  const [contributionAmount, setContributionAmount] = useState<string>('');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const totalSaved = savingGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = savingGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalPercent = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 100;

  const handleContributeSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const val = parseFloat(contributionAmount);
    if (isNaN(val) || val <= 0) return;
    
    contributeToGoal(id, val);
    setContributionAmount('');
    setSelectedGoalId(null);
  };

  const triggerEditGoal = (goal: SavingGoal) => {
    useFinanceStore.setState({ selectedGoalToEdit: goal });
    onOpenModal('goal');
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
      
      {/* Title section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-100 tracking-tight">Metas de Ahorro</h2>
          <p className="text-[11px] text-zinc-500 font-sans tracking-normal font-medium">Planifica y materializa tus sueños</p>
        </div>
        <button
          onClick={() => {
            useFinanceStore.setState({ selectedGoalToEdit: null });
            onOpenModal('goal');
          }}
          className="flex items-center space-x-1.5 py-1.5 px-3 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-[11px] text-indigo-400 font-bold border border-indigo-500/15 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Meta</span>
        </button>
      </div>

      {/* Cumulative savings summary box */}
      <div className="bg-[#0F0F11] border border-white/5 p-5 rounded-[24px] flex items-center justify-between shadow-xl relative overflow-hidden">
        
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-1">
          <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest font-sans block leading-none">Ahorrado Consolidado</span>
          <p className="text-2xl font-bold font-mono text-zinc-200 mt-1">
            {formatCurrency(totalSaved, profile.currency)}
          </p>
          <span className="text-[9.5px] text-zinc-400 block font-sans">
            Objetivo total: {formatCurrency(totalTarget, profile.currency)}
          </span>
        </div>

        {/* Circular Percentage visual indicator */}
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-[#050505] rounded-full border border-white/5 shadow-inner">
          <span className="text-xs font-bold text-indigo-400 font-mono select-none">{totalPercent}%</span>
          {/* Subtle spinning glow border */}
          <div className="absolute inset-x-0 inset-y-0 border border-dashed border-indigo-500/15 rounded-full animate-spin-slow pointer-events-none" />
        </div>
      </div>
      {/* Savings goals entries list */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-500 tracking-widest uppercase">Mis Objetivos De Ahorro</h3>

        {savingGoals.length === 0 ? (
          <div className="bg-[#0F0F11]/40 border border-white/5 border-dashed rounded-2xl p-8 text-center text-zinc-500 text-xs">
            No tienes metas de ahorro registradas. Haz clic en "Nueva Meta" para programar tu primera reserva.
          </div>
        ) : (
          savingGoals.map((g) => {
            const isCompleted = g.currentAmount >= g.targetAmount;
            const itemPercent = g.targetAmount > 0
              ? Math.min(Math.round((g.currentAmount / g.targetAmount) * 100), 100)
              : 100;
            const remaining = Math.max(g.targetAmount - g.currentAmount, 0);

            return (
              <div 
                key={g.id}
                className={`bg-[#0F0F11] border p-5 rounded-[22px] shadow-sm flex flex-col space-y-4 relative overflow-hidden transition-all duration-300 ${
                  isCompleted 
                    ? 'border-emerald-500/20 bg-emerald-950/5' 
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
                {/* Header indicators */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3 min-w-0 pr-1">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 text-indigo-400">
                      <Target className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-zinc-100 truncate tracking-tight">{g.name}</h4>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span className="text-[9px] font-mono text-zinc-550 uppercase">Meta: {g.targetDate}</span>
                        {isCompleted && (
                          <span className="bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] px-1 font-bold text-emerald-400 uppercase tracking-wider">
                            LOGRADO
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Goal editing/deleting controls */}
                  <div className="flex items-center space-x-1 bg-[#050505]/80 p-1.5 rounded-xl border border-white/5 shrink-0 select-none">
                    <button 
                      onClick={() => triggerEditGoal(g)} 
                      className="p-1 rounded hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => deleteGoal(g.id)} 
                      className="p-1 rounded hover:bg-zinc-900 text-rose-500 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Progress bar and details */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-end text-[10.5px]">
                    <span className="text-zinc-455">
                      Acumulado: <span className="font-bold text-zinc-200 font-mono">{formatCurrency(g.currentAmount, profile.currency)}</span> de {formatCurrency(g.targetAmount, profile.currency)}
                    </span>
                    <span className="font-mono font-bold text-indigo-400">{itemPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#050505] rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${itemPercent}%` }}
                      className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Contribution drawer layout */}
                {selectedGoalId === g.id ? (
                  <form 
                    onSubmit={(e) => handleContributeSubmit(e, g.id)}
                    className="pt-2 flex items-center space-x-2 border-t border-white/5"
                  >
                    <input
                      type="number"
                      required
                      placeholder="Monto a aportar..."
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      className="flex-1 bg-[#050505] border border-white/5 rounded-xl px-3 py-2 text-xs font-mono focus:border-indigo-500 outline-none placeholder-zinc-650"
                    />
                    <button
                      type="submit"
                      className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] cursor-pointer"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGoalId(null)}
                      className="py-2.5 px-3 rounded-xl bg-zinc-800 text-zinc-400 text-[10px] cursor-pointer hover:bg-zinc-700"
                    >
                      Cancelar
                    </button>
                  </form>
                ) : (
                  !isCompleted && (
                    <div className="border-t border-white/5 pt-3.5 flex justify-between items-center">
                      <span className="text-[10px] text-zinc-500 font-sans">
                        Falta: {formatCurrency(remaining, profile.currency)}
                      </span>
                      <button
                        onClick={() => setSelectedGoalId(g.id)}
                        className="py-2 px-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-[10px] font-bold text-indigo-400 border border-indigo-500/15 cursor-pointer transition-transform duration-200 active:scale-95"
                      >
                        Aportar Capital
                      </button>
                    </div>
                  )
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
