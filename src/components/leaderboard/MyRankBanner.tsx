'use client';

import { useMyRank } from '@/hooks/useMyRank';
import { useTheme } from '@/hooks/useTheme';
import { componentSizes, componentStates, spacing } from '@/styles/design-system';
import ErrorState from '@/components/common/ErrorState';
import {
  getKSTDate,
  getKSTDateStringFromDate,
  getKSTMonthlyDateString,
  getKSTWeeklyDateString,
} from '@/utils/timezone';
import {
  Award,
  ChevronUp,
  Clock,
  Crown,
  Star,
  TrendingUp,
  Users
} from 'lucide-react';

// Function to convert seconds to hours, minutes format
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}min`;
  } else if (minutes === 0) {
    return `${hours}hr`;
  } else {
    return `${hours}hr ${minutes}min`;
  }
};

// 파티클 애니메이션 컴포넌트 제거 (담백한 디자인)
const AnimatedParticles = ({ rank, isDarkMode }: { rank: number | null; isDarkMode: boolean }) => {
  return null; // 모든 파티클 애니메이션 제거
};

// Top 랭크 글로우 효과 제거 (담백한 디자인)
const TopRankGlow = ({ rank, isDarkMode }: { rank: number | null; isDarkMode: boolean }) => {
  return null; // 모든 글로우 효과 제거
};


interface MyRankBannerProps {
  category: string;
  period: 'daily' | 'weekly' | 'monthly';
  selectedDateIndex: number;
  onScrollToMyRank?: () => void;
  totalUsers?: number;
  userId?: string; // 고정된 userId를 props로 받음
}

export default function MyRankBanner({
  category,
  period,
  selectedDateIndex,
  onScrollToMyRank,
  totalUsers = 1000,
  userId, //
}: MyRankBannerProps) {
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();

  // 날짜 계산 - 한국 시간대 기준
  const getDateForAPI = () => {
    const today = getKSTDate();

    if (period === 'daily') {
      // 일간: selectedDateIndex에 따라 과거 날짜로
      const targetDate = new Date(
        today.getTime() - selectedDateIndex * 24 * 60 * 60 * 1000
      );
      return getKSTDateStringFromDate(targetDate);
    } else if (period === 'weekly') {
      // 주간: 월요일-일요일 기준으로 해당 주의 월요일 날짜
      return getKSTWeeklyDateString(selectedDateIndex);
    } else if (period === 'monthly') {
      // 월간의 경우 - 해당 월의 1일로 조회
      return getKSTMonthlyDateString(selectedDateIndex);
    }

    return getKSTDateStringFromDate(today);
  };

  const date = getDateForAPI();

  const { myRank, rank, score, isLoading, isError } = useMyRank({
    category,
    type: period, // period를 type으로 전달
    date,
    userId, // props로 받은 userId 사용
  });

  const getRankDisplay = (rank: number | null) => {
    if (!rank)
      return { text: 'No Rank', color: getThemeTextColor('secondary'), icon: Users };
    if (rank === 1)
      return { text: '1st', color: 'text-yellow-600', icon: Crown };
    if (rank === 2) return { text: '2nd', color: isDarkMode ? 'text-gray-400' : 'text-gray-600', icon: Crown };
    if (rank === 3)
      return { text: '3rd', color: 'text-amber-600', icon: Crown };
    return { text: `${rank}th`, color: isDarkMode ? 'text-blue-400' : 'text-blue-600', icon: TrendingUp };
  };

  const getRankStyle = () => {
    return `${getThemeClass('component')} ${getThemeClass('border')} shadow-lg`;
  };

  if (isLoading) {
    return (
      <div
        className={`relative ${spacing.section.normal} ${componentSizes.large.borderRadius} ${componentSizes.medium.border} ${componentSizes.medium.padding} ${componentSizes.small.shadow} ${getThemeClass('border')} ${getThemeClass('component')} ${componentStates.loading.animate}`}
        style={{ zIndex: 1 }}
      >
        <div className='flex items-center space-x-4'>
          <div className={`h-12 w-12 animate-pulse rounded-full ${getThemeClass('componentSecondary')}`}></div>
          <div className='flex-1'>
            <div className={`mb-2 h-4 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
            <div className={`h-3 w-24 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !myRank) {
    return (
      <div className={`relative ${spacing.section.normal}`} style={{ zIndex: 1 }}>
        <ErrorState
          title="Unable to load rank information"
          message="Please log in or create activity records to see your ranking!"
          size="small"
          icon={Users}
          showBorder={true}
        />
      </div>
    );
  }

  const rankDisplay = getRankDisplay(rank);
  const IconComponent = rankDisplay.icon;

  return (
    <>
      <div
        className={`mb-3 lg:mb-4 rounded-lg border p-3 lg:p-4 ${getRankStyle()}`}
        style={{ zIndex: 1 }}
      >

        {/* 미니멀 내 순위 정보 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            {/* 핵심 정보만 */}
            <div>
              <div className='flex items-center space-x-2'>
                <h3 className={`text-sm lg:text-base font-bold ${getThemeTextColor('primary')}`}>
                  {myRank.nickname}
                </h3>
              </div>
              <div className='flex items-center space-x-2 mt-0.5'>
                <span className={`text-xs font-medium ${getThemeTextColor('primary')}`}>
                  {formatTime(score || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* 순위 숫자 - 심플 */}
          <div className='text-right'>
            <div className={`text-xl lg:text-2xl font-bold ${getThemeTextColor('primary')}`}>
              #{rank || '?'}
            </div>
          </div>
        </div>
      </div>

      {/* 미니멀 구분선 */}
      <div className='mb-2 lg:mb-3'>
        <div 
          className='h-px w-full'
          style={{
            background: isDarkMode 
              ? 'linear-gradient(to right, transparent, rgb(120, 120, 120), transparent)' 
              : 'linear-gradient(to right, transparent, rgb(209, 213, 219), transparent)'
          }}
        ></div>
      </div>
    </>
  );
}