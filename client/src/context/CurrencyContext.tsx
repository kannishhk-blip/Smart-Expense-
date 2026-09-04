import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CurrencyContextType {
  currency: string;
  setCurrency: (c: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currency, setCurrencyState] = useState<string>('INR');

  useEffect(() => {
    if (user?.settings?.currency) {
      setCurrencyState(user.settings.currency);
    } else {
      const saved = localStorage.getItem('currency');
      if (saved) setCurrencyState(saved);
    }
  }, [user]);

  const setCurrency = (c: string) => {
    setCurrencyState(c);
    localStorage.setItem('currency', c);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
  return context;
};
