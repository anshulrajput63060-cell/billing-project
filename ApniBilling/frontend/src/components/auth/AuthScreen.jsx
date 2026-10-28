import React, { useState } from 'react';
import { 
  ReceiptText, 
  Store, 
  User, 
  Phone, 
  QrCode, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Smartphone, 
  Zap, 
  RefreshCw,
  Layers,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { INDIAN_STATES } from '../../utils/formatters';
import { STORE_PRESETS } from '../../data/starterTemplates';

export const AuthScreen = () => {
  const { createFreshStore, loadDemoStore, storesList, switchStore } = useAuth();
  const [tab, setTab] = useState('create'); // 'create', 'demo', 'saved'

  // New store form
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    phone: '',
    upiId: '',
    stateCode: '07',
    stateName: 'Delhi',
    categoryPreset: 'blank',
  });

  const [loading, setLoading] = useState(false);

  const handleStateChange = (e) => {
    const code = e.target.value;
    const found = INDIAN_STATES.find((s) => s.code === code);
    setFormData({
      ...formData,
      stateCode: code,
      stateName: found ? found.name : 'Delhi',
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.storeName.trim()) return;

    setLoading(true);
    setTimeout(() => {
      createFreshStore(formData);
      setLoading(false);
    }, 400);
  };

  const handleDemoClick = () => {
    setLoading(true);
    setTimeout(() => {
      loadDemoStore();
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white p-4 sm:p-6 md:p-8">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between pb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/30">
            <ReceiptText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight flex items-center gap-2">
              Apni<span className="text-brand-400">Billing</span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full border border-brand-500/30">
                GST 2.4
              </span>
            </h1>
            <p className="text-xs text-slate-400">आसान, सुरक्षित और संपूर्ण भारतीय बिलिंग ERP</p>
          </div>
        </div>

        {storesList.length > 0 && (
          <button
            onClick={() => setTab('saved')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-brand-500 text-xs font-medium text-slate-300 hover:text-white transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden sm:inline">Saved Stores</span>
            <span className="px-1.5 py-0.2 rounded-full bg-brand-600 text-white text-[10px] font-bold">
              {storesList.length}
            </span>
          </button>
        )}
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-xl mx-auto w-full my-auto py-4">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl mb-6 shadow-xl">
          <button
            type="button"
            onClick={() => setTab('create')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'create'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>नई दुकान</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('demo')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'demo'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>डेमो स्टोर</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('saved')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'saved'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>लॉगिन ({storesList.length})</span>
          </button>
        </div>

        {/* Tab 1: Create Fresh Store */}
        {tab === 'create' && (
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-slate-800/80 pb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> 100% Fresh & Private Workspace
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
                अपनी नई दुकान रजिस्टर करें
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                यहाँ से शुरू करें — पुराना कोई भी डेटा नहीं दिखेगा, सिर्फ आपकी दुकान की फ्रेश बिलिंग!
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Store Name */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  दुकान / फर्म का नाम (Store Name) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Store className="w-4 h-4 text-brand-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    placeholder="उदा. शर्मा किराना स्टोर / राजपूत टेलीकॉम"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Owner Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    मालिक का नाम (Owner Name)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="उदा. राहुल शर्मा"
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    मोबाइल नंबर (Mobile)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* UPI ID (For receipt QR & digital payments) */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  UPI ID (QR पेमेंट के लिए)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.upiId}
                    onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                    placeholder="उदा. 9876543210@paytm या shop@okhdfcbank"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  ग्राहक द्वारा स्कैन करने पर यह UPI ID बिल पर्ची पर प्रिंट होगी।
                </p>
              </div>

              {/* State & Business Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    राज्य (GST State)
                  </label>
                  <select
                    value={formData.stateCode}
                    onChange={handleStateChange}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    दुकान का प्रकार (Category)
                  </label>
                  <select
                    value={formData.categoryPreset}
                    onChange={(e) => setFormData({ ...formData, categoryPreset: e.target.value })}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  >
                    {STORE_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>दुकान शुरू करें (Start Fresh Store)</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Demo Store */}
        {tab === 'demo' && (
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                डेमो किराना स्टोर एक्सप्लोर करें
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
                बिना कोई फॉर्म भरे तुरंत <strong>Shree Ganesh Enterprises</strong> का सैंपल किराना स्टोर चलाकर देखें। इसमें सैंपल प्रोडक्ट्स, इनवॉइस और बारकोड पहले से मौजूद हैं।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-750 text-left text-xs space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>8 रेडीमेड किराना व इलेक्ट्रिकल प्रोडक्ट्स</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>पिछली इनवॉइस और जीएसटी कैलकुलेशन प्रीव्यू</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>थर्मल 80mm प्रिंटिंग और बारकोड टेस्टिंग</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemoClick}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>डेमो स्टोर खोलें (Open Demo Store)</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Tab 3: Saved Stores / Login */}
        {tab === 'saved' && (
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                सेव की गई दुकानें (Saved Stores)
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                इस डिवाइस पर उपलब्ध किसी भी स्टोर को 1-क्लिक में खोलें:
              </p>
            </div>

            {storesList.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <Store className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400">अभी तक कोई स्टोर सेव नहीं है।</p>
                <button
                  type="button"
                  onClick={() => setTab('create')}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl"
                >
                  नई दुकान बनाएं
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {storesList.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => switchStore(s.id)}
                    className="w-full p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-brand-500 transition-all flex items-center justify-between group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center font-bold">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-brand-300">
                          {s.name}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {s.owner ? `मालिक: ${s.owner}` : ''} {s.phone ? `• ${s.phone}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 group-hover:text-brand-400 text-xs font-semibold">
                      <span>लॉगिन</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Feature Badges below card */}
        <div className="grid grid-cols-3 gap-3 mt-6 text-center text-[11px] text-slate-400">
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% प्राइवेट डेटा</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/40">
            <Smartphone className="w-3.5 h-3.5 text-brand-400" />
            <span>मोबाइल रेडी</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/40">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>ऑफलाइन फर्स्ट</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-slate-500 pt-6">
        ApniBilling &copy; 2026 • High-Speed GST POS & Inventory for Indian Retailers
      </footer>
    </div>
  );
};
