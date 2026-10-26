import React, { useState, useEffect, useRef } from 'react';
import { 
  Barcode, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  QrCode, 
  UserCheck, 
  UserPlus, 
  Printer, 
  RefreshCw, 
  ArrowRight,
  Package,
  PackagePlus,
  AlertTriangle,
  Check,
  Percent,
  X
} from 'lucide-react';
import { useBilling } from '../../context/BillingContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { ThermalReceiptModal } from './ThermalReceiptModal';

export const POSScreen = () => {
  const {
    products,
    customers,
    cart,
    addToCart,
    updateCartQuantity,
    updateCartItem,
    removeFromCart,
    clearCart,
    selectedCustomer,
    setSelectedCustomer,
    orderDiscount,
    setOrderDiscount,
    paymentMode,
    setPaymentMode,
    paidAmountInput,
    setPaidAmountInput,
    calculations,
    finalizeInvoice,
    activeReceipt,
    setActiveReceipt,
    addProduct,
    addCustomer,
    updateCustomerDetails
  } = useBilling();

  const { businessProfile } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [quickScanError, setQuickScanError] = useState('');
  const [quickScanNotFound, setQuickScanNotFound] = useState(null);
  const [productAddedSuccess, setProductAddedSuccess] = useState('');

  // Quick Add Product Form State
  const [newProductData, setNewProductData] = useState({
    name: '',
    sellingPrice: '',
    purchasePrice: '',
    gstRate: 18,
    category: 'General',
    unit: 'PCS',
    currentStock: '50',
    barcode: '',
    sku: '',
    hsnSac: '9999',
  });

  // New Customer Form State
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    phone: '',
    gstin: '',
    stateCode: '07',
  });

  const searchInputRef = useRef(null);

  const openQuickAddWithQuery = (initialQuery = '') => {
    const clean = (initialQuery || '').trim();
    const isBarcode = /^\d{6,14}$/.test(clean);
    setNewProductData({
      name: isBarcode ? '' : clean,
      sellingPrice: '',
      purchasePrice: '',
      gstRate: 18,
      category: selectedCategory !== 'ALL' ? selectedCategory : 'General',
      unit: 'PCS',
      currentStock: '50',
      barcode: isBarcode ? clean : `890${Date.now().toString().slice(-10)}`,
      sku: `ITEM-${Date.now().toString().slice(-4)}`,
      hsnSac: '9999',
    });
    setQuickScanNotFound(null);
    setShowAddProductModal(true);
  };

  // Focus search input on mount and F2/F3 key
  useEffect(() => {
    searchInputRef.current?.focus();

    const handleKeyDown = (e) => {
      // F2 -> focus search
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
      // F3 -> Quick Add Item to Bill & Inventory
      if (e.key === 'F3') {
        e.preventDefault();
        openQuickAddWithQuery(searchQuery);
      }
      // F4 -> clear cart
      if (e.key === 'F4') {
        e.preventDefault();
        clearCart();
      }
      // Ctrl + Enter -> Finalize Invoice
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleFinalize();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, calculations, paymentMode, paidAmountInput, searchQuery]);

  // Categories list
  const categories = ['ALL', ...new Set(products.map((p) => p.category).filter(Boolean))];

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query ||
      p.name.toLowerCase().includes(query) ||
      (p.barcode && p.barcode.toLowerCase().includes(query)) ||
      (p.sku && p.sku.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  // Handle direct Enter in search bar (Barcode scanner wedge)
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // Try exact match on barcode or SKU first
    const exactMatch = products.find(
      (p) => (p.barcode && p.barcode.toLowerCase() === query.toLowerCase()) ||
             (p.sku && p.sku.toLowerCase() === query.toLowerCase())
    );

    if (exactMatch) {
      addToCart(exactMatch, 1);
      setSearchQuery('');
      setQuickScanNotFound(null);
      setQuickScanError('');
    } else if (filteredProducts.length === 1) {
      // If only one product matches query, add it directly!
      addToCart(filteredProducts[0], 1);
      setSearchQuery('');
      setQuickScanNotFound(null);
      setQuickScanError('');
    } else if (filteredProducts.length > 1) {
      // Multiple items match, user can click or select
      setQuickScanNotFound(null);
      setQuickScanError('');
    } else {
      // Not found! Offer instant Quick Add to Bill!
      setQuickScanNotFound(query);
      setQuickScanError('');
    }
  };

  // Create Product directly from POS & add immediately to bill
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProductData.name || !newProductData.sellingPrice) return;

    const price = Number(newProductData.sellingPrice) || 0;
    const stock = Number(newProductData.currentStock) || 50;
    const cost = Number(newProductData.purchasePrice) || Math.round(price * 0.75);

    const created = addProduct({
      name: newProductData.name.trim(),
      sellingPrice: price,
      purchasePrice: cost,
      gstRate: Number(newProductData.gstRate) || 0,
      category: newProductData.category.trim() || 'General',
      unit: newProductData.unit || 'PCS',
      currentStock: stock,
      barcode: newProductData.barcode.trim() || `890${Date.now().toString().slice(-10)}`,
      sku: newProductData.sku.trim() || `ITEM-${Date.now().toString().slice(-4)}`,
      hsnSac: newProductData.hsnSac.trim() || '9999',
      lowStockAlert: 10,
    });

    // Directly add to cart!
    addToCart(created, 1);

    setShowAddProductModal(false);
    setSearchQuery('');
    setQuickScanNotFound(null);
    setProductAddedSuccess(`"${created.name}" (₹${created.sellingPrice}) added to inventory & bill!`);
    setTimeout(() => setProductAddedSuccess(''), 4000);

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleFinalize = () => {
    if (cart.length === 0) return;
    finalizeInvoice();
  };

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newCustomerData.name) return;
    const created = addCustomer({
      name: newCustomerData.name,
      phone: newCustomerData.phone || '9999999999',
      gstin: newCustomerData.gstin || '',
      stateCode: newCustomerData.stateCode || businessProfile.stateCode,
      type: newCustomerData.gstin ? 'B2B' : 'B2C',
      balance: 0,
      address: 'Local customer',
    });
    setSelectedCustomer(created);
    setShowAddCustomerModal(false);
    setNewCustomerData({ name: '', phone: '', gstin: '', stateCode: '07' });
  };

  // Change Due Calculation for Cash payments
  const tenderAmount = Number(paidAmountInput) || calculations.grandTotal;
  const changeDue = Math.max(0, tenderAmount - calculations.grandTotal);

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
      {/* LEFT SECTION: Catalog & Barcode Scanner */}
      <div className="flex-1 flex flex-col border-r border-slate-800 overflow-hidden">
        {/* Top Control Bar: Search & Category Pills */}
        <div className="p-3 sm:p-4 bg-slate-900 border-b border-slate-800 space-y-3">
          {/* Barcode Search Form */}
          <form onSubmit={handleBarcodeSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Barcode className="w-5 h-5 text-brand-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Scan barcode or type product name / SKU (Press F2 to focus)..."
              className="w-full pl-11 pr-24 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-inner"
            />
            <div className="absolute inset-y-0 right-1.5 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Enter
              </button>
            </div>
          </form>

          {quickScanError && (
            <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg">
              {quickScanError}
            </div>
          )}

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-750'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
              <Package className="w-12 h-12 text-slate-600 stroke-1" />
              <p className="text-sm font-medium">No products match your search</p>
              <p className="text-xs text-slate-600">Scan another barcode or select a different category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((p) => {
                const isLowStock = p.currentStock <= (p.lowStockAlert || 5);
                const cartItem = cart.find((c) => c.id === p.id);

                return (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p, 1)}
                    className={`relative text-left p-3 rounded-xl border transition-all flex flex-col justify-between group ${
                      cartItem 
                        ? 'bg-brand-950/40 border-brand-500/50 ring-1 ring-brand-500/30' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-750">
                          {p.category || 'General'}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          isLowStock 
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          Stock: {p.currentStock}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-100 line-clamp-2 group-hover:text-brand-300 transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-500 mt-1">
                        HSN: {p.hsnSac} | GST: {p.gstRate}%
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-sm font-bold text-white">
                        {formatCurrency(p.sellingPrice)}
                      </span>
                      {cartItem ? (
                        <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                          {cartItem.quantity}
                        </span>
                      ) : (
                        <div className="w-6 h-6 rounded-lg bg-slate-800 group-hover:bg-brand-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION: Cart, Customer & Checkout */}
      <div className="w-full lg:w-[490px] bg-slate-900 flex flex-col justify-between border-l border-slate-800 overflow-hidden">
        {/* Customer Header Details Bar (Direct Customer Name & Mobile Fill) */}
        <div className="p-3 bg-slate-850 border-b border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-brand-400" />
              Customer / Party Details (ग्राहक का नाम)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedCustomer({
                    id: 'c1',
                    name: 'Cash Sale (Retail Walk-in)',
                    phone: '',
                    gstin: '',
                    stateCode: businessProfile.stateCode,
                    type: 'B2C',
                    balance: 0,
                  });
                }}
                className="text-[10px] text-brand-400 hover:text-brand-300 font-semibold px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/20 transition-colors"
                title="Reset to Walk-in Cash Sale"
              >
                Walk-in
              </button>
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(true)}
                title="Add New Registered Customer"
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-brand-400 hover:text-brand-300 border border-slate-700"
              >
                <UserPlus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Customer Name Input - Direct type or select from saved */}
            <div>
              <input
                type="text"
                list="saved-customers-list"
                value={selectedCustomer?.name || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const matched = customers.find(
                    (c) => c.name.toLowerCase() === val.toLowerCase()
                  );
                  if (matched) {
                    setSelectedCustomer(matched);
                  } else {
                    updateCustomerDetails({ name: val });
                  }
                }}
                placeholder="Customer Name (e.g. Ramesh)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-white px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder-slate-400"
              />
              <datalist id="saved-customers-list">
                {customers.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.phone ? `${c.phone} • ` : ''}{c.type}
                  </option>
                ))}
              </datalist>
            </div>

            {/* Customer Mobile Number Input */}
            <div>
              <input
                type="tel"
                value={selectedCustomer?.phone || ''}
                onChange={(e) => updateCustomerDetails({ phone: e.target.value })}
                placeholder="Mobile No. (e.g. 9876543210)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-white px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Quick Party Selector Dropdown */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-[10px] text-slate-400 whitespace-nowrap">Saved Party:</span>
            <select
              value={selectedCustomer?.id || ''}
              onChange={(e) => {
                const found = customers.find((c) => c.id === e.target.value);
                if (found) setSelectedCustomer(found);
              }}
              className="w-full bg-slate-800/80 border border-slate-750 rounded text-[11px] text-slate-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="" disabled>-- Select from saved customers --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.phone ? `(${c.phone})` : ''} - {c.type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cart Line Items Table */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 py-8">
              <Barcode className="w-10 h-10 text-slate-600 stroke-1" />
              <p className="text-sm font-medium">Cart is empty</p>
              <p className="text-xs text-slate-600">Scan barcode or click any item to add</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                <span>Items ({cart.length})</span>
                <button
                  onClick={clearCart}
                  className="text-rose-400 hover:text-rose-300 text-[10px] flex items-center gap-1 font-medium transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Clear (F4)
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between gap-2 transition-all hover:border-slate-700"
                >
                  <div className="flex-1 min-w-0 pr-1">
                    <h5 className="text-xs font-semibold text-white truncate" title={item.name}>
                      {item.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <div className="flex items-center gap-1">
                        <span>Rate: ₹</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.sellingPrice === '' ? '' : item.sellingPrice}
                          onChange={(e) => updateCartItem(item.id, 'sellingPrice', e.target.value)}
                          onFocus={(e) => e.target.select()}
                          title="Click to edit selling price (दर)"
                          className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                      <span>•</span>
                      <span className="text-brand-400 font-mono">GST {item.gstRate}%</span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Direct Editable Number Input */}
                  <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      title="Decrease quantity (-1)"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      min="0.01"
                      step="any"
                      value={item.quantity === '' ? '' : item.quantity}
                      onChange={(e) => updateCartItem(item.id, 'quantity', e.target.value)}
                      onFocus={(e) => e.target.select()}
                      title="Directly type quantity value (मात्रा)"
                      className="w-12 text-center bg-slate-900 border border-slate-650 rounded py-0.5 text-xs font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      title="Increase quantity (+1)"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right pl-2 min-w-[70px]">
                    <div className="text-xs font-bold text-white font-mono">
                      {formatCurrency(Number(item.quantity || 0) * Number(item.sellingPrice || 0))}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-500 hover:text-rose-400 text-[10px] mt-0.5 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Calculations & Settlement */}
        <div className="p-3 bg-slate-850 border-t border-slate-800 space-y-2">
          {/* Subtotal, Discount & GST Summary */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Items Total:</span>
              <span className="font-mono text-slate-200">{formatCurrency(calculations.subtotal)}</span>
            </div>

            {/* Order Discount Input */}
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-brand-400" />
                <span>Order Discount (छूट):</span>
              </span>
              <div className="flex items-center gap-1">
                <span className="text-slate-400 text-xs">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={orderDiscount === 0 ? '' : orderDiscount}
                  onChange={(e) => setOrderDiscount(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="0.00"
                  className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-right font-mono text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            {calculations.isInterState ? (
              <div className="flex justify-between text-slate-400">
                <span>IGST:</span>
                <span className="font-mono text-slate-200">{formatCurrency(calculations.igst)}</span>
              </div>
            ) : (
              <div className="flex justify-between text-slate-400">
                <span>CGST + SGST:</span>
                <span className="font-mono text-slate-200">
                  {formatCurrency(calculations.cgst + calculations.sgst)}
                </span>
              </div>
            )}

            {calculations.roundOff !== 0 && (
              <div className="flex justify-between text-slate-400">
                <span>Round Off:</span>
                <span className="font-mono text-slate-200">
                  {calculations.roundOff > 0 ? `+${calculations.roundOff}` : calculations.roundOff}
                </span>
              </div>
            )}

            <div className="flex justify-between text-base font-bold text-white pt-1.5 border-t border-slate-750">
              <span>Grand Total:</span>
              <span className="font-mono text-brand-400 text-lg">
                {formatCurrency(calculations.grandTotal)}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-4 gap-1.5 pt-0.5">
            {[
              { id: 'CASH', label: 'Cash', icon: Banknote },
              { id: 'UPI', label: 'UPI QR', icon: QrCode },
              { id: 'CARD', label: 'Card', icon: CreditCard },
              { id: 'CREDIT', label: 'Credit', icon: UserCheck },
            ].map((pm) => {
              const Icon = pm.icon;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => {
                    setPaymentMode(pm.id);
                    if (pm.id === 'UPI') setShowUPIModal(true);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    paymentMode === pm.id
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{pm.label}</span>
                </button>
              );
            })}
          </div>

          {/* Cash Received / Paid Amount Input & Change Due Calculation */}
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cash Received (प्राप्त राशि):</span>
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-400">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={paidAmountInput}
                  onChange={(e) => setPaidAmountInput(e.target.value)}
                  placeholder={calculations.grandTotal.toString()}
                  className="w-28 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-right font-mono text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Quick Cash Suggestions */}
            <div className="flex items-center gap-1.5 justify-end flex-wrap">
              <span className="text-[10px] text-slate-400 mr-0.5">Quick:</span>
              <button
                type="button"
                onClick={() => setPaidAmountInput(calculations.grandTotal.toString())}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700"
              >
                Exact (₹{calculations.grandTotal})
              </button>
              {[100, 200, 500, 1000, 2000]
                .filter((amt) => amt >= calculations.grandTotal || calculations.grandTotal < 500)
                .slice(0, 3)
                .map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPaidAmountInput(amt.toString())}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700"
                  >
                    ₹{amt}
                  </button>
                ))}
            </div>

            {/* Change Due / Return to Customer */}
            {changeDue > 0 && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs font-bold text-emerald-400">
                <span>Change to Return (वापस दें):</span>
                <span className="font-mono text-sm font-bold">{formatCurrency(changeDue)}</span>
              </div>
            )}
          </div>

          {/* Checkout Finalize Button */}
          <button
            onClick={handleFinalize}
            disabled={cart.length === 0}
            className={`w-full py-2.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              cart.length === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40'
                : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/30 ring-2 ring-emerald-500/20'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Generate & Print Bill</span>
            <span className="text-xs font-mono font-normal opacity-80">(Ctrl + Enter)</span>
          </button>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-display font-semibold text-white">Add New Customer</h3>
              <button 
                onClick={() => setShowAddCustomerModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Customer / Business Name *</label>
                <input
                  type="text"
                  required
                  value={newCustomerData.name}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                  placeholder="e.g. Ramesh Trading Co."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={newCustomerData.phone}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">GSTIN (Optional for B2B)</label>
                <input
                  type="text"
                  maxLength={15}
                  value={newCustomerData.gstin}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, gstin: e.target.value.toUpperCase() })}
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs uppercase font-mono focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold"
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPI QR Instant Modal */}
      {showUPIModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-5 text-center shadow-2xl">
            <h3 className="font-display font-semibold text-white text-base">Scan & Pay via UPI</h3>
            <p className="text-xs text-slate-400 mt-1">Payment for {formatCurrency(calculations.grandTotal)}</p>

            <div className="my-4 p-4 bg-white rounded-xl inline-block shadow-inner">
              {/* Dynamic UPI QR SVG */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${businessProfile.upiId}&pn=${encodeURIComponent(businessProfile.name)}&am=${calculations.grandTotal}&cu=INR`}
                alt="UPI Payment QR Code"
                className="w-44 h-44 mx-auto"
              />
            </div>

            <p className="font-mono text-xs text-brand-300 font-semibold">{businessProfile.upiId}</p>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowUPIModal(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
              >
                Change Mode
              </button>
              <button
                onClick={() => {
                  setShowUPIModal(false);
                  handleFinalize();
                }}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Payment Received
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thermal Receipt Print Modal */}
      {activeReceipt && (
        <ThermalReceiptModal
          invoice={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      )}
    </div>
  );
};
