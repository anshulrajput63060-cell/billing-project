import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ReceiptText, 
  FileText, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  AlertTriangle,
  Layers
} from 'lucide-react';
import { useBilling } from '../../context/BillingContext';

export const Sidebar = () => {
  const { products } = useBilling();

  const lowStockCount = products.filter(
    (p) => p.currentStock <= (p.lowStockAlert || 5)
  ).length;

  const navItems = [
    { to: '/pos', label: 'POS Billing', icon: ReceiptText, hotkey: 'F1', highlight: true },
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/invoices', label: 'Invoices', icon: FileText },
    { to: '/products', label: 'Inventory', icon: Package, badge: lowStockCount > 0 ? lowStockCount : null },
    { to: '/customers', label: 'Parties & Ledgers', icon: Users },
    { to: '/reports', label: 'GST & Reports', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex select-none">
      <div className="py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Core Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? item.highlight
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                      : 'bg-slate-800 text-white font-semibold border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  item.highlight ? 'text-brand-300' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.hotkey && (
                  <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/40 text-slate-400 border border-slate-750">
                    {item.hotkey}
                  </kbd>
                )}
                {item.badge && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    {item.badge}
                  </span>
                )}
              </div>
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Tenant & Version Box */}
      <div className="p-4 border-t border-slate-800 m-3 rounded-xl bg-slate-850/50">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4 text-brand-400" />
          <span className="text-xs font-semibold text-slate-200">ApniBilling Pro</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Version 2.4.0 (GST)</span>
          <span className="text-emerald-400 font-medium">Active</span>
        </div>
      </div>
    </aside>
  );
};
