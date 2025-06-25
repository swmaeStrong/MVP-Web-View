import { useThemeStore } from '@/stores/themeStore';
import { themeColors } from '@/styles/colors';
import { useEffect, useState } from 'react';

/**
 * 테마 관리를 위한 통합 React Hook
 * Zustand store를 활용하여 전역 상태 관리
 */
export function useTheme() {
  const { isDarkMode, theme, setDarkMode, toggleDarkMode } = useThemeStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 현재 테마의 컬러 객체
  const colors = themeColors[theme];

  // 유틸리티 함수들
  const getThemeClass = (type: keyof typeof themeColors.dark.classes) => {
    return colors.classes[type];
  };

  const getThemeColor = (type: 'background' | 'component' | 'componentSecondary' | 'border' | 'borderLight') => {
    return colors[type];
  };

  const getThemeTextColor = (type: 'primary' | 'secondary' | 'accent') => {
    return colors.classes[`text${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof colors.classes];
  };

  const getThemeTextColorValue = (type: 'primary' | 'secondary' | 'accent') => {
    return colors.text[type];
  };

  return {
    // 상태
    theme,
    isDarkMode,
    isLight: !isDarkMode,
    isClient,

    // 컬러 객체
    colors,

    // 액션
    setDarkMode,
    toggleDarkMode,

    // 유틸리티 함수들
    getThemeClass,
    getThemeColor,
    getThemeTextColor,
    getThemeTextColorValue,
    getWarningColor: () => themeColors.common.warning,
    getWarningClass: () => themeColors.common.classes.warning,
  };
} 