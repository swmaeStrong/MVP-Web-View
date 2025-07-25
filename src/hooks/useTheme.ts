import { themeColors } from '@/styles/colors';

/**
 * 테마 관리를 위한 통합 React Hook
 * 라이트모드 고정 적용
 */
export function useTheme() {
  // 라이트모드 고정
  const isDarkMode = false;
  const theme = 'light' as const;
  const isClient = true; // SSR에서도 라이트모드 고정이므로 항상 true

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

  // 자주 사용되는 카드 스타일 유틸리티 (스타일 시스템 단순화)
  const getCommonCardClass = () => {
    return `bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm bg-white shadow-lg transition-all duration-200 ${getThemeClass('border')} ${getThemeClass('component')}`;
  };

  // 자주 사용되는 호버 가능한 카드 스타일
  const getHoverableCardClass = () => {
    return `${getCommonCardClass()} hover:shadow-xl hover:-translate-y-1`;
  };

  return {
    // 상태
    theme,
    isDarkMode,
    isLight: true, // 항상 라이트모드
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
    
    // 단순화된 스타일 유틸리티들
    getCommonCardClass,
    getHoverableCardClass,
  };
} 