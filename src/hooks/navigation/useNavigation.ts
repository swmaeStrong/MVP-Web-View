'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

import { SupportedLocale } from '@/config/i18n';
import { createNavigationUrl, NavigationOptions } from '@/utils/navigation';

/**
 * Enhanced navigation hook for Next.js App Router with locale support
 */
export function useNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Convert URLSearchParams to query object for compatibility
  const query = useCallback(() => {
    const queryObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });
    return queryObj;
  }, [searchParams]);

  /**
   * Navigate to a new path while preserving query parameters
   */
  const navigateWithParams = useCallback((
    newPath: string,
    options: NavigationOptions = {}
  ) => {
    const url = createNavigationUrl(newPath, query(), options);
    router.push(url);
  }, [router, query]);

  /**
   * Navigate to a new path with additional query parameters
   */
  const navigateWithExtraParams = useCallback((
    newPath: string,
    extraParams: Record<string, string>,
    options: Omit<NavigationOptions, 'additionalParams'> = {}
  ) => {
    const url = createNavigationUrl(newPath, query(), {
      ...options,
      additionalParams: extraParams,
    });
    router.push(url);
  }, [router, query]);

  /**
   * Navigate to the same page with a different locale
   */
  const navigateWithLocale = useCallback((
    locale: SupportedLocale,
    targetPath?: string
  ) => {
    const url = createNavigationUrl(targetPath || pathname, query(), {
      preserveQuery: true,
      locale,
    });
    router.push(url);
  }, [router, pathname, query]);

  /**
   * Replace current URL with locale parameter
   */
  const replaceWithLocale = useCallback((
    locale: SupportedLocale,
    targetPath?: string
  ) => {
    const url = createNavigationUrl(targetPath || pathname, query(), {
      preserveQuery: true,
      locale,
    });
    router.replace(url);
  }, [router, pathname, query]);

  /**
   * Navigate to a path without preserving query parameters
   */
  const navigateClean = useCallback((newPath: string) => {
    router.push(newPath);
  }, [router]);

  /**
   * Get current locale from URL
   */
  const getCurrentLocale = useCallback((): SupportedLocale | null => {
    const hl = searchParams.get('hl');
    return (hl === 'ko' || hl === 'en') ? hl as SupportedLocale : null;
  }, [searchParams]);

  /**
   * Check if a specific locale is active
   */
  const isLocaleActive = useCallback((locale: SupportedLocale): boolean => {
    return getCurrentLocale() === locale;
  }, [getCurrentLocale]);

  /**
   * Get current query parameters as object
   */
  const getQuery = useCallback(() => {
    return query();
  }, [query]);

  /**
   * Get a specific query parameter value
   */
  const getQueryParam = useCallback((key: string): string | null => {
    return searchParams.get(key);
  }, [searchParams]);

  return {
    // Navigation methods
    navigateWithParams,
    navigateWithExtraParams,
    navigateWithLocale,
    replaceWithLocale,
    navigateClean,

    // Locale helpers
    getCurrentLocale,
    isLocaleActive,

    // Query helpers
    getQuery,
    getQueryParam,

    // Current route info
    pathname,
    searchParams,

    // Original router for advanced use cases
    router,
  };
}