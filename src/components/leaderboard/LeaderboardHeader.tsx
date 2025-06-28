'use client';

import { useTheme } from '@/hooks/useTheme';

export default function LeaderboardHeader() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className='mb-4 lg:mb-6 text-center'>
      <h1 className={`text-2xl lg:text-3xl font-bold ${
        isDarkMode 
          ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'
          : 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'
      }`}>
        🏆 리더보드
      </h1>
    </div>
  );
}
