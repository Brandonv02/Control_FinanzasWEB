/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface IPhoneContainerProps {
  children: React.ReactNode;
}

export default function IPhoneContainer({ children }: IPhoneContainerProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // first hour should be 12
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#050505] dark:bg-[#050505] flex flex-col items-center justify-center p-0 md:p-6 overflow-hidden relative">
      
      {/* Background ambient lighting glow */}
      <div className="hidden md:block absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Responsive iPhone 15 Pro Wrapper: fluid 100% on mobile, formatted device on desktop */}
      <div id="iphone-device" className="relative w-full h-[100dvh] md:h-[880px] md:max-h-[880px] md:max-w-[430px] bg-white dark:bg-[#0A0A0A] md:rounded-[56px] md:border-[10px] md:border-white/5 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden md:ring-1 md:ring-white/5 transition-all duration-300">
        
        {/* Dynamic Island Notch on Desktop */}
        <div className="hidden md:absolute md:top-3 md:left-1/2 md:-translate-x-1/2 md:w-32 md:h-8 md:bg-black md:rounded-full md:z-50 md:flex md:items-center md:justify-center md:transition-all md:duration-300 hover:md:w-36">
          <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full absolute left-4" />
          <div className="w-1.5 h-1.5 bg-indigo-900/40 rounded-full absolute right-6 animate-pulse" />
        </div>

        {/* Status Bar (Humble UX indicator) - Only on desktop emulator */}
        <div className="hidden md:flex w-full h-11 bg-zinc-100 dark:bg-[#0A0A0A]/80 backdrop-blur-md px-6 items-center justify-between text-[13px] font-sans font-medium text-zinc-800 dark:text-zinc-300 select-none z-40 shrink-0">
          {/* Time */}
          <div className="flex items-center space-x-1">
            <span className="font-mono text-xs">{time || '09:41 AM'}</span>
          </div>

          {/* Device indicators right */}
          <div className="flex items-center space-x-2 text-zinc-500 dark:text-zinc-300">
            <Signal className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold font-mono tracking-tight text-emerald-500 dark:text-emerald-400">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center space-x-0.5">
              <span className="text-[9px] font-mono font-bold text-zinc-500 dark:text-zinc-400 mr-0.5">94%</span>
              <Battery className="w-4 h-4 text-emerald-500 dark:text-emerald-400 rotate-0 fill-current" />
            </div>
          </div>
        </div>

        {/* Active viewport of our app */}
        <div className="w-full flex-1 flex flex-col overflow-hidden relative bg-zinc-50 dark:bg-[#050505]">
          {children}
        </div>

        {/* iOS Home Indicator Bar - Only on desktop emulator */}
        <div className="hidden md:flex w-full h-6 bg-zinc-100/40 dark:bg-[#050505]/40 items-center justify-center shrink-0 pb-1 z-40 select-none">
          <div className="w-36 h-1.5 bg-zinc-400 dark:bg-zinc-800/85 rounded-full hover:bg-zinc-700 cursor-pointer" />
        </div>

      </div>

      {/* Small subtle installation footer on desktop */}
      <p className="hidden md:block mt-4 text-xs font-sans text-zinc-500 text-center tracking-wide select-none">
        Optimizado Mobile First • Abre este preview en tu teléfono para instalar la PWA
      </p>
    </div>
  );
}
