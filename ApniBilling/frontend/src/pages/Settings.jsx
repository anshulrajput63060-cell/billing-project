import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Store, 
  CreditCard, 
  Printer, 
  Save, 
  CheckCircle2, 
  ShieldCheck,
  Moon,
  Sun,
  Flame,
  Sparkles,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme, THEMES, THEME_OPTIONS } from '../context/ThemeContext';
import { INDIAN_STATES } from '../utils/formatters';

export const Settings = () => {
  const { businessProfile, updateBusinessProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState({ ...businessProfile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBusinessProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white">Store Settings & Configuration</h1>
          <p className="text-xs text-slate-400 mt-1">
            Business profile, GST registration, thermal printer templates, display theme, and bank UPI details
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Display & Lighting Modes (Dark, Low Light, Light) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <h3>Display & Lighting Modes (थीम एवं डिस्प्ले मोड)</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 hidden sm:inline">Quick Shortcut:</span>
              <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">Alt + T</kbd>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            अपनी सुविधा अनुसार डिस्प्ले मोड चुनें। रात के समय बिलिंग करने के लिए <strong>लो लाइट (आई कम्फर्ट)</strong> मोड स्क्रीन की नीली रौशनी और चकाचौंध (blue-light glare) को कम करता है जिससे आँखों में जलन नहीं होती।
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTheme(opt.id)}
                  className={`group relative p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? opt.id === THEMES.DIM
                        ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                        : opt.id === THEMES.LIGHT
                        ? 'border-brand-500 bg-brand-50/20 shadow-lg shadow-brand-500/10 ring-1 ring-brand-500/30'
                        : 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10 ring-1 ring-brand-500/30'
                      : 'border-slate-800 bg-slate-850/60 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  {/* Top Badge & Indicator */}
                  <div className="flex items-center justify-between mb-3 w-full">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg border ${
                        opt.id === THEMES.DIM
                          ? 'bg-black border-amber-500/40 text-amber-400'
                          : opt.id === THEMES.LIGHT
                          ? 'bg-white border-slate-300 text-amber-500'
                          : 'bg-slate-950 border-slate-750 text-indigo-400'
                      }`}>
                        {opt.id === THEMES.DIM ? (
                          <Flame className="w-4 h-4 text-amber-400" />
                        ) : opt.id === THEMES.LIGHT ? (
                          <Sun className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Moon className="w-4 h-4 text-indigo-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                          {opt.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {opt.hindiName}
                        </span>
                      </div>
                    </div>

                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <Check className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">
                        Select
                      </span>
                    )}
                  </div>

                  {/* Visual Preview Box */}
                  <div
                    className="w-full h-16 rounded-lg p-2.5 mb-3 border flex flex-col justify-between overflow-hidden shadow-inner"
                    style={{
                      backgroundColor: opt.bgColor,
                      borderColor: opt.borderColor,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="h-2 w-16 rounded"
                        style={{
                          backgroundColor: opt.id === THEMES.LIGHT ? '#0f172a' : '#f8fafc',
                        }}
                      />
                      <div
                        className="h-2 w-6 rounded"
                        style={{ backgroundColor: opt.accentColor }}
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-4 flex-1 rounded text-[8px] flex items-center px-1 font-mono"
                        style={{
                          backgroundColor: opt.cardColor,
                          color: opt.id === THEMES.LIGHT ? '#475569' : '#94a3b8',
                          borderColor: opt.borderColor,
                          borderWidth: '1px',
                        }}
                      >
                        ₹ 1,450.00
                      </div>
                      <div
                        className="h-4 px-2 rounded text-[8px] font-bold text-white flex items-center"
                        style={{ backgroundColor: opt.accentColor }}
                      >
                        PAY
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Business Profile */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-white font-semibold text-sm">
            <Store className="w-4 h-4 text-brand-400" />
            <h3>Business Profile & Contact</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Business / Store Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Tagline / Sub-heading</label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">GSTIN Number *</label>
              <input
                type="text"
                required
                maxLength={15}
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono uppercase focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Home State (GST Place of Supply) *</label>
              <select
                value={formData.stateCode}
                onChange={(e) => {
                  const state = INDIAN_STATES.find((s) => s.code === e.target.value);
                  setFormData({
                    ...formData,
                    stateCode: e.target.value,
                    stateName: state?.name || 'Delhi',
                  });
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Store Address *</label>
            <textarea
              rows="2"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
            ></textarea>
          </div>
        </div>

        {/* Banking & UPI */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-white font-semibold text-sm">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h3>Banking & Instant UPI QR Payments</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">UPI ID (For Customer Scan & Pay) *</label>
              <input
                type="text"
                required
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                placeholder="storename@upi"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankDetails?.bankName || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bankDetails: { ...formData.bankDetails, bankName: e.target.value },
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Account Number</label>
              <input
                type="text"
                value={formData.bankDetails?.accountNumber || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bankDetails: { ...formData.bankDetails, accountNumber: e.target.value },
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">IFSC Code</label>
              <input
                type="text"
                value={formData.bankDetails?.ifsc || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bankDetails: { ...formData.bankDetails, ifsc: e.target.value.toUpperCase() },
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono uppercase focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Invoice & Thermal Slip Configuration */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-white font-semibold text-sm">
            <Printer className="w-4 h-4 text-indigo-400" />
            <h3>Invoice Numbering & Thermal Print Settings</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Invoice Prefix *</label>
              <input
                type="text"
                required
                value={formData.invoicePrefix}
                onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Thermal Printer Width</label>
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
                defaultValue="80mm"
              >
                <option value="80mm">80mm (3-inch Thermal Roll - Standard)</option>
                <option value="58mm">58mm (2-inch Thermal Roll - Compact)</option>
                <option value="A4">A4 Full Page Laser Print</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Invoice Terms & Conditions</label>
            <textarea
              rows="3"
              value={formData.termsAndConditions}
              onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500 font-mono"
            ></textarea>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
