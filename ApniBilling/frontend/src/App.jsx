import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BillingProvider } from './context/BillingContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { POSScreen } from './components/pos/POSScreen';
import { Dashboard } from './pages/Dashboard';
import { Invoices } from './pages/Invoices';
import { Products } from './pages/Products';
import { Customers } from './pages/Customers';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <BillingProvider>
            <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100 transition-colors duration-200">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 flex flex-col overflow-hidden">
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
          </div>
        </BillingProvider>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
