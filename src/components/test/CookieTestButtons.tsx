'use client';

import { useState } from 'react';

import { useLanguage } from '@/providers/LanguageProvider';
import { useThemeContext } from '@/providers/ThemeProvider';
import { Button } from '@/shadcn/ui/button';

export default function CookieTestButtons() {
  const { theme, toggleTheme, colors, updateColors } = useThemeContext();
  const { locale, setLocale } = useLanguage();
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleLanguageToggle = () => {
    const newLocale = locale === 'ko' ? 'en' : 'ko';
    setLocale(newLocale);
    // 페이지 새로고침해서 서버 사이드 변경사항 확인
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    // 페이지 새로고침해서 서버 사이드 변경사항 확인
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleColorChange = (type: 'mainColor' | 'backgroundColor', value: string) => {
    const newColors = { ...colors, [type]: value };
    updateColors(newColors);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cookie Test</h3>

      <Button
        onClick={handleLanguageToggle}
        variant="outline"
        size="sm"
        className="w-full"
      >
        Language: {locale} → {locale === 'ko' ? 'en' : 'ko'}
      </Button>

      <Button
        onClick={handleThemeToggle}
        variant="outline"
        size="sm"
        className="w-full"
      >
        Theme: {theme} → {theme === 'light' ? 'dark' : 'light'}
      </Button>

      <Button
        onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
        variant="outline"
        size="sm"
        className="w-full"
      >
        Custom Colors {isColorPickerOpen ? '▲' : '▼'}
      </Button>

      {isColorPickerOpen && (
        <div className="flex flex-col gap-2 p-2 border rounded">
          <div className="flex items-center gap-2">
            <label className="text-xs flex-1">Main:</label>
            <input
              type="color"
              value={colors.mainColor}
              onChange={(e) => handleColorChange('mainColor', e.target.value)}
              className="w-16 h-6"
            />
            <span className="text-xs">{colors.mainColor}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs flex-1">BG:</label>
            <input
              type="color"
              value={colors.backgroundColor}
              onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
              className="w-16 h-6"
            />
            <span className="text-xs">{colors.backgroundColor}</span>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        <p>Current: {locale}, {theme}</p>
        <p className="text-xs">Auto-reload for server-side</p>
      </div>
    </div>
  );
}