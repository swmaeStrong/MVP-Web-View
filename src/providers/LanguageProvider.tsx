'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SupportedLocale, DEFAULT_LOCALE, detectBrowserLocale } from '@/config/i18n';
import { translations } from '@/config/i18n/locales';

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isClient: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드 초기화
  useEffect(() => {
    setIsClient(true);

    // localStorage에서 언어 설정 불러오기, 없으면 브라우저 언어 감지
    const savedLocale = localStorage.getItem('locale') as SupportedLocale;
    if (savedLocale && translations[savedLocale]) {
      setLocaleState(savedLocale);
    } else {
      const detectedLocale = detectBrowserLocale();
      setLocaleState(detectedLocale);
      localStorage.setItem('locale', detectedLocale);
    }
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    if (isClient) {
      localStorage.setItem('locale', newLocale);
    }
  };

  // Translation function with nested key support
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to Korean if key not found in current locale
        value = translations[DEFAULT_LOCALE];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            console.warn(`Translation key "${key}" not found in locale "${locale}"`);
            return key; // Return the key itself if translation not found
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation key "${key}" does not resolve to a string`);
      return key;
    }

    // Parameter interpolation
    if (params) {
      return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
        return str.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
      }, value);
    }

    return value;
  };

  const value = {
    locale,
    setLocale,
    t,
    isClient,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Custom hook for easier translation usage
export function useTranslation() {
  const { t, locale, setLocale, isClient } = useLanguage();

  return {
    t,
    locale,
    setLocale,
    isClient,
  };
}