/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFinanceStore } from '../store/financeStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  Check, 
  Eye, 
  EyeOff,
  Smartphone,
  Wallet,
  Coins,
  Shield,
  Info,
  Lock,
  Mail,
  User,
  Globe,
  DollarSign,
  CreditCard,
  Plus,
  Trash2,
  Sliders,
  Scale,
  Settings,
  BellRing,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { formatCurrency } from '../utils/categories';

export default function Onboarding() {
  // Navigation Flow States:
  // -1: Slides Intro Carousel
  // 0: Auth Screen (Log In / Sign Up)
  // 1: Personal Profile
  // 2: Net Income & Salary Frequency
  // 3: Debt Ledger & Liabilities Setup
  // 4: Monthly Fixed Expenses
  // 5: Savings Goals
  // 6: AI Underwriting Scorecard & Launch Preview
  const [step, setStep] = useState(-1);
  const [slide, setSlide] = useState(0);

  const { setProfile, addDebt, addGoal, addReminder, addPayrollIncome, setCycleAnchorDay, resetToMockData } = useFinanceStore();

  // Authentication Fields
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Step 1: Personal Profile Fields
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('CO');
  const [selectedCurrency, setSelectedCurrency] = useState('$');
  const [selectedAvatarSeed, setSelectedAvatarSeed] = useState('🦊');
  const [selectedGradient, setSelectedGradient] = useState('from-indigo-500 to-purple-500');

  const avatarSeeds = ['🦊', '🐯', '🦁', '🦉', '🐨', '👩‍💻', '👨‍💻', '🥷', '🧙‍♂️', '🚀'];
  const gradientSeeds = [
    { label: 'Twilight', class: 'from-indigo-500 to-purple-500' },
    { label: 'Mint', class: 'from-emerald-400 to-teal-500' },
    { label: 'Sunset', class: 'from-rose-500 to-amber-500' },
    { label: 'Oceans', class: 'from-blue-600 to-sky-450' }
  ];

  const countries = [
    { code: 'CO', name: 'Colombia 🇨🇴', currency: '$' },
    { code: 'MX', name: 'México 🇲🇽', currency: '$' },
    { code: 'CL', name: 'Chile 🇨🇱', currency: '$' },
    { code: 'PE', name: 'Perú 🇵🇪', currency: 'S/.' },
    { code: 'ES', name: 'España 🇪🇸', currency: '€' },
    { code: 'US', name: 'USA 🇺🇸', currency: '$' }
  ];

  // Step 2: Financial/Salary Fields
  const [salaryFrequency, setSalaryFrequency] = useState<'monthly' | 'biweekly' | 'weekly' | 'variable'>('monthly');
  const [salaryAmount, setSalaryAmount] = useState<number>(3500000);
  const [paymentDay, setPaymentDay] = useState<number>(15);
  const [paymentDay2, setPaymentDay2] = useState<number>(30);
  const [paymentDayWeekly, setPaymentDayWeekly] = useState<number>(5); // 1-7, 5 = Friday
  const [hasMultipleIncomes, setHasMultipleIncomes] = useState(false);
  const [extraIncomeEstimated, setExtraIncomeEstimated] = useState<number>(0);

  // Step 3: Debts configuration
  const [debts, setDebts] = useState<any[]>([]);
  const [newDebtType, setNewDebtType] = useState<string>('credit_card');
  const [newDebtEntity, setNewDebtEntity] = useState('');
  const [newDebtName, setNewDebtName] = useState('');
  const [newDebtAmount, setNewDebtAmount] = useState<number>(1200000);
  const [newDebtCuota, setNewDebtCuota] = useState<number>(100000);
  const [newDebtInstallments, setNewDebtInstallments] = useState<number>(12);
  const [newDebtPaidTotal, setNewDebtPaidTotal] = useState<number>(0);
  const [newDebtInterest, setNewDebtInterest] = useState<number>(0);
  const [isAddingDebt, setIsAddingDebt] = useState(false);

  // Step 4: Fixed Expenses
  const [fixedExpenses, setFixedExpenses] = useState({
    rent: 800000,
    food: 400000,
    services: 120000,
    transport: 150000,
    internet: 60000,
    subscriptions: 30000,
    studies: 200000,
    health: 80000,
    others: 0
  });

  // Step 5: Goals Configuration
  const [goals, setGoals] = useState<any[]>([]);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState<number>(2000000);
  const [newGoalCategory, setNewGoalCategory] = useState('ahorro');
  const [newGoalDate, setNewGoalDate] = useState('25-12-2026'); // DD-MM-YYYY format or any
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  // Carousel Slides intro details
  const slides = [
    {
      title: 'Tu Capital, Inteligente',
      description: 'Una visión general unificada de tus saldos reales, tarjetas de crédito y nóminas con un diseño premium y responsive inspirado en Apple Wallet.',
      icon: Wallet,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      title: 'Mentoría Financiera Gemini AI',
      description: 'Asesoría de control de haberes que evalúa tu índice de endeudamiento y propone cortes inteligentes de ocio al instante de registrar deudas.',
      icon: Sparkles,
      color: 'from-purple-600 to-fuchsia-600',
    },
    {
      title: 'Flujos Automatizados de Nómina',
      description: 'Configura tus cuotas de arriendo, internet, Addias, Nequis y metas de ahorro agregando deudas una sola vez. Alerta de reseteo automático.',
      icon: Calendar,
      color: 'from-emerald-600 to-teal-600',
    },
  ];

  // Methods
  const handleNextSlide = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      setStep(0); // Move to Auth Screen
    }
  };

  const handlePrevSlide = () => {
    if (slide > 0) {
      setSlide(slide - 1);
    }
  };

  // Auth Handling
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Por favor completa todos los campos.');
      return;
    }
    setAuthError('');
    setIsAuthenticating(true);

    try {
      if (isSupabaseConfigured && supabase) {
        if (isSignUp) {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
          
          setStep(1); // Proceed on success
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          
          // Check if profile exists and restore
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user?.id)
            .single();

          if (profileData) {
            // If they already did onboarding, retrieve and load!
            setProfile({
              name: profileData.name,
              currency: profileData.currency,
              onboardingCompleted: true,
              supabaseConnected: true
            });
            useFinanceStore.setState({ showOnboarding: false });
            return;
          }
          setStep(1);
        }
      } else {
        // Local Sandbox Mode
        setStep(1);
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Error de autenticación. Inténtalo de nuevo.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLocalGuest = () => {
    // Allows proceeding without setting up Supabase
    setStep(1);
  };

  // Debts Management
  const addDebtToList = () => {
    if (!newDebtEntity || !newDebtName) {
      alert('Completa la entidad y el nombre de la deuda.');
      return;
    }
    const debt = {
      id: `setup_d_${Date.now()}`,
      name: newDebtName,
      entity: newDebtEntity,
      totalAmount: newDebtAmount,
      remainingAmount: newDebtAmount,
      interestRate: newDebtInterest,
      totalInstallments: newDebtInstallments,
      paidInstallments: newDebtPaidTotal,
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toISOString().split('T')[0],
      monthlyPayment: newDebtCuota,
      type: newDebtType,
      penaltyStatus: 'normal' as const,
      minimumPayment: newDebtCuota,
      totalPaidAmount: newDebtCuota * newDebtPaidTotal
    };

    setDebts([...debts, debt]);
    setNewDebtEntity('');
    setNewDebtName('');
    setIsAddingDebt(false);
  };

  const removeDebtFromList = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  // Goals Management
  const addGoalToList = () => {
    if (!newGoalName) {
      alert('Completa un nombre válido para tu meta.');
      return;
    }
    const formattedDate = newGoalDate.indexOf('-') !== -1 
      ? newGoalDate.split('-').reverse().join('-') // Convert layout format to ISO
      : newGoalDate;

    setGoals([
      ...goals,
      {
        id: `setup_g_${Date.now()}`,
        name: newGoalName,
        targetAmount: newGoalAmount,
        currentAmount: 0,
        category: newGoalCategory,
        targetDate: formattedDate
      }
    ]);

    setNewGoalName('');
    setIsAddingGoal(false);
  };

  const removeGoalFromList = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  // Live Scorecard Calculations
  const calculatedGrossIncome = salaryAmount + (hasMultipleIncomes ? extraIncomeEstimated : 0);
  const totalDebtsMonthlyInstallment = debts.reduce((sum: number, d: any) => sum + (d.monthlyPayment || 0), 0);
  const totalFixedExpensesSum = (Object.values(fixedExpenses) as number[]).reduce((sum: number, val: number) => sum + val, 0);
  const expectedFreeCash = calculatedGrossIncome - totalDebtsMonthlyInstallment - totalFixedExpensesSum;
  
  const debtToIncomeRatio = calculatedGrossIncome > 0 
    ? Math.round((totalDebtsMonthlyInstallment / calculatedGrossIncome) * 100)
    : 0;
  
  const savingsPotentialRatio = calculatedGrossIncome > 0 
    ? Math.max(0, Math.round((expectedFreeCash / calculatedGrossIncome) * 100))
    : 0;

  const getRiskScorecard = () => {
    if (debtToIncomeRatio > 50 || expectedFreeCash < 0) {
      return { label: 'CRÍTICO 🚨', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', note: 'Deudas y fijos consumen más del 50%. Peligro de insolvencia.', tips: 'Congela compras con tarjeta de crédito de inmediato y reprograma deudas.' };
    }
    if (debtToIncomeRatio > 35) {
      return { label: 'ALTO ⚠️', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', note: 'Margen de maniobra estrecho. Más del 35% de tu ingreso se drena en pasivos.', tips: 'Evita adquirir Addi o Sistecrédito y busca abonos a capital.' };
    }
    if (debtToIncomeRatio > 20) {
      return { label: 'MODERADO 📉', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', note: 'Ratios manejables, pero con poco espacio para el ocio si agregas consumos.', tips: 'Fija transferencias automáticas para ahorrar el remanente.' };
    }
    return { label: 'EXCELENTE 🛡️', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', note: 'Salud de pasivos impecable. Tienes libertad y poder de inversión.', tips: 'Programa el 15% de tu nómina directo a tus fondos de ahorro.' };
  };

  const currentRisk = getRiskScorecard();

  const handleFinishOnboarding = async () => {
    const finalProfile = {
      name: name || 'Usuario Serene',
      nickname: nickname || name.split(' ')[0] || 'Usuario',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80`, // placeholder
      currency: selectedCurrency,
      onboardingCompleted: true,
      supabaseConnected: isSupabaseConfigured
    };

    // 1. Establish General Profile info
    setProfile(finalProfile);

    // 2. Set Automated Payroll Income Stream
    addPayrollIncome({
      title: 'Nómina Principal',
      amount: salaryAmount,
      frequency: salaryFrequency,
      paymentDay: paymentDay,
      paymentDay2: paymentDay2,
      isActive: true
    });

    if (hasMultipleIncomes && extraIncomeEstimated > 0) {
      addPayrollIncome({
        title: 'Ingresos Extra / Freelance',
        amount: extraIncomeEstimated,
        frequency: 'variable',
        paymentDay: 30,
        isActive: true
      });
    }

    // 3. Configure payment cycle anchor based on payroll payment day
    setCycleAnchorDay(paymentDay);

    // 4. Register Debts
    debts.forEach(d => {
      addDebt({
        name: d.name,
        entity: d.entity,
        totalAmount: d.totalAmount,
        remainingAmount: d.remainingAmount,
        interestRate: d.interestRate,
        totalInstallments: d.totalInstallments,
        paidInstallments: d.paidInstallments,
        dueDate: d.dueDate,
        monthlyPayment: d.monthlyPayment,
        type: d.type as any,
        penaltyStatus: d.penaltyStatus,
        minimumPayment: d.minimumPayment,
        totalPaidAmount: d.totalPaidAmount
      });
    });

    // 5. Register Savings Goals
    goals.forEach(g => {
      addGoal({
        name: g.name,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        category: g.category,
        targetDate: g.targetDate
      });
    });

    // 6. Automatically convert Fixed Monthly Expenses into Smart Calendar Bills!
    const expenseMapping = [
      { key: 'rent', label: 'Arriendo / Vivienda', category: 'hogar' },
      { key: 'services', label: 'Eservicios Públicos', category: 'servicios' },
      { key: 'internet', label: 'Fibra Óptica / Celular', category: 'servicios' },
      { key: 'subscriptions', label: 'Plataformas de streaming', category: 'suscripciones' },
      { key: 'studies', label: 'Educación / Cursos', category: 'estudio' },
      { key: 'health', label: 'Seguro Médico / Prepagada', category: 'otros' }
    ];

    expenseMapping.forEach((exp, idx) => {
      const amount = (fixedExpenses as any)[exp.key];
      if (amount > 0) {
        addReminder({
          title: exp.label,
          amount: amount,
          dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), paymentDay).toISOString().split('T')[0],
          isPaid: false,
          category: exp.category,
          recurring: 'monthly'
        });
      }
    });

    // 7. Save in Remote Database if connected
    if (isSupabaseConfigured && supabase) {
      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (user) {
          await supabase.from('profiles').upsert({
            id: user.id,
            name: finalProfile.name,
            nickname: finalProfile.nickname,
            currency: finalProfile.currency,
            onboarding_completed: true,
            salary_type: salaryFrequency,
            salary_amount: salaryAmount,
            payment_day: paymentDay,
            has_multiple_incomes: hasMultipleIncomes,
            extra_income_est: extraIncomeEstimated,
            fixed_expenses: fixedExpenses
          });
        }
      } catch (err) {
        console.error("No se pudo persistir perfil inicial en Supabase:", err);
      }
    }

    // 8. Turn off Onboarding, launch homepage!
    useFinanceStore.setState({ showOnboarding: false });
  };

  const currentSlideData = slides[slide];
  const SlideIcon = currentSlideData.icon;

  return (
    <div className="absolute inset-0 bg-[#050505] flex flex-col justify-between p-5 z-50 overflow-y-auto font-sans safe-pt safe-pb">
      
      {/* STEP PRE-FLOW: Welcome Carousel Slides */}
      {step === -1 && (
        <div className="flex-1 flex flex-col justify-between">
          {/* Top Frame */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-emerald-450 flex items-center justify-center ring-2 ring-indigo-500/30">
                <Coins className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-sm font-bold text-zinc-150">Serene Finance</span>
            </div>
            <button 
              onClick={resetToMockData}
              className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer px-3 py-1.5 rounded-full bg-[#0F0F11] border border-white/5 active:scale-95"
            >
              Saltar Demo
            </button>
          </div>

          {/* Carousel Body */}
          <div className="flex-1 flex flex-col justify-center my-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, x: 30, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center px-2"
              >
                <div className={`w-20 h-20 rounded-[28px] bg-gradient-to-tr ${currentSlideData.color} flex items-center justify-center shadow-lg ring-1 ring-white/10 mb-6`}>
                  <SlideIcon className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mb-2">
                  {currentSlideData.title}
                </h1>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-xs">
                  {currentSlideData.description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center space-x-1.5 mt-8">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${slide === i ? 'w-5 bg-indigo-500' : 'w-1.5 bg-zinc-800'}`}
                />
              ))}
            </div>
          </div>

          {/* Footer controls */}
          <div className="space-y-4 pb-2">
            <div className="flex space-x-3">
              {slide > 0 ? (
                <button
                  onClick={handlePrevSlide}
                  className="w-14 h-12 rounded-xl border border-white/5 bg-[#0F0F11] text-zinc-400 hover:text-white flex items-center justify-center active:scale-95 transition-transform"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              ) : null}
              <button
                onClick={handleNextSlide}
                className="flex-1 h-12 bg-indigo-650 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-1.5 active:scale-[0.98] transition-transform select-none cursor-pointer"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-zinc-650 text-center uppercase tracking-wider font-mono">
              Inspirado en Apple Wallet y Revolut Premium
            </p>
          </div>
        </div>
      )}

      {/* STEP 0: Authentication and Gateway */}
      {step === 0 && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-extrabold text-zinc-400 uppercase tracking-widest font-mono">Fase 1 de 6</span>
              <span className="text-xs text-zinc-500">Autenticación</span>
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-150 tracking-tight mt-3">Comencemos tu cuenta</h2>
            <p className="text-zinc-400 text-xs mt-1 leading-snug">
              Ingresa tus credenciales para sincronizar tus transacciones y balances en la nube en tiempo real.
            </p>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5 mt-6">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-zinc-550" />
                  <label className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-widest">Email Corporativo o Personal</label>
                </div>
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0F0F11] border border-white/5 rounded-xl px-3.5 py-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 transition-colors outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-zinc-550" />
                  <label className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-widest">Contraseña de Acceso</label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0F0F11] border border-white/5 rounded-xl pl-3.5 pr-10 py-3 text-xs text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 transition-colors outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start space-x-2.5">
                  <span className="text-xs text-rose-450 leading-relaxed">{authError}</span>
                </div>
              )}

              {/* Status Indicator */}
              <div className={`p-3 rounded-xl border flex items-center space-x-3 ${isSupabaseConfigured ? 'bg-indigo-500/5 border-indigo-500/15' : 'bg-zinc-800/20 border-white/5 opacity-80'}`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${isSupabaseConfigured ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                <p className="text-[10px] text-zinc-450 leading-tight">
                  {isSupabaseConfigured 
                    ? 'Soporte Supabase ACTIVO ☁️. Sincronización remota habilitada.' 
                    : 'Modo Local Sandbox Activado Seguro 🛡️. Tus datos se guardarán localmente.'}
                </p>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full bg-indigo-650 hover:bg-indigo-500 border border-indigo-500/20 text-white font-semibold text-xs py-3.5 rounded-xl flex items-center justify-center space-x-1.5 active:scale-[0.98] transition-all"
              >
                {isAuthenticating && <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin mr-1" />}
                <span>{isSignUp ? 'Crear Cuenta Fintech' : 'Ingresar con mi Cuenta'}</span>
              </button>
            </form>

            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-center w-full text-[10.5px] text-zinc-450 hover:text-zinc-300 block mt-4 font-semibold"
            >
              {isSignUp ? '¿Ya tienes una cuenta? Iniciar sesión' : '¿No tienes cuenta? Regístrate gratis'}
            </button>
          </div>

          <div className="space-y-4 pt-6">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-3 text-[9px] uppercase tracking-widest font-mono text-zinc-600">Alternativo</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <button
              onClick={handleLocalGuest}
              className="w-full bg-zinc-950 hover:bg-zinc-900 border border-white/5 text-zinc-330 hover:text-zinc-150 font-semibold text-xs py-3 rounded-xl transition-all active:scale-[0.98]"
            >
              Iniciar en Modo Offline Local (Sin Cuenta) 🛡️
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: Personal Profile setup */}
      {step === 1 && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-extrabold text-zinc-400 uppercase tracking-widest font-mono">Fase 2 de 6</span>
              <span className="text-xs text-zinc-500">¿Quién eres?</span>
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-150 tracking-tight mt-3">Identidad Financiera</h2>
            <p className="text-zinc-400 text-xs mt-1 leading-snug">
              Personaliza tu portal con tu nombre, avatar memoji favorito, moneda principal de cálculo y país de residencia.
            </p>

            <div className="mt-5 space-y-4">
              {/* Animated Avatar Selector Preview */}
              <div className="flex flex-col items-center">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${selectedGradient} flex items-center justify-center text-3xl shadow-lg ring-4 ring-white/10 relative transition-all`}>
                  <span>{selectedAvatarSeed}</span>
                  <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-emerald-500 rounded-full border-2 border-[#050505] flex items-center justify-center text-[10px] text-white">
                    ✓
                  </div>
                </div>
                
                {/* Seed Slider */}
                <div className="flex space-x-1.5 mt-3 max-w-full overflow-x-auto p-1.5 scrollbar-none">
                  {avatarSeeds.map(seed => (
                    <button
                      key={seed}
                      onClick={() => setSelectedAvatarSeed(seed)}
                      className={`w-9 h-9 rounded-full bg-zinc-900 border text-sm flex items-center justify-center transition-all cursor-pointer ${selectedAvatarSeed === seed ? 'border-indigo-500 scale-110 bg-zinc-800' : 'border-white/5 hover:border-zinc-700'}`}
                    >
                      {seed}
                    </button>
                  ))}
                </div>

                {/* Back Color Selector */}
                <div className="flex space-x-2 mt-2">
                  {gradientSeeds.map(g => (
                    <button
                      key={g.label}
                      onClick={() => setSelectedGradient(g.class)}
                      className={`w-4 h-4 rounded-full bg-gradient-to-tr ${g.class} border-2 ${selectedGradient === g.class ? 'border-indigo-405 ring-1 ring-indigo-500' : 'border-black'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Name fields */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Brandon Vides"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0F0F11] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-650 focus:border-indigo-500 transition-colors outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Apodo / Nombre Corto</label>
                  <input
                    type="text"
                    placeholder="Ej: Brandon"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full bg-[#0F0F11] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-650 focus:border-indigo-500 transition-colors outline-none"
                  />
                </div>

                {/* Country and Currency picker */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-widest font-mono">País Residente</label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => {
                        const code = e.target.value;
                        setSelectedCountry(code);
                        const mappedCurrency = countries.find(c => c.code === code)?.currency || '$';
                        setSelectedCurrency(mappedCurrency);
                      }}
                      className="w-full bg-[#0F0F11] border border-white/5 rounded-xl px-3.5 py-3 text-xs text-zinc-100 outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      {countries.map(c => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Divisa de Caja</label>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="w-full bg-[#0F0F11] border border-white/5 rounded-xl px-3.5 py-3 text-xs text-zinc-100 outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="$">Peso / Dólar ($)</option>
                      <option value="COP">COP ($)</option>
                      <option value="S/.">Soles (S/.)</option>
                      <option value="€">Euro (€)</option>
                      <option value="£">Libra (£)</option>
                      <option value="MXN">MXN ($)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => {
                if (!name) {
                  alert('Por favor ingresa tu nombre.');
                  return;
                }
                setStep(2); // Proceed to Income step
              }}
              className="w-full bg-indigo-650 hover:bg-indigo-550 text-white font-semibold text-xs py-3.5 rounded-xl flex items-center justify-center space-x-1 hover:shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
            >
              <span>Siguiente: Nómina e Ingresos</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Net Income & Salary Frequency */}
      {step === 2 && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-extrabold text-zinc-400 uppercase tracking-widest font-mono">Fase 3 de 6</span>
              <span className="text-xs text-zinc-500">¿De dónde viene tu dinero?</span>
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-150 tracking-tight mt-3">Sueldos y Flujos</h2>
            <p className="text-zinc-400 text-xs mt-1 leading-snug">
              Cuéntanos tu tipo de remuneración laboral para auto-programar los periodos financieros e iniciar con saldo real.
            </p>

            <div className="mt-5 space-y-4">
              {/* Selected salary type tab list */}
              <div className="space-y-1">
                <label className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Tipo de Nómina</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {[
                    { label: 'Mensual 🗓️', value: 'monthly' },
                    { label: 'Quincenal 📆', value: 'biweekly' },
                    { label: 'Semanal 🕒', value: 'weekly' },
                    { label: 'Ingresos Libres 📈', value: 'variable' }
                  ].map(item => (
                    <button
                      key={item.value}
                      onClick={() => setSalaryFrequency(item.value as any)}
                      type="button"
                      className={`py-3 text-center text-xs font-semibold rounded-xl border transition-all cursor-pointer ${salaryFrequency === item.value ? 'bg-indigo-650/15 border-indigo-500 text-indigo-400' : 'bg-[#0F0F11]/80 border-white/5 text-zinc-450 hover:border-zinc-700'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary Amount Input */}
              <div className="space-y-1">
                <label className="text-[9.5px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Monto Sueldo Neto / Nómina promedio</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 h-full text-zinc-500 text-xs font-bold font-mono">
                    {selectedCurrency}
                  </span>
                  <input
                    type="number"
                    value={salaryAmount}
                    onChange={(e) => setSalaryAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-[#0F0F11] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-150 font-mono focus:border-indigo-500 outline-none"
                    placeholder="Monto neto sin deudas"
                  />
                </div>
              </div>

              {/* Anchor dates scheduler */}
              <div className="p-3 bg-zinc-950/80 border border-white/5 rounded-xl space-y-2">
                <div className="flex items-center space-x-1 text-zinc-400">
                  <Briefcase className="w-4 h-4 text-indigo-455" />
                  <span className="text-[10.5px] font-bold">Fecha de Depósito de Nómina</span>
                </div>

                {salaryFrequency === 'monthly' && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-zinc-500">¿Qué día del mes te depositan?</p>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={paymentDay}
                      onChange={(e) => setPaymentDay(Math.max(1, Math.min(31, parseInt(e.target.value) || 1)))}
                      className="w-20 bg-black/40 border border-white/5 rounded-lg p-2 text-xs font-mono text-zinc-150 text-center focus:border-indigo-500"
                    />
                    <span className="text-[10px] text-zinc-600 block">Tu ciclo financiero reiniciará automáticamente el día {paymentDay} de cada mes.</span>
                  </div>
                )}

                {salaryFrequency === 'biweekly' && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-zinc-550">¿Qué días de cobro tienes? (Sueles cobrar dos veces al mes)</p>
                    <div className="flex space-x-2.5 items-center">
                      <div className="space-y-0.5">
                        <span className="text-[8.5px] uppercase font-mono text-zinc-600 block text-center">Primero</span>
                        <input
                          type="number"
                          min="1"
                          max="15"
                          value={paymentDay}
                          onChange={(e) => setPaymentDay(Math.max(1, Math.min(15, parseInt(e.target.value) || 15)))}
                          className="w-16 bg-black/40 border border-white/5 rounded-lg p-2 text-xs font-mono text-zinc-150 text-center"
                        />
                      </div>
                      <span className="text-zinc-600 text-xs font-bold">y el</span>
                      <div className="space-y-0.5">
                        <span className="text-[8.5px] uppercase font-mono text-zinc-600 block text-center">Segundo</span>
                        <input
                          type="number"
                          min="15"
                          max="31"
                          value={paymentDay2}
                          onChange={(e) => setPaymentDay2(Math.max(15, Math.min(31, parseInt(e.target.value) || 30)))}
                          className="w-16 bg-black/40 border border-white/5 rounded-lg p-2 text-xs font-mono text-zinc-150 text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {salaryFrequency === 'weekly' && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-zinc-550">Día de cobro de la semana:</p>
                    <select
                      value={paymentDayWeekly}
                      onChange={(e) => setPaymentDayWeekly(parseInt(e.target.value))}
                      className="bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-zinc-150 outline-none"
                    >
                      <option value="1">Lunes</option>
                      <option value="2">Martes</option>
                      <option value="3">Miércoles</option>
                      <option value="4">Jueves</option>
                      <option value="5">Viernes 🕒</option>
                      <option value="6">Sábado</option>
                      <option value="7">Domingo</option>
                    </select>
                  </div>
                )}

                {salaryFrequency === 'variable' && (
                  <p className="text-[10px] text-zinc-600 leading-normal">
                    Tus ciclos se calcularán mensualmente por defecto (Día 30/31). Te ayudaremos a optimizar tu flujo irregular de caja para evitar sobregiros de pasivos.
                  </p>
                )}
              </div>

              {/* Extra incomes toggler */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2.5 cursor-pointer py-1 select-none">
                  <input
                    type="checkbox"
                    checked={hasMultipleIncomes}
                    onChange={(e) => setHasMultipleIncomes(e.target.checked)}
                    className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                  />
                  <span className="text-xs text-zinc-300 font-semibold leading-none">Tengo ingresos adicionales / Freelance</span>
                </label>

                {hasMultipleIncomes && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-1 pr-1"
                  >
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Monto Neto Estimado mensual extra</label>
                    <div className="relative">
                      <span className="absolute left-4 top-2.5 text-zinc-550 text-xs font-bold font-mono">
                        {selectedCurrency}
                      </span>
                      <input
                        type="number"
                        value={extraIncomeEstimated}
                        onChange={(e) => setExtraIncomeEstimated(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-[#0F0F11] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-155 font-mono focus:border-indigo-500 outline-none"
                        placeholder="Ej: Rentas, Freelancing, Diseños"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-6">
            <button
              onClick={() => setStep(1)}
              className="w-14 h-12 rounded-xl border border-white/5 bg-[#0F0F11] text-zinc-400 hover:text-white flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (salaryAmount <= 0) {
                  alert('Por favor agrega un monto neto de sueldos.');
                  return;
                }
                setStep(3); // Proceed to liabilities config
              }}
              className="flex-1 h-12 bg-indigo-650 hover:bg-indigo-550 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-1 active:scale-[0.98] transition-transform select-none cursor-pointer"
            >
              <span>Continuar: Deudas y Préstamos</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Debt Ledger & Liabilities Setup */}
      {step === 3 && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-extrabold text-zinc-400 uppercase tracking-widest font-mono">Fase 4 de 6</span>
              <span className="text-xs text-zinc-500">¿Cuáles son tus pasivos?</span>
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-150 tracking-tight mt-3">Registro de Deudas</h2>
            <p className="text-zinc-400 text-xs mt-1 leading-snug">
              ¿Tienes microcréditos activos (Addi, Sistecrédito), deudas de estudios, tarjetas de crédito, de autos o de libre inversión? Regístralas para vigilar su pago.
            </p>

            {/* Debts summary slider or dynamic display */}
            <div className="mt-4 space-y-3.5 max-h-[340px] overflow-y-auto pr-1">
              {debts.length === 0 ? (
                <div className="border border-dashed border-white/5 bg-[#0F0F11]/30 p-5 rounded-2xl text-center space-y-1 cursor-all-scroll select-none">
                  <p className="text-xs text-zinc-550 font-semibold uppercase font-sans">No has agregado deudas 🎉</p>
                  <p className="text-[10px] text-zinc-600 max-w-xs mx-auto">
                    Si no tienes pasivos o quieres agregarlas luego en la app, puedes saltar directo al siguiente paso.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono tracking-widest block">Tus deudas configuradas ({debts.length}):</span>
                  {debts.map(d => (
                    <div key={d.id} className="bg-gradient-to-tr from-[#131317] via-[#0E0E12] to-black border border-white/5 p-3 rounded-xl flex items-center justify-between shadow-md">
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-zinc-200 truncate">{d.entity} • {d.name}</span>
                          <span className="text-[8.5px] uppercase py-0.5 px-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono font-bold rounded-full">
                            {d.type.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-[9.5px] font-mono text-zinc-500 block mt-0.5">
                          Saldo: <span className="font-semibold text-zinc-350">{selectedCurrency}{d.remainingAmount.toLocaleString()}</span> • Cuota: <span className="font-semibold text-zinc-350">{selectedCurrency}{d.monthlyPayment.toLocaleString()}</span>
                        </span>
                      </div>
                      <button 
                        onClick={() => removeDebtFromList(d.id)}
                        className="p-1 rounded-lg bg-[#0F0F11] hover:bg-rose-500/15 border border-white/5 hover:border-rose-500/20 text-zinc-500 hover:text-rose-455 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] text-amber-400 font-medium">
                    ⚠️ Total pasivo mensual de deudas comprometido: <span className="font-bold font-mono">{selectedCurrency}{totalDebtsMonthlyInstallment.toLocaleString()}</span>.
                  </div>
                </div>
              )}

              {/* Toggle new debt form */}
              {!isAddingDebt ? (
                <button
                  type="button"
                  onClick={() => setIsAddingDebt(true)}
                  className="w-full h-11 border border-dashed border-zinc-800 bg-zinc-950/20 hover:bg-[#0F0F11] text-[#7C8290] hover:text-zinc-200 text-xs font-semibold rounded-xl flex items-center justify-center space-s-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-indigo-405 mr-1" />
                  <span>Configurar una Deuda</span>
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-[#0F0F11] border border-zinc-850 rounded-2xl space-y-3 shadow-lg"
                >
                  <h4 className="text-xs font-extrabold text-[#7C8290] uppercase tracking-widest flex items-center">
                    <Plus className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                    Nueva Deuda o Crédito
                  </h4>

                  <div className="grid grid-cols-2 gap-2.5 col-span-2">
                    <div className="space-y-1">
                      <label className="text-[8.5px] uppercase font-bold text-zinc-500">¿Quién te prestó? (Entidad)</label>
                      <input
                        type="text"
                        placeholder="Ej: Bancolombia, Addi, Lulo"
                        value={newDebtEntity}
                        onChange={(e) => setNewDebtEntity(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-lg p-2.5 text-xs text-zinc-150 outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8.5px] uppercase font-bold text-zinc-500">Nombre de la Deuda</label>
                      <input
                        type="text"
                        placeholder="Ej: Tarjeta Crédito, Préstamo"
                        value={newDebtName}
                        onChange={(e) => setNewDebtName(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-lg p-2.5 text-xs text-zinc-150 outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[8.5px] uppercase font-bold text-zinc-500">Tipo de Pasivo</label>
                      <select
                        value={newDebtType}
                        onChange={(e) => setNewDebtType(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-zinc-150 outline-none"
                      >
                        <option value="credit_card">Tarjeta Crédito 💳</option>
                        <option value="addi">Addi Cupo ⚡</option>
                        <option value="sistecrédito">Sistecrédito 📦</option>
                        <option value="loan">Préstamo Bancario 🏦</option>
                        <option value="study">Crédito de Estudios 🎓</option>
                        <option value="vehicle">Vehículo / Moto 🏍️</option>
                        <option value="personal">Préstamo Personal 🤝</option>
                        <option value="cooperative">Cooperativa / Caja 🏦</option>
                        <option value="other">Otros Pasivos 📱</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8.5px] uppercase font-bold text-zinc-500">Interés anual (%)</label>
                      <input
                        type="number"
                        placeholder="Ej: 19.9"
                        value={newDebtInterest}
                        onChange={(e) => setNewDebtInterest(parseFloat(e.target.value) || 0)}
                        className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-zinc-150 font-mono outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8.5px] uppercase font-bold text-zinc-500">Saldo Odo ({selectedCurrency})</label>
                      <input
                        type="number"
                        value={newDebtAmount}
                        onChange={(e) => setNewDebtAmount(parseFloat(e.target.value) || 0)}
                        className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-zinc-150 font-mono outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8.5px] uppercase font-bold text-zinc-500">Cuota ({selectedCurrency})</label>
                      <input
                        type="number"
                        value={newDebtCuota}
                        onChange={(e) => setNewDebtCuota(parseFloat(e.target.value) || 0)}
                        className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-zinc-150 font-mono outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8.5px] uppercase font-bold text-zinc-500">Financ. (cuotas)</label>
                      <input
                        type="number"
                        value={newDebtInstallments}
                        onChange={(e) => setNewDebtInstallments(parseInt(e.target.value) || 12)}
                        className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-zinc-150 font-mono outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingDebt(false)}
                      className="flex-1 py-2 rounded-xl bg-black/20 hover:bg-black/40 border border-white/5 text-[11px] font-semibold text-zinc-500 hover:text-zinc-350 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={addDebtToList}
                      className="flex-1 py-2 rounded-xl bg-indigo-650 hover:bg-indigo-550 border border-indigo-500/20 text-[11px] font-bold text-white cursor-pointer"
                    >
                      Aceptar y Listar
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex space-x-3 pt-6">
            <button
              onClick={() => setStep(2)}
              className="w-14 h-12 rounded-xl border border-white/5 bg-[#0F0F11] text-zinc-400 hover:text-white flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setStep(4)} // Forward to Fixed costs
              className="flex-1 h-12 bg-indigo-650 hover:bg-indigo-550 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-1 active:scale-[0.98] transition-transform select-none cursor-pointer"
            >
              <span>Siguiente: Gastos Fijos Mensuales</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Fixed Monthly Expenses */}
      {step === 4 && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-extrabold text-zinc-400 uppercase tracking-widest font-mono">Fase 5 de 6</span>
              <span className="text-xs text-zinc-500">¿Qué gastos fijos asumes?</span>
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-150 tracking-tight mt-3">Gastos Fijos</h2>
            <p className="text-zinc-400 text-xs mt-1 leading-snug">
              Configura tus desembolsos necesarios de cada mes. Al finalizar, los convertiremos automáticamente en recordatorios de pago.
            </p>

            <div className="mt-4 space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {[
                { key: 'rent', label: 'Arriendo / Hipoteca 🏠', max: 3000000, step: 50000 },
                { key: 'food', label: 'Alimentación / Compras 🍎', max: 1500000, step: 20000 },
                { key: 'services', label: 'Servicios Públicos (Luz/Agua) ⚡', max: 500000, step: 10000 },
                { key: 'transport', label: 'Transporte / Gasolina 🚗', max: 600000, step: 10000 },
                { key: 'internet', label: 'Internet y Celular 🌐', max: 200000, step: 5000 },
                { key: 'studies', label: 'Educación / Cursos 🎓', max: 1000000, step: 20000 },
                { key: 'subscriptions', label: 'Suscripciones / Streaming 📺', max: 100000, step: 2000 },
                { key: 'health', label: 'Medicina Prepagada / Salud 🧪', max: 400000, step: 10000 }
              ].map(item => (
                <div key={item.key} className="space-y-1 bg-[#0F0F11]/40 border border-white/5 p-3 rounded-xl shadow-inner select-none">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-zinc-335">{item.label}</span>
                    <span className="font-bold font-mono text-indigo-400">
                      {selectedCurrency}{(fixedExpenses as any)[item.key].toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 mt-1.5">
                    <input
                      type="range"
                      min="0"
                      max={item.max}
                      step={item.step}
                      value={(fixedExpenses as any)[item.key]}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setFixedExpenses(prev => ({ ...prev, [item.key]: val }));
                      }}
                      className="flex-1 accent-indigo-500 rounded-lg cursor-pointer h-1.5 bg-zinc-900"
                    />
                    <input
                      type="number"
                      value={(fixedExpenses as any)[item.key]}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        setFixedExpenses(prev => ({ ...prev, [item.key]: val }));
                      }}
                      className="w-16 bg-black border border-white/5 rounded-md p-1.5 text-[11px] font-semibold text-center text-zinc-200 font-mono outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
              <div className="sky-panel p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs rounded-xl flex justify-between font-bold items-center">
                <span>TOTAL GASTOS FIJOS FIJOS:</span>
                <span className="font-mono text-sm leading-none">{selectedCurrency}{totalFixedExpensesSum.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex space-x-3 pt-6">
            <button
              onClick={() => setStep(3)}
              className="w-14 h-12 rounded-xl border border-white/5 bg-[#0F0F11] text-zinc-400 hover:text-white flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setStep(5)} // Proceed to goals
              className="flex-1 h-12 bg-indigo-650 hover:bg-indigo-550 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-1 active:scale-[0.98] transition-transform select-none cursor-pointer"
            >
              <span>Siguiente: Metas de Ahorro</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Savings Goals Setup */}
      {step === 5 && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-extrabold text-zinc-400 uppercase tracking-widest font-mono">Fase 6 de 6</span>
              <span className="text-xs text-zinc-500">¿Qué planeas ahorrar?</span>
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-150 tracking-tight mt-3">Anhelos y Metas</h2>
            <p className="text-zinc-400 text-xs mt-1 leading-snug">
              Crea tu primer fondo estructurado para compras u objetivos de mediano plazo. Te ayudaremos a apartarlo de tu caja de ocio.
            </p>

            <div className="mt-4 space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
              {goals.length === 0 ? (
                <div className="border border-dashed border-white/5 bg-[#0F0F11]/30 p-5 rounded-2xl text-center space-y-1">
                  <p className="text-xs text-zinc-550 font-semibold uppercase font-sans">No has añadido metas de ahorro</p>
                  <p className="text-[10px] text-zinc-600 max-w-xs mx-auto">
                    Añade un fondo voluntario (Ej: Fondo de emergencia, Moto) para potenciar tu salud de ahorro.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono tracking-widest block">Tus metas de ahorro listas ({goals.length}):</span>
                  {goals.map(g => (
                    <div key={g.id} className="bg-[#0F0F11] border border-white/5 p-3 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="text-left">
                        <div className="flex space-x-1.5 items-center">
                          <span className="text-xs font-bold text-zinc-200">{g.name}</span>
                          <span className="text-[8.5px] uppercase px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold rounded-full font-mono">
                            {g.category}
                          </span>
                        </div>
                        <span className="text-[9.5px] font-mono text-zinc-500 block mt-0.5">
                          Monto objetivo: <span className="font-semibold text-zinc-350">{selectedCurrency}{g.targetAmount.toLocaleString()}</span> • Meta: {g.targetDate}
                        </span>
                      </div>
                      <button 
                        onClick={() => removeGoalFromList(g.id)}
                        className="p-1 rounded-lg bg-[#0F0F11] hover:bg-rose-500/10 border border-white/5 text-zinc-550 hover:text-rose-455 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Form add goals */}
              {!isAddingGoal ? (
                <button
                  type="button"
                  onClick={() => setIsAddingGoal(true)}
                  className="w-full h-11 border border-dashed border-zinc-800 bg-zinc-950/10 hover:bg-[#0F0F11] text-[#7C8290] hover:text-zinc-200 text-xs font-semibold rounded-xl flex items-center justify-center space-s-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-indigo-405 mr-1" />
                  <span>Configurar una Meta de Ahorro</span>
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-[#0F0F11] border border-zinc-850 rounded-2xl space-y-3.5 shadow-lg"
                >
                  <h4 className="text-xs font-extrabold text-[#7C8290] uppercase tracking-widest flex items-center">
                    <Plus className="w-3.5 h-3.5 mr-1 text-indigo-400 animate-pulse" />
                    Crear Meta Vocacional
                  </h4>

                  <div className="space-y-1">
                    <label className="text-[8.5px] uppercase font-bold text-zinc-500">¿Qué planeas adquirir / ahorrar?</label>
                    <input
                      type="text"
                      placeholder="Ej: Viaje a Japón, Fondo de Emergencia"
                      value={newGoalName}
                      onChange={(e) => setNewGoalName(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-zinc-150 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[8.5px] uppercase font-bold text-zinc-500">Categoría</label>
                      <select
                        value={newGoalCategory}
                        onChange={(e) => setNewGoalCategory(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-zinc-150 outline-none cursor-pointer"
                      >
                        <option value="ahorro">Ahorro Programado 🪙</option>
                        <option value="viaje">Viajes ✈️</option>
                        <option value="moto">Vehículos / Moto 🏍️</option>
                        <option value="computador">Tecnología / Computadores 💻</option>
                        <option value="emergencia">Fondo de Emergencia 🛡️</option>
                        <option value="inversion">Inversión Futura 📈</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8.5px] uppercase font-bold text-zinc-500">Monto del Objetivo</label>
                      <input
                        type="number"
                        placeholder="Monto total del plan"
                        value={newGoalAmount}
                        onChange={(e) => setNewGoalAmount(parseFloat(e.target.value) || 0)}
                        className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-zinc-150 font-mono outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8.5px] uppercase font-bold text-zinc-500">Fecha Límite Estimada</label>
                    <input
                      type="date"
                      value={newGoalDate}
                      onChange={(e) => setNewGoalDate(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-zinc-150 outline-none cursor-pointer"
                    />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingGoal(false)}
                      className="flex-1 py-1.5 rounded-lg bg-black/20 hover:bg-black/35 border border-white/5 text-[10.5px] font-semibold text-zinc-500 hover:text-zinc-350 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={addGoalToList}
                      className="flex-1 py-1.5 rounded-lg bg-indigo-650 hover:bg-indigo-550 border border-indigo-500/20 text-[10.5px] font-bold text-white cursor-pointer"
                    >
                      Aceptar
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Action flow buttons */}
          <div className="flex space-x-3 pt-6">
            <button
              onClick={() => setStep(4)}
              className="w-14 h-12 rounded-xl border border-white/5 bg-[#0F0F11] text-zinc-400 hover:text-white flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setStep(6)} // Proceed to Underwriting/Scorecard
              className="flex-1 h-12 bg-indigo-650 hover:bg-indigo-550 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-1 active:scale-[0.98] transition-transform select-none cursor-pointer"
            >
              <span>Siguiente: Score Diagnóstico Personal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: AI Underwriting Scorecard & Final Summary */}
      {step === 6 && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-extrabold text-indigo-405 uppercase tracking-widest font-mono">Última Fase</span>
              <span className="text-xs text-zinc-500">SaaS AI Underwriting Score</span>
            </div>
            
            <h2 className="text-xl font-extrabold text-zinc-150 tracking-tight mt-3">Análisis Coach Financiero</h2>
            <p className="text-zinc-400 text-xs mt-1 leading-snug">
              Nuestro algoritmo analizó tus flujos, deudas e ingresos brutos para entregarte tu diagnóstico óptimo de caja.
            </p>

            <div className="mt-4.5 space-y-4 max-h-[360px] overflow-y-auto pr-1">
              
              {/* Financial Traffic Light assessment card */}
              <div className="bg-[#0F0F11] border border-white/5 p-4 rounded-2xl space-y-3.5 shadow-md select-none">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1.5">
                    <Scale className="w-4.5 h-4.5 text-indigo-400" />
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Tu Evaluación de Riesgo:</span>
                  </div>
                  <span className={`text-[10px] uppercase font-extrabold border py-1 px-2.5 rounded-full ${currentRisk.color}`}>
                    {currentRisk.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 bg-black/40 border border-white/5 rounded-xl">
                    <span className="text-[8.5px] uppercase font-mono text-zinc-505 block">Riesgo Pasivo (RDI)</span>
                    <span className="text-sm font-bold font-mono text-rose-400 block mt-1">{debtToIncomeRatio}%</span>
                  </div>
                  <div className="p-2.5 bg-black/40 border border-white/5 rounded-xl">
                    <span className="text-[8.5px] uppercase font-mono text-zinc-550 block">Capacidad de Ahorro</span>
                    <span className="text-sm font-bold font-mono text-[#4ade80] block mt-1">{savingsPotentialRatio}%</span>
                  </div>
                </div>

                <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                  <p className="text-[10.5px] text-zinc-300 font-sans leading-relaxed">
                    💡 <span className="font-bold">Análisis Coach:</span> {currentRisk.note} {currentRisk.tips}
                  </p>
                </div>
              </div>

              {/* Recommended budget blueprint panel */}
              <div className="bg-[#0F0F11] border border-white/5 p-4 rounded-xl space-y-2.5 select-none">
                <div className="flex items-center space-x-1 text-zinc-305 font-bold text-xs uppercase tracking-wider">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span>Tu Planificación del Disponible</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  Basado en la regla 50/30/20 y tus compromisos recurrentes cargados:
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10.5px] text-zinc-400 font-mono">
                    <span>Ingresos Esperados Totales:</span>
                    <span className="text-zinc-200 font-bold">{selectedCurrency}{calculatedGrossIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10.5px] text-zinc-400 font-mono">
                    <span>(-) Gastos de Vivienda y Servicios Fijos:</span>
                    <span className="text-rose-405 font-medium">-{selectedCurrency}{totalFixedExpensesSum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10.5px] text-zinc-400 font-mono">
                    <span>(-) Cuotas de Préstamos y Deudas:</span>
                    <span className="text-rose-405 font-medium">-{selectedCurrency}{totalDebtsMonthlyInstallment.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/5 pt-2 flex justify-between text-xs font-bold text-zinc-300">
                    <span>Efectivo Real Libre de Ciclo:</span>
                    <span className={expectedFreeCash < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                      {selectedCurrency}{expectedFreeCash.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Auto setups notices */}
              <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl space-y-1 text-left">
                <span className="text-[9px] uppercase font-bold text-indigo-400 font-mono tracking-widest block">🔧 AUTOMATIZACIONES COMPLETADAS:</span>
                <p className="text-[10.5px] text-zinc-400 leading-snug">
                  • Tu ciclo iniciará el día <span className="font-semibold text-zinc-333">{paymentDay}</span> de cada mes.<br />
                  • Se han catalogado <span className="font-semibold text-zinc-333">{debts.length}</span> deudas y se les asignó fecha de pago mensual automática.<br />
                  • Tus costos recurrentes se tradujeron en recordatorios interactivos en tu calendario financiero.
                </p>
              </div>

            </div>
          </div>

          {/* Siguiente trigger */}
          <div className="flex space-x-3 pt-6">
            <button
              onClick={() => setStep(5)}
              className="w-14 h-12 rounded-xl border border-white/5 bg-[#0F0F11] text-zinc-400 hover:text-white flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleFinishOnboarding}
              className="flex-1 h-12 bg-indigo-650 hover:bg-indigo-550 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-1.5 active:scale-[0.98] transition-transform select-none cursor-pointer"
            >
              <span>Activar Portal Financiero Premium</span>
              <Check className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
