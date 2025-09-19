'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SupportedLocale, DEFAULT_LOCALE, detectBrowserLocale } from '@/config/i18n';
import { translations } from '@/config/i18n/locales';
import { getLocaleFromQuery, createNavigationUrl } from '@/utils/navigation';
import dynamic from 'next/dynamic';
import PageLoader from '@/components/common/PageLoader';

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isClient: boolean;
  isLoadingLocale: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);


function LanguageProviderInner({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Initialize with default locale for consistent server/client rendering
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);
  const [isClient, setIsClient] = useState(false);
  const [isLoadingLocale, setIsLoadingLocale] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 마운트 후 언어 설정
  useEffect(() => {
    setIsMounted(true);
    setIsClient(true);
    setIsLoadingLocale(true);

    // 1. Check URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const hlParam = urlParams.get('hl');

    let targetLocale: SupportedLocale;

    if (hlParam === 'ko' || hlParam === 'en') {
      targetLocale = hlParam as SupportedLocale;
    } else {
      // 2. Check localStorage
      const savedLocale = localStorage.getItem('locale') as SupportedLocale;
      if (savedLocale && translations[savedLocale]) {
        targetLocale = savedLocale;
      } else {
        // 3. Detect browser locale
        targetLocale = detectBrowserLocale();
      }
    }

    // Update state if different
    setLocaleState(targetLocale);

    // Save to localStorage
    localStorage.setItem('locale', targetLocale);

    // Add locale to URL if not present
    if (!hlParam) {
      const queryObj: Record<string, string> = {};
      urlParams.forEach((value, key) => {
        queryObj[key] = value;
      });

      const newUrl = createNavigationUrl(pathname, queryObj, {
        preserveQuery: true,
        locale: targetLocale,
      });
      router.replace(newUrl);
    }

    setIsLoadingLocale(false);
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);

    if (isClient) {
      localStorage.setItem('locale', newLocale);

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
    isLoadingLocale,
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <LanguageContext.Provider value={value}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Use dynamic import to prevent SSR for this component
export const LanguageProvider = dynamic(
  () => Promise.resolve(LanguageProviderInner),
  {
    ssr: false,
    loading: () => <PageLoader message="Initializing..." />,
  }
);

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