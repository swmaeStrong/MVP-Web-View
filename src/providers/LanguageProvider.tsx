'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SupportedLocale, DEFAULT_LOCALE } from '@/config/i18n';
import { translations } from '@/config/i18n/locales';
import { setLocaleCookie } from '@/utils/cookies';

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isClient: boolean;
}

interface LanguageProviderProps {
  children: ReactNode;
  initialLocale: SupportedLocale;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function LanguageProviderInner({ children, initialLocale }: LanguageProviderProps) {

  // 서버에서 전달받은 초기 언어로 시작
  const [locale, setLocaleState] = useState<SupportedLocale>(initialLocale);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 마운트 시 초기화
  useEffect(() => {
    setIsClient(true);
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);

    if (isClient) {
      // 쿠키에 저장
      setLocaleCookie(newLocale);
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

// Export directly without dynamic import (now supports SSR)
export const LanguageProvider = LanguageProviderInner;

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