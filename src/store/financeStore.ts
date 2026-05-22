/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { Transaction, Debt, SavingGoal, BillReminder, UserProfile, FinanceStoreState, PayrollIncome, ArchivedCycle, AppNotification } from '../types/finance';

function calculateCycleDates(refDate: Date, anchorDay: number) {
  const year = refDate.getFullYear();
  const month = refDate.getMonth();
  
  let startYear = year;
  let startMonth = month;
  
  if (refDate.getDate() < anchorDay) {
    startMonth = month - 1;
    if (startMonth < 0) {
      startMonth = 11;
      startYear = year - 1;
    }
  }
  
  // Set to noon to guard against timezone shift dropping days
  const startDate = new Date(startYear, startMonth, anchorDay, 12, 0, 0);
  
  let endMonth = startMonth + 1;
  let endYear = startYear;
  if (endMonth > 11) {
    endMonth = 0;
    endYear = startYear + 1;
  }
  
  const endDate = new Date(endYear, endMonth, anchorDay - 1, 12, 0, 0);
  
  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];
  
  return { startStr, endStr };
}

const MOCK_PROFILE: UserProfile = {
  name: 'Brandon Vides',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
  currency: '$',
  theme: 'dark',
  supabaseConnected: false,
  onboardingCompleted: false, // Will launch onboarding on first run
};

const MOCK_PAYROLL: PayrollIncome[] = [
  { id: 'p1', title: 'Nómina Consultor Software', amount: 3800000, frequency: 'monthly', paymentDay: 15, isActive: true },
  { id: 'p2', title: 'Freelance UX UX/UI', amount: 650000, frequency: 'biweekly', paymentDay: 15, paymentDay2: 30, isActive: true },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'income', amount: 3800000, category: 'salario', date: '2026-05-15', paymentMethod: 'Transferencia', tags: ['Principal', 'Nómina'], notes: 'Salario de Consultor de Software', icon: 'Briefcase' },
  { id: 't2', type: 'expense', amount: 1100000, category: 'hogar', date: '2026-05-16', paymentMethod: 'Débito', tags: ['Mensual', 'Arriendo'], notes: 'Pago de alquiler de apartamento', icon: 'Home' },
  { id: 't3', type: 'expense', amount: 75500, category: 'comida', date: '2026-05-18', paymentMethod: 'Crédito Apple', tags: ['Restaurante'], notes: 'Sushi Premium Dinner', icon: 'Utensils' },
  { id: 't4', type: 'expense', amount: 15990, category: 'suscripciones', date: '2026-05-15', paymentMethod: 'Crédito', tags: ['Video'], notes: 'Netflix Premium 4K', icon: 'Tv' },
  { id: 't5', type: 'expense', amount: 18500, category: 'transporte', date: '2026-05-20', paymentMethod: 'Efectivo', tags: ['Uber'], notes: 'Viaje a oficina central', icon: 'Car' },
  { id: 't6', type: 'expense', amount: 45000, category: 'servicios', date: '2026-05-17', paymentMethod: 'Débito', tags: ['Servicios Públicos', 'Internet'], notes: 'Plan Fibra Optica 500MB', icon: 'Wifi' },
  { id: 't7', type: 'income', amount: 650000, category: 'freelancing', date: '2026-05-15', paymentMethod: 'PayPal', tags: ['Freelance', 'Diseño'], notes: 'Diseño UX de Landing Page Fintech', icon: 'Palette' },
  { id: 't8', type: 'expense', amount: 120000, category: 'estudio', date: '2026-05-17', paymentMethod: 'Crédito', tags: ['Idiomas'], notes: 'Curso de Inglés de Negocios Platzi', icon: 'BookOpen' }
];

const MOCK_DEBTS: Debt[] = [
  { id: 'd1', name: 'Tarjeta Crédito Apple Titanium', entity: 'Apple Bank', totalAmount: 1800000, remainingAmount: 900000, interestRate: 19.9, totalInstallments: 12, paidInstallments: 6, dueDate: '2026-06-05', monthlyPayment: 150000, type: 'credit_card', tags: ['Apple', 'Diario'], penaltyStatus: 'normal', minimumPayment: 45000, totalPaidAmount: 900000 },
  { id: 'd2', name: 'Plazo Vehículo Mazda', entity: 'Banco de Bogotá', totalAmount: 22000000, remainingAmount: 11200000, interestRate: 6.5, totalInstallments: 48, paidInstallments: 20, dueDate: '2026-06-15', monthlyPayment: 420000, type: 'vehicle', tags: ['Banco', 'Auto'], penaltyStatus: 'normal', minimumPayment: 420000, totalPaidAmount: 10800000 },
  { id: 'd3', name: 'Cupo de Crédito Addi', entity: 'Addi Co', totalAmount: 400000, remainingAmount: 200000, interestRate: 0, totalInstallments: 4, paidInstallments: 2, dueDate: '2026-05-24', monthlyPayment: 100000, type: 'addi', tags: ['Celular', 'Pasivo'], penaltyStatus: 'normal', minimumPayment: 100000, totalPaidAmount: 200000 }
];

