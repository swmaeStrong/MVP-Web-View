// Internationalization configuration
export const SUPPORTED_LOCALES = ['ko', 'en'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = 'ko';

export const LOCALE_NAMES = {
  ko: '한국어',
  en: 'English',
} as const;

// Browser locale detection
export const detectBrowserLocale = (): SupportedLocale => {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  const browserLocale = navigator.language.split('-')[0] as SupportedLocale;
  return SUPPORTED_LOCALES.includes(browserLocale) ? browserLocale : DEFAULT_LOCALE;
};

// Date formatting with Intl
export const formatDate = (date: Date | string, locale: SupportedLocale): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
};

// Number formatting with Intl
export const formatNumber = (number: number, locale: SupportedLocale): string => {
  return new Intl.NumberFormat(locale).format(number);
};

// Time formatting with Intl
export const formatTime = (date: Date, locale: SupportedLocale): string => {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Relative time formatting
export const formatRelativeTime = (date: Date, locale: SupportedLocale): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  }
};