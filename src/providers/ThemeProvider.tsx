'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { setThemeCookie } from '@/utils/cookies';

interface ThemeContextType {
  isDarkMode: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isClient: boolean;
}

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  // 서버에서 전달받은 초기 테마로 시작
  const [isDarkMode, setIsDarkMode] = useState(initialTheme === 'dark');
  const [isClient, setIsClient] = useState(false);
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

  // 테마 토글 함수
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    theme,
    toggleTheme,
    isClient,
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