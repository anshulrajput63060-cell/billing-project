import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ReceiptText, 
  LayoutDashboard, 
  FileText, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  X, 
  LogOut, 
  Store, 
  Sparkles,
  Wifi,
  WifiOff,
  Layers,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBilling } from '../../context/BillingContext';
import { ThemeToggle } from './ThemeToggle';

export const MobileDrawer = ({ isOpen, onClose }) => {
  const { businessProfile, user, logout, isOnline, resetCurrentStoreData } = useAuth();
  const { products } = useBilling();

  if (!isOpen) return null;

  const lowStockCount = products.filter(
    (p) => p.currentStock <= (p.lowStockAlert || 5)
  ).length;

  const navLinks = [
    { to: '/pos', label: 'Fast POS Billing (बिलिंग)', icon: ReceiptText, highlight: true },
    { to: '/', label: 'Dashboard (डैशबोर्ड)', icon: LayoutDashboard },
    { to: '/invoices', label: 'Invoices & Slips (पर्चियां)', icon: FileText },
    { to: '/products', label: 'Inventory & Stock (सामान)', icon: Package, badge: lowStockCount > 0 ? lowStockCount : null },
    { to: '/customers', label: 'Parties & Ledgers (खाता / उधार)', icon: Users },
    { to: '/reports', label: 'GST & Sales Reports (रिपोर्ट्स)', icon: BarChart3 },
    { to: '/settings', label: 'Store Settings (सेटिंग्स)', icon: Settings },
  ];

  const handleLinkClick = () => {
    onClose();
  };

  const handleResetData = () => {
    if (window.confirm('क्या आप सच में इस स्टोर का सारा डेटा (बिल, सामान) खाली करके फ्रेश शुरू करना चाहते हैं?')) {
      resetCurrentStoreData();
    }
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Content */}
      <aside className="relative w-4/5 max-w-xs bg-slate-900 border-r border-slate-800 h-full flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <ReceiptText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-white leading-tight block">ApniBilling</span>
                <span className="text-[10px] text-brand-400 font-semibold">स्मार्ट स्टोर ERP</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Store Details Card */}
          <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-850/80 border border-slate-750">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-400 flex items-center gap-1">
                <Store className="w-3.5 h-3.5" /> एक्टिव दुकान
              </span>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                isOnline ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
              }`}>
                {isOnline ? 'ऑनलाइन' : 'ऑफलाइन'}
              </div>
            </div>
            <h3 className="font-bold text-sm text-white mt-1.5 truncate">
              {businessProfile?.name || 'My Store'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {user?.name ? `${user.name} • ` : ''}{businessProfile?.phone || ''}
            </p>
            {businessProfile?.upiId && (
              <p className="text-[10px] text-emerald-400 font-mono mt-1 truncate">
                UPI: {businessProfile.upiId}
              </p>
            )}
          </div>

          {/* Nav Links */}
          <div className="px-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              मेन्यू विकल्प
            </div>
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? item.highlight
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                          : 'bg-slate-800 text-white border border-slate-700/60'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-brand-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-900/80">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs font-medium text-slate-400">डिस्प्ले थीम</span>
            <ThemeToggle />
          </div>

          {/* Reset Current Store Data */}
          <button
            type="button"
            onClick={handleResetData}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-amber-400 text-xs font-semibold border border-slate-750 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>डेटा रीसेट करें (Clear Store Data)</span>
          </button>

          {/* Switch Store / Logout */}
          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>दुकान बदलें / लॉगआउट (Switch Store)</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
