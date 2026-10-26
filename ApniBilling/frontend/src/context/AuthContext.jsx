import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_BUSINESS_PROFILE } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: "usr_101",
    name: "Jatin Rajput",
    role: "OWNER",
    email: "jatinrajput18@ybl",
    upiId: "jatinrajput18@ybl",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  });

  const [businessProfile, setBusinessProfile] = useState(() => {
    const saved = localStorage.getItem('apni_business_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.upiId || parsed.upiId === 'shreeganesh@upi') {
          parsed.upiId = 'jatinrajput18@ybl';
          localStorage.setItem('apni_business_profile', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_BUSINESS_PROFILE;
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

  const updateBusinessProfile = (newProfile) => {
    setBusinessProfile(newProfile);
    localStorage.setItem('apni_business_profile', JSON.stringify(newProfile));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, businessProfile, updateBusinessProfile, isOnline }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
