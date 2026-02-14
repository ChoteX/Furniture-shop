/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(() => localStorage.getItem('bowen_locale') || 'ka');

  const value = useMemo(() => {
    const t = (key) => translations[locale]?.[key] || key;

    const switchLocale = (nextLocale) => {
      setLocale(nextLocale);
      localStorage.setItem('bowen_locale', nextLocale);
    };

    return {
      locale,
      t,
      switchLocale,
    };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used inside LocaleProvider');
  }
  return context;
}
