import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ReceiptText, 
  Wifi, 
  WifiOff, 
  HelpCircle, 
  Keyboard, 
  Store, 
  Bell,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatTime } from '../../utils/formatters';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
  const { businessProfile, isOnline, user } = useAuth();
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 select-none">
        {/* Left: Brand & Business Switcher */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <ReceiptText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg text-white tracking-tight">Apni<span className="text-brand-400">Billing</span></span>
                <span className="text-[10px] uppercase font-semibold bg-brand-500/10 text-brand-400 px-1.5 py-0.5 rounded border border-brand-500/20">GST</span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[180px] sm:max-w-[260px]">{businessProfile.name}</p>
            </div>
          </Link>
        </div>

        {/* Center: Quick Link to POS Billing */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/pos"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm ${
              location.pathname === '/pos'
                ? 'bg-brand-600 text-white shadow-brand-600/30 ring-2 ring-brand-500/30'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/60'
            }`}
          >
            <ReceiptText className="w-4 h-4 text-brand-300" />
            <span>Fast POS Billing</span>
            <kbd className="text-[10px] bg-slate-900/60 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 font-mono">F1</kbd>
          </Link>
        </div>

        {/* Right: Status, Time, Help & Profile */}
        <div className="flex items-center gap-3">
          {/* Live Clock */}
          <div className="hidden lg:flex flex-col text-right pr-2 border-r border-slate-800">
            <span className="text-xs font-mono font-medium text-slate-200">{formatTime(time)}</span>
            <span className="text-[10px] text-slate-400 font-mono">{time.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}</span>
          </div>

          {/* Online/Offline Status */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            isOnline 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
          }`}>
            {isOnline ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="hidden sm:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Offline Mode</span>
              </>
            )}
          </div>

          {/* Theme Switcher (Dark, Low Light, Light) */}
          <ThemeToggle />

          {/* Keyboard Shortcuts Trigger */}
          <button
            onClick={() => setShowShortcuts(true)}
            title="Keyboard Shortcuts (?)"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Keyboard className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2">
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 border border-brand-400/40 flex items-center justify-center font-bold text-xs text-white shadow-sm"
              title={`Logged in: ${user?.name || 'Jatin Rajput'} (${user?.email || 'jatinrajput18@ybl'})`}
            >
              JR
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight">{user?.name || 'Jatin Rajput'}</span>
              <span className="text-[10px] text-brand-400 font-mono">jatinrajput18@ybl</span>
            </div>
          </div>
        </div>
      </header>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-display font-semibold text-lg">
                <Keyboard className="w-5 h-5 text-brand-400" />
                <h3>Keyboard Shortcuts Guide</h3>
              </div>
              <button 
                onClick={() => setShowShortcuts(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-750">
                <span className="text-sm text-slate-300">Switch Theme (Dark / Low Light / Light)</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 text-xs font-mono font-semibold bg-slate-700 text-slate-200 rounded border border-slate-600">Alt</kbd>
                  <span className="text-slate-400">+</span>
                  <kbd className="px-2 py-1 text-xs font-mono font-semibold bg-amber-500/80 text-white rounded border border-amber-400">T</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-750">
                <span className="text-sm text-slate-300">Focus Barcode / Item Search</span>
                <kbd className="px-2 py-1 text-xs font-mono font-semibold bg-slate-700 text-slate-200 rounded border border-slate-600">F2</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-750">
                <span className="text-sm text-slate-300">Fast POS Checkout / Pay</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 text-xs font-mono font-semibold bg-slate-700 text-slate-200 rounded border border-slate-600">Ctrl</kbd>
                  <span className="text-slate-400">+</span>
                  <kbd className="px-2 py-1 text-xs font-mono font-semibold bg-brand-600 text-white rounded border border-brand-500">Enter</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-750">
                <span className="text-sm text-slate-300">Clear Current Cart</span>
                <kbd className="px-2 py-1 text-xs font-mono font-semibold bg-slate-700 text-slate-200 rounded border border-slate-600">F4</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-750">
                <span className="text-sm text-slate-300">Close Modal / Cancel</span>
                <kbd className="px-2 py-1 text-xs font-mono font-semibold bg-slate-700 text-slate-200 rounded border border-slate-600">Esc</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-750">
                <span className="text-sm text-slate-300">Go to POS Screen</span>
                <kbd className="px-2 py-1 text-xs font-mono font-semibold bg-slate-700 text-slate-200 rounded border border-slate-600">F1</kbd>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowShortcuts(false)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg shadow-sm"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
