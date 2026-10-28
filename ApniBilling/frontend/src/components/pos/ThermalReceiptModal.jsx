import React, { useRef, useEffect } from 'react';
import { Printer, X, CheckCircle, Share2, Download, MessageSquare } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import jsbarcode from 'jsbarcode';

export const ThermalReceiptModal = ({ invoice, onClose }) => {
  const { businessProfile } = useAuth();
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current && invoice?.invoiceNumber) {
      try {
        jsbarcode(barcodeRef.current, invoice.invoiceNumber, {
          format: "CODE128",
          width: 1.4,
          height: 35,
          displayValue: false,
          margin: 0,
        });
      } catch (err) {
        console.error("Barcode generation failed", err);
      }
    }
  }, [invoice]);

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const cleanPhone = (invoice.customerPhone || '').replace(/\D/g, '');
    const itemsSummary = (invoice.items || [])
      .map((item) => `• ${item.name} (Qty: ${item.quantity}) - ₹${item.total.toFixed(2)}`)
      .join('\n');

    const text = `🧾 *${businessProfile?.name || 'Our Store'}*\n` +
      `*Invoice No:* ${invoice.invoiceNumber}\n` +
      `*Date:* ${formatDate(invoice.date)} ${formatTime(invoice.date)}\n` +
      `*Customer:* ${invoice.customerName}\n\n` +
      `*Items Summary:*\n${itemsSummary}\n\n` +
      `*Grand Total:* ₹${invoice.grandTotal.toFixed(2)}\n` +
      `*Paid Amount:* ₹${invoice.paidAmount.toFixed(2)} (${invoice.paymentMode})\n` +
      (invoice.balanceAmount > 0 ? `*Balance Due:* ₹${invoice.balanceAmount.toFixed(2)}\n` : '') +
      (businessProfile?.upiId ? `*UPI ID for payment:* ${businessProfile.upiId}\n` : '') +
      `\nThank you for your visit! Visit again! 🙏`;

    const targetUrl = cleanPhone.length >= 10
      ? `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(targetUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        {/* Header Actions (no-print) */}
        <div className="p-3.5 sm:p-4 bg-slate-850 border-b border-slate-700/80 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-sm sm:text-base">बिल तैयार (Invoice Ready)</h3>
              <p className="text-xs text-slate-400 font-mono">{invoice.invoiceNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* WhatsApp Share Button */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              title="Share on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* Print Slip */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt Area */}
        <div className="p-3 sm:p-4 overflow-y-auto bg-slate-950 flex justify-center">
          <div
            id="printable-receipt"
            className="w-full max-w-[340px] bg-white text-black p-4 font-mono text-[11px] leading-tight rounded shadow-md border border-slate-200"
          >
            {/* Business Header */}
            <div className="text-center pb-2 border-b border-dashed border-gray-400">
              <h2 className="font-bold text-sm uppercase tracking-wide">{businessProfile?.name || 'Apni Store'}</h2>
              {businessProfile?.tagline && <p className="text-[10px] text-gray-700">{businessProfile.tagline}</p>}
              <p className="text-[10px] mt-0.5">{businessProfile?.address}</p>
              {businessProfile?.phone && <p className="text-[10px]">Ph: {businessProfile.phone}</p>}
              {businessProfile?.gstin && <p className="font-semibold text-[10px] mt-0.5">GSTIN: {businessProfile.gstin}</p>}
            </div>

            {/* Invoice Meta */}
            <div className="py-2 border-b border-dashed border-gray-400 space-y-0.5">
              <div className="flex justify-between">
                <span>INV NO: <strong>{invoice.invoiceNumber}</strong></span>
                <span>{formatDate(invoice.date)}</span>
              </div>
              <div className="flex justify-between">
                <span>TIME: {formatTime(invoice.date)}</span>
                <span>POS-01</span>
              </div>
              <div className="flex justify-between font-semibold pt-1">
                <span>CUSTOMER: {invoice.customerName}</span>
              </div>
              {invoice.customerPhone && <div>Ph: {invoice.customerPhone}</div>}
              {invoice.customerGstin && <div>GSTIN: {invoice.customerGstin}</div>}
            </div>

            {/* Item Table */}
            <div className="py-2 border-b border-dashed border-gray-400">
              <div className="grid grid-cols-12 font-bold pb-1 text-[10px] uppercase border-b border-gray-300">
                <span className="col-span-6">Item</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-2 text-right">Rate</span>
                <span className="col-span-2 text-right">Amt</span>
              </div>
              <div className="divide-y divide-dotted divide-gray-300 py-1 space-y-1">
                {invoice.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 pt-1 text-[10px]">
                    <div className="col-span-6 pr-1">
                      <div className="font-semibold truncate">{item.name}</div>
                      <div className="text-[9px] text-gray-600">HSN: {item.hsnSac} | GST: {item.gstRate}%</div>
                    </div>
                    <div className="col-span-2 text-center font-medium">{item.quantity} {item.unit || ''}</div>
                    <div className="col-span-2 text-right">₹{item.unitPrice}</div>
                    <div className="col-span-2 text-right font-semibold">₹{item.total.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations & GST Breakup */}
            <div className="py-2 border-b border-dashed border-gray-400 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.orderDiscount > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Discount:</span>
                  <span>- {formatCurrency(invoice.orderDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 text-[10px]">
                <span>Taxable Value:</span>
                <span>{formatCurrency(invoice.taxableAmount)}</span>
              </div>
              {invoice.isInterState ? (
                <div className="flex justify-between text-gray-600 text-[10px]">
                  <span>IGST:</span>
                  <span>{formatCurrency(invoice.igst)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-gray-600 text-[10px]">
                    <span>CGST:</span>
                    <span>{formatCurrency(invoice.cgst)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-[10px]">
                    <span>SGST:</span>
                    <span>{formatCurrency(invoice.sgst)}</span>
                  </div>
                </>
              )}
              {invoice.roundOff !== 0 && (
                <div className="flex justify-between text-gray-600 text-[10px]">
                  <span>Round Off:</span>
                  <span>{invoice.roundOff > 0 ? `+${invoice.roundOff}` : invoice.roundOff}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold pt-1 border-t border-black">
                <span>NET PAYABLE:</span>
                <span>{formatCurrency(invoice.grandTotal)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>PAID ({invoice.paymentMode}):</span>
                <span>{formatCurrency(invoice.paidAmount)}</span>
              </div>
              {invoice.balanceAmount > 0 && (
                <div className="flex justify-between font-bold text-red-600">
                  <span>BALANCE DUE:</span>
                  <span>{formatCurrency(invoice.balanceAmount)}</span>
                </div>
              )}
            </div>

            {/* Barcode & Footer */}
            <div className="pt-2 text-center space-y-1">
              <div className="flex justify-center my-1">
                <svg ref={barcodeRef} className="h-8 w-auto"></svg>
              </div>
              {businessProfile?.upiId && (
                <p className="text-[10px] font-semibold text-gray-800">
                  UPI ID: <span className="font-mono">{businessProfile.upiId}</span>
                </p>
              )}
              <p className="text-[10px] text-gray-700 whitespace-pre-line">{businessProfile?.termsAndConditions}</p>
              <p className="font-bold text-[10px] uppercase tracking-wider mt-1">*** Thank You! Visit Again ***</p>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls (no-print) */}
        <div className="p-3 sm:p-4 bg-slate-850 border-t border-slate-700/80 flex items-center justify-between no-print">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp पर भेजें</span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-750 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print (Enter)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
