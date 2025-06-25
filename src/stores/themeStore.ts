import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  theme: 'dark' | 'light';
  setDarkMode: (isDark: boolean) => void;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      theme: 'light',
      setDarkMode: (isDark: boolean) => set({ 
        isDarkMode: isDark, 
        theme: isDark ? 'dark' : 'light' 
      }),
      toggleDarkMode: () => set((state) => ({ 
        isDarkMode: !state.isDarkMode,
        theme: state.isDarkMode ? 'light' : 'dark'
      })),
    }),
    {
      name: 'theme-storage',
    }
  )
);