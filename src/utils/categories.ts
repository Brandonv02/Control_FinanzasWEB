/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Building2, 
  Car, 
  Utensils, 
  BookOpen, 
  Tv, 
  HeartPulse, 
  ShoppingBag, 
  Wifi, 
  CircleDot, 
  Briefcase, 
  TrendingUp, 
  Palette, 
  LineChart, 
  PiggyBank,
  Smartphone,
  Flame,
  Award
} from 'lucide-react';

export interface CategoryInfo {
  id: string;
  label: string;
  iconName: string;
  color: string; // Tailwind hex color
  bgColor: string; // Tailwind bg color class
  textColor: string; // Tailwind text class
}

export const EXPENSE_CATEGORIES: CategoryInfo[] = [
  { id: 'comida', label: 'Alimentación', iconName: 'Utensils', color: '#EF4444', bgColor: 'bg-red-50/10 dark:bg-red-950/20', textColor: 'text-red-600 dark:text-red-400' },
  { id: 'transporte', label: 'Transporte', iconName: 'Car', color: '#F59E0B', bgColor: 'bg-amber-50/10 dark:bg-amber-950/20', textColor: 'text-amber-600 dark:text-amber-400' },
  { id: 'estudio', label: 'Estudio & Cursos', iconName: 'BookOpen', color: '#10B981', bgColor: 'bg-emerald-50/10 dark:bg-emerald-950/20', textColor: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'entretenimiento', label: 'Entretenimiento', iconName: 'Award', color: '#8B5CF6', bgColor: 'bg-violet-50/10 dark:bg-violet-950/20', textColor: 'text-violet-600 dark:text-violet-400' },
  { id: 'suscripciones', label: 'Suscripciones', iconName: 'Tv', color: '#EC4899', bgColor: 'bg-pink-50/10 dark:bg-pink-950/20', textColor: 'text-pink-600 dark:text-pink-400' },
  { id: 'hogar', label: 'Vivienda & Hogar', iconName: 'Building2', color: '#3B82F6', bgColor: 'bg-blue-50/10 dark:bg-blue-950/20', textColor: 'text-blue-600 dark:text-blue-400' },
  { id: 'salud', label: 'Salud & Bienestar', iconName: 'HeartPulse', color: '#14B8A6', bgColor: 'bg-teal-50/10 dark:bg-teal-950/20', textColor: 'text-teal-600 dark:text-teal-400' },
  { id: 'compras', label: 'Compras & Ropa', iconName: 'ShoppingBag', color: '#6366F1', bgColor: 'bg-indigo-50/10 dark:bg-indigo-950/20', textColor: 'text-indigo-600 dark:text-indigo-400' },
  { id: 'servicios', label: 'Servicios Públicos', iconName: 'Wifi', color: '#06B6D4', bgColor: 'bg-cyan-50/10 dark:bg-cyan-950/20', textColor: 'text-cyan-600 dark:text-cyan-400' },
  { id: 'otros', label: 'Otros Gastos', iconName: 'CircleDot', color: '#6B7280', bgColor: 'bg-gray-50/10 dark:bg-gray-950/20', textColor: 'text-gray-600 dark:text-gray-400' }
];

export const INCOME_CATEGORIES: CategoryInfo[] = [
  { id: 'salario', label: 'Salario Fijo', iconName: 'Briefcase', color: '#10B981', bgColor: 'bg-emerald-50/10 dark:bg-emerald-950/20', textColor: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'freelancing', label: 'Trabajo Freelance', iconName: 'Palette', color: '#3B82F6', bgColor: 'bg-blue-50/10 dark:bg-blue-950/20', textColor: 'text-blue-600 dark:text-blue-400' },
  { id: 'negocios', label: 'Emprendimientos', iconName: 'Flame', color: '#F59E0B', bgColor: 'bg-amber-50/10 dark:bg-amber-950/20', textColor: 'text-amber-600 dark:text-amber-400' },
  { id: 'inversiones', label: 'Inversiones y Dividendos', iconName: 'LineChart', color: '#8B5CF6', bgColor: 'bg-violet-50/10 dark:bg-violet-950/20', textColor: 'text-violet-600 dark:text-violet-400' },
  { id: 'otros_ingresos', label: 'Otros Ingresos', iconName: 'TrendingUp', color: '#EC4899', bgColor: 'bg-pink-50/10 dark:bg-pink-950/20', textColor: 'text-pink-600 dark:text-pink-400' }
];

// Helper mapping to render correct Lucide icons dynamically 
export const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Utensils': return Utensils;
    case 'Car': return Car;
    case 'BookOpen': return BookOpen;
    case 'Tv': return Tv;
    case 'Building2': return Building2;
    case 'HeartPulse': return HeartPulse;
    case 'ShoppingBag': return ShoppingBag;
    case 'Wifi': return Wifi;
    case 'Briefcase': return Briefcase;
    case 'Palette': return Palette;
    case 'LineChart': return LineChart;
    case 'TrendingUp': return TrendingUp;
    case 'PiggyBank': return PiggyBank;
    case 'Smartphone': return Smartphone;
    case 'Flame': return Flame;
    case 'Award': return Award;
    default: return CircleDot;
  }
};

export const getCategoryDetails = (id: string, type: 'income' | 'expense'): CategoryInfo => {
  const cats = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  return cats.find(c => c.id === id) || {
    id: 'otros',
    label: 'Otros',
    iconName: 'CircleDot',
    color: '#6B7280',
    bgColor: 'bg-gray-50/10 dark:bg-gray-950/20',
    textColor: 'text-gray-600 dark:text-gray-400'
  };
};

export const formatCurrency = (amount: number, symbol: string = '$'): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: symbol === '$' ? 'COP' : symbol === '€' ? 'EUR' : symbol === '£' ? 'GBP' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount).replace('COP', symbol).replace('EUR', symbol).replace('GBP', symbol).replace('USD', symbol);
};
