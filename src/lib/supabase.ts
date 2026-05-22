/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// Validate configured variables (ensuring they start with http/https and aren't default placeholder templates or stringified undefs)
const isValidHttpUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('http://') || url.startsWith('https://');
};

export const isSupabaseConfigured = 
  !!supabaseUrl && 
  !!supabaseAnonKey && 
  isValidHttpUrl(supabaseUrl) &&
  supabaseUrl !== 'https://your-project-id.supabase.co' && 
  supabaseAnonKey !== 'your-anon-api-key' &&
  supabaseUrl !== 'undefined' &&
  supabaseAnonKey !== 'undefined';

let client = null;
if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
  }
}

export const supabase = client;

// Types for Supabase tables schema for documentation and safety
export interface SupabaseProfile {
  id: string;
  name: string;
  nickname?: string;
  avatar_url?: string;
  country?: string;
  currency: string;
  onboarding_completed: boolean;
  salary_type: 'monthly' | 'biweekly' | 'weekly' | 'variable';
  salary_amount: number;
  payment_day: number;
  payment_day2?: number;
  has_multiple_incomes: boolean;
  extra_income_est: number;
  fixed_expenses: {
    rent: number;
    food: number;
    services: number;
    transport: number;
    internet: number;
    subscriptions: number;
    studies: number;
    health: number;
    others: number;
  };
  created_at?: string;
}
