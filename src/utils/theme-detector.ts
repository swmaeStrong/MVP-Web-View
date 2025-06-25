import { themeColors } from '@/styles/colors';

/**
 * 현재 시스템이 다크모드인지 확인하는 함수
 * @returns {boolean} 다크모드이면 true, 라이트모드이면 false
 */
export function isDarkMode(): boolean {
  if (typeof window === 'undefined') {
    // 서버사이드에서는 기본값으로 false 반환
    return false;
  }
  
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * 현재 테마 타입을 반환하는 함수
 * @returns {'dark' | 'light'} 현재 테마 타입
 */
export function getCurrentTheme(): 'dark' | 'light' {
  return isDarkMode() ? 'dark' : 'light';
}

/**
 * 현재 테마에 따른 컬러 객체를 반환하는 함수
 * @returns 현재 테마의 컬러 설정 객체
 */
export function getCurrentThemeColors() {
  const theme = getCurrentTheme();
  return themeColors[theme];
}

/**
 * 테마 변경을 감지하는 리스너를 등록하는 함수
 * @param {(isDark: boolean, theme: 'dark' | 'light') => void} callback 테마가 변경될 때 호출될 콜백 함수
 * @returns {() => void} 리스너를 제거하는 함수
 */
export function addThemeChangeListener(
  callback: (isDark: boolean, theme: 'dark' | 'light') => void
): () => void {
  if (typeof window === 'undefined') {
    // 서버사이드에서는 빈 함수 반환
    return () => {};
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    const isDark = e.matches;
    const theme = isDark ? 'dark' : 'light';
    
    console.log(`테마가 ${isDark ? '다크모드' : '라이트모드'}로 변경됨`);
    callback(isDark, theme);
  };

  // 리스너 등록
  mediaQuery.addEventListener('change', handleChange);

  // 리스너 제거 함수 반환
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}

/**
 * 테마에 따른 CSS 클래스를 반환하는 함수
 * @param {keyof typeof themeColors.dark.classes | keyof typeof themeColors.light.classes} type 클래스 타입
 * @returns {string} 현재 테마에 맞는 CSS 클래스
 */
export function getThemeClass(
  type: keyof typeof themeColors.dark.classes
): string {
  const theme = getCurrentTheme();
  return themeColors[theme].classes[type];
}

/**
 * 테마에 따른 색상 값을 반환하는 함수
 * @param {'background' | 'component'} type 색상 타입
 * @returns {string} 현재 테마에 맞는 색상 값
 */
export function getThemeColor(type: 'background' | 'component'): string {
  const theme = getCurrentTheme();
  return themeColors[theme][type];
}

/**
 * 테마에 따른 텍스트 색상을 반환하는 함수
 * @param {'primary' | 'secondary'} type 텍스트 타입
 * @returns {string} 현재 테마에 맞는 텍스트 색상
 */
export function getThemeTextColor(type: 'primary' | 'secondary'): string {
  const theme = getCurrentTheme();
  return themeColors[theme].text[type];
}

/**
 * 경고 색상을 반환하는 함수 (테마 무관)
 * @returns {string} 경고 색상
 */
export function getWarningColor(): string {
  return themeColors.common.warning;
}

/**
 * 경고 색상 CSS 클래스를 반환하는 함수 (테마 무관)
 * @returns {string} 경고 색상 CSS 클래스
 */
export function getWarningClass(): string {
  return themeColors.common.classes.warning;
}

// 타입 정의
export type ThemeType = 'dark' | 'light';
export type ThemeChangeCallback = (isDark: boolean, theme: ThemeType) => void;
export type ThemeClassType = keyof typeof themeColors.dark.classes;
export type ThemeColorType = 'background' | 'component';
export type ThemeTextType = 'primary' | 'secondary'; 