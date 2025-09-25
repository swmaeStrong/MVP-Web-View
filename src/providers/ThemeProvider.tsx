'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { setThemeCookie, getColorsFromCookie, setColorsCookie } from '@/utils/cookies';
import type { CustomColors } from '@/config/colors';

interface ThemeContextType {
  isDarkMode: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isClient: boolean;
  colors: CustomColors;
  updateColors: (colors: CustomColors) => void;
}

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme: 'light' | 'dark';
  initialColors: CustomColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, initialTheme, initialColors }: ThemeProviderProps) {
  // 서버에서 전달받은 초기 테마로 시작
  const [isDarkMode, setIsDarkMode] = useState(initialTheme === 'dark');
  const [isClient, setIsClient] = useState(false);
  const [colors, setColors] = useState<CustomColors>(initialColors);
  const theme: 'light' | 'dark' = isDarkMode ? 'dark' : 'light';

  // 클라이언트 사이드 초기화
  useEffect(() => {
    setIsClient(true);
  }, []);

  // HTML 클래스 업데이트 및 쿠키 저장
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // 클라이언트에서만 쿠키 저장
    if (isClient) {
      setThemeCookie(isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, isClient]);

  // CSS 변수 및 배경색 업데이트
  useEffect(() => {
    if (isClient) {
      const html = document.documentElement;

      // 루트 CSS 변수 설정
      html.style.setProperty('--main-color', colors.mainColor);
      html.style.setProperty('--bg-color', colors.backgroundColor);
      html.style.setProperty('--gradient-main', `linear-gradient(to right, ${colors.mainColor}, #2563eb)`);

      // 다크모드 클래스에도 동일한 변수 설정
      const darkModeStyle = document.querySelector('style[data-theme="dark"]');
      if (!darkModeStyle) {
        const style = document.createElement('style');
        style.setAttribute('data-theme', 'dark');
        style.textContent = `
          .dark {
            --main-color: ${colors.mainColor};
            --bg-color: ${colors.backgroundColor === '#f5fafc' ? '#383838' : colors.backgroundColor};
            --gradient-main: linear-gradient(to right, ${colors.mainColor}, #2563eb);
          }
        `;
        document.head.appendChild(style);
      } else {
        darkModeStyle.textContent = `
          .dark {
            --main-color: ${colors.mainColor};
            --bg-color: ${colors.backgroundColor === '#f5fafc' ? '#383838' : colors.backgroundColor};
            --gradient-main: linear-gradient(to right, ${colors.mainColor}, #2563eb);
          }
        `;
      }

      document.body.style.backgroundColor = isDarkMode && colors.backgroundColor === '#f5fafc' ? '#383838' : colors.backgroundColor;
    }
  }, [colors, isDarkMode, isClient]);

  // 테마 토글 함수
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // 컬러 업데이트 함수
  const updateColors = (newColors: CustomColors) => {
    setColors(newColors);
    if (isClient) {
      setColorsCookie(newColors);
    }
  };

  const value = {
    isDarkMode,
    theme,
    toggleTheme,
    isClient,
    colors,
    updateColors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}