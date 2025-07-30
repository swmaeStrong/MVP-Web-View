'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { FONT_SIZES } from '@/styles/font-sizes';

export default function LeaderboardHeader() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className='mb-4 text-center'>
      <h1 className={`${FONT_SIZES.LEADERBOARD.HEADER} font-bold ${
        isDarkMode 
          ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'
          : 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'
      }`}>
        🏆 리더보드
      </h1>
    </div>
  );
}
