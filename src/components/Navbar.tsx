/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFinanceStore } from '../store/financeStore';
import { 
  Home, 
  WalletCards, 
  PercentSquare, 
  PiggyBank, 
  Sparkles, 
  Settings,
  CalendarDays
} from 'lucide-react';

export default function Navbar() {
  const { billReminders } = useFinanceStore();
  const navigate = useNavigate();
  const location = useLocation();

  const unpaidReminderCount = billReminders.filter(r => !r.isPaid).length;

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/' || path === '/home') return 'home';
    return path.replace('/', '');
  };

  const activeTab = getActiveTab();

  const navItems = [
    { id: 'home' as const, path: '/', label: 'Inicio', icon: Home },
    { id: 'transactions' as const, path: '/transactions', label: 'Billetera', icon: WalletCards },
    { id: 'debts' as const, path: '/debts', label: 'Deudas', icon: PercentSquare },
    { id: 'goals' as const, path: '/goals', label: 'Metas', icon: PiggyBank },
    { id: 'analytics' as const, path: '/analytics', label: 'IA Coach', icon: Sparkles, badge: true },
    { id: 'settings' as const, path: '/settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <div className="w-full h-[72px] bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900 px-3 flex items-center justify-around select-none shrink-0 z-40 relative">
      
      {/* Background container glow */}
      <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center flex-1 h-full relative cursor-pointer group"
          >
            {/* Animated Active Pill Indicator */}
            {isActive && (
              <div 
                className="absolute top-1 w-8 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              />
            )}

            {/* Custom Icon wrapper with active transitions */}
            <div 
              className={`p-2 rounded-xl transition-all duration-200 relative ${
                isActive 
                  ? 'text-indigo-400 scale-110' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className="w-[21px] h-[21px]" />

              {/* Dynamic Notification Dots */}
              {item.badge && unpaidReminderCount > 0 && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-zinc-950 animate-pulse" />
              )}
            </div>

            {/* Font Label */}
            <span 
              className={`text-[10px] font-sans font-medium tracking-tight mt-0.5 transition-all duration-200 ${
                isActive 
                  ? 'text-zinc-200 font-bold' 
                  : 'text-zinc-500 group-hover:text-zinc-400'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
