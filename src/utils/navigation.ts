import { SupportedLocale } from '@/config/i18n';

/**
 * Navigation utilities for handling query parameters and locale routing
 */

/**
 * Get the current locale from URL query parameter
 */
export const getLocaleFromQuery = (query: Record<string, string | string[] | undefined>): SupportedLocale | null => {
  const hl = query.hl;
  if (typeof hl === 'string' && (hl === 'ko' || hl === 'en')) {
    return hl as SupportedLocale;
  }
  return null;
};

/**
 * Create URL search params with locale
 */
export const createSearchParamsWithLocale = (
  currentParams: URLSearchParams | Record<string, string | string[] | undefined>,
  locale: SupportedLocale,
  additionalParams?: Record<string, string>
): URLSearchParams => {
  const searchParams = new URLSearchParams();

  // Handle both URLSearchParams and Next.js router.query
  if (currentParams instanceof URLSearchParams) {
    // Copy existing params
    currentParams.forEach((value, key) => {
      if (key !== 'hl') { // Don't copy existing hl param
        searchParams.set(key, value);
      }
    });
  } else {
    // Handle Next.js router.query object
    Object.entries(currentParams).forEach(([key, value]) => {
      if (key !== 'hl' && value !== undefined) { // Don't copy existing hl param
        if (Array.isArray(value)) {
          searchParams.set(key, value.join(','));
        } else {
          searchParams.set(key, value);
        }
      }
    });
  }

  // Add locale parameter
  searchParams.set('hl', locale);

  // Add any additional parameters
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      searchParams.set(key, value);
    });
  }

  return searchParams;
};

/**
 * Build URL with locale and preserved query parameters
 */
export const buildUrlWithLocale = (
  pathname: string,
  currentQuery: Record<string, string | string[] | undefined>,
  locale: SupportedLocale,
  additionalParams?: Record<string, string>
): string => {
  const searchParams = createSearchParamsWithLocale(currentQuery, locale, additionalParams);
  const queryString = searchParams.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
};

/**
 * Get current URL search params on client side
 */
export const getCurrentSearchParams = (): URLSearchParams => {
  if (typeof window === 'undefined') {
    return new URLSearchParams();
  }
  return new URLSearchParams(window.location.search);
};

/**
 * Get current locale from URL or fallback
 */
export const getCurrentLocaleFromUrl = (fallback: SupportedLocale = 'ko'): SupportedLocale => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const searchParams = getCurrentSearchParams();
  const hl = searchParams.get('hl');

  if (hl === 'ko' || hl === 'en') {
    return hl as SupportedLocale;
  }

  return fallback;
};

/**
 * Navigation object similar to Next.js router but with locale handling
 */
export interface NavigationOptions {
  preserveQuery?: boolean;
  additionalParams?: Record<string, string>;
  locale?: SupportedLocale;
}

/**
 * Create navigation URL with options
 */
export const createNavigationUrl = (
  targetPath: string,
  currentQuery: Record<string, string | string[] | undefined>,
  options: NavigationOptions = {}
): string => {
  const { preserveQuery = true, additionalParams, locale } = options;

  if (!preserveQuery && !locale && !additionalParams) {
    return targetPath;
  }

  const searchParams = new URLSearchParams();

  // Preserve current query parameters if requested
  if (preserveQuery) {
    Object.entries(currentQuery).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          searchParams.set(key, value.join(','));
        } else {
          searchParams.set(key, value);
        }
      }
    });
  }

  // Override with new locale if provided
  if (locale) {
    searchParams.set('hl', locale);
  }

  // Add additional parameters
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      searchParams.set(key, value);
    });
  }

  const queryString = searchParams.toString();
  return queryString ? `${targetPath}?${queryString}` : targetPath;
};