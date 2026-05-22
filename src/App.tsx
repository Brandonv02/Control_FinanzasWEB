/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useFinanceStore } from './store/financeStore';
import { ThemeProvider } from './context/ThemeContext';
import IPhoneContainer from './components/IPhoneContainer';
import Onboarding from './components/Onboarding';
import Navbar from './components/Navbar';
import Modals from './components/Modals';

// Page imports
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import DebtsPage from './pages/DebtsPage';
import GoalsPage from './pages/GoalsPage';
import AICoachPage from './pages/AICoachPage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const { showOnboarding } = useFinanceStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Modal active trigger states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'transaction' | 'debt' | 'goal' | 'reminder'>('transaction');

  const handleOpenModal = (type: 'transaction' | 'debt' | 'goal' | 'reminder') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // If user hasn't setup name and currency - slide in beautiful Onboarding Carousel!
  if (showOnboarding) {
    return <Onboarding />;
  }

  return (
    <div className="absolute inset-0 flex flex-col justify-between overflow-hidden">
      
      {/* Scrollable active view container */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <Routes>
          <Route path="/" element={<Dashboard onOpenModal={handleOpenModal} />} />
          <Route path="/home" element={<Dashboard onOpenModal={handleOpenModal} />} />
          <Route path="/transactions" element={<TransactionsPage onOpenModal={handleOpenModal} />} />
          <Route path="/debts" element={<DebtsPage onOpenModal={handleOpenModal} />} />
          <Route path="/goals" element={<GoalsPage onOpenModal={handleOpenModal} />} />
          <Route path="/analytics" element={<AICoachPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>

      {/* Persistent floating bottom navigational docking */}
      <Navbar />

      {/* Floating sheets modals */}
      <Modals 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        type={modalType} 
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <IPhoneContainer>
          <AppContent />
        </IPhoneContainer>
      </HashRouter>
    </ThemeProvider>
  );
}
