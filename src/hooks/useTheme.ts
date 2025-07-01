import { themeColors } from '@/styles/colors';

/**
 * 테마 관리를 위한 통합 React Hook
 * 다크모드 고정 적용
 */
export function useTheme() {
  // 다크모드 고정
  const isDarkMode = true;
  const theme = 'dark' as const;
  const isClient = true; // SSR에서도 다크모드 고정이므로 항상 true

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
    isLight: false, // 항상 다크모드
    isClient,

    // 컬러 객체
    colors,

    // 유틸리티 함수들
    getThemeClass,
    getThemeColor,
    getThemeTextColor,
    getThemeTextColorValue,
    getWarningColor: () => themeColors.common.warning,
    getWarningClass: () => themeColors.common.classes.warning,
  };
} 