const MOCK_GOALS: SavingGoal[] = [
  { id: 'g1', name: 'Viaje a Japón 🇯🇵', targetAmount: 5000000, currentAmount: 3200000, category: 'viaje', targetDate: '2026-11-20' },
  { id: 'g2', name: 'Nuevo MacBook Pro M4 Max', targetAmount: 2800000, currentAmount: 1500000, category: 'computador', targetDate: '2026-09-15' },
];

const MOCK_REMINDERS: BillReminder[] = [
  { id: 'r1', title: 'Plan Celular Movistar', amount: 29900, dueDate: '2026-05-24', isPaid: false, category: 'servicios', recurring: 'monthly' },
  { id: 'r2', title: 'Suscripción Prime Video', amount: 15900, dueDate: '2026-05-28', isPaid: false, category: 'suscripciones', recurring: 'monthly' },
];

const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', title: '¡Ciclo Financiero Inicializado! 🔄', body: 'Tu nuevo ciclo de nómina basado en el día 15 ha comenzado. Tus presupuestos de gastos se reiniciaron.', type: 'cycle_restart', date: '2026-05-15 08:00', isRead: false },
  { id: 'n2', title: 'Alerta de Vencimiento de Pago ⏰', body: 'Tu cuota del cupo de Addi de $100.000 vence en 2 días.', type: 'payment_due', date: '2026-05-22 09:30', isRead: false }
];

const MOCK_ARCHIVED: ArchivedCycle[] = [
  {
    id: 'ac1',
    periodName: 'Ciclo 15 Abr - 14 May 2026',
    startDate: '2026-04-15',
    endDate: '2026-05-14',
    totalIncome: 4450000,
    totalExpenses: 2840000,
    remainingBalance: 1610000,
    summaryText: 'Completaste el ciclo anterior con saldo de $1.610.000 libre de deudas convencionales.',
    healthScore: 78
  }
];

// Helper to load state from local storage or mock data
const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('finance_store');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.transactions && parsed.debts && parsed.savingGoals && parsed.billReminders && parsed.profile) {
        return {
          ...parsed,
          payrollIncomes: parsed.payrollIncomes || MOCK_PAYROLL,
          archivedCycles: parsed.archivedCycles || MOCK_ARCHIVED,
          notifications: parsed.notifications || MOCK_NOTIFICATIONS,
          cycleAnchorDay: parsed.cycleAnchorDay || 15,
          currentCycleStart: parsed.currentCycleStart || '2026-05-15',
          currentCycleEnd: parsed.currentCycleEnd || '2026-06-14',
        };
      }
    }
  } catch (e) {
    console.error('Error loading data from localStorage', e);
  }
  return null;
};

const saveToLocalStorage = (state: Partial<FinanceStoreState>) => {
  try {
    const dataToSave = {
      transactions: state.transactions,
      debts: state.debts,
      savingGoals: state.savingGoals,
      billReminders: state.billReminders,
      payrollIncomes: state.payrollIncomes,
      archivedCycles: state.archivedCycles,
      notifications: state.notifications,
      profile: state.profile,
      cycleAnchorDay: state.cycleAnchorDay,
      currentCycleStart: state.currentCycleStart,
      currentCycleEnd: state.currentCycleEnd,
    };
    localStorage.setItem('finance_store', JSON.stringify(dataToSave));
  } catch (e) {
    console.error('Error saving data to localStorage', e);
  }
};

const initialDates = calculateCycleDates(new Date(), 15);
const initialStateData = loadFromLocalStorage() || {
  transactions: MOCK_TRANSACTIONS,
  debts: MOCK_DEBTS,
  savingGoals: MOCK_GOALS,
  billReminders: MOCK_REMINDERS,
  payrollIncomes: MOCK_PAYROLL,
  archivedCycles: MOCK_ARCHIVED,
  notifications: MOCK_NOTIFICATIONS,
  profile: MOCK_PROFILE,
  cycleAnchorDay: 15,
  currentCycleStart: initialDates.startStr,
  currentCycleEnd: initialDates.endStr,
};

