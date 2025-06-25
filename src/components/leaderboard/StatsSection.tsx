'use client';

import { Users, Zap } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { componentSizes, componentStates, spacing } from '@/styles/design-system';

// User 타입은 userStore에서 import
import { User } from '@/stores/userStore';

interface StatsSectionProps {
  users: User[];
}

// 실시간 경쟁 표시기 컴포넌트 (분리)
export function LiveIndicator() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`${spacing.section.normal} flex justify-center`}>
      <div className={`relative flex transform items-center gap-3 rounded-full px-6 py-3 text-white shadow-lg transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-purple-500 to-blue-500'
          : 'bg-gradient-to-r from-purple-600 to-blue-600'
      }`}>
        <div className='relative'>
          <div className={`h-3 w-3 rounded-full bg-white`}></div>
        </div>
        <span className='text-lg font-bold tracking-wide'>
          🔥 실시간 경쟁 중
        </span>
        <Zap className={`h-5 w-5`} />
      </div>
    </div>
  );
}

// 총 경쟁자 정보 컴포넌트 (분리)
export function CompetitorStats({ users }: StatsSectionProps) {
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();
  const totalCompetitors = users.length;

  return (
    <div className={`group relative overflow-hidden ${componentSizes.large.borderRadius} ${componentSizes.medium.border} ${componentSizes.large.padding} ${componentSizes.large.shadow} ${componentStates.hoverable.transition} ${
      isDarkMode 
        ? `${getThemeClass('component')} ${getThemeClass('border')}` 
        : 'bg-gradient-to-br from-purple-50 via-purple-100 to-blue-100 border-purple-200'
    }`}>
      <div className={`absolute -top-4 -right-4 text-6xl transition-opacity duration-300 group-hover:opacity-20 ${
        isDarkMode ? 'opacity-5' : 'opacity-10'
      } ${getThemeTextColor('secondary')}`}>
        <Users />
      </div>
      <div className='relative z-10 text-center'>
        <div className='mb-2 flex items-center justify-center gap-2'>
          <Users className={`h-6 w-6 ${isDarkMode ? getThemeTextColor('accent') : 'text-purple-600'}`} />
          <span className={`text-sm font-semibold tracking-wide uppercase ${
            isDarkMode ? getThemeTextColor('primary') : 'text-purple-700'
          }`}>
            총 경쟁자
          </span>
        </div>
        <div className={`mb-1 text-4xl font-black ${
          isDarkMode ? getThemeTextColor('primary') : 'text-purple-700'
        }`}>
          {totalCompetitors}
        </div>
        <div className={`text-xs font-medium ${
          isDarkMode ? getThemeTextColor('secondary') : 'text-purple-600'
        }`}>명의 도전자들</div>
      </div>
      <div className={`absolute right-0 bottom-0 left-0 h-1 rounded-b-xl ${
        isDarkMode 
          ? 'bg-gradient-to-r from-purple-400 to-blue-400'
          : 'bg-gradient-to-r from-purple-400 to-blue-400'
      }`}></div>
    </div>
  );
}

// 기존 StatsSection은 하위 호환성을 위해 유지 (전체 표시)
export default function StatsSection({ users }: StatsSectionProps) {
  return (
    <>
      <LiveIndicator />
      <div className='mb-8 flex justify-center'>
        <CompetitorStats users={users} />
      </div>
    </>
  );
}
