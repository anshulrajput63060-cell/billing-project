import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  Printer, 
  Plus, 
  ArrowUpDown,
  Download,
  Calendar,
  Eye
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';
import { ThermalReceiptModal } from '../components/pos/ThermalReceiptModal';

export const Invoices = () => {
  const { invoices, activeReceipt, setActiveReceipt } = useBilling();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.customerPhone && inv.customerPhone.includes(searchTerm));
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-950">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white">Invoices & Sales Slips</h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete transaction records, GST tax invoices, and thermal receipts
          </p>
        </div>
        <Link
          to="/pos"
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice (F1)</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice number, party or phone..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'PAID', 'PARTIAL', 'UNPAID'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Datatable */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-850/80 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                <th className="py-3 px-4">Invoice No</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4 text-center">Items</th>
                <th className="py-3 px-4 text-right">Taxable</th>
                <th className="py-3 px-4 text-right">GST Total</th>
                <th className="py-3 px-4 text-right">Grand Total</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-500">
                    No invoices match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const gstTotal = (inv.cgst || 0) + (inv.sgst || 0) + (inv.igst || 0);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-brand-400">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        <div>{formatDate(inv.date)}</div>
                        <div className="text-[10px] text-slate-500">{formatTime(inv.date)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{inv.customerName}</div>
                        {inv.customerPhone && (
                          <div className="text-[10px] text-slate-400">{inv.customerPhone}</div>
                        )}
                        {inv.customerGstin && (
                          <div className="text-[9px] font-mono text-brand-300">GST: {inv.customerGstin}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        {inv.items?.length || inv.totalItems || 1}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        {formatCurrency(inv.taxableAmount)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-400">
                        {formatCurrency(gstTotal)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-white text-sm">
                        {formatCurrency(inv.grandTotal)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setActiveReceipt(inv)}
                          title="View / Print Receipt"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Thermal Modal */}
      {activeReceipt && (
        <ThermalReceiptModal
          invoice={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      )}
    </div>
  );
};
