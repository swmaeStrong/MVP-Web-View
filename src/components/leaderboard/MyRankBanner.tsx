'use client';

import { useMyRank } from '@/hooks/useMyRank';
import { useTheme } from '@/hooks/useTheme';
import { componentSizes, componentStates, spacing } from '@/styles/design-system';
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
import Image from 'next/image';

// 초 단위를 시간, 분 형식으로 변환하는 함수
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}분`;
  } else if (minutes === 0) {
    return `${hours}시간`;
  } else {
    return `${hours}시간 ${minutes}분`;
  }
};

// 파티클 애니메이션 컴포넌트 제거 (담백한 디자인)
const AnimatedParticles = ({ rank, isDarkMode }: { rank: number | null; isDarkMode: boolean }) => {
  return null; // 모든 파티클 애니메이션 제거
};

// 상위 랭크 글로우 효과 제거 (담백한 디자인)
const TopRankGlow = ({ rank, isDarkMode }: { rank: number | null; isDarkMode: boolean }) => {
  return null; // 모든 글로우 효과 제거
};

// 리더보드와 동일한 티어 계산 로직
const getTierByRank = (rank: number, totalUsers: number) => {
  const percentage = (rank / totalUsers) * 100;

  if (percentage <= 1) return 'challenger'; // 상위 1%
  if (percentage <= 3) return 'grandmaster'; // 상위 3%
  if (percentage <= 5) return 'master'; // 상위 5%
  if (percentage <= 10) return 'diamond'; // 상위 10%
  if (percentage <= 15) return 'emerald'; // 상위 15%
  if (percentage <= 30) return 'platinum'; // 상위 30%
  if (percentage <= 50) return 'gold'; // 상위 50%
  if (percentage <= 80) return 'silver'; // 상위 80%
  return 'bronze'; // 나머지
};

interface MyRankBannerProps {
  category: string;
  period: 'daily' | 'weekly' | 'monthly';
  selectedDateIndex: number;
  onScrollToMyRank?: () => void;
  totalUsers?: number; // 전체 사용자 수를 받아서 티어 계산에 사용
  userId?: string; // 고정된 userId를 props로 받음
}

export default function MyRankBanner({
  category,
  period,
  selectedDateIndex,
  onScrollToMyRank,
  totalUsers = 1000, // 기본값 설정 (나중에 props로 받아올 수 있음)
  userId, //
}: MyRankBannerProps) {
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();
  
  // 리더보드와 동일한 티어 설정
  const tierConfig = {
    challenger: {
      icon: '/icons/rank/challenger.png',
      title: 'Challenger',
      bgGradient: 'from-yellow-200 via-amber-100 to-blue-200',
      borderColor: 'border-yellow-400',
      shadowColor: 'shadow-yellow-300/60',
    },
    grandmaster: {
      icon: '/icons/rank/grandMaster.png',
      title: 'Grandmaster',
      bgGradient: 'from-red-200 via-rose-100 to-pink-200',
      borderColor: 'border-red-400',
      shadowColor: 'shadow-red-300/60',
    },
    master: {
      icon: '/icons/rank/master.png',
      title: 'Master',
      bgGradient: 'from-purple-200 via-violet-100 to-indigo-200',
      borderColor: 'border-purple-500',
      shadowColor: 'shadow-purple-300/60',
    },
    diamond: {
      icon: '/icons/rank/diamond.png',
      title: 'Diamond',
      bgGradient: 'from-blue-50 via-cyan-50 to-sky-50',
      borderColor: 'border-blue-400',
      shadowColor: 'shadow-blue-300/60',
    },
    emerald: {
      icon: '/icons/rank/emerald.png',
      title: 'Emerald',
      bgGradient: 'from-emerald-100 to-emerald-50',
      borderColor: 'border-emerald-300',
      shadowColor: 'shadow-emerald-200/50',
    },
    platinum: {
      icon: '/icons/rank/platinum.png',
      title: 'Platinum',
      bgGradient: 'from-slate-100 to-slate-50',
      borderColor: 'border-slate-300',
      shadowColor: 'shadow-slate-200/50',
    },
    gold: {
      icon: '/icons/rank/gold.png',
      title: 'Gold',
      bgGradient: '',
      borderColor: '',
      shadowColor: 'shadow-gray-100/50',
    },
    silver: {
      icon: '/icons/rank/silver.png',
      title: 'Silver',
      bgGradient: '',
      borderColor: '',
      shadowColor: 'shadow-gray-100/50',
    },
    bronze: {
      icon: '/icons/rank/bronze.png',
      title: 'Bronze',
      bgGradient: '',
      borderColor: '',
      shadowColor: 'shadow-gray-100/50',
    },
  };

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
      return { text: '순위 없음', color: getThemeTextColor('secondary'), icon: Users };
    if (rank === 1)
      return { text: '1st', color: 'text-yellow-600', icon: Crown };
    if (rank === 2) return { text: '2nd', color: isDarkMode ? 'text-gray-400' : 'text-gray-600', icon: Crown };
    if (rank === 3)
      return { text: '3rd', color: 'text-amber-600', icon: Crown };
    return { text: `${rank}th`, color: isDarkMode ? 'text-blue-400' : 'text-blue-600', icon: TrendingUp };
  };

  // 리더보드와 동일한 티어 로직 사용
  const getTierInfo = (rank: number | null) => {
    if (!rank) return tierConfig.bronze;
    const tier = getTierByRank(rank, totalUsers);
    return tierConfig[tier];
  };

  const getRankStyle = (rank: number | null) => {
    const tierInfo = getTierInfo(rank);
    // 다크모드일 때는 모든 티어에서 테마 색상 사용, 라이트모드일 때만 상위 티어 그라데이션 유지
    const tier = getTierByRank(rank || 999, totalUsers);
    if (!isDarkMode && ['challenger', 'grandmaster', 'master', 'diamond', 'emerald'].includes(tier)) {
      return `bg-gradient-to-r ${tierInfo.bgGradient} ${tierInfo.borderColor} shadow-lg ${tierInfo.shadowColor}`;
    } else {
      return `${getThemeClass('component')} ${getThemeClass('border')} shadow-lg`;
    }
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
      <div
        className={`relative ${spacing.section.normal} ${componentSizes.large.borderRadius} ${componentSizes.medium.border} border-orange-200 ${componentSizes.medium.padding} ${componentSizes.small.shadow} ${getThemeClass('component')}`}
        style={{ zIndex: 1 }}
      >
        <div className='flex items-center space-x-3'>
          <Users className='h-8 w-8 text-orange-500' />
          <div>
            <p className={`font-medium ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}>
              순위 정보를 불러올 수 없습니다
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-orange-300' : 'text-orange-600'}`}>
              로그인하거나 활동 기록을 만들어보세요!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const rankDisplay = getRankDisplay(rank);
  const IconComponent = rankDisplay.icon;
  const tierInfo = getTierInfo(rank);

  return (
    <>
      <div
        className={`mb-3 lg:mb-4 rounded-lg border p-3 lg:p-4 ${getRankStyle(rank)}`}
        style={{ zIndex: 1 }}
      >

        {/* 미니멀 내 순위 정보 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            {/* 티어 아이콘 - 심플 */}
            <Image
              src={tierInfo.icon}
              alt={tierInfo.title}
              width={32}
              height={32}
              className='drop-shadow-sm lg:w-10 lg:h-10'
            />

            {/* 핵심 정보만 */}
            <div>
              <div className='flex items-center space-x-2'>
                <h3 className={`text-sm lg:text-base font-bold ${getThemeTextColor('primary')}`}>
                  {myRank.nickname}
                </h3>
                <span className='rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-xs font-bold text-white'>
                  YOU
                </span>
              </div>
              <div className='flex items-center space-x-2 mt-0.5'>
                <span className={`text-xs font-medium ${getThemeTextColor('primary')}`}>
                  {formatTime(score || 0)}
                </span>
                <span className={`text-xs ${getThemeTextColor('secondary')}`}>•</span>
                <span className={`text-xs ${getThemeTextColor('secondary')}`}>
                  상위 {Math.round(((rank || 0) / totalUsers) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* 순위 숫자 - 심플 */}
          <div className='text-right'>
            <div className={`text-xl lg:text-2xl font-bold ${getThemeTextColor('primary')}`}>
              #{rank || '?'}
            </div>
            {onScrollToMyRank && rank && (
              <button
                onClick={onScrollToMyRank}
                className='mt-1 text-xs text-blue-500 hover:text-blue-600 transition-colors'
              >
                내 리더보드에서 찾기
              </button>
            )}
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