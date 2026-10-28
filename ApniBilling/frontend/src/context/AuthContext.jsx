import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_BUSINESS_PROFILE, INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_INVOICES } from '../data/mockData';
import { STORE_PRESETS } from '../data/starterTemplates';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Check active store ID
  const [activeStoreId, setActiveStoreId] = useState(() => {
    return localStorage.getItem('apni_active_store_id') || null;
  });

  // Stores list
  const [storesList, setStoresList] = useState(() => {
    try {
      const saved = localStorage.getItem('apni_stores_directory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current Business Profile
  const [businessProfile, setBusinessProfile] = useState(() => {
    const currentId = localStorage.getItem('apni_active_store_id');
    if (currentId) {
      try {
        const saved = localStorage.getItem(`apni_store_${currentId}_profile`);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load store profile', e);
      }
    }
    return null;
  });

  // Current Logged-in User
  const [user, setUser] = useState(() => {
    const currentId = localStorage.getItem('apni_active_store_id');
    if (currentId) {
      try {
        const saved = localStorage.getItem(`apni_store_${currentId}_user`);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load user', e);
      }
    }
    return null;
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync profile update
  const updateBusinessProfile = (newProfile) => {
    if (!activeStoreId) return;
    setBusinessProfile(newProfile);
    localStorage.setItem(`apni_store_${activeStoreId}_profile`, JSON.stringify(newProfile));

    // Also update name in directory
    const updatedStores = storesList.map((s) =>
      s.id === activeStoreId ? { ...s, name: newProfile.name, phone: newProfile.phone } : s
    );
    setStoresList(updatedStores);
    localStorage.setItem('apni_stores_directory', JSON.stringify(updatedStores));
  };

  // Create a brand new fresh store (No old data!)
  const createFreshStore = ({ storeName, ownerName, phone, upiId, stateCode = '07', stateName = 'Delhi', categoryPreset = 'blank' }) => {
    const newStoreId = `store_${Date.now()}`;
    const cleanPrefix = storeName
      .trim()
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 4) || 'INV';

    const newProfile = {
      id: newStoreId,
      name: storeName.trim(),
      tagline: 'Retail & Wholesale',
      gstin: '',
      stateCode: stateCode,
      stateName: stateName,
      address: 'Shop / Store Address',
      phone: phone || '',
      email: '',
      upiId: upiId || (phone ? `${phone}@upi` : ''),
      bankDetails: {
        bankName: '',
        accountNumber: '',
        ifsc: '',
        branch: '',
      },
      invoicePrefix: `${cleanPrefix}/`,
      termsAndConditions: '1. Goods once sold will not be taken back.\n2. Subject to local jurisdiction.\n3. Thank you for your business!',
    };

    const newUser = {
      id: `usr_${Date.now()}`,
      name: ownerName || 'Store Owner',
      role: 'OWNER',
      phone: phone || '',
      upiId: newProfile.upiId,
    };

    // Find products from preset
    const preset = STORE_PRESETS.find((p) => p.id === categoryPreset) || STORE_PRESETS[0];
    const initialProducts = preset.products || [];

    // Default Walk-in customer only
    const initialCustomers = [
      {
        id: `c_${Date.now()}`,
        name: 'Cash Sale (Retail Walk-in)',
        phone: '',
        gstin: '',
        stateCode: stateCode,
        type: 'B2C',
        balance: 0,
        address: 'Walk-in',
      },
    ];

    // Save newly created store records (Fresh clean state, 0 invoices!)
    localStorage.setItem(`apni_store_${newStoreId}_profile`, JSON.stringify(newProfile));
    localStorage.setItem(`apni_store_${newStoreId}_user`, JSON.stringify(newUser));
    localStorage.setItem(`apni_store_${newStoreId}_products`, JSON.stringify(initialProducts));
    localStorage.setItem(`apni_store_${newStoreId}_customers`, JSON.stringify(initialCustomers));
    localStorage.setItem(`apni_store_${newStoreId}_invoices`, JSON.stringify([]));

    // Update stores list
    const newEntry = {
      id: newStoreId,
      name: newProfile.name,
      owner: newUser.name,
      phone: newProfile.phone,
      created: new Date().toISOString(),
    };
    const updatedDirectory = [newEntry, ...storesList.filter((s) => s.id !== newStoreId)];
    setStoresList(updatedDirectory);
    localStorage.setItem('apni_stores_directory', JSON.stringify(updatedDirectory));

    // Activate this store
    localStorage.setItem('apni_active_store_id', newStoreId);
    setActiveStoreId(newStoreId);
    setBusinessProfile(newProfile);
    setUser(newUser);

    return newStoreId;
  };

  // Load sample demo store
  const loadDemoStore = () => {
    const demoId = 'store_demo_sample';
    localStorage.setItem(`apni_store_${demoId}_profile`, JSON.stringify(INITIAL_BUSINESS_PROFILE));
    localStorage.setItem(`apni_store_${demoId}_user`, JSON.stringify({
      id: 'usr_demo',
      name: 'Demo Merchant',
      role: 'OWNER',
      phone: '+91 98765 43210',
      upiId: 'samplemerchant@ybl',
    }));
    localStorage.setItem(`apni_store_${demoId}_products`, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(`apni_store_${demoId}_customers`, JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem(`apni_store_${demoId}_invoices`, JSON.stringify(INITIAL_INVOICES));

    const demoEntry = {
      id: demoId,
      name: INITIAL_BUSINESS_PROFILE.name,
      owner: 'Demo Merchant',
      phone: INITIAL_BUSINESS_PROFILE.phone,
      isDemo: true,
    };
    const updatedDirectory = [demoEntry, ...storesList.filter((s) => s.id !== demoId)];
    setStoresList(updatedDirectory);
    localStorage.setItem('apni_stores_directory', JSON.stringify(updatedDirectory));

    localStorage.setItem('apni_active_store_id', demoId);
    setActiveStoreId(demoId);
    setBusinessProfile(INITIAL_BUSINESS_PROFILE);
    setUser(demoEntry);
  };

  // Switch between saved stores
  const switchStore = (storeId) => {
    try {
      const profile = JSON.parse(localStorage.getItem(`apni_store_${storeId}_profile`));
      const u = JSON.parse(localStorage.getItem(`apni_store_${storeId}_user`));
      if (profile) {
        localStorage.setItem('apni_active_store_id', storeId);
        setActiveStoreId(storeId);
        setBusinessProfile(profile);
        setUser(u || { name: profile.name, role: 'OWNER' });
        return true;
      }
    } catch (e) {
      console.error('Error switching store', e);
    }
    return false;
  };

  // Logout / Switch to welcome screen
  const logout = () => {
    localStorage.removeItem('apni_active_store_id');
    setActiveStoreId(null);
    setBusinessProfile(null);
    setUser(null);
  };

  // Reset or clear current store data
  const resetCurrentStoreData = () => {
    if (!activeStoreId) return;
    localStorage.setItem(`apni_store_${activeStoreId}_products`, JSON.stringify([]));
    localStorage.setItem(`apni_store_${activeStoreId}_invoices`, JSON.stringify([]));
    localStorage.setItem(`apni_store_${activeStoreId}_customers`, JSON.stringify([
      {
        id: `c_${Date.now()}`,
        name: 'Cash Sale (Retail Walk-in)',
        phone: '',
        gstin: '',
        stateCode: businessProfile?.stateCode || '07',
        type: 'B2C',
        balance: 0,
      }
    ]));
    // Force reload
    window.location.reload();
  };

  // Delete a store
  const deleteStore = (storeId) => {
    localStorage.removeItem(`apni_store_${storeId}_profile`);
    localStorage.removeItem(`apni_store_${storeId}_user`);
    localStorage.removeItem(`apni_store_${storeId}_products`);
    localStorage.removeItem(`apni_store_${storeId}_customers`);
    localStorage.removeItem(`apni_store_${storeId}_invoices`);

    const updated = storesList.filter((s) => s.id !== storeId);
    setStoresList(updated);
    localStorage.setItem('apni_stores_directory', JSON.stringify(updated));

    if (activeStoreId === storeId) {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        activeStoreId,
        storesList,
        user,
        setUser,
        businessProfile,
        updateBusinessProfile,
        createFreshStore,
        loadDemoStore,
        switchStore,
        logout,
        resetCurrentStoreData,
        deleteStore,
        isOnline,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
