import {
    addThemeChangeListener,
    getCurrentTheme,
    getCurrentThemeColors,
    getThemeClass,
    getThemeColor,
    getThemeTextColor,
    getWarningClass,
    getWarningColor,
    isDarkMode,
    type ThemeType,
} from '@/utils/theme-detector';
import { useEffect, useState } from 'react';

/**
 * 테마 관리를 위한 React Hook
 * @returns 테마 관련 상태와 유틸리티 함수들
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeType>('light');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    setIsClient(true);
    setTheme(getCurrentTheme());

    // 테마 변경 리스너 등록
    const removeListener = addThemeChangeListener((isDark, newTheme) => {
      setTheme(newTheme);
    });

    // 컴포넌트 언마운트 시 리스너 제거
    return removeListener;
  }, []);

  // 현재 테마의 컬러 객체
  const colors = getCurrentThemeColors();

  return {
    // 상태
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isClient, // SSR 대응

    // 컬러 객체
    colors,

    // 유틸리티 함수들
    getClass: getThemeClass,
    getColor: getThemeColor,
    getTextColor: getThemeTextColor,
    getWarningColor,
    getWarningClass,
    isDarkMode,
    getCurrentTheme,
  };
}

/**
 * 간단한 테마 감지만 필요한 경우 사용하는 경량 Hook
 * @returns 현재 테마가 다크모드인지 여부
 */
export function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(isDarkMode());

    const removeListener = addThemeChangeListener((isDarkMode) => {
      setIsDark(isDarkMode);
    });

    return removeListener;
  }, []);

  return isDark;
} 