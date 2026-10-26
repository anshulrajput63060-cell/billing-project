import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Phone, 
  MapPin, 
  FileText, 
  X,
  CreditCard,
  Building
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';
import { formatCurrency, INDIAN_STATES } from '../utils/formatters';

export const Customers = () => {
  const { customers, addCustomer } = useBilling();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gstin: '',
    stateCode: '07',
    type: 'B2C',
    balance: '0',
    address: '',
  });

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm)) ||
      (c.gstin && c.gstin.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'ALL' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalOutstanding = customers.reduce((acc, c) => acc + (c.balance || 0), 0);

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    addCustomer({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      gstin: formData.gstin.toUpperCase(),
      stateCode: formData.stateCode,
      type: formData.gstin ? 'B2B' : formData.type,
      balance: Number(formData.balance) || 0,
      address: formData.address,
    });

    setShowAddModal(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      gstin: '',
      stateCode: '07',
      type: 'B2C',
      balance: '0',
      address: '',
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-950">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white">Parties & Ledgers</h1>
          <p className="text-xs text-slate-400 mt-1">
            Customer directory, GSTIN tax registration, and running credit accounts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Outstanding</span>
            <p className="font-mono font-bold text-amber-400 text-sm">{formatCurrency(totalOutstanding)}</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Party</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search party by name, phone or GSTIN..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['ALL', 'B2B', 'B2C'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === type
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {type === 'ALL' ? 'All Parties' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-display font-semibold text-white text-base">{c.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{c.phone || 'No phone'}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  c.type === 'B2B'
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {c.type}
                </span>
              </div>

              {c.gstin && (
                <div className="mt-3 p-2 rounded-lg bg-slate-850 border border-slate-800 font-mono text-xs text-brand-300">
                  <span className="text-[10px] text-slate-500 block">GSTIN:</span>
                  {c.gstin}
                </div>
              )}

              {c.address && (
                <p className="text-xs text-slate-400 mt-2 flex items-start gap-1 line-clamp-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  {c.address}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Current Balance</span>
                <span className={`font-mono font-bold text-sm ${
                  c.balance > 0 ? 'text-amber-400' : 'text-slate-300'
                }`}>
                  {formatCurrency(c.balance)}
                </span>
              </div>
              <span className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-400">
                State: {c.stateCode || '07'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-display font-semibold text-white text-base">Add Party / Customer</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Business / Customer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Apex Traders"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">GSTIN (For B2B Tax Invoices)</label>
                <input
                  type="text"
                  maxLength={15}
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono uppercase focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">State *</label>
                  <select
                    value={formData.stateCode}
                    onChange={(e) => setFormData({ ...formData, stateCode: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Opening Udhaar (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Billing Address</label>
                <textarea
                  rows="2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Address, City, Pin code..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold"
                >
                  Save Party
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
