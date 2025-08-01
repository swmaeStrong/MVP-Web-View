'use client';

import StateDisplay from '@/components/common/StateDisplay';
import { useMyRank } from '@/hooks/data/useMyRank';
import { useTheme } from '@/hooks/ui/useTheme';
import { themeColors } from '@/styles/colors';
import { componentSizes, componentStates, spacing } from '@/styles/design-system';
import { FONT_SIZES } from '@/styles/font-sizes';
import { processLeaderboardDetails } from '@/utils/leaderboard';
import {
  getKSTDate,
  getKSTDateStringFromDate,
  getKSTMonthlyDateString,
  getKSTWeeklyDateString,
} from '@/utils/timezone';
import {
  Crown,
  Eye,
  TrendingUp
} from 'lucide-react';

// Function to convert seconds to hours, minutes format
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
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
  isLoadingToMyRank?: boolean; // 스크롤 로딩 상태
}

export default function MyRankBanner({
  category,
  period,
  selectedDateIndex,
  onScrollToMyRank,
  totalUsers = 1000,
  userId, //
  isLoadingToMyRank = false,
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
      return { text: 'No Rank', color: getThemeTextColor('secondary'), icon: TrendingUp };
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

  if (isError || (!isLoading && !myRank && !rank)) {
    return (
      <div className={`relative ${spacing.section.normal}`} style={{ zIndex: 1 }}>
        <div className={`border rounded-lg p-6 ${
          isDarkMode ? `${themeColors.dark.classes.borderLight} ${themeColors.dark.classes.componentSecondary}/50` : `${themeColors.light.classes.borderLight} ${themeColors.light.classes.componentSecondary}/50`
        }`}>
          <StateDisplay
            type="empty"
            title="No Rank Data"
            message="Please log in or create activity records to see your ranking!"
            size="medium"
            showBorder={false}
          />
        </div>
      </div>
    );
  }

  const rankDisplay = getRankDisplay(rank);
  const IconComponent = rankDisplay.icon;

  return (
    <>
      <div
        className={`mb-4 rounded-lg border p-4 ${getRankStyle()}`}
        style={{ zIndex: 1 }}
      >

        {/* 미니멀 내 순위 정보 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            {/* 핵심 정보만 */}
            <div>
              <div className='flex items-center space-x-2'>
                <h3 className={`${FONT_SIZES.LEADERBOARD.PRIMARY} font-bold ${getThemeTextColor('primary')}`}>
                  {myRank?.nickname || '내 닉네임'}
                </h3>
              </div>
              <div className='flex items-center space-x-2 mt-0.5'>
                <span className={`${FONT_SIZES.LEADERBOARD.SECONDARY} ${getThemeTextColor('secondary')}`}>
                  {category === 'total' ? 'Total Time' : 'Activity Time'}
                </span>
              </div>
            </div>
          </div>

          {/* 우측 - 등수 표시 또는 내 순위 찾기 버튼 */}
          <div className='flex items-center space-x-3'>
            {rank ? (
              // rank가 있을 때
              <>
                <div className={`${FONT_SIZES.LEADERBOARD.RANK} font-bold whitespace-nowrap ${getThemeTextColor('primary')}`}>
                  {rank === 1 ? '1st'
                  : rank === 2 ? '2nd' 
                  : rank === 3 ? '3rd'
                  : `${rank}th`}
                </div>
                {onScrollToMyRank && (
                  <button
                    onClick={onScrollToMyRank}
                    disabled={isLoadingToMyRank}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border ${FONT_SIZES.LEADERBOARD.BUTTON} font-medium transition-all duration-200 ${
                      isLoadingToMyRank 
                        ? `cursor-not-allowed opacity-50 ${getThemeClass('border')} ${getThemeClass('componentSecondary')} ${getThemeTextColor('secondary')}`
                        : `${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} hover:${getThemeClass('borderLight')} hover:scale-105 active:scale-95`
                    }`}
                  >
                    {isLoadingToMyRank ? (
                      <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Eye size={12} />
                    )}
                    <span>{isLoadingToMyRank ? 'Finding...' : 'Find My Rank'}</span>
                  </button>
                )}
              </>
            ) : (
              // rank가 없을 때
              <div className={`${FONT_SIZES.LEADERBOARD.SECONDARY} ${getThemeTextColor('secondary')}`}>
                순위 정보 없음
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 미니멀 구분선 */}
      <div className='mb-3'>
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