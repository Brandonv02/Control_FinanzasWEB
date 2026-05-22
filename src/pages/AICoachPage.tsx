/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { formatCurrency, EXPENSE_CATEGORIES } from '../utils/categories';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  Activity, 
  Lightbulb, 
  RefreshCw, 
  DollarSign,
  PieChart as PieIcon,
  LineChart as LineIcon
} from 'lucide-react';

interface AIInsightItem {
  type: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  savingPotential: string;
}

interface AIReport {
  healthScore: number;
  summary: string;
  insights: AIInsightItem[];
  tips: string[];
}

export default function AICoachPage() {
  const { transactions, debts, savingGoals, profile } = useFinanceStore();
  
  const [activeSegment, setActiveSegment] = useState<'analytics' | 'ai'>('analytics');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AIReport | null>(null);
  const [loadingPhase, setLoadingPhase] = useState('');

  // 1. CHART DATA PREPARATION
  // Category mapping data for Recharts
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const categoryTotals: Record<string, number> = {};
  
  expenseTransactions.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const pieChartData = Object.entries(categoryTotals).map(([catId, amount]) => {
    const config = EXPENSE_CATEGORIES.find(c => c.id === catId);
    return {
      name: config?.label || catId,
      value: amount,
      color: config?.color || '#6B7280'
    };
  });

  // Flow trends data (Income vs Expense) over discrete log dates
  const dailyFlows: Record<string, { date: string; ingresos: number; gastos: number }> = {};
  
  // Initialize last 5 unique dates
  const recentDates = [...new Set(transactions.map(t => t.date))]
    .sort()
    .slice(-6);

  recentDates.forEach(d => {
    dailyFlows[d] = { date: d, ingresos: 0, gastos: 0 };
  });

  transactions.forEach(t => {
    if (dailyFlows[t.date]) {
      if (t.type === 'income') dailyFlows[t.date].ingresos += t.amount;
      if (t.type === 'expense') dailyFlows[t.date].gastos += t.amount;
    }
  });

  const lineChartData = Object.values(dailyFlows).sort((a,b) => a.date.localeCompare(b.date));

  // 2. AI ADVISOR REQUEST FETCHING (Fullstack Gemini API call)
  const fetchInsights = async () => {
    setLoading(true);
    setLoadingPhase('Estructurando reporte...');
    
    // Pulse realistic phase transitions for iPhone simulation
    const phases = [
      'Escaneando transacciones de Brandon...',
      'Analizando pasivos y vencimientos de cuotas...',
      'Procesando con Gemini AI...',
      'Estructurando plan de ahorro...'
    ];

    let currentPhase = 0;
    const interval = setInterval(() => {
      if (currentPhase < phases.length - 1) {
        currentPhase++;
        setLoadingPhase(phases[currentPhase]);
      }
    }, 1200);

    try {
      const response = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions,
          debts,
          savingGoals,
          profile
        })
      });

      if (!response.ok) {
        throw new Error('API server response failed');
      }

      const data = await response.json();
      setReport(data);

    } catch (e) {
      console.error('Error fetching insights', e);
      // Fallback fallback is handled perfectly server-side, but let's provide a reliable UI fail recover
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  // Autoload insights report if tab visited and empty
  useEffect(() => {
    if (activeSegment === 'ai' && !report) {
      fetchInsights();
    }
  }, [activeSegment]);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 flex flex-col">
      
      {/* Dynamic Segment Switch bar */}
      <div className="grid grid-cols-2 p-1 bg-[#0F0F11] border border-white/5 rounded-2xl shrink-0">
        <button
          onClick={() => setActiveSegment('analytics')}
          className={`py-2 text-xs font-semibold cursor-pointer transition-all ${
            activeSegment === 'analytics' 
              ? 'bg-zinc-100 text-zinc-950 font-extrabold shadow-sm rounded-xl' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span className="flex items-center justify-center space-x-1.5">
            <LineIcon className="w-3.5 h-3.5" />
            <span>Estadísticas</span>
          </span>
        </button>
        <button
          onClick={() => setActiveSegment('ai')}
          className={`py-2 text-xs font-semibold cursor-pointer transition-all ${
            activeSegment === 'ai' 
              ? 'bg-zinc-100 text-zinc-900 font-extrabold shadow-sm rounded-xl' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span className="flex items-center justify-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />
            <span>Asesor de IA</span>
          </span>
        </button>
      </div>

      {/* SEGMENT A: ANALYTICS & CHARTS PANEL */}
      {activeSegment === 'analytics' && (
        <div className="flex-1 space-y-6">
          
          {/* Chart 1: Cash flow Trends */}
          <div className="bg-[#0F0F11] p-4 rounded-[22px] border border-white/5 space-y-3 shadow-md">
            <div className="flex justify-between items-center px-1">
              <div>
                <h4 className="text-xs font-bold text-zinc-100 tracking-tight flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span>Caja: Flujo Temporal</span>
                </h4>
                <p className="text-[10px] text-zinc-500">Ingresos vs egresos recientes</p>
              </div>
            </div>

            {/* Recharts trend render space */}
            <div className="w-full h-44">
              {lineChartData.length < 2 ? (
                <div className="w-full h-full bg-[#050505]/40 border border-dashed border-white/5 flex items-center justify-center text-zinc-500 text-[11px] text-center p-3">
                  Introduce más transacciones distribuidas en distintas fechas para generar tendencias.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={lineChartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#52525b" fontSize={9} />
                    <YAxis stroke="#52525b" fontSize={9} />
                    <Tooltip contentStyle={{ backgroundColor: '#050505', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="ingresos" name="Entradas" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorInc)" />
                    <Area type="monotone" dataKey="gastos" name="Gastos" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 2: Expense Allocation */}
          <div className="bg-[#0F0F11] p-4 rounded-[22px] border border-white/5 space-y-3 shadow-md">
            <div>
              <h4 className="text-xs font-bold text-zinc-100 tracking-tight flex items-center space-x-1.5">
                <PieIcon className="w-4 h-4 text-emerald-400" />
                <span>Distribución del Gasto</span>
              </h4>
              <p className="text-[10px] text-zinc-500">Egreso segmentado por categoría</p>
            </div>

            <div className="w-full h-44 flex items-center justify-center relative">
              {pieChartData.length === 0 ? (
                <div className="text-zinc-500 text-[11px] text-center">Registra egresos para ver el reparto de consumo.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value), '$')} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Micro category badges summary below pie */}
            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
              {pieChartData.slice(0, 6).map((item, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-400 truncate">{item.name}</span>
                  <span className="text-zinc-200 font-mono font-semibold">({formatCurrency(item.value)})</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SEGMENT B: GEMINI AI ADVISOR REPORT PANEL */}
      {activeSegment === 'ai' && (
        <div className="flex-1 space-y-4">
          
          {/* Trigger analysis again */}
          <div className="flex items-center justify-between shrink-0 mb-1">
            <h4 className="text-xs font-bold text-indigo-400 tracking-wider uppercase flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagnóstico de Salud Financiera</span>
            </h4>
            <button 
              onClick={fetchInsights}
              disabled={loading}
              className="p-2 rounded-xl bg-[#0F0F11] border border-white/5 text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50 cursor-pointer animate-none"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Loading Skeletal State overlay */}
          {loading ? (
            <div className="bg-[#0F0F11]/60 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
              <div className="relative w-14 h-14 bg-indigo-600/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-indigo-400 animate-spin-slow" />
                <div className="absolute inset-0 border border-dashed border-indigo-400/20 rounded-full animate-ping" />
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-zinc-200">Asesor de IA Calculando</h5>
                <p className="text-xs text-zinc-450 font-mono text-indigo-400 animate-pulse">{loadingPhase}</p>
              </div>

              {/* Decorative loading lines */}
              <div className="w-48 space-y-2 pt-2">
                <div className="h-1.5 bg-[#050505] rounded-full w-full animate-pulse" />
                <div className="h-1.5 bg-[#050505] rounded-full w-4/5 animate-pulse mx-auto" />
                <div className="h-1.5 bg-[#050505] rounded-full w-5/6 animate-pulse mx-auto" />
              </div>
            </div>
          ) : report ? (
            <div className="space-y-5 fade-in">
              
              {/* Dial Score wrapper */}
              <div className="bg-[#0F0F11] border border-white/5 p-5 rounded-[26px] flex items-center space-x-5 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl" />
                
                {/* Visual percentage ring */}
                <div className="w-20 h-20 rounded-full border-4 border-[#050505] flex flex-col items-center justify-center shrink-0 relative shadow-inner animate-none">
                  <span className="text-xl font-bold font-mono text-zinc-100">{report.healthScore}</span>
                  <span className="text-[7.5px] uppercase font-bold text-zinc-455 tracking-widest block leading-none mt-1">SCORE</span>
                  <div className="absolute inset-2 rounded-full border border-dashed border-indigo-500/20" />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wide">Plan Individualizado</h4>
                  <p className="text-xs text-zinc-400 leading-snug mt-1 font-sans font-medium">{report.summary}</p>
                </div>
              </div>

              {/* Dynamic Insights list */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase pl-1">Insights de Auditoría Inteligente</h5>
                {report.insights.map((insight, idx) => {
                  const isDanger = insight.type === 'danger';
                  const isWarning = insight.type === 'warning';
                  const isSuccess = insight.type === 'success';

                  return (
                    <div 
                      key={idx}
                      className={`border p-4 rounded-2xl flex items-start space-x-3.5 shadow-sm ${
                        isDanger 
                          ? 'bg-rose-500/5 border-rose-500/10' 
                          : isWarning 
                            ? 'bg-amber-500/5 border-amber-500/10' 
                            : isSuccess 
                              ? 'bg-emerald-500/5 border-emerald-500/10' 
                              : 'bg-[#0F0F11] border-white/5'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                        isDanger 
                          ? 'bg-rose-500/10 text-rose-400' 
                          : isWarning 
                            ? 'bg-amber-500/10 text-amber-400' 
                            : isSuccess 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : 'bg-indigo-500/10 text-indigo-400'
                      }`}>
                        <Lightbulb className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <h6 className="text-xs font-bold text-zinc-200 truncate">{insight.title}</h6>
                          <span className={`text-[8px] font-extrabold uppercase font-sans tracking-wide px-1.5 py-0.5 rounded leading-none ${
                            isDanger 
                              ? 'bg-rose-500/10 text-rose-400' 
                              : isWarning 
                                ? 'bg-amber-500/10 text-amber-400' 
                                : isSuccess 
                                  ? 'bg-emerald-500/10 text-emerald-400' 
                                  : 'bg-indigo-500/10 text-indigo-400'
                          }`}>
                            {insight.type}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-zinc-400 leading-normal font-sans font-medium">{insight.description}</p>
                        
                        {/* Saving highlight projection */}
                        {insight.savingPotential && (
                          <div className="text-[10px] font-bold text-indigo-400 pt-1 flex items-center space-x-1.5">
                            <Activity className="w-3 h-3" />
                            <span>{insight.savingPotential}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* General advices bullet list */}
              <div className="bg-[#0F0F11]/40 border border-white/5 rounded-[22px] p-5 space-y-3.5">
                <h5 className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase pl-1">Recomendaciones de Acción Rápida</h5>
                <ul className="space-y-2.5">
                  {report.tips.map((tip, i) => (
                    <li key={i} className="flex items-start space-x-3 text-xs text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                      <span className="leading-rose font-medium">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ) : (
            <div className="bg-[#0F0F11] border border-white/5 rounded-3xl p-6.5 text-center min-h-[300px] flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h5 className="text-sm font-bold text-zinc-205">Planificador de IA Serene</h5>
                <p className="text-xs text-zinc-500 leading-normal">
                  No hemos escaneado tu caja este mes. Deja que Gemini AI evalúe tus créditos, egresos por comida y recordatorios de pago para potenciar tus ahorros.
                </p>
              </div>
              <button
                onClick={fetchInsights}
                className="py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs shadow-lg shadow-indigo-600/15 transition-transform active:scale-95 cursor-pointer flex items-center space-x-2 border-none outline-none"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Generar Informe de Inteligencia</span>
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
