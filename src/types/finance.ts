/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // ISO date string (YYYY-MM-DD)
  paymentMethod: string;
  tags: string[];
  notes?: string;
  icon?: string;
}

export type DebtType = 
  | 'credit_card' 
  | 'loan' 
  | 'personal' 
  | 'study' 
  | 'vehicle' 
  | 'free_investment' 
  | 'nequi' 
  | 'addi' 
  | 'sistecrédito' 
  | 'cooperative' 
  | 'other';

export interface Debt {
  id: string;
  name: string;
  entity: string; // e.g. Bancolombia, Nequi, Addi, etc.
  totalAmount: number;
  remainingAmount: number;
  interestRate: number; // percentage (e.g. 19.9 for 19.9%)
  totalInstallments: number; // cuotas totales
  paidInstallments: number; // cuotas pagadas
  dueDate: string; // YYYY-MM-DD representing next payment date
  monthlyPayment: number;
  type: DebtType;
  tags?: string[];
  penaltyStatus: 'normal' | 'late' | 'critical'; // mora o estado
  minimumPayment: number;
  totalPaidAmount: number; // total cumulative amount paid so far
}

export interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  targetDate: string; // YYYY-MM-DD
}

export interface BillReminder {
  id: string;
  title: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  isPaid: boolean;
  category: string;
  recurring: 'monthly' | 'weekly' | 'none';
}

export interface PayrollIncome {
  id: string;
  title: string;
  amount: number;
  frequency: 'monthly' | 'biweekly' | 'weekly' | 'variable';
  paymentDay: number; // 1 to 31 (for monthly), 1 to 7 for weekly (1=Mon, 7=Sun)
  paymentDay2?: number; // for biweekly second day (e.g. 30)
  isActive: boolean;
}

export interface ArchivedCycle {
  id: string;
  periodName: string; // e.g. "Ciclo 15 May - 14 Jun 2026"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalIncome: number;
  totalExpenses: number;
  remainingBalance: number;
  summaryText: string;
  healthScore: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'payment_due' | 'cycle_restart' | 'goal_progress' | 'high_spending' | 'payment_received' | 'general';
  date: string; // YYYY-MM-DD HH:MM
  isRead: boolean;
}

export interface UserProfile {
  name: string;
  avatarUrl?: string;
  currency: string; // '$', '€', '£', 'S/.', 'COP', 'MXN', etc.
  theme: 'light' | 'dark';
  supabaseConnected: boolean;
  onboardingCompleted: boolean;
}

export interface FinanceStoreState {
  transactions: Transaction[];
  debts: Debt[];
  savingGoals: SavingGoal[];
  billReminders: BillReminder[];
  payrollIncomes: PayrollIncome[];
  archivedCycles: ArchivedCycle[];
  notifications: AppNotification[];
  profile: UserProfile;
  activeTab: 'home' | 'transactions' | 'debts' | 'goals' | 'analytics' | 'settings' | 'simulador' | 'cycles';
  selectedTransactionToEdit: Transaction | null;
  selectedDebtToEdit: Debt | null;
  selectedGoalToEdit: SavingGoal | null;
  selectedReminderToEdit: BillReminder | null;
  selectedPayrollToEdit: PayrollIncome | null;
  showOnboarding: boolean;
  cycleAnchorDay: number; // The day of month the period restarts (default 15)
  currentCycleStart: string; // Date (YYYY-MM-DD) of active period start
  currentCycleEnd: string; // Date (YYYY-MM-DD) of active period end
  
  // Actions
  setProfile: (profile: Partial<UserProfile>) => void;
  setActiveTab: (tab: 'home' | 'transactions' | 'debts' | 'goals' | 'analytics' | 'settings' | 'simulador' | 'cycles') => void;
  
  // Transactions Actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Debts Actions
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  editDebt: (id: string, debt: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
  payDebtInstallment: (id: string, customAmount?: number) => void;
  
  // Goals Actions
  addGoal: (goal: Omit<SavingGoal, 'id'>) => void;
  editGoal: (id: string, goal: Partial<SavingGoal>) => void;
  deleteGoal: (id: string) => void;
  contributeToGoal: (id: string, amount: number) => void;
  
  // Bill Reminders Actions
  addReminder: (reminder: Omit<BillReminder, 'id'>) => void;
  editReminder: (id: string, reminder: Partial<BillReminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminderPaid: (id: string) => void;

  // Payroll Actions
  addPayrollIncome: (income: Omit<PayrollIncome, 'id'>) => void;
  editPayrollIncome: (id: string, income: Partial<PayrollIncome>) => void;
  deletePayrollIncome: (id: string) => void;

  // Notification Actions
  addNotification: (title: string, body: string, type: AppNotification['type']) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Cycle Restart Actions
  setCycleAnchorDay: (day: number) => void;
  checkAndTriggerAutoCycleRestart: () => void;
  restartCycleManually: () => void;
  
  // Data Reset/Mocking
  resetToMockData: () => void;
  clearAllData: () => void;
}
