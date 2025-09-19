'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SupportedLocale, DEFAULT_LOCALE, detectBrowserLocale } from '@/config/i18n';
import { translations } from '@/config/i18n/locales';
import { getLocaleFromQuery, createNavigationUrl } from '@/utils/navigation';

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isClient: boolean;
  isLoadingLocale: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);
  const [isClient, setIsClient] = useState(false);
  const [isLoadingLocale, setIsLoadingLocale] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 클라이언트 사이드 초기화 및 URL 기반 언어 설정
  useEffect(() => {
    setIsClient(true);

    // URL에서 언어 설정 확인
    const queryObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });

    const urlLocale = getLocaleFromQuery(queryObj);

    if (urlLocale) {
      // URL에 언어 파라미터가 있으면 사용
      setLocaleState(urlLocale);
      localStorage.setItem('locale', urlLocale);
    } else {
      // URL에 언어 파라미터가 없으면 localStorage 또는 브라우저 언어 감지
      const savedLocale = localStorage.getItem('locale') as SupportedLocale;
      let targetLocale: SupportedLocale;

      if (savedLocale && translations[savedLocale]) {
        targetLocale = savedLocale;
      } else {
        targetLocale = detectBrowserLocale();
        localStorage.setItem('locale', targetLocale);
      }

      setLocaleState(targetLocale);

      // URL에 언어 파라미터 추가 (replace를 사용해 히스토리에 남기지 않음)
      const newUrl = createNavigationUrl(pathname, queryObj, {
        preserveQuery: true,
        locale: targetLocale,
      });
      router.replace(newUrl);
    }

    setIsLoadingLocale(false);
  }, [searchParams, pathname, router]);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);

    if (isClient) {
      localStorage.setItem('locale', newLocale);

      // URL 업데이트
      const queryObj: Record<string, string> = {};
      searchParams.forEach((value, key) => {
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
    isLoadingLocale,
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
  const { t, locale, setLocale, isClient, isLoadingLocale } = useLanguage();

  return {
    t,
    locale,
    setLocale,
    isClient,
    isLoadingLocale,
  };
}