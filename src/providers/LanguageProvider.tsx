'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SupportedLocale, DEFAULT_LOCALE, detectBrowserLocale } from '@/config/i18n';
import { translations } from '@/config/i18n/locales';
import { getLocaleFromQuery, createNavigationUrl } from '@/utils/navigation';
import { getLocaleFromCookie, setLocaleCookie, getLocaleFromServerCookies } from '@/utils/cookies';
import dynamic from 'next/dynamic';
import PageLoader from '@/components/common/PageLoader';

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
  const router = useRouter();
  const pathname = usePathname();

  // 서버에서 전달받은 초기 언어로 시작
  const [locale, setLocaleState] = useState<SupportedLocale>(initialLocale);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 마운트 후 URL 파라미터 체크
  useEffect(() => {
    setIsClient(true);

    // URL 파라미터 체크
    const urlParams = new URLSearchParams(window.location.search);
    const hlParam = urlParams.get('hl');

    if (hlParam === 'ko' || hlParam === 'en') {
      // URL 파라미터가 있으면 그것을 우선시
      if (hlParam !== locale) {
        setLocaleState(hlParam as SupportedLocale);
        setLocaleCookie(hlParam as SupportedLocale);
      }
    } else if (!hlParam) {
      // URL에 언어 파라미터가 없으면 추가
      const queryObj: Record<string, string> = {};
      urlParams.forEach((value, key) => {
        queryObj[key] = value;
      });

      const newUrl = createNavigationUrl(pathname, queryObj, {
        preserveQuery: true,
        locale,
      });
      router.replace(newUrl);
    }
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);

    if (isClient) {
      // 쿠키에 저장
      setLocaleCookie(newLocale);

      // URL 업데이트
      const urlParams = new URLSearchParams(window.location.search);
      const queryObj: Record<string, string> = {};
      urlParams.forEach((value, key) => {
        queryObj[key] = value;
      });

      const newUrl = createNavigationUrl(pathname, queryObj, {
        preserveQuery: true,
        locale: newLocale,
      });

      router.push(newUrl);
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