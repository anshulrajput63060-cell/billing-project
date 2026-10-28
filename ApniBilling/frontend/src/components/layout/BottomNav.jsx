import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ReceiptText, 
  LayoutDashboard, 
  FileText, 
  Package, 
  Menu
} from 'lucide-react';
import { useBilling } from '../../context/BillingContext';

export const BottomNav = ({ onOpenMenu }) => {
  const { cart } = useBilling();
  const totalCartQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const navItems = [
    { to: '/pos', label: 'POS बिल', icon: ReceiptText, badge: totalCartQty > 0 ? totalCartQty : null },
    { to: '/', label: 'डैशबोर्ड', icon: LayoutDashboard },
    { to: '/invoices', label: 'इनवॉइस', icon: FileText },
    { to: '/products', label: 'स्टॉक', icon: Package },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-brand-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-brand-400' : ''}`} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-brand-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center shadow-md animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 leading-none">{item.label}</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-brand-400 mt-0.5" />
                )}
              </>
            )}
          </NavLink>
        );
      })}

      {/* Menu / Drawer Toggle */}
      <button
        type="button"
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-400 hover:text-slate-200"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] mt-1 leading-none">मेन्यू</span>
      </button>
    </nav>
  );
};
