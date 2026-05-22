/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFinanceStore } from '../store/financeStore';
import { formatCurrency, getCategoryDetails, EXPENSE_CATEGORIES } from '../utils/categories';
import { 
  Search, 
  Trash2, 
  Edit2, 
  Plus, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Check, 
  DollarSign, 
  Sparkles,
  AlertCircle,
  CalendarDays,
  Briefcase,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  X,
  History,
  ArrowUpRight
} from 'lucide-react';
import { Transaction, BillReminder, PayrollIncome, ArchivedCycle } from '../types/finance';

interface TransactionsPageProps {
  onOpenModal: (type: 'transaction' | 'debt' | 'goal' | 'reminder') => void;
}

export default function TransactionsPage({ onOpenModal }: TransactionsPageProps) {
  const { 
    transactions, 
    billReminders, 
    payrollIncomes,
    archivedCycles,
    profile, 
    cycleAnchorDay,
    currentCycleStart,
    currentCycleEnd,
    deleteTransaction, 
    toggleReminderPaid,
    deleteReminder,
    addPayrollIncome,
    editPayrollIncome,
    deletePayrollIncome,
    setCycleAnchorDay,
    restartCycleManually
  } = useFinanceStore();

  const [activeSubTab, setActiveSubTab] = useState<'history' | 'calendar' | 'cycles'>('history');
  
  // Filtering states for History
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Filtering actions (Historical Ledger)
  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    const matchesSearch = t.notes?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  const unpaidReminders = billReminders.filter(r => !r.isPaid);

  // 2. Local State for Payroll Form
  const [isPayrollFormOpen, setIsPayrollFormOpen] = useState(false);
  const [payrollId, setPayrollId] = useState<string | null>(null);
  const [payrollTitle, setPayrollTitle] = useState('');
  const [payrollAmount, setPayrollAmount] = useState('');
  const [payrollFrequency, setPayrollFrequency] = useState<'monthly' | 'biweekly' | 'weekly' | 'variable'>('monthly');
  const [payrollDay, setPayrollDay] = useState('15');
  const [payrollDay2, setPayrollDay2] = useState('30');

  const triggerEditTransaction = (tx: Transaction) => {
    useFinanceStore.setState({ selectedTransactionToEdit: tx });
    onOpenModal('transaction');
  };

  const triggerEditReminder = (rem: BillReminder) => {
    useFinanceStore.setState({ selectedReminderToEdit: rem });
    onOpenModal('reminder');
  };

  // 3. Cycle Progress and Days Left Helpers
  const calculateDaysLeft = () => {
    const end = new Date(currentCycleEnd + 'T12:00:00');
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const calculateDaysElapsedPercent = () => {
    const totalDays = 30; // standard approximation for cycle duration
    const left = calculateDaysLeft();
    const elapsed = Math.max(0, totalDays - left);
    return Math.min(100, Math.round((elapsed / totalDays) * 100));
  };

  // 4. Save/Edit Payroll Incomes
  const handleSavePayroll = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(payrollAmount);
    if (isNaN(amt) || amt <= 0) return;

    const data = {
      title: payrollTitle || 'Ingreso de Nómina',
      amount: amt,
      frequency: payrollFrequency,
      paymentDay: parseInt(payrollDay) || 15,
      paymentDay2: payrollFrequency === 'biweekly' ? parseInt(payrollDay2) || 30 : undefined,
      isActive: true
    };

    if (payrollId) {
      editPayrollIncome(payrollId, data);
    } else {
      addPayrollIncome(data);
    }

    // Reset payroll state
    setPayrollId(null);
    setPayrollTitle('');
    setPayrollAmount('');
    setPayrollFrequency('monthly');
    setPayrollDay('15');
    setPayrollDay2('30');
    setIsPayrollFormOpen(false);
  };

  const handleTriggerEditPayroll = (pi: PayrollIncome) => {
    setPayrollId(pi.id);
    setPayrollTitle(pi.title);
    setPayrollAmount(String(pi.amount));
    setPayrollFrequency(pi.frequency);
    setPayrollDay(String(pi.paymentDay));
    setPayrollDay2(String(pi.paymentDay2 || '30'));
    setIsPayrollFormOpen(true);
  };

  const handleTogglePayrollStatus = (pi: PayrollIncome) => {
    editPayrollIncome(pi.id, { isActive: !pi.isActive });
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col space-y-4">
      
      {/* Top Selector pills (Segmented Control 3-cols) */}
      <div className="grid grid-cols-3 p-1 bg-[#0F0F11] border border-white/5 rounded-2xl shrink-0">
        <button
          onClick={() => setActiveSubTab('history')}
          className={`py-2.5 rounded-xl text-[10px] sm:text-xs font-semibold cursor-pointer transition-all ${
            activeSubTab === 'history' 
              ? 'bg-indigo-600 text-white shadow-md font-bold' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Historial
        </button>
        <button
          onClick={() => setActiveSubTab('calendar')}
          className={`py-2.5 rounded-xl text-[10px] sm:text-xs font-semibold cursor-pointer transition-all ${
            activeSubTab === 'calendar' 
              ? 'bg-indigo-600 text-white shadow-md font-bold' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Agenda ({unpaidReminders.length})
        </button>
        <button
          onClick={() => setActiveSubTab('cycles')}
          className={`py-2.5 rounded-xl text-[10px] sm:text-xs font-semibold cursor-pointer transition-all ${
            activeSubTab === 'cycles' 
              ? 'bg-indigo-600 text-white shadow-md font-bold' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Nómina & Ciclos
        </button>
      </div>

      {/* VIEW A: TRANSACTIONS RECORD HISTORIAL */}
      {activeSubTab === 'history' && (
        <div className="flex-1 flex flex-col space-y-4">
          
          {/* Quick Header */}
          <div className="flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-sm font-bold text-zinc-150 leading-none">Mi Libro de Caja</h3>
              <p className="text-[10px] text-zinc-500 mt-1">Busca y audita tu libro de operaciones histórico</p>
            </div>
            <button
              onClick={() => {
                useFinanceStore.setState({ selectedTransactionToEdit: null });
                onOpenModal('transaction');
              }}
              className="flex items-center space-x-1.5 py-1.5 px-3 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-[10px] text-indigo-400 font-bold border border-indigo-500/15 transition-colors cursor-pointer select-none"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Flujo</span>
            </button>
          </div>

          {/* Filters controls card */}
          <div className="bg-[#0F0F11]/90 border border-white/5 rounded-2xl p-4 space-y-3.5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-zinc-650" />
              <input
                type="text"
                placeholder="Filtrar por notas, método o tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#050505] text-xs text-zinc-200 border border-white/5 rounded-xl pl-9 pr-4 py-3 placeholder-zinc-550 focus:border-indigo-500 outline-none transition-all shadow-inner font-sans"
              />
            </div>

            {/* Selector Pills row */}
            <div className="flex space-x-2.5">
              <div className="flex bg-[#050505] p-1 rounded-xl border border-white/5 space-x-1 flex-1">
                <button
                  onClick={() => setFilterType('all')}
                  className={`flex-1 py-1 text-[9px] font-bold rounded-lg uppercase cursor-pointer select-none tracking-tight transition-all ${filterType === 'all' ? 'bg-zinc-800 text-zinc-100 font-extrabold' : 'text-zinc-500 hover:text-zinc-400'}`}
                >
                  TODOS
                </button>
                <button
                  onClick={() => setFilterType('income')}
                  className={`flex-1 py-1 text-[9px] font-bold rounded-lg uppercase cursor-pointer select-none tracking-tight transition-all ${filterType === 'income' ? 'bg-emerald-500/15 text-emerald-400 font-extrabold' : 'text-zinc-500 hover:text-emerald-550'}`}
                >
                  INGRESOS
                </button>
                <button
                  onClick={() => setFilterType('expense')}
                  className={`flex-1 py-1 text-[9px] font-bold rounded-lg uppercase cursor-pointer select-none tracking-tight transition-all ${filterType === 'expense' ? 'bg-rose-500/15 text-rose-400 font-extrabold' : 'text-zinc-500 hover:text-rose-550'}`}
                >
                  GASTOS
                </button>
              </div>

              {/* Reset shortcut */}
              {(filterType !== 'all' || filterCategory !== 'all' || searchQuery !== '') && (
                <button
                  onClick={() => {
                    setFilterType('all');
                    setFilterCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-3 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-white/5 text-[9.5px] font-bold text-zinc-400 cursor-pointer"
                >
                  Limpiar ({filteredTransactions.length})
                </button>
              )}
            </div>
          </div>

          {/* Transactions list map */}
          <div className="flex-1 space-y-2 min-h-[280px]">
            {filteredTransactions.length === 0 ? (
              <div className="bg-[#0F0F11]/40 border border-white/5 border-dashed rounded-2xl p-8 text-center text-zinc-550 text-xs">
                No se registraron transaccionen bajo los filtros especificados. Registra un flujo o modifica filtros.
              </div>
            ) : (
              filteredTransactions.map((t) => {
                const cat = getCategoryDetails(t.category, t.type);
                const isExpense = t.type === 'expense';

                return (
                  <div 
                    key={t.id}
                    className="w-full bg-[#0F0F11] border border-white/5 p-3.5 rounded-2xl flex items-center justify-between shadow-sm hover:border-white/10 transition-all relative overflow-hidden group"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cat.bgColor} ${cat.textColor} ring-1 ring-white/5`}>
                        <ArrowUpRight className={`w-4 h-4 ${isExpense ? 'rotate-90 select-none' : ''}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-100 truncate">
                          {t.notes || cat.label}
                        </p>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tight block mt-0.5">
                          {t.date} • {t.paymentMethod}
                          {t.tags && t.tags.length > 0 && ` • [${t.tags.join(', ')}]`}
                        </span>
                      </div>
                    </div>

                    {/* Numeric value and rapid utility editing */}
                    <div className="flex items-center space-x-3 shrink-0 pl-2">
                      <div className="text-right">
                        <span className={`text-xs font-mono font-bold ${isExpense ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {isExpense ? '-' : '+'}{formatCurrency(t.amount, profile.currency)}
                        </span>
                        <span className={`text-[8.5px] block ${cat.textColor} font-semibold mt-0.5`}>
                          {cat.label}
                        </span>
                      </div>

                      {/* Tool edits */}
                      <div className="flex flex-col space-y-1 bg-[#050505]/60 p-1 rounded-xl border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => triggerEditTransaction(t)}
                          className="p-1 rounded text-zinc-500 hover:text-zinc-300 cursor-pointer"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                        <button 
                          onClick={() => deleteTransaction(t.id)}
                          className="p-1 rounded text-rose-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW B: BILL AGENDA & CALENDAR CALENDAR */}
      {activeSubTab === 'calendar' && (
        <div className="flex-1 flex flex-col space-y-4">
          
          {/* Calendar header summaries */}
          <div className="flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-sm font-bold text-zinc-150 leading-none">Recordatorios de Servicios</h3>
              <p className="text-[10px] text-zinc-500 mt-1">Controla débitos futuros y agendas recurrentes</p>
            </div>
            
            <button
              onClick={() => {
                useFinanceStore.setState({ selectedReminderToEdit: null });
                onOpenModal('reminder');
              }}
              className="flex items-center space-x-1.5 py-1.5 px-3 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-[10px] text-emerald-400 font-bold border border-emerald-500/15 transition-colors cursor-pointer select-none"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Factura</span>
            </button>
          </div>

          {/* Calendar Summary statistics */}
          <div className="bg-[#0F0F11] border border-white/5 rounded-2xl p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/10">
                  <Calendar className="w-4 h-4 text-indigo-400 animate-pulse" />
                </div>
                <div>
                  <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-sans block">Gastos recurrentes</span>
                  <span className="text-xs text-zinc-300 font-sans font-semibold">Tus cuentas periódicos mensuales</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Total Pendientes</span>
                <span className="text-xs font-mono font-bold text-rose-300">
                  {unpaidReminders.length} Pendientes (
                  {formatCurrency(unpaidReminders.reduce((sum, r) => sum + r.amount, 0), profile.currency)}
                  )
                </span>
              </div>
            </div>
          </div>

          {/* Agenda Scroll area */}
          <div className="flex-1 space-y-3 min-h-[300px]">
            {billReminders.length === 0 ? (
              <div className="bg-[#0F0F11]/40 border border-white/5 border-dashed rounded-2xl p-8 text-center text-zinc-550 text-xs">
                No tienes facturas o servicios recurrentes guardados. Crea una para organizarte rápido.
              </div>
            ) : (
              billReminders.map((r) => {
                const isPaid = r.isPaid;
                return (
                  <div 
                    key={r.id}
                    className={`border p-4 rounded-2xl flex items-center justify-between transition-all duration-350 ${
                      isPaid 
                        ? 'bg-[#0F0F11]/25 border-zinc-900 border-[#0F0F11] opacity-70' 
                        : 'bg-[#0F0F11] border-white/5 shadow-md hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      {/* Check trigger toggles */}
                      <button 
                        onClick={() => toggleReminderPaid(r.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border transition-colors shrink-0 ${
                          isPaid 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                            : 'bg-[#050505] border-white/10 text-zinc-500 hover:border-indigo-500 hover:text-indigo-400'
                        }`}
                      >
                        {isPaid ? <Check className="w-4 h-4" /> : <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />}
                      </button>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${isPaid ? 'line-through text-zinc-500 font-medium' : 'text-zinc-100'}`}>
                          {r.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tight block">
                            Vence: {r.dueDate}
                          </span>
                          <span className="text-[9.5px] bg-black/40 border border-white/5 rounded-md px-1.5 py-0.5 text-zinc-500 font-sans">
                            {r.recurring === 'monthly' ? 'Mensual' : r.recurring === 'weekly' ? 'Semanal' : 'Único'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Price column */}
                    <div className="flex items-center space-x-2.5 pl-2">
                      <div className="text-right">
                        <p className={`text-xs font-mono font-bold ${isPaid ? 'text-zinc-550' : 'text-zinc-200'}`}>
                          {formatCurrency(r.amount, profile.currency)}
                        </p>
                        <span className={`text-[8px] font-bold uppercase ${isPaid ? 'text-emerald-500' : 'text-rose-400'} tracking-wider mt-0.5 block`}>
                          {isPaid ? 'PAGADA' : 'PENDIENTE'}
                        </span>
                      </div>
                      
                      {/* Reminder utilities */}
                      <div className="flex flex-col space-y-1 bg-[#050505]/80 p-1 rounded-lg border border-white/5">
                        <button 
                          onClick={() => triggerEditReminder(r)}
                          className="p-1 rounded text-zinc-500 hover:text-zinc-300 cursor-pointer"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                        <button 
                          onClick={() => deleteReminder(r.id)}
                          className="p-1 rounded text-rose-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW C: PAYROLL INCOME MODULE AND CYCLICAL AUTOPORT SETTINGS */}
      {activeSubTab === 'cycles' && (
        <div className="flex-1 flex flex-col space-y-4">
          
          {/* Panel header instructions */}
          <div>
            <h3 className="text-sm font-bold text-zinc-150 leading-none">Nóminas & Ciclos Financieros</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Sincroniza y reinicia automáticamente tus presupuestos por fecha de pago quincenal/mensual</p>
          </div>

          {/* ACTIVE PERIOD CALENDAR ANCHOR CARD */}
          <div className="bg-[#0F0F11] border border-indigo-500/10 p-5 rounded-[22px] space-y-4 relative overflow-hidden">
            {/* Soft backdrop glow */}
            <div className="absolute right-0 top-0 w-28 h-28 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-1.5">
                  <CalendarDays className="w-4.5 h-4.5 text-indigo-400" />
                  <span className="text-[10.5px] uppercase font-bold text-zinc-500 tracking-wider">Período Financiero Activo</span>
                </div>
                <div className="mt-1 flex items-baseline space-x-1.5">
                  <span className="text-sm font-sans font-extrabold text-zinc-100 tracking-tight">Día de nómina fijado: {cycleAnchorDay}</span>
                  <span className="text-[9.5px] text-indigo-400 font-mono">(Cada mes)</span>
                </div>
                <p className="text-[11px] text-zinc-305 font-mono mt-2 bg-black/45 border border-white/5 py-1.5 px-3 rounded-lg inline-block">
                  {currentCycleStart.split('-').reverse().join('/')} al {currentCycleEnd.split('-').reverse().join('/')}
                </p>
              </div>

              {/* Progress Wheel indicator */}
              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] text-zinc-550 uppercase font-sans">Días Restantes</span>
                <p className="text-2xl font-bold font-mono text-indigo-400 mt-0.5 tracking-tight">{calculateDaysLeft()}</p>
                <span className="text-[8px] text-zinc-500 font-sans mt-0.5 uppercase tracking-wide">de 30 días de ciclo</span>
              </div>
            </div>

            {/* Micro progress line */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9.5px]">
                <span className="text-zinc-500 font-sans">Transcurrido del ciclo</span>
                <span className="font-mono text-zinc-400 font-bold">{calculateDaysElapsedPercent()}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#050505] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500" 
                  style={{ width: `${calculateDaysElapsedPercent()}%` }}
                />
              </div>
            </div>

            {/* Controls segment inside Anchor Card */}
            <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-3.5 text-xs items-center">
              <div className="space-y-1">
                <span className="text-[9.5px] uppercase text-zinc-550 font-bold">Cambiar día de ciclo Principal</span>
                <select 
                  value={cycleAnchorDay}
                  onChange={(e) => setCycleAnchorDay(parseInt(e.target.value))}
                  className="w-full bg-[#050505] text-zinc-300 font-mono text-[11px] py-2 px-2 border border-white/5 rounded-xl cursor-pointer outline-none"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>Día {day} de cada mes</option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('¿Estás seguro de que deseas forzar el cierre del ciclo financiero anterior? Esto archivará tus ingresos y egresos recientes para renovar tus presupuestos.')) {
                      restartCycleManually();
                      alert('¡Ciclo financiero cerrado y archivado perfectamente! Se han depositado tus sueldos y refrescado la agenda de servicios.');
                    }
                  }}
                  className="w-full bg-indigo-600/10 hover:bg-indigo-600/20 active:scale-95 border border-indigo-500/25 py-2.5 px-3 rounded-xl font-bold text-[10.5px] text-indigo-400 flex items-center justify-center space-x-1.5 transition-all text-center cursor-pointer select-none"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reiniciar Período</span>
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE MULTIPLE PAYROLL STREAMS */}
          <div className="bg-[#0F0F11] border border-white/5 rounded-[22px] p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs uppercase font-extrabold text-zinc-400 tracking-wider">Mapeo de Ingresos / Nómina</h4>
              </div>

              {!isPayrollFormOpen && (
                <button
                  onClick={() => {
                    setPayrollId(null);
                    setPayrollTitle('');
                    setPayrollAmount('');
                    setPayrollFrequency('monthly');
                    setPayrollDay('15');
                    setIsPayrollFormOpen(true);
                  }}
                  className="flex items-center space-x-1 py-1 px-2.5 text-[9.5px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/15 rounded-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir nómina</span>
                </button>
              )}
            </div>

            {/* ADD / EDIT PAYROLL CONFLICT FORM */}
            {isPayrollFormOpen && (
              <form onSubmit={handleSavePayroll} className="bg-[#050505] p-4 rounded-2xl border border-white/5 space-y-3.5">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] uppercase font-bold text-indigo-400">{payrollId ? 'Editar Flujo Nómina' : 'Agregar Flujo de Nómina'}</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsPayrollFormOpen(false);
                      setPayrollId(null);
                    }}
                    className="text-zinc-500 hover:text-zinc-300 pointer-events-auto cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9.5px] uppercase text-zinc-500">Título / Cargo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Nómina Brandon Sr Consultant"
                    value={payrollTitle}
                    onChange={(e) => setPayrollTitle(e.target.value)}
                    className="w-full bg-[#0E0E10] border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] uppercase text-zinc-500">Monto Esperado</label>
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      value={payrollAmount}
                      onChange={(e) => setPayrollAmount(e.target.value)}
                      className="w-full bg-[#0E0E10] font-mono border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] uppercase text-zinc-500">Frecuencia</label>
                    <select
                      value={payrollFrequency}
                      onChange={(e) => setPayrollFrequency(e.target.value as any)}
                      className="w-full bg-[#0E0E10] border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none cursor-pointer"
                    >
                      <option value="monthly">Mensual 🗓️</option>
                      <option value="biweekly">Quincenal (15/30) 🌗</option>
                      <option value="weekly">Semanal (Viernes) 🧾</option>
                      <option value="variable">Variables 🍃</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] uppercase text-zinc-500">Día de Pago (1 - 31)</label>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      required
                      placeholder="15"
                      value={payrollDay}
                      onChange={(e) => setPayrollDay(e.target.value)}
                      className="w-full bg-[#0E0E10] font-mono border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none"
                    />
                  </div>

                  {payrollFrequency === 'biweekly' && (
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] uppercase text-zinc-500">Segundo Día (1 - 31)</label>
                      <input
                        type="number"
                        min={1}
                        max={31}
                        placeholder="30"
                        value={payrollDay2}
                        onChange={(e) => setPayrollDay2(e.target.value)}
                        className="w-full bg-[#0E0E10] font-mono border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-colors"
                >
                  Guardar Flujo Nómina
                </button>
              </form>
            )}

            {/* LIST OF REGISTERED PAYROLL SOURCES */}
            <div className="space-y-2.5">
              {payrollIncomes.length === 0 ? (
                <div className="text-center font-sans text-xs text-zinc-500 py-4">
                  No has registrado nóminas fijas. Agrégalas arriba para automatizar tus ingresos reales al iniciar el ciclo.
                </div>
              ) : (
                payrollIncomes.map((pi) => {
                  const freqMap = {
                    monthly: 'Mensual',
                    biweekly: 'Quincenal (15 y 30)',
                    weekly: 'Semanal (Viernes)',
                    variable: 'Variable e Informal'
                  };

                  return (
                    <div 
                      key={pi.id} 
                      className={`flex justify-between items-center p-3.5 rounded-xl border transition-all ${pi.isActive ? 'bg-[#050505] border-white/10' : 'bg-black/20 border-white/5 opacity-55'}`}
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        {/* Slide Toggle Switch simulation with tap target */}
                        <button
                          type="button"
                          onClick={() => handleTogglePayrollStatus(pi)}
                          className={`w-10 h-6 rounded-full p-0.5 border cursor-pointer select-none transition-all ${pi.isActive ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900 border-white/5 text-zinc-650'}`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-full bg-current transition-transform duration-200 ${pi.isActive ? 'translate-x-[17px]' : 'translate-x-0'}`} />
                        </button>

                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-zinc-200 truncate">{pi.title}</h5>
                          <span className="text-[9px] font-sans text-zinc-500 block uppercase tracking-wide mt-0.5">
                            {freqMap[pi.frequency]} • Pago día {pi.paymentDay}{pi.paymentDay2 && ` y ${pi.paymentDay2}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pl-2">
                        <div className="text-right">
                          <p className={`text-xs font-mono font-bold ${pi.isActive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                            +{formatCurrency(pi.amount, profile.currency)}
                          </p>
                          <span className="text-[8px] uppercase tracking-wide text-zinc-500 mt-0.5 block">NÓMINA</span>
                        </div>
                        
                        <div className="flex flex-col space-y-1 bg-black/45 p-1 rounded-xl border border-white/5 shrink-0 select-none">
                          <button 
                            type="button" 
                            onClick={() => handleTriggerEditPayroll(pi)} 
                            className="p-1 rounded text-zinc-500 hover:text-zinc-300 cursor-pointer"
                          >
                            <Edit2 className="w-2.5 h-2.5" />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => deletePayrollIncome(pi.id)} 
                            className="p-1 rounded text-rose-500 hover:text-rose-450 cursor-pointer"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* CHRONOLOGICAL HISTORICAL ARCHIVED PERIODS LEDGER */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs uppercase font-extrabold text-zinc-500 tracking-wider">Historial de Períodos Cerrados</h4>
            </div>

            {archivedCycles.length === 0 ? (
              <div className="bg-[#0F0F11]/40 border border-white/5 border-dashed rounded-2xl p-6 text-center text-zinc-500 text-xs">
                Aún no tienes ciclos archivados. Al cerrar tu período activo usando el botón superior "Reiniciar Período", se registrarán tus resúmenes históricos aquí.
              </div>
            ) : (
              <div className="space-y-3">
                {archivedCycles.map((ac) => {
                  return (
                    <div 
                      key={ac.id} 
                      className="bg-[#0F0F11] border border-white/5 p-4 rounded-2xl space-y-3 relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-xs font-bold text-zinc-200 tracking-tight">{ac.periodName}</h5>
                          <span className="text-[9px] font-mono text-zinc-500">Rango: {ac.startDate.split('-').reverse().join('/')} al {ac.endDate.split('-').reverse().join('/')}</span>
                        </div>
                        {/* Perfect small circular score indicator */}
                        <div className="flex items-center space-x-2 shrink-0 bg-black/45 border border-white/5 py-1 px-2.5 rounded-full select-none font-sans">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px] font-extrabold text-zinc-300">Score {ac.healthScore}/100</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans bg-black/30 border border-white/5 p-2 rounded-xl">
                        {ac.summaryText}
                      </p>

                      <div className="grid grid-cols-3 gap-2 py-0.5 text-center bg-[#050505]/45 border border-white/5 p-2.5 rounded-xl text-[10px]">
                        <div>
                          <span className="text-zinc-500 text-[9px] block">Ingresos de Ciclo</span>
                          <span className="text-emerald-400 font-mono font-bold mt-1 block">+{formatCurrency(ac.totalIncome, profile.currency)}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[9px] block">Gastos de Ciclo</span>
                          <span className="text-rose-400 font-mono font-bold mt-1 block">-{formatCurrency(ac.totalExpenses, profile.currency)}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[9px] block">Saldo Libre / Remanente</span>
                          <span className="text-indigo-400 font-mono font-bold mt-1 block">{formatCurrency(ac.remainingBalance, profile.currency)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
