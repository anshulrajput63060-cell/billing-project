import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_INVOICES } from '../data/mockData';
import { calculateGST } from '../utils/formatters';
import { useAuth } from './AuthContext';

const BillingContext = createContext();

export const BillingProvider = ({ children }) => {
  const { businessProfile } = useAuth();

  // Products and Inventory state
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('apni_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Parties/Customers state
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('apni_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  // Invoices History state
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('apni_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  // Current POS Cart State
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0] || null);
  const [orderDiscount, setOrderDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('CASH'); // CASH, UPI, CARD, CREDIT
  const [paidAmountInput, setPaidAmountInput] = useState('');
  const [invoiceNotes, setInvoiceNotes] = useState('');

  // Active Print Receipt State
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Synchronize localStorage
  const saveProducts = (updated) => {
    setProducts(updated);
    localStorage.setItem('apni_products', JSON.stringify(updated));
  };

  const saveCustomers = (updated) => {
    setCustomers(updated);
    localStorage.setItem('apni_customers', JSON.stringify(updated));
  };

  const saveInvoices = (updated) => {
    setInvoices(updated);
    localStorage.setItem('apni_invoices', JSON.stringify(updated));
  };

  // Add Item to POS Cart (Supports barcode scan or clicking)
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            sku: product.sku,
            barcode: product.barcode,
            hsnSac: product.hsnSac,
            unit: product.unit,
            sellingPrice: product.sellingPrice,
            gstRate: product.gstRate,
            cessRate: product.cessRate || 0,
            quantity: quantity,
            discountAmount: 0,
          },
        ];
      }
    });
  };

  // Update item quantity in cart
  const updateCartQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Update specific field on cart item (e.g. custom price, direct qty, or discount)
  const updateCartItem = (productId, field, value) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId) {
          if (value === '') {
            return {
              ...item,
              [field]: '',
            };
          }
          const num = Number(value);
          return {
            ...item,
            [field]: isNaN(num) ? value : num,
          };
        }
        return item;
      })
    );
  };

  // Update customer details directly from POS input
  const updateCustomerDetails = (fields) => {
    setSelectedCustomer((prev) => {
      const base = prev || {
        id: `walkin-${Date.now()}`,
        name: 'Cash Sale (Retail Walk-in)',
        phone: '',
        gstin: '',
        stateCode: businessProfile.stateCode,
        type: 'B2C',
        balance: 0,
      };
      return {
        ...base,
        ...fields,
      };
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Clear Cart
  const clearCart = () => {
    setCart([]);
    setOrderDiscount(0);
    setPaidAmountInput('');
    setInvoiceNotes('');
  };

  // Real-time authoritative calculation
  const calculations = useMemo(() => {
    return calculateGST({
      items: cart,
      customerState: selectedCustomer?.stateCode || businessProfile.stateCode,
      businessState: businessProfile.stateCode,
      orderDiscount: orderDiscount,
    });
  }, [cart, selectedCustomer, businessProfile, orderDiscount]);

  // Finalize Invoice & Deduct Stock
  const finalizeInvoice = (options = {}) => {
    if (cart.length === 0) return null;

    const invoiceSeq = (invoices.length + 87).toString().padStart(4, '0');
    const invoiceNumber = `${businessProfile.invoicePrefix}${invoiceSeq}`;
    const now = new Date().toISOString();

    const finalPaid = paidAmountInput === '' 
      ? calculations.grandTotal 
      : Number(paidAmountInput);
    
    const balance = Math.max(0, calculations.grandTotal - finalPaid);
    const invoiceStatus = balance === 0 ? 'PAID' : (finalPaid > 0 ? 'PARTIAL' : 'UNPAID');

    const newInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      date: now,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
      customerPhone: selectedCustomer?.phone || '',
      customerGstin: selectedCustomer?.gstin || '',
      customerState: selectedCustomer?.stateCode || businessProfile.stateCode,
      isInterState: calculations.isInterState,
      totalItems: cart.length,
      subtotal: calculations.subtotal,
      taxableAmount: calculations.taxableAmount,
      cgst: calculations.cgst,
      sgst: calculations.sgst,
      igst: calculations.igst,
      cess: calculations.cess,
      orderDiscount: calculations.orderDiscount,
      roundOff: calculations.roundOff,
      grandTotal: calculations.grandTotal,
      paidAmount: finalPaid,
      balanceAmount: balance,
      status: invoiceStatus,
      paymentMode: paymentMode,
      notes: invoiceNotes,
      items: calculations.items,
    };

    // 1. Deduct Stock from Products
    const updatedProducts = products.map((prod) => {
      const soldItem = cart.find((c) => c.id === prod.id);
      if (soldItem) {
        return {
          ...prod,
          currentStock: Math.max(0, prod.currentStock - soldItem.quantity),
        };
      }
      return prod;
    });
    saveProducts(updatedProducts);

    // 2. Update Customer Balance if credit/partial
    if (selectedCustomer && selectedCustomer.id !== 'c1' && balance > 0) {
      const updatedCustomers = customers.map((c) => {
        if (c.id === selectedCustomer.id) {
          return {
            ...c,
            balance: Number((c.balance + balance).toFixed(2)),
          };
        }
        return c;
      });
      saveCustomers(updatedCustomers);
    }

    // 3. Save to Invoices
    const updatedInvoices = [newInvoice, ...invoices];
    saveInvoices(updatedInvoices);

    // Set as active receipt for printing/viewing
    setActiveReceipt(newInvoice);

    // Reset POS cart
    clearCart();

    return newInvoice;
  };

  // Add Product to Catalog
  const addProduct = (newProd) => {
    const created = {
      ...newProd,
      id: `p-${Date.now()}`,
      currentStock: Number(newProd.currentStock) || 0,
      sellingPrice: Number(newProd.sellingPrice) || 0,
      purchasePrice: Number(newProd.purchasePrice) || 0,
      gstRate: Number(newProd.gstRate) || 0,
    };
    saveProducts([created, ...products]);
    return created;
  };

  // Update existing Product
  const updateProduct = (id, updatedFields) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    saveProducts(updated);
  };

  // Add Customer
  const addCustomer = (newCust) => {
    const created = {
      ...newCust,
      id: `c-${Date.now()}`,
      balance: Number(newCust.balance) || 0,
    };
    saveCustomers([...customers, created]);
    setSelectedCustomer(created);
    return created;
  };

  return (
    <BillingContext.Provider
      value={{
        products,
        customers,
        invoices,
        cart,
        selectedCustomer,
        setSelectedCustomer,
        orderDiscount,
        setOrderDiscount,
        paymentMode,
        setPaymentMode,
        paidAmountInput,
        setPaidAmountInput,
        invoiceNotes,
        setInvoiceNotes,
        calculations,
        addToCart,
        updateCartQuantity,
        updateCartItem,
        removeFromCart,
        clearCart,
        finalizeInvoice,
        addProduct,
        updateProduct,
        addCustomer,
        updateCustomerDetails,
        activeReceipt,
        setActiveReceipt,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = () => useContext(BillingContext);
