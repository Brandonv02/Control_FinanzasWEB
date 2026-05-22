/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Save } from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/categories';
import { Transaction, Debt, SavingGoal, BillReminder, DebtType } from '../types/finance';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'transaction' | 'debt' | 'goal' | 'reminder';
}

export default function Modals({ isOpen, onClose, type }: ModalProps) {
  const { 
    addTransaction, editTransaction, selectedTransactionToEdit,
    addDebt, editDebt, selectedDebtToEdit,
    addGoal, editGoal, selectedGoalToEdit,
    addReminder, editReminder, selectedReminderToEdit
  } = useFinanceStore();

  // Reset helper for local form states
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Transaction Form State
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('comida');
  const [txDate, setTxDate] = useState(todayStr);
  const [txMethod, setTxMethod] = useState('Efectivo');
  const [txTags, setTxTags] = useState('');
  const [txNotes, setTxNotes] = useState('');

  // 2. Debt Form State
  const [debtName, setDebtName] = useState('');
  const [debtEntity, setDebtEntity] = useState('');
  const [debtTotal, setDebtTotal] = useState('');
  const [debtRemaining, setDebtRemaining] = useState('');
  const [debtInterest, setDebtInterest] = useState('');
  const [debtInstallments, setDebtInstallments] = useState('');
  const [debtPaidInst, setDebtPaidInst] = useState('');
  const [debtDueDate, setDebtDueDate] = useState(todayStr);
  const [debtType, setDebtType] = useState<DebtType>('credit_card');
  const [debtMinimumPayment, setDebtMinimumPayment] = useState('');

  // 3. Goal Form State
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalCategory, setGoalCategory] = useState('viaje');
  const [goalDate, setGoalDate] = useState(todayStr);

  // 4. Reminder Form State
  const [remTitle, setRemTitle] = useState('');
  const [remAmount, setRemAmount] = useState('');
  const [remDueDate, setRemDueDate] = useState(todayStr);
  const [remCategory, setRemCategory] = useState('servicios');
  const [remRecurring, setRemRecurring] = useState<'monthly' | 'weekly' | 'none'>('monthly');

  // Load editing entities if selected
  useEffect(() => {
    if (selectedTransactionToEdit) {
      setTxType(selectedTransactionToEdit.type);
      setTxAmount(String(selectedTransactionToEdit.amount));
      setTxCategory(selectedTransactionToEdit.category);
      setTxDate(selectedTransactionToEdit.date);
      setTxMethod(selectedTransactionToEdit.paymentMethod);
      setTxTags(selectedTransactionToEdit.tags?.join(', ') || '');
      setTxNotes(selectedTransactionToEdit.notes || '');
    } else {
      setTxType('expense');
      setTxAmount('');
      setTxCategory('comida');
      setTxDate(todayStr);
      setTxMethod('Efectivo');
      setTxTags('');
      setTxNotes('');
    }
  }, [selectedTransactionToEdit, isOpen]);

  useEffect(() => {
    if (selectedDebtToEdit) {
      setDebtName(selectedDebtToEdit.name);
      setDebtEntity(selectedDebtToEdit.entity || '');
      setDebtTotal(String(selectedDebtToEdit.totalAmount));
      setDebtRemaining(String(selectedDebtToEdit.remainingAmount));
      setDebtInterest(String(selectedDebtToEdit.interestRate));
      setDebtInstallments(String(selectedDebtToEdit.totalInstallments));
      setDebtPaidInst(String(selectedDebtToEdit.paidInstallments));
      setDebtDueDate(selectedDebtToEdit.dueDate);
      setDebtType(selectedDebtToEdit.type);
      setDebtMinimumPayment(String(selectedDebtToEdit.minimumPayment || ''));
    } else {
      setDebtName('');
      setDebtEntity('');
      setDebtTotal('');
      setDebtRemaining('');
      setDebtInterest('0');
      setDebtInstallments('12');
      setDebtPaidInst('0');
      setDebtDueDate(todayStr);
      setDebtType('credit_card');
      setDebtMinimumPayment('');
    }
  }, [selectedDebtToEdit, isOpen]);

  useEffect(() => {
    if (selectedGoalToEdit) {
      setGoalName(selectedGoalToEdit.name);
      setGoalTarget(String(selectedGoalToEdit.targetAmount));
      setGoalCurrent(String(selectedGoalToEdit.currentAmount));
      setGoalCategory(selectedGoalToEdit.category);
      setGoalDate(selectedGoalToEdit.targetDate);
    } else {
      setGoalName('');
      setGoalTarget('');
      setGoalCurrent('0');
      setGoalCategory('viaje');
      setGoalDate(todayStr);
    }
  }, [selectedGoalToEdit, isOpen]);

  useEffect(() => {
    if (selectedReminderToEdit) {
      setRemTitle(selectedReminderToEdit.title);
      setRemAmount(String(selectedReminderToEdit.amount));
      setRemDueDate(selectedReminderToEdit.dueDate);
      setRemCategory(selectedReminderToEdit.category);
      setRemRecurring(selectedReminderToEdit.recurring);
    } else {
      setRemTitle('');
      setRemAmount('');
      setRemDueDate(todayStr);
      setRemCategory('servicios');
      setRemRecurring('monthly');
    }
  }, [selectedReminderToEdit, isOpen]);

  if (!isOpen) return null;

  // Form Submission handlers
  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(txAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const formattedTags = txTags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const categoryInfo = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].find(c => c.id === txCategory);
    
    if (selectedTransactionToEdit) {
      editTransaction(selectedTransactionToEdit.id, {
        type: txType,
        amount: parsedAmount,
        category: txCategory,
        date: txDate,
        paymentMethod: txMethod,
        tags: formattedTags,
        notes: txNotes,
        icon: categoryInfo?.iconName || 'CircleDot'
      });
    } else {
      addTransaction({
        type: txType,
        amount: parsedAmount,
        category: txCategory,
        date: txDate,
        paymentMethod: txMethod,
        tags: formattedTags,
        notes: txNotes,
        icon: categoryInfo?.iconName || 'CircleDot'
      });
    }
    onClose();
  };

  const handleSaveDebt = (e: React.FormEvent) => {
    e.preventDefault();
    const total = parseFloat(debtTotal);
    const remaining = debtRemaining ? parseFloat(debtRemaining) : total;
    if (isNaN(total) || total <= 0) return;

    const data = {
      name: debtName || 'Crédito nuevo',
      entity: debtEntity || 'Entidad Financaria',
      totalAmount: total,
      remainingAmount: remaining,
      interestRate: parseFloat(debtInterest) || 0,
      totalInstallments: parseInt(debtInstallments) || 12,
      paidInstallments: parseInt(debtPaidInst) || 0,
      dueDate: debtDueDate,
      monthlyPayment: parseFloat(debtTotal) / (parseInt(debtInstallments) || 12),
      type: debtType,
      penaltyStatus: 'normal' as const,
      minimumPayment: parseFloat(debtMinimumPayment) || (parseFloat(debtTotal) / (parseInt(debtInstallments) || 12)),
      totalPaidAmount: (parseInt(debtPaidInst) || 0) * (parseFloat(debtTotal) / (parseInt(debtInstallments) || 12))
    };

    if (selectedDebtToEdit) {
      editDebt(selectedDebtToEdit.id, data);
    } else {
      addDebt(data);
    }
    onClose();
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(goalTarget);
    if (isNaN(target) || target <= 0) return;

    const data = {
      name: goalName || 'Meta nueva',
      targetAmount: target,
      currentAmount: parseFloat(goalCurrent) || 0,
      category: goalCategory,
      targetDate: goalDate,
    };

    if (selectedGoalToEdit) {
      editGoal(selectedGoalToEdit.id, data);
    } else {
      addGoal(data);
    }
    onClose();
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(remAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    const data = {
      title: remTitle || 'Factura',
      amount: amountVal,
      dueDate: remDueDate,
      isPaid: false,
      category: remCategory,
      recurring: remRecurring
    };

    if (selectedReminderToEdit) {
      editReminder(selectedReminderToEdit.id, data);
    } else {
      addReminder(data);
    }
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col justify-end z-50">
      
      {/* Tap backdrop to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Sheet Content Frame */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="w-full max-h-[85%] bg-[#0F0F11] border-t border-white/5 rounded-t-[32px] p-6 pb-8 overflow-y-auto z-50 relative flex flex-col shadow-[0_-8px_32px_rgba(0,0,0,0.6)]"
      >
        {/* iOS bar notch indicator inside sheet */}
        <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-5 shrink-0" />

        <div className="flex items-center justify-between mb-5 shrink-0">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <span>
              {type === 'transaction' && (selectedTransactionToEdit ? 'Editar Transacción' : 'Agregar Transacción')}
              {type === 'debt' && (selectedDebtToEdit ? 'Editar Deuda / Tarjeta' : 'Registrar Tarjeta o Deuda')}
              {type === 'goal' && (selectedGoalToEdit ? 'Editar Meta de Ahorro' : 'Nueva Meta de Ahorro')}
              {type === 'reminder' && (selectedReminderToEdit ? 'Editar Recordatorio' : 'Crear Recordatorio de Pago')}
            </span>
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full bg-[#18181B] hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* 1. TRANSACTION FORM SHEET */}
        {type === 'transaction' && (
          <form onSubmit={handleSaveTransaction} className="space-y-4 flex-1">
            {/* Expense vs Income switcher pill */}
            <div className="grid grid-cols-2 p-1 bg-[#050505] border border-white/5 rounded-xl">
              <button
                type="button"
                onClick={() => { setTxType('expense'); setTxCategory('comida'); }}
                className={`py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  txType === 'expense' 
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20 shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Gasto / Egreso
              </button>
              <button
                type="button"
                onClick={() => { setTxType('income'); setTxCategory('salario'); }}
                className={`py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  txType === 'income' 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Ingreso / Entrada
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Valor / Monto</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-lg font-bold text-zinc-400">$</span>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-100 font-mono text-lg font-semibold border border-white/10 rounded-xl pl-8 pr-4 py-2.5 focus:border-indigo-500 text-indigo-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Categoría</label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 border border-white/10 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
                >
                  {txType === 'expense' ? (
                    EXPENSE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)
                  ) : (
                    INCOME_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Fecha</label>
                <input
                  type="date"
                  required
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Medio Pago</label>
                <select
                  value={txMethod}
                  onChange={(e) => setTxMethod(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 border border-white/10 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
                >
                  <option value="Efectivo">Efectivo 💵</option>
                  <option value="Débito">Tarjeta de Débito 💳</option>
                  <option value="Crédito Apple">Crédito Apple 🍎</option>
                  <option value="Crédito Principal">Crédito Principal 💳</option>
                  <option value="PayPal">PayPal / Internacional 🌐</option>
                  <option value="Transferencia">Transferencia Bancaria 🏦</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Etiquetas (tags)</label>
                <input
                  type="text"
                  placeholder="Ej: PlatoFuerte, Restaurante"
                  value={txTags}
                  onChange={(e) => setTxTags(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none placeholder-zinc-650"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Notas Adicionales</label>
              <textarea
                placeholder="Escribe comentarios de la compra..."
                value={txNotes}
                onChange={(e) => setTxNotes(e.target.value)}
                rows={2}
                className="w-full bg-[#050505] text-zinc-200 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer mt-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Transacción</span>
            </button>
          </form>
        )}

        {/* 2. DEBT FORM SHEET */}
        {type === 'debt' && (
          <form onSubmit={handleSaveDebt} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Nombre del Crédito</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cupo de Compra"
                  value={debtName}
                  onChange={(e) => setDebtName(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Entidad Financiera</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Addi, Bancolombia, Nequi"
                  value={debtEntity}
                  onChange={(e) => setDebtEntity(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Monto Solicitado (Total)</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={debtTotal}
                  onChange={(e) => setDebtTotal(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 font-mono border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Saldo Pendiente (Restante)</label>
                <input
                  type="number"
                  placeholder="Dejar vacío si es igual"
                  value={debtRemaining}
                  onChange={(e) => setDebtRemaining(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 font-mono border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Interés Anual %</label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.0"
                  value={debtInterest}
                  onChange={(e) => setDebtInterest(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 font-mono border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Cuotas Totales</label>
                <input
                  type="number"
                  required
                  placeholder="12"
                  value={debtInstallments}
                  onChange={(e) => setDebtInstallments(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 font-mono border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Cuotas Pagas</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={debtPaidInst}
                  onChange={(e) => setDebtPaidInst(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 font-mono border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Clase / Tipo</label>
                <select
                  value={debtType}
                  onChange={(e) => setDebtType(e.target.value as any)}
                  className="w-full bg-[#050505] text-zinc-200 border border-white/10 rounded-xl px-3 py-2.5 text-xs outline-none cursor-pointer focus:border-indigo-500"
                >
                  <option value="credit_card">Tarjeta de Crédito 💳</option>
                  <option value="addi">Crédito Addi 🚀</option>
                  <option value="sistecrédito">Sistecrédito 🛍️</option>
                  <option value="nequi">Préstamo Nequi 📱</option>
                  <option value="vehicle">Crédito de Vehículo 🚗</option>
                  <option value="loan">Préstamo Bancario 🏦</option>
                  <option value="personal">Deuda Personal 🤝</option>
                  <option value="study">Crédito de Estudios 📚</option>
                  <option value="free_investment">Libre Inversión 💸</option>
                  <option value="other">Otro pasivo 📁</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Pago Mínimo (Cuota)</label>
                <input
                  type="number"
                  placeholder="Dejar vacío para auto-calc"
                  value={debtMinimumPayment}
                  onChange={(e) => setDebtMinimumPayment(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 font-mono border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Próximo Vencimiento</label>
              <input
                type="date"
                required
                value={debtDueDate}
                onChange={(e) => setDebtDueDate(e.target.value)}
                className="w-full bg-[#050505] text-zinc-200 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            <button
               type="submit"
               className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer mt-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Deuda / Tarjeta</span>
            </button>
          </form>
        )}

        {/* 3. GOAL FORM SHEET */}
        {type === 'goal' && (
          <form onSubmit={handleSaveGoal} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Nombre de la Meta</label>
              <input
                type="text"
                required
                placeholder="Ej: Viaje a Japón 🇯🇵, Comprar Moto 🏍️"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="w-full bg-[#050505] text-zinc-200 border border-white/10 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Monto Blanco / Objetivo</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 font-mono border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Ahorro Inicial (Actual)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={goalCurrent}
                  onChange={(e) => setGoalCurrent(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 font-mono border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Tipo / Categoría</label>
                <select
                  value={goalCategory}
                  onChange={(e) => setGoalCategory(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 border border-white/10 rounded-xl px-3 py-2.5 text-xs outline-none cursor-pointer focus:border-indigo-500"
                >
                  <option value="viaje">Viajes ✈️</option>
                  <option value="moto">Vehículos 🏍️</option>
                  <option value="computador">Tecnología 💻</option>
                  <option value="emergencia">Fondo Emergencias 🛡️</option>
                  <option value="inversion">Inversiones & Bolsa 📈</option>
                  <option value="estudios">Educación 📚</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Meta Estimada</label>
                <input
                  type="date"
                  required
                  value={goalDate}
                  onChange={(e) => setGoalDate(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer mt-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Meta de Ahorro</span>
            </button>
          </form>
        )}

        {/* 4. REMINDER FORM SHEET */}
        {type === 'reminder' && (
          <form onSubmit={handleSaveReminder} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Título de la Factura</label>
              <input
                type="text"
                required
                placeholder="Ej: Pago de Internet Fibra, Suscripción Spotify"
                value={remTitle}
                onChange={(e) => setRemTitle(e.target.value)}
                className="w-full bg-[#050505] text-zinc-200 border border-white/10 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Monto Neto</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={remAmount}
                  onChange={(e) => setRemAmount(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 font-mono border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Categoría</label>
                <select
                  value={remCategory}
                  onChange={(e) => setRemCategory(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 border border-white/10 rounded-xl px-3 py-2.5 text-xs outline-none cursor-pointer focus:border-indigo-500"
                >
                  <option value="servicios">Servicios Básicos ⚡</option>
                  <option value="suscripciones">Suscripciones 📺</option>
                  <option value="salud">Salud & Seguros ⚕️</option>
                  <option value="hogar">Alquiler & Expensas 🏠</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Periodicidad / Intervalo</label>
                <select
                  value={remRecurring}
                  onChange={(e) => setRemRecurring(e.target.value as any)}
                  className="w-full bg-[#050505] text-zinc-200 border border-white/10 rounded-xl px-3 py-2.5 text-xs outline-none cursor-pointer focus:border-indigo-500"
                >
                  <option value="monthly">Mensual 🗓️</option>
                  <option value="weekly">Semanal 🔄</option>
                  <option value="none">Una sola vez ⏱️</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Vencimiento</label>
                <input
                  type="date"
                  required
                  value={remDueDate}
                  onChange={(e) => setRemDueDate(e.target.value)}
                  className="w-full bg-[#050505] text-zinc-200 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer mt-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Recordatorio</span>
            </button>
          </form>
        )}

      </motion.div>
    </div>
  );
}
