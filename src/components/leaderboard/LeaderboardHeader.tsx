'use client';

import { useTheme } from '@/hooks/useTheme';

export default function LeaderboardHeader() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className='mb-8 text-center'>
      <h1 className={`text-3xl font-bold sm:text-4xl ${
        isDarkMode 
          ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'
          : 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'
      }`}>
        🏆 리더보드
      </h1>
    </div>
  );
}
