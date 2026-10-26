import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle, 
  Barcode, 
  Tag, 
  Edit3, 
  X,
  TrendingUp,
  Layers
} from 'lucide-react';
import { useBilling } from '../context/BillingContext';
import { formatCurrency } from '../utils/formatters';

export const Products = () => {
  const { products, addProduct, updateProduct } = useBilling();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: 'Groceries',
    unit: 'PCS',
    purchasePrice: '',
    sellingPrice: '',
    gstRate: '18',
    hsnSac: '',
    currentStock: '10',
    lowStockAlert: '5',
  });

  const categories = ['ALL', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchTerm)) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.hsnSac && p.hsnSac.includes(searchTerm));
    return matchesCat && matchesSearch;
  });

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sellingPrice) return;

    addProduct({
      name: formData.name,
      sku: formData.sku || `SKU-${Date.now().toString().slice(-4)}`,
      barcode: formData.barcode || Date.now().toString(),
      category: formData.category,
      unit: formData.unit,
      purchasePrice: Number(formData.purchasePrice) || 0,
      sellingPrice: Number(formData.sellingPrice) || 0,
      gstRate: Number(formData.gstRate) || 0,
      hsnSac: formData.hsnSac || '9983',
      currentStock: Number(formData.currentStock) || 0,
      lowStockAlert: Number(formData.lowStockAlert) || 5,
    });

    setShowAddModal(false);
    setFormData({
      name: '',
      sku: '',
      barcode: '',
      category: 'Groceries',
      unit: 'PCS',
      purchasePrice: '',
      sellingPrice: '',
      gstRate: '18',
      hsnSac: '',
      currentStock: '10',
      lowStockAlert: '5',
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-950">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white">Product & Stock Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">
            HSN/SAC codes, barcodes, GST tax rates, and live stock balance
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, barcode, SKU, or HSN..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-850/80 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Barcode / SKU</th>
                <th className="py-3 px-4">HSN / SAC</th>
                <th className="py-3 px-4 text-center">Tax Rate</th>
                <th className="py-3 px-4 text-right">Selling Price</th>
                <th className="py-3 px-4 text-right">Purchase Price</th>
                <th className="py-3 px-4 text-center">Current Stock</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredProducts.map((p) => {
                const isLowStock = p.currentStock <= (p.lowStockAlert || 5);
                const margin = p.sellingPrice > 0 
                  ? (((p.sellingPrice - p.purchasePrice) / p.sellingPrice) * 100).toFixed(0)
                  : 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-500">Unit: {p.unit || 'PCS'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-750">
                        {p.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                      <div>{p.barcode || '-'}</div>
                      <div className="text-[9px] text-slate-500">{p.sku}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">{p.hsnSac}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                        {p.gstRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      {formatCurrency(p.sellingPrice)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      {formatCurrency(p.purchasePrice)}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      <span className={isLowStock ? 'text-amber-400' : 'text-slate-200'}>
                        {p.currentStock} {p.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <AlertTriangle className="w-2.5 h-2.5" /> Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-display font-semibold text-white text-base">Add New Product to Inventory</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Fortune Sunflower Oil 1L"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Barcode (EAN-13 / Code128)</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="Scan with scanner or type..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">SKU / Item Code</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. OIL-01"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Groceries, Apparel..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">HSN / SAC Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.hsnSac}
                    onChange={(e) => setFormData({ ...formData, hsnSac: e.target.value })}
                    placeholder="e.g. 1512"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">GST Tax Rate *</label>
                  <select
                    value={formData.gstRate}
                    onChange={(e) => setFormData({ ...formData, gstRate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
                  >
                    <option value="0">0% (Nil)</option>
                    <option value="5">5% GST</option>
                    <option value="12">12% GST</option>
                    <option value="18">18% GST</option>
                    <option value="28">28% GST</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    placeholder="135.00"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Purchase Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    placeholder="115.00"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Initial Opening Stock</label>
                  <input
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Low Stock Alert Limit</label>
                  <input
                    type="number"
                    value={formData.lowStockAlert}
                    onChange={(e) => setFormData({ ...formData, lowStockAlert: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:ring-1 focus:ring-brand-500"
                  />
                </div>
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
