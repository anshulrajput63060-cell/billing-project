import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BillingProvider } from './context/BillingContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { AuthScreen } from './components/auth/AuthScreen';
import { POSScreen } from './components/pos/POSScreen';
import { Dashboard } from './pages/Dashboard';
import { Invoices } from './pages/Invoices';
import { Products } from './pages/Products';
import { Customers } from './pages/Customers';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

const AppContent = () => {
  const { activeStoreId } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // If no store is active / fresh visitor opens the link: show Onboarding / Login screen
  if (!activeStoreId) {
    return <AuthScreen />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100 transition-colors duration-200">
      <Navbar onOpenMenu={() => setIsDrawerOpen(true)} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden pb-14 md:pb-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pos" element={<POSScreen />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onOpenMenu={() => setIsDrawerOpen(true)} />

      {/* Slide-out Mobile Navigation Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <BillingProvider>
            <AppContent />
          </BillingProvider>
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  );
}
