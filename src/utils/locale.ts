import { SupportedLocale } from '@/config/i18n';

/**
 * Get HTML lang attribute value from locale
 */
export const getHtmlLang = (locale: SupportedLocale): string => {
  const langMap: Record<SupportedLocale, string> = {
    ko: 'ko-KR',
    en: 'en-US',
  };

  return langMap[locale] || 'ko-KR';
};

/**
 * Get font family CSS based on locale
 */
export const getFontFamily = (locale: SupportedLocale): string => {
  if (locale === 'ko') {
    return 'var(--font-noto-sans-kr), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  } else {
    return 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  }
};

/**
 * Get reading direction for locale
 */
export const getTextDirection = (_locale: SupportedLocale): 'ltr' | 'rtl' => {
  // All supported locales use left-to-right text direction
  return 'ltr';
};