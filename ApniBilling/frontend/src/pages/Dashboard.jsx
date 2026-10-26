import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ReceiptText, 
  Users, 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Printer,
  Plus
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const Dashboard = () => {
  const { invoices, products, customers, setActiveReceipt } = useBilling();

  // Metrics calculations
  const totalSalesRevenue = invoices.reduce((acc, inv) => acc + (inv.grandTotal || 0), 0);
  const totalReceivedCash = invoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0);
  const totalReceivables = customers.reduce((acc, c) => acc + (c.balance || 0), 0);

  const lowStockProducts = products.filter(
    (p) => p.currentStock <= (p.lowStockAlert || 5)
  );

  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-brand-900/60 via-slate-900 to-slate-900 border border-brand-500/30 shadow-xl">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">Universal Billing & Business ERP</span>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
            Store Performance Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time sales tracking, GST compliance, and inventory management.
          </p>
        </div>
        <div className="flex gap-2.5">
          <Link
            to="/pos"
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-600/30 transition-all"
          >
            <ReceiptText className="w-4 h-4" />
            <span>Open POS Counter (F1)</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Sales Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-mono text-white">{formatCurrency(totalSalesRevenue)}</h3>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% from last week
            </p>
          </div>
        </div>

        {/* Amount Collected */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Cash / Digital Collected</span>
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <ReceiptText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-mono text-white">{formatCurrency(totalReceivedCash)}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Across UPI, Cash & Cards</p>
          </div>
        </div>

        {/* Outstanding Receivables */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Customer Receivables (Udhaar)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-mono text-amber-400">{formatCurrency(totalReceivables)}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Pending payments from parties</p>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Low Stock Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-mono text-white">{lowStockProducts.length} Items</h3>
            <Link to="/products" className="text-[11px] text-rose-400 hover:underline mt-1 block font-medium">
              Reorder stock immediately &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main Split: Recent Invoices + Low Stock Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices Table (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-white text-base">Recent Invoices</h3>
              <p className="text-xs text-slate-400">Latest completed billing transactions</p>
            </div>
            <Link to="/invoices" className="text-xs text-brand-400 hover:text-brand-300 font-medium">
              View All Invoices &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                  <th className="pb-3">Invoice No</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 font-mono font-semibold text-brand-300">{inv.invoiceNumber}</td>
                    <td className="py-3 font-medium text-white">{inv.customerName}</td>
                    <td className="py-3 text-slate-400">{formatDate(inv.date)}</td>
                    <td className="py-3 text-right font-mono font-bold text-white">
                      {formatCurrency(inv.grandTotal)}
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setActiveReceipt(inv)}
                        title="Print / View Receipt"
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Warning Box (1 Col) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-white text-base">Low Stock Attention</h3>
            <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded font-bold">
              {lowStockProducts.length} Items
            </span>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-slate-400">All inventory items are well-stocked!</p>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-semibold text-white truncate max-w-[170px]">{p.name}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">HSN: {p.hsnSac} | Rate: ₹{p.sellingPrice}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-rose-400">{p.currentStock} left</span>
                    <p className="text-[9px] text-slate-500">Alert at {p.lowStockAlert}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link
            to="/products"
            className="block w-full py-2 text-center bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
          >
            Manage Product Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};
