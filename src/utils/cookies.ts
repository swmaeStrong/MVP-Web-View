/**
 * 쿠키 유틸리티 함수들
 * 테마와 언어 설정을 쿠키에 저장하고 불러오는 기능 제공
 */

import type { CustomColors } from '@/config/colors';
import { defaultColors } from '@/config/colors';

// 쿠키 설정 옵션
interface CookieOptions {
  expires?: number; // 만료일 (일 단위)
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

// 기본 쿠키 옵션
const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  expires: 365, // 1년
  path: '/',
  sameSite: 'lax',
};

/**
 * 쿠키 설정
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') return;

  const opts = { ...DEFAULT_COOKIE_OPTIONS, ...options };
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (opts.expires) {
    const date = new Date();
    date.setTime(date.getTime() + opts.expires * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  }

  if (opts.path) {
    cookieString += `; path=${opts.path}`;
  }

  if (opts.domain) {
    cookieString += `; domain=${opts.domain}`;
  }

  if (opts.secure) {
    cookieString += `; secure`;
  }

  if (opts.sameSite) {
    cookieString += `; samesite=${opts.sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * 쿠키 가져오기
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    let c = cookie.trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }

  return null;
}

/**
 * 쿠키 삭제
 */
export function deleteCookie(name: string, path: string = '/'): void {
  if (typeof document === 'undefined') return;

  setCookie(name, '', {
    expires: -1,
    path,
  });
}

/**
 * 서버 사이드에서 쿠키 파싱
 */
export function parseCookies(cookieHeader?: string): Record<string, string> {
  const cookies: Record<string, string> = {};

  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name && rest.length > 0) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(rest.join('='));
    }
  });

  return cookies;
}

// 테마 관련 쿠키 함수들
export const THEME_COOKIE_NAME = 'theme';

export function getThemeFromCookie(): 'light' | 'dark' | null {
  const theme = getCookie(THEME_COOKIE_NAME);
  if (theme === 'light' || theme === 'dark') {
    return theme;
  }
  return null;
}

export function setThemeCookie(theme: 'light' | 'dark'): void {
  setCookie(THEME_COOKIE_NAME, theme);
}

// 언어 관련 쿠키 함수들
export const LOCALE_COOKIE_NAME = 'locale';

export function getLocaleFromCookie(): 'ko' | 'en' | null {
  const locale = getCookie(LOCALE_COOKIE_NAME);
  if (locale === 'ko' || locale === 'en') {
    return locale;
  }
  return null;
}

export function setLocaleCookie(locale: 'ko' | 'en'): void {
  setCookie(LOCALE_COOKIE_NAME, locale);
}

/**
 * 서버 사이드에서 테마 가져오기
 */
export function getThemeFromServerCookies(cookieHeader?: string): 'light' | 'dark' | null {
  const cookies = parseCookies(cookieHeader);
  const theme = cookies[THEME_COOKIE_NAME];
  if (theme === 'light' || theme === 'dark') {
    return theme;
  }
  return null;
}

/**
 * 서버 사이드에서 언어 가져오기
 */
export function getLocaleFromServerCookies(cookieHeader?: string): 'ko' | 'en' | null {
  const cookies = parseCookies(cookieHeader);
  const locale = cookies[LOCALE_COOKIE_NAME];
  if (locale === 'ko' || locale === 'en') {
    return locale;
  }
  return null;
}

// 커스텀 컬러 관련 쿠키 함수들
export const MAIN_COLOR_COOKIE = 'mainColor';
export const BG_COLOR_COOKIE = 'bgColor';

export function getColorsFromCookie(): CustomColors {
  const mainColor = getCookie(MAIN_COLOR_COOKIE);
  const backgroundColor = getCookie(BG_COLOR_COOKIE);

  return {
    mainColor: mainColor || defaultColors.mainColor,
    backgroundColor: backgroundColor || defaultColors.backgroundColor
  };
}

export function setColorsCookie(colors: CustomColors): void {
  // 색상 값은 URL 인코딩하지 않고 직접 저장
  if (typeof document !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000); // 1년

    document.cookie = `${MAIN_COLOR_COOKIE}=${colors.mainColor}; expires=${expires.toUTCString()}; path=/; samesite=lax`;
    document.cookie = `${BG_COLOR_COOKIE}=${colors.backgroundColor}; expires=${expires.toUTCString()}; path=/; samesite=lax`;
  }
}

export function getColorsFromServerCookies(cookieHeader?: string): CustomColors {
  const cookies = parseCookies(cookieHeader);

  return {
    mainColor: cookies[MAIN_COLOR_COOKIE] || defaultColors.mainColor,
    backgroundColor: cookies[BG_COLOR_COOKIE] || defaultColors.backgroundColor
  };
}