export const useFinanceStore = create<FinanceStoreState>((set, get) => ({
  ...initialStateData,
  activeTab: 'home',
  selectedTransactionToEdit: null,
  selectedDebtToEdit: null,
  selectedGoalToEdit: null,
  selectedReminderToEdit: null,
  selectedPayrollToEdit: null,
  showOnboarding: !initialStateData.profile.onboardingCompleted,

  setProfile: (profileUpdates) => {
    set((state) => {
      const updatedProfile = { ...state.profile, ...profileUpdates };
      const nextState = { profile: updatedProfile };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  // Transactions Actions
  addTransaction: (tx) => {
    set((state) => {
      const newTx: Transaction = {
        ...tx,
        id: `t_${Date.now()}`
      };
      const nextState = {
        transactions: [newTx, ...state.transactions]
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  editTransaction: (id, updatedFields) => {
    set((state) => {
      const nextState = {
        transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updatedFields } : t)),
        selectedTransactionToEdit: null
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  deleteTransaction: (id) => {
    set((state) => {
      const nextState = {
        transactions: state.transactions.filter((t) => t.id !== id)
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  // Debts Actions
  addDebt: (debt) => {
    set((state) => {
      const newDebt: Debt = {
        ...debt,
        id: `d_${Date.now()}`
      };
      const nextState = {
        debts: [...state.debts, newDebt]
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  editDebt: (id, updatedFields) => {
    set((state) => {
      const nextState = {
        debts: state.debts.map((d) => (d.id === id ? { ...d, ...updatedFields } : d)),
        selectedDebtToEdit: null
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  deleteDebt: (id) => {
    set((state) => {
      const nextState = {
        debts: state.debts.filter((d) => d.id !== id)
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  payDebtInstallment: (id, customAmount) => {
    set((state) => {
      const updatedDebts = state.debts.map((d) => {
        if (d.id === id) {
          const installmentVal = customAmount || d.monthlyPayment;
          const paid = Math.min(d.paidInstallments + 1, d.totalInstallments);
          const remainingAmount = Math.max(d.remainingAmount - installmentVal, 0);
          const totalPaid = d.totalPaidAmount + installmentVal;
          const isLayedOff = remainingAmount <= 0;
          
          // Generate an automatic expense transaction
          setTimeout(() => {
            get().addTransaction({
              type: 'expense',
              amount: installmentVal,
              category: 'servicios',
              date: new Date().toISOString().split('T')[0],
              paymentMethod: 'Débito Automático',
              tags: ['Deuda', d.entity || 'Fintech'],
              notes: `Pago cuota ${paid}/${d.totalInstallments} - ${d.name}`,
              icon: 'CreditCard'
            });

            get().addNotification(
              `Cuota registrada: ${d.name} 💳`,
              `Se abonaron ${d.minimumPayment > 0 && d.remainingAmount === 0 ? 'todas las cuotas' : `un valor de ${state.profile.currency}${installmentVal}`} a tu deuda, cuota ${paid}/${d.totalInstallments}.`,
              'payment_received'
            );
          }, 0);

          // Advance next due date by 1 month
          const currentDueDate = new Date(d.dueDate);
          currentDueDate.setMonth(currentDueDate.getMonth() + 1);
          const nextDueDateStr = currentDueDate.toISOString().split('T')[0];

          return {
            ...d,
            paidInstallments: paid,
            remainingAmount: remainingAmount,
            totalPaidAmount: totalPaid,
            dueDate: nextDueDateStr,
            penaltyStatus: isLayedOff ? 'normal' : d.penaltyStatus
          };
        }
        return d;
      });

      const nextState = { debts: updatedDebts };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  // Goals Actions
  addGoal: (goal) => {
    set((state) => {
      const newGoal: SavingGoal = {
        ...goal,
        id: `g_${Date.now()}`
      };
      const nextState = {
        savingGoals: [...state.savingGoals, newGoal]
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  editGoal: (id, updatedFields) => {
    set((state) => {
      const nextState = {
        savingGoals: state.savingGoals.map((g) => (g.id === id ? { ...g, ...updatedFields } : g)),
        selectedGoalToEdit: null
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  deleteGoal: (id) => {
    set((state) => {
      const nextState = {
        savingGoals: state.savingGoals.filter((g) => g.id !== id)
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  contributeToGoal: (id, amount) => {
    set((state) => {
      const updatedGoals = state.savingGoals.map((g) => {
        if (g.id === id) {
          const nextAmount = Math.min(g.currentAmount + amount, g.targetAmount);
          
          setTimeout(() => {
            get().addTransaction({
              type: 'expense',
              amount: amount,
              category: 'otros',
              date: new Date().toISOString().split('T')[0],
              paymentMethod: 'Ahorro Programado',
              tags: ['Ahorro', g.name],
              notes: `Aporte a meta: ${g.name}`,
              icon: 'PiggyBank'
            });

            get().addNotification(
              `¡Ahorro programado! 🐷`,
              `Aportaste ${state.profile.currency}${amount} exitosamente a tu meta: ${g.name}.`,
              'goal_progress'
            );
          }, 0);

          return {
            ...g,
            currentAmount: nextAmount
          };
        }
        return g;
      });

      const nextState = { savingGoals: updatedGoals };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  // Bill Reminders Actions
  addReminder: (reminder) => {
    set((state) => {
      const newReminder: BillReminder = {
        ...reminder,
        id: `r_${Date.now()}`
      };
      const nextState = {
        billReminders: [...state.billReminders, newReminder]
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  editReminder: (id, updatedFields) => {
    set((state) => {
      const nextState = {
        billReminders: state.billReminders.map((r) => (r.id === id ? { ...r, ...updatedFields } : r)),
        selectedReminderToEdit: null
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  deleteReminder: (id) => {
    set((state) => {
      const nextState = {
        billReminders: state.billReminders.filter((r) => r.id !== id)
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  toggleReminderPaid: (id) => {
    set((state) => {
      const updatedReminders = state.billReminders.map((r) => {
        if (r.id === id) {
          const isPayingNow = !r.isPaid;
          
          if (isPayingNow) {
            setTimeout(() => {
              get().addTransaction({
                type: 'expense',
                amount: r.amount,
                category: r.category,
                date: new Date().toISOString().split('T')[0],
                paymentMethod: 'Factura Online',
                tags: ['Servicios', 'Recordatorio'],
                notes: `Pago recordatorio: ${r.title}`,
                icon: 'CalendarCheck'
              });

              get().addNotification(
                `Factura Pagada: ${r.title} ✅`,
                `Registramos el pago de ${state.profile.currency}${r.amount} para este servicio.`,
                'payment_received'
              );
            }, 0);
          }

          return { ...r, isPaid: isPayingNow };
        }
        return r;
      });

      const nextState = { billReminders: updatedReminders };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  // Payroll Actions
  addPayrollIncome: (income) => {
    set((state) => {
      const newIncome: PayrollIncome = {
        ...income,
        id: `p_${Date.now()}`
      };
      const nextState = {
        payrollIncomes: [...state.payrollIncomes, newIncome]
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  editPayrollIncome: (id, updatedFields) => {
    set((state) => {
      const nextState = {
        payrollIncomes: state.payrollIncomes.map((pi) => pi.id === id ? { ...pi, ...updatedFields } : pi),
        selectedPayrollToEdit: null
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  deletePayrollIncome: (id) => {
    set((state) => {
      const nextState = {
        payrollIncomes: state.payrollIncomes.filter((pi) => pi.id !== id)
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  // Notification Actions
  addNotification: (title, body, type) => {
    set((state) => {
      const now = new Date();
      const dateStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newNotif: AppNotification = {
        id: `n_${Date.now()}`,
        title,
        body,
        type,
        date: dateStr,
        isRead: false
      };
      const nextState = {
        notifications: [newNotif, ...state.notifications]
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  markNotificationAsRead: (id) => {
    set((state) => {
      const nextState = {
        notifications: state.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n)
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  clearAllNotifications: () => {
    set((state) => {
      const nextState = { notifications: [] };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  // Cycle Restart Actions
  setCycleAnchorDay: (day) => {
    set((state) => {
      const dates = calculateCycleDates(new Date(), day);
      const nextState = {
        cycleAnchorDay: day,
        currentCycleStart: dates.startStr,
        currentCycleEnd: dates.endStr
      };
      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  checkAndTriggerAutoCycleRestart: () => {
    const state = get();
    const todayStr = new Date().toISOString().split('T')[0];
    
    // If today is equal or past currentCycleEnd, it's time to trigger an auto restart cycle!
    if (todayStr > state.currentCycleEnd) {
      get().restartCycleManually();
    }
  },

  restartCycleManually: () => {
    set((state) => {
      const cycleTransactions = state.transactions.filter(t => t.date >= state.currentCycleStart && t.date <= state.currentCycleEnd);
      const income = cycleTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = cycleTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const remaining = income - expense;
      const score = Math.max(0, Math.min(100, Math.round((income > 0 ? (income - expense) / income : 0) * 100)));

      const rangeDisplay = `${state.currentCycleStart.split('-').slice(1).reverse().join('/')} al ${state.currentCycleEnd.split('-').slice(1).reverse().join('/')}`;
      const archived: ArchivedCycle = {
        id: `ac_${Date.now()}`,
        periodName: `Ciclo ${rangeDisplay}`,
        startDate: state.currentCycleStart,
        endDate: state.currentCycleEnd,
        totalIncome: income,
        totalExpenses: expense,
        remainingBalance: remaining,
        summaryText: `Has cerrado este ciclo de nómina con ingresos de ${state.profile.currency}${income.toLocaleString()} y gastos de ${state.profile.currency}${expense.toLocaleString()}. Saldo libre: ${state.profile.currency}${remaining.toLocaleString()}.`,
        healthScore: score
      };

      // Compute next cycle dates based on current end + 1 day
      const currentEndDateObj = new Date(state.currentCycleEnd + 'T12:00:00');
      currentEndDateObj.setDate(currentEndDateObj.getDate() + 1);
      const nextDates = calculateCycleDates(currentEndDateObj, state.cycleAnchorDay);

      // Reset bill reminders that are paid to unpaid for the new cycle!
      const refreshedReminders = state.billReminders.map(r => r.recurring !== 'none' ? { ...r, isPaid: false } : r);

      // Create entries for each payroll stream that is active for the new cycle!
      const automaticCycleIncomes: Transaction[] = [];
      state.payrollIncomes.forEach((pi, idx) => {
        if (pi.isActive) {
          automaticCycleIncomes.push({
            id: `auto_t_${Date.now()}_${idx}`,
            type: 'income',
            amount: pi.amount,
            category: 'salario',
            date: nextDates.startStr, // Register at first day of the new cycle
            paymentMethod: 'Transferencia',
            tags: ['Nómina', 'Sueldo Automático'],
            notes: `Nómina registrada: ${pi.title}`,
            icon: 'Briefcase'
          });
        }
      });

      // Show native Notification
      const nextState = {
        archivedCycles: [archived, ...state.archivedCycles],
        currentCycleStart: nextDates.startStr,
        currentCycleEnd: nextDates.endStr,
        billReminders: refreshedReminders,
        transactions: [...automaticCycleIncomes, ...state.transactions],
        notifications: [
          {
            id: `n_${Date.now()}`,
            title: `¡Tu ciclo comenzó! 🔄`,
            body: `El nuevo período financiero de nómina (${nextDates.startStr} al ${nextDates.endStr}) se ha activado. Tu sueldo fue depositado automáticamente para el presupuesto real de este mes.`,
            type: 'cycle_restart' as const,
            date: `${new Date().toISOString().split('T')[0]} 08:00`,
            isRead: false
          },
          ...state.notifications
        ]
      };

      saveToLocalStorage({ ...state, ...nextState });
      return nextState;
    });
  },

  resetToMockData: () => {
    const refreshedProfile = { ...MOCK_PROFILE, onboardingCompleted: true };
    const dates = calculateCycleDates(new Date(), 15);
    const nextState = {
      transactions: MOCK_TRANSACTIONS,
      debts: MOCK_DEBTS,
      savingGoals: MOCK_GOALS,
      billReminders: MOCK_REMINDERS,
      payrollIncomes: MOCK_PAYROLL,
      archivedCycles: MOCK_ARCHIVED,
      notifications: MOCK_NOTIFICATIONS,
      profile: refreshedProfile,
      cycleAnchorDay: 15,
      currentCycleStart: dates.startStr,
      currentCycleEnd: dates.endStr,
      activeTab: 'home' as const,
      showOnboarding: false
    };
    saveToLocalStorage(nextState);
    set(nextState);
  },

  clearAllData: () => {
    const clearedProfile = { ...MOCK_PROFILE, name: 'Usuario', onboardingCompleted: false };
    const dates = calculateCycleDates(new Date(), 15);
    const nextState = {
      transactions: [],
      debts: [],
      savingGoals: [],
      billReminders: [],
      payrollIncomes: [],
      archivedCycles: [],
      notifications: [],
      profile: clearedProfile,
      cycleAnchorDay: 15,
      currentCycleStart: dates.startStr,
      currentCycleEnd: dates.endStr,
      activeTab: 'home' as const,
      showOnboarding: true,
    };
    saveToLocalStorage(nextState);
    set(nextState);
  }
}));
