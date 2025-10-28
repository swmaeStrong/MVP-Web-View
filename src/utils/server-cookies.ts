import { cookies } from 'next/headers';

import type { CustomColors } from '@/config/colors';
import { defaultColors } from '@/config/colors';
import type { SupportedLocale } from '@/config/i18n';

/**
 * 서버 컴포넌트에서 테마 읽기
 */
export async function getThemeFromServerCookie(): Promise<'light' | 'dark'> {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme');

  if (theme?.value === 'dark') {
    return 'dark';
  }

  // 쿠키가 없으면 기본값 light
  return 'light';
}

/**
 * 서버 컴포넌트에서 언어 읽기
 */
export async function getLocaleFromServerCookie(): Promise<SupportedLocale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale');

  if (locale?.value === 'ko' || locale?.value === 'en') {
    return locale.value as SupportedLocale;
  }

  // 쿠키가 없으면 기본값 ko
  return 'ko';
}

/**
 * 서버 컴포넌트에서 커스텀 컬러 읽기
 */
export async function getColorsFromServerCookie(): Promise<CustomColors> {
  const cookieStore = await cookies();
  const mainColor = cookieStore.get('mainColor');
  const bgColor = cookieStore.get('bgColor');

  return {
    mainColor: mainColor?.value || defaultColors.mainColor,
    backgroundColor: bgColor?.value || defaultColors.backgroundColor
  };
}

/**
 * 서버에서 초기 설정 가져오기
 */
export async function getServerSettings() {
  const [theme, locale, colors] = await Promise.all([
    getThemeFromServerCookie(),
    getLocaleFromServerCookie(),
    getColorsFromServerCookie(),
  ]);

  return {
    theme,
    locale,
    colors,
  };
}