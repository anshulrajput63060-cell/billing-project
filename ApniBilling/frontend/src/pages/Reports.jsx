import React, { useState } from 'react';
import { 
  BarChart3, 
  FileSpreadsheet, 
  Download, 
  Calendar, 
  TrendingUp, 
  Layers, 
  FileText,
  Percent
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';
import { formatCurrency } from '../utils/formatters';

export const Reports = () => {
  const { invoices, products } = useBilling();
  const [activeTab, setActiveTab] = useState('GSTR1');

  // GSTR-1 Splits: B2B vs B2C
  const b2bInvoices = invoices.filter((inv) => inv.customerGstin && inv.customerGstin.trim() !== '');
  const b2cInvoices = invoices.filter((inv) => !inv.customerGstin || inv.customerGstin.trim() === '');

  // Aggregated totals
  const totalTaxable = invoices.reduce((acc, inv) => acc + (inv.taxableAmount || 0), 0);
  const totalCGST = invoices.reduce((acc, inv) => acc + (inv.cgst || 0), 0);
  const totalSGST = invoices.reduce((acc, inv) => acc + (inv.sgst || 0), 0);
  const totalIGST = invoices.reduce((acc, inv) => acc + (inv.igst || 0), 0);
  const totalTaxCollected = totalCGST + totalSGST + totalIGST;

  // HSN summary computation
  const hsnMap = {};
  invoices.forEach((inv) => {
    (inv.items || []).forEach((item) => {
      const hsn = item.hsnSac || '9983';
      if (!hsnMap[hsn]) {
        hsnMap[hsn] = {
          hsn,
          name: item.name,
          quantity: 0,
          unit: item.unit || 'PCS',
          taxableValue: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          total: 0,
        };
      }
      hsnMap[hsn].quantity += item.quantity || 1;
      hsnMap[hsn].taxableValue += item.taxableValue || item.sellingPrice * (item.quantity || 1);
      hsnMap[hsn].cgst += item.cgst || 0;
      hsnMap[hsn].sgst += item.sgst || 0;
      hsnMap[hsn].igst += item.igst || 0;
      hsnMap[hsn].total += item.total || 0;
    });
  });

  const hsnSummaryList = Object.values(hsnMap);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white">GST & Business Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            GSTR-1 compliance reports, HSN outward summaries, and output tax liability
          </p>
        </div>
        <button
          onClick={() => alert("GSTR-1 report exported successfully.")}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold rounded-xl border border-slate-700 shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export GSTR-1 CSV</span>
        </button>
      </div>

      {/* Tax Liability Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Taxable Value</span>
          <h3 className="text-xl font-bold font-mono text-white mt-2">{formatCurrency(totalTaxable)}</h3>
          <p className="text-[10px] text-slate-500 mt-1">Eligible for GST assessment</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Output CGST (Central)</span>
          <h3 className="text-xl font-bold font-mono text-brand-300 mt-2">{formatCurrency(totalCGST)}</h3>
          <p className="text-[10px] text-slate-500 mt-1">Intra-state sales</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Output SGST (State)</span>
          <h3 className="text-xl font-bold font-mono text-brand-300 mt-2">{formatCurrency(totalSGST)}</h3>
          <p className="text-[10px] text-slate-500 mt-1">Intra-state sales</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Output IGST (Integrated)</span>
          <h3 className="text-xl font-bold font-mono text-indigo-300 mt-2">{formatCurrency(totalIGST)}</h3>
          <p className="text-[10px] text-slate-500 mt-1">Inter-state sales</p>
        </div>
      </div>

      {/* Tabs: GSTR-1 Sections */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-800 bg-slate-850/60 px-4 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('GSTR1')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'GSTR1'
                ? 'border-brand-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Table 4: B2B Invoices ({b2bInvoices.length})
          </button>
          <button
            onClick={() => setActiveTab('B2C')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'B2C'
                ? 'border-brand-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Table 7: B2C Retail Supplies ({b2cInvoices.length})
          </button>
          <button
            onClick={() => setActiveTab('HSN')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'HSN'
                ? 'border-brand-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Table 12: HSN Summary ({hsnSummaryList.length})
          </button>
        </div>

        <div className="p-4 overflow-x-auto">
          {activeTab === 'GSTR1' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                  <th className="pb-3">GSTIN of Recipient</th>
                  <th className="pb-3">Receiver Name</th>
                  <th className="pb-3">Invoice No</th>
                  <th className="pb-3">Invoice Value</th>
                  <th className="pb-3">Taxable Value</th>
                  <th className="pb-3">CGST</th>
                  <th className="pb-3">SGST</th>
                  <th className="pb-3">IGST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {b2bInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-6 text-center text-slate-500">
                      No B2B invoices recorded yet.
                    </td>
                  </tr>
                ) : (
                  b2bInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-850/40">
                      <td className="py-2.5 font-mono text-brand-300 font-semibold">{inv.customerGstin}</td>
                      <td className="py-2.5">{inv.customerName}</td>
                      <td className="py-2.5 font-mono">{inv.invoiceNumber}</td>
                      <td className="py-2.5 font-mono font-bold text-white">{formatCurrency(inv.grandTotal)}</td>
                      <td className="py-2.5 font-mono">{formatCurrency(inv.taxableAmount)}</td>
                      <td className="py-2.5 font-mono text-slate-400">{formatCurrency(inv.cgst)}</td>
                      <td className="py-2.5 font-mono text-slate-400">{formatCurrency(inv.sgst)}</td>
                      <td className="py-2.5 font-mono text-slate-400">{formatCurrency(inv.igst)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'B2C' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                  <th className="pb-3">Invoice No</th>
                  <th className="pb-3">Customer / Walk-in</th>
                  <th className="pb-3">Place of Supply</th>
                  <th className="pb-3">Taxable Amount</th>
                  <th className="pb-3">GST Amount</th>
                  <th className="pb-3">Grand Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {b2cInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-850/40">
                    <td className="py-2.5 font-mono text-brand-300">{inv.invoiceNumber}</td>
                    <td className="py-2.5">{inv.customerName}</td>
                    <td className="py-2.5 font-mono">{inv.isInterState ? 'Inter-state' : 'Intra-state'}</td>
                    <td className="py-2.5 font-mono">{formatCurrency(inv.taxableAmount)}</td>
                    <td className="py-2.5 font-mono">{formatCurrency((inv.cgst || 0) + (inv.sgst || 0) + (inv.igst || 0))}</td>
                    <td className="py-2.5 font-mono font-bold text-white">{formatCurrency(inv.grandTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'HSN' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                  <th className="pb-3">HSN Code</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3 text-center">Total Qty</th>
                  <th className="pb-3 text-right">Taxable Value</th>
                  <th className="pb-3 text-right">CGST</th>
                  <th className="pb-3 text-right">SGST</th>
                  <th className="pb-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {hsnSummaryList.map((h, i) => (
                  <tr key={i} className="hover:bg-slate-850/40">
                    <td className="py-2.5 font-mono text-brand-300 font-semibold">{h.hsn}</td>
                    <td className="py-2.5">{h.name}</td>
                    <td className="py-2.5 text-center font-mono">{h.quantity} {h.unit}</td>
                    <td className="py-2.5 text-right font-mono">{formatCurrency(h.taxableValue)}</td>
                    <td className="py-2.5 text-right font-mono text-slate-400">{formatCurrency(h.cgst)}</td>
                    <td className="py-2.5 text-right font-mono text-slate-400">{formatCurrency(h.sgst)}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-white">{formatCurrency(h.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
