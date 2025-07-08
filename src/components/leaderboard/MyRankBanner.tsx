'use client';

import { useMyRank } from '@/hooks/useMyRank';
import { useTheme } from '@/hooks/useTheme';
import { componentSizes, componentStates, spacing } from '@/styles/design-system';
import ErrorState from '@/components/common/ErrorState';
import { processLeaderboardDetails, ProcessedDetail, getCategoryDisplayName, formatScoreToMinutes } from '@/utils/leaderboard';
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

  // total 카테고리의 details 처리
  const processedDetails = category === 'total' && myRank?.details 
    ? processLeaderboardDetails(myRank.details)
    : [];

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

  if (isError || (!isLoading && !myRank)) {
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
                  {myRank?.nickname}
                </h3>
              </div>
              <div className='flex items-center space-x-2 mt-0.5'>
                <span className={`text-xs font-medium ${getThemeTextColor('primary')}`}>
                  {category === 'total' ? formatScoreToMinutes(score || 0) : formatTime(score || 0)}
                </span>
                <span className={`text-xs ${getThemeTextColor('secondary')}`}>
                  {category === 'total' ? 'Total Time' : 'Activity Time'}
                </span>
              </div>
              
              {/* Details for total category - Stacked bar chart */}
              {category === 'total' && processedDetails.length > 0 && (
                <div className='mt-2 flex items-center gap-3'>
                  {/* Stacked progress bar */}
                  <div className={`relative h-5 w-24 lg:w-32 rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className='flex h-full'>
                      {processedDetails.map((detail: ProcessedDetail, detailIndex: number) => {
                        // 카테고리 색상 가져오기 - 조화로운 색상 팔레트
                        const categoryColor = detail.category === 'others' 
                          ? 'bg-gray-400' 
                          : detail.category === 'development' ? 'bg-purple-500'
                          : detail.category === 'documentation' ? 'bg-indigo-500'
                          : detail.category === 'llm' ? 'bg-violet-500'
                          : detail.category === 'design' ? 'bg-blue-500'
                          : 'bg-gray-400';
                        
                        const hoverColor = detail.category === 'others'
                          ? 'hover:bg-gray-500'
                          : detail.category === 'development' ? 'hover:bg-purple-600'
                          : detail.category === 'documentation' ? 'hover:bg-indigo-600'
                          : detail.category === 'llm' ? 'hover:bg-violet-600'
                          : detail.category === 'design' ? 'hover:bg-blue-600'
                          : 'hover:bg-gray-500';
                          
                        return (
                          <div
                            key={detailIndex}
                            className={`relative group transition-all duration-200 ${categoryColor} ${hoverColor}`}
                            style={{ width: `${detail.percentage}%` }}
                          >
                            {/* Tooltip on hover */}
                            <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10`}>
                              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-900'} text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap`}>
                                <div className='font-medium'>
                                  {getCategoryDisplayName(detail.category)}
                                </div>
                                <div className='text-gray-300'>
                                  {formatScoreToMinutes(detail.score)} ({detail.percentage}%)
                                </div>
                              </div>
                              {/* Tooltip arrow */}
                              <div className={`absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 ${isDarkMode ? 'border-gray-800' : 'border-gray-900'} border-l-transparent border-r-transparent`}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Compact details */}
                  <div className='flex gap-2 text-xs'>
                    {processedDetails.slice(0, 2).map((detail: ProcessedDetail, detailIndex: number) => (
                      <div key={detailIndex} className='flex items-center gap-1'>
                        <div className={`w-2 h-2 rounded ${
                          detail.category === 'development' ? 'bg-purple-500'
                          : detail.category === 'documentation' ? 'bg-indigo-500'
                          : detail.category === 'llm' ? 'bg-violet-500'
                          : detail.category === 'design' ? 'bg-blue-500'
                          : 'bg-gray-400'
                        }`} />
                        <span className={`${getThemeTextColor('secondary')}`}>
                          {detail.percentage}%
                        </span>
                      </div>
                    ))}
                    {processedDetails.length > 2 && (
                      <div className='flex items-center gap-1'>
                        <div className='w-2 h-2 rounded bg-gray-400' />
                        <span className={`${getThemeTextColor('secondary')}`}>
                          {processedDetails.find(d => d.category === 'others')?.percentage || 0}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
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