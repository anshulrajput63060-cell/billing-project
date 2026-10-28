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

  const [mobileTab, setMobileTab] = useState('catalog'); // 'catalog' or 'cart'
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
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
      if (e.key === 'F3') {
        e.preventDefault();
        openQuickAddWithQuery(searchQuery);
      }
      if (e.key === 'F4') {
        e.preventDefault();
        clearCart();
      }
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
      addToCart(filteredProducts[0], 1);
      setSearchQuery('');
      setQuickScanNotFound(null);
      setQuickScanError('');
    } else if (filteredProducts.length > 1) {
      setQuickScanNotFound(null);
      setQuickScanError('');
    } else {
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

    addToCart(created, 1);
    setShowAddProductModal(false);
    setSearchQuery('');
    setQuickScanNotFound(null);
    setProductAddedSuccess(`"${created.name}" (₹${created.sellingPrice}) जोड़ा गया!`);
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
    const defaultState = businessProfile?.stateCode || '07';
    const created = addCustomer({
      name: newCustomerData.name,
      phone: newCustomerData.phone || '',
      gstin: newCustomerData.gstin || '',
      stateCode: newCustomerData.stateCode || defaultState,
      type: newCustomerData.gstin ? 'B2B' : 'B2C',
      balance: 0,
      address: 'Local customer',
    });
    setSelectedCustomer(created);
    setShowAddCustomerModal(false);
    setNewCustomerData({ name: '', phone: '', gstin: '', stateCode: defaultState });
  };

  const tenderAmount = Number(paidAmountInput) || calculations.grandTotal;
  const changeDue = Math.max(0, tenderAmount - calculations.grandTotal);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] pb-14 md:pb-0 overflow-hidden bg-slate-950">
      {/* Mobile Top Segmented View Switcher (< lg screens) */}
      <div className="lg:hidden flex items-center p-2 bg-slate-900 border-b border-slate-800 gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab('catalog')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'catalog'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>सामान कैटलॉग</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('cart')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'cart'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          <div className="relative">
            <Banknote className="w-4 h-4" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>
          <span>बिल / कार्ट ({formatCurrency(calculations.grandTotal)})</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT SECTION: Catalog & Barcode Scanner */}
        <div className={`flex-1 flex flex-col border-r border-slate-800 overflow-hidden ${
          mobileTab === 'cart' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Top Control Bar: Search & Category Pills */}
          <div className="p-3 sm:p-4 bg-slate-900 border-b border-slate-800 space-y-2.5 flex-shrink-0">
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
                placeholder="बारकोड स्कैन करें या नाम खोजें (F2)..."
                className="w-full pl-11 pr-24 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-inner"
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

            {/* Notification / Success Banners */}
            {productAddedSuccess && (
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-1.5 animate-fadeIn">
                <Check className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-semibold">{productAddedSuccess}</span>
              </div>
            )}

            {/* Quick Add missing product banner */}
            {quickScanNotFound && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs truncate">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="truncate">"{quickScanNotFound}" नहीं मिला!</span>
                </div>
                <button
                  type="button"
                  onClick={() => openQuickAddWithQuery(quickScanNotFound)}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm whitespace-nowrap flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>नया जोड़ें (F3)</span>
                </button>
              </div>
            )}

            {/* Category Pills & Quick Add Button */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-brand-600 text-white font-semibold shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => openQuickAddWithQuery(searchQuery)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-brand-300 text-xs font-semibold border border-slate-700 whitespace-nowrap flex-shrink-0"
              >
                <PackagePlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Item</span>
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            {filteredProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 py-12">
                <Package className="w-12 h-12 text-slate-600 stroke-1" />
                <p className="text-sm font-medium">कोई सामान नहीं मिला (No Products)</p>
                <button
                  type="button"
                  onClick={() => openQuickAddWithQuery(searchQuery)}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>नया सामान जोड़ें (Add Product)</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                {filteredProducts.map((p) => {
                  const isLowStock = p.currentStock <= (p.lowStockAlert || 5);
                  const cartItem = cart.find((c) => c.id === p.id);

                  return (
                    <button
                      key={p.id}
                      onClick={() => addToCart(p, 1)}
                      className={`relative text-left p-3 rounded-2xl border transition-all flex flex-col justify-between group select-none active:scale-[0.98] ${
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
                            {p.currentStock} {p.unit || 'PCS'}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-100 line-clamp-2 group-hover:text-brand-300 transition-colors">
                          {p.name}
                        </h4>
                        <p className="text-[10px] font-mono text-slate-500 mt-1">
                          GST: {p.gstRate}%
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-sm font-bold text-white font-mono">
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

          {/* Floating Mobile Bottom Summary Bar on Catalog View */}
          {cart.length > 0 && (
            <div className="lg:hidden p-3 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-between shadow-2xl flex-shrink-0">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">कुल बिल राशि:</span>
                <span className="text-base font-bold font-mono text-brand-400">
                  {formatCurrency(calculations.grandTotal)}
                </span>
                <span className="text-[11px] text-slate-400 ml-1.5 font-medium">({cart.length} आइटम)</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileTab('cart')}
                className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-600/30 flex items-center gap-1.5"
              >
                <span>बिल एवं पेमेंट</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SECTION: Cart, Customer & Checkout */}
        <div className={`w-full lg:w-[490px] bg-slate-900 flex flex-col justify-between border-l border-slate-800 overflow-hidden ${
          mobileTab === 'catalog' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Customer Header Details Bar */}
          <div className="p-3 bg-slate-850 border-b border-slate-800 space-y-2 flex-shrink-0">
            {/* Mobile Back Button to Add More Items */}
            <button
              type="button"
              onClick={() => setMobileTab('catalog')}
              className="lg:hidden w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-brand-300 text-xs font-bold border border-slate-700/80 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>सामान और जोड़ें (Add More Items)</span>
            </button>

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-brand-400" />
                ग्राहक का नाम व मोबाइल (Customer Details)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const defaultState = businessProfile?.stateCode || '07';
                    setSelectedCustomer({
                      id: 'c1',
                      name: 'Cash Sale (Retail Walk-in)',
                      phone: '',
                      gstin: '',
                      stateCode: defaultState,
                      type: 'B2C',
                      balance: 0,
                    });
                  }}
                  className="text-[10px] text-brand-400 hover:text-brand-300 font-semibold px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/20 transition-colors"
                >
                  Walk-in
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(true)}
                  title="Add New Customer"
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-brand-400 hover:text-brand-300 border border-slate-700"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                placeholder="ग्राहक का नाम (Customer Name)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-white px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder-slate-400"
              />
              <datalist id="saved-customers-list">
                {customers.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.phone ? `${c.phone} • ` : ''}{c.type}
                  </option>
                ))}
              </datalist>

              <input
                type="tel"
                value={selectedCustomer?.phone || ''}
                onChange={(e) => updateCustomerDetails({ phone: e.target.value })}
                placeholder="मोबाइल नंबर (Mobile No.)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-white px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Cart Line Items Table */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 py-8">
                <Barcode className="w-10 h-10 text-slate-600 stroke-1" />
                <p className="text-sm font-medium">बिल पर्ची अभी खाली है</p>
                <button
                  type="button"
                  onClick={() => setMobileTab('catalog')}
                  className="px-3 py-1.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
                >
                  सामान चुनें (Select Items)
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                  <span>कुल सामान ({cart.length})</span>
                  <button
                    onClick={clearCart}
                    className="text-rose-400 hover:text-rose-300 text-[10px] flex items-center gap-1 font-medium transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> खाली करें (Clear)
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
                          <span>दर: ₹</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.sellingPrice === '' ? '' : item.sellingPrice}
                            onChange={(e) => updateCartItem(item.id, 'sellingPrice', e.target.value)}
                            className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                          />
                        </div>
                        <span>•</span>
                        <span className="text-brand-400 font-mono">GST {item.gstRate}%</span>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5 border border-slate-700 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="w-7 h-7 rounded flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="0.01"
                        step="any"
                        value={item.quantity === '' ? '' : item.quantity}
                        onChange={(e) => updateCartItem(item.id, 'quantity', e.target.value)}
                        className="w-12 text-center bg-slate-900 border border-slate-650 rounded py-0.5 text-xs font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="w-7 h-7 rounded flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right pl-2 min-w-[70px] flex-shrink-0">
                      <div className="text-xs font-bold text-white font-mono">
                        {formatCurrency(Number(item.quantity || 0) * Number(item.sellingPrice || 0))}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-500 hover:text-rose-400 text-[10px] mt-0.5 transition-colors"
                      >
                        हटाएं
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Calculations & Settlement */}
          <div className="p-3 bg-slate-850 border-t border-slate-800 space-y-2 flex-shrink-0">
            {/* Calculation details */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>सामान कुल (Items Total):</span>
                <span className="font-mono text-slate-200">{formatCurrency(calculations.subtotal)}</span>
              </div>

              {/* Order Discount Input */}
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-brand-400" />
                  <span>छूट (Discount):</span>
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

              <div className="flex justify-between text-slate-400">
                <span>GST Tax Total:</span>
                <span className="font-mono text-slate-200">
                  {formatCurrency(calculations.cgst + calculations.sgst + calculations.igst)}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-white pt-1.5 border-t border-slate-750">
                <span>कुल देय राशि (Grand Total):</span>
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
                { id: 'CREDIT', label: 'उधार', icon: UserCheck },
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

            {/* Cash Received / Change Due */}
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                  <span>प्राप्त राशि (Paid):</span>
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

              {changeDue > 0 && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs font-bold text-emerald-400">
                  <span>वापस देने योग्य (Change Due):</span>
                  <span className="font-mono text-sm font-bold">{formatCurrency(changeDue)}</span>
                </div>
              )}
            </div>

            {/* Checkout Finalize Button */}
            <button
              onClick={handleFinalize}
              disabled={cart.length === 0}
              className={`w-full py-3 rounded-xl font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg ${
                cart.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/30 ring-2 ring-emerald-500/20 active:scale-[0.99]'
              }`}
            >
              <Printer className="w-5 h-5" />
              <span>बिल बनाएं एवं पर्ची प्रिंट करें (Finalize)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-display font-semibold text-white">नया ग्राहक जोड़ें</h3>
              <button 
                onClick={() => setShowAddCustomerModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">ग्राहक का नाम *</label>
                <input
                  type="text"
                  required
                  value={newCustomerData.name}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                  placeholder="उदा. रमेश कुमार"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">मोबाइल नंबर</label>
                <input
                  type="tel"
                  value={newCustomerData.phone}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">GSTIN (वैकल्पिक)</label>
                <input
                  type="text"
                  maxLength={15}
                  value={newCustomerData.gstin}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, gstin: e.target.value.toUpperCase() })}
                  placeholder="07AAAAA0000A1Z5"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs uppercase font-mono focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold"
                >
                  सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-display font-semibold text-white text-base">नया सामान तुरंत जोड़ें (Add Item)</h3>
                <p className="text-xs text-slate-400 mt-0.5">यह सामान इन्वेंटरी और बिल दोनों में तुरंत जुड़ जाएगा</p>
              </div>
              <button 
                onClick={() => setShowAddProductModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">सामान का नाम (Product Name) *</label>
                <input
                  type="text"
                  required
                  value={newProductData.name}
                  onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                  placeholder="उदा. सरसों का तेल 1L / मैगी 70g"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs sm:text-sm focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">बिक्री मूल्य (Selling Price) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    value={newProductData.sellingPrice}
                    onChange={(e) => setNewProductData({ ...newProductData, sellingPrice: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs sm:text-sm font-mono font-bold focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">खरीद मूल्य (Cost)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={newProductData.purchasePrice}
                    onChange={(e) => setNewProductData({ ...newProductData, purchasePrice: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs sm:text-sm font-mono focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">GST Rate %</label>
                  <select
                    value={newProductData.gstRate}
                    onChange={(e) => setNewProductData({ ...newProductData, gstRate: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-white text-xs font-semibold focus:ring-1 focus:ring-brand-500"
                  >
                    {[0, 5, 12, 18, 28].map((r) => (
                      <option key={r} value={r}>{r}%</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">मात्रा यूनिट</label>
                  <select
                    value={newProductData.unit}
                    onChange={(e) => setNewProductData({ ...newProductData, unit: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-white text-xs font-semibold focus:ring-1 focus:ring-brand-500"
                  >
                    {['PCS', 'KG', 'LTR', 'GM', 'PKT', 'BAG', 'BOX'].map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">प्रारंभिक स्टॉक</label>
                  <input
                    type="number"
                    value={newProductData.currentStock}
                    onChange={(e) => setNewProductData({ ...newProductData, currentStock: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-white text-xs font-mono font-bold focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">बारकोड (Barcode / EAN)</label>
                <input
                  type="text"
                  value={newProductData.barcode}
                  onChange={(e) => setNewProductData({ ...newProductData, barcode: e.target.value })}
                  placeholder="बारकोड स्कैन करें..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  जोड़ें एवं बिल में डालें (Add & Bill)
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
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${businessProfile?.upiId || 'shop@upi'}&pn=${encodeURIComponent(businessProfile?.name || 'Store')}&am=${calculations.grandTotal}&cu=INR`}
                alt="UPI Payment QR Code"
                className="w-44 h-44 mx-auto"
              />
            </div>

            <p className="font-mono text-xs text-brand-300 font-semibold">{businessProfile?.upiId || 'shop@upi'}</p>

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
