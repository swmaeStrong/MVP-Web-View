'use client';

import { useMyRank } from '@/hooks/useMyRank';
import { Clock, Crown, TrendingUp, Users } from 'lucide-react';
import Image from 'next/image';

// 리더보드와 동일한 티어 설정
const tierConfig = {
  challenger: {
    icon: '/icons/rank/challenger.png',
    title: 'Challenger',
    bgGradient: 'from-yellow-100 via-yellow-50 to-blue-100',
    borderColor: 'border-yellow-400',
    shadowColor: 'shadow-yellow-200/50',
  },
  grandmaster: {
    icon: '/icons/rank/grandMaster.png',
    title: 'Grandmaster',
    bgGradient: 'from-red-100 to-red-50',
    borderColor: 'border-red-400',
    shadowColor: 'shadow-red-200/50',
  },
  master: {
    icon: '/icons/rank/master.png',
    title: 'Master',
    bgGradient: 'from-purple-100 to-purple-50',
    borderColor: 'border-purple-400',
    shadowColor: 'shadow-purple-200/50',
  },
  diamond: {
    icon: '/icons/rank/diamond.png',
    title: 'Diamond',
    bgGradient: 'from-blue-100 to-blue-50',
    borderColor: 'border-blue-300',
    shadowColor: 'shadow-blue-200/50',
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
    bgGradient: 'from-amber-100 to-amber-50',
    borderColor: 'border-amber-300',
    shadowColor: 'shadow-amber-200/50',
  },
  silver: {
    icon: '/icons/rank/silver.png',
    title: 'Silver',
    bgGradient: 'from-gray-100 to-gray-50',
    borderColor: 'border-gray-300',
    shadowColor: 'shadow-gray-200/50',
  },
  bronze: {
    icon: '/icons/rank/bronze.png',
    title: 'Bronze',
    bgGradient: 'from-orange-100 to-orange-50',
    borderColor: 'border-orange-300',
    shadowColor: 'shadow-orange-200/50',
  },
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
}

export default function MyRankBanner({
  category,
  period,
  selectedDateIndex,
  onScrollToMyRank,
  totalUsers = 1000, // 기본값 설정 (나중에 props로 받아올 수 있음)
}: MyRankBannerProps) {
  // 날짜 계산 (임시로 오늘 날짜 사용, 실제로는 selectedDateIndex 활용)
  const today = new Date();
  const date = today.toISOString().split('T')[0];

  const { myRank, rank, score, isLoading, isError } = useMyRank({
    category,
    date,
  });

  const getRankDisplay = (rank: number | null) => {
    if (!rank)
      return { text: '순위 없음', color: 'text-gray-500', icon: Users };
    if (rank === 1)
      return { text: '1st', color: 'text-yellow-600', icon: Crown };
    if (rank === 2) return { text: '2nd', color: 'text-gray-500', icon: Crown };
    if (rank === 3)
      return { text: '3rd', color: 'text-amber-600', icon: Crown };
    return { text: `${rank}th`, color: 'text-blue-600', icon: TrendingUp };
  };

  // 리더보드와 동일한 티어 로직 사용
  const getTierInfo = (rank: number | null) => {
    if (!rank) return tierConfig.bronze;
    const tier = getTierByRank(rank, totalUsers);
    return tierConfig[tier];
  };

  const getRankStyle = (rank: number | null) => {
    const tierInfo = getTierInfo(rank);
    return `${tierInfo.bgGradient} ${tierInfo.borderColor} shadow-lg ${tierInfo.shadowColor}`;
  };

  if (isLoading) {
    return (
      <div className='mb-6 rounded-xl border border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 p-4'>
        <div className='flex items-center space-x-4'>
          <div className='h-12 w-12 animate-pulse rounded-full bg-gray-300'></div>
          <div className='flex-1'>
            <div className='mb-2 h-4 w-32 animate-pulse rounded bg-gray-300'></div>
            <div className='h-3 w-24 animate-pulse rounded bg-gray-200'></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !myRank) {
    return (
      <div className='mb-6 rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 p-4'>
        <div className='flex items-center space-x-3'>
          <Users className='h-8 w-8 text-orange-500' />
          <div>
            <p className='font-medium text-orange-700'>
              순위 정보를 불러올 수 없습니다
            </p>
            <p className='text-sm text-orange-600'>
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
    <div
      className={`mb-6 rounded-xl border-2 bg-gradient-to-r ${getRankStyle(rank)} p-4 transition-all duration-300 hover:scale-[1.02]`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          {/* 티어 아이콘 - 리더보드와 동일한 로직 */}
          <div className='relative'>
            <Image
              src={tierInfo.icon}
              alt={tierInfo.title}
              width={48}
              height={48}
              className='drop-shadow-sm'
            />
            {rank && rank <= 3 && (
              <div className='absolute -top-1 -right-1 animate-pulse'>
                <Crown className='h-4 w-4 text-yellow-500' />
              </div>
            )}
          </div>

          {/* 유저 정보 */}
          <div>
            <div className='flex items-center space-x-2'>
              <h3 className='text-lg font-bold text-gray-800'>
                {myRank.nickname}
              </h3>
              <span className='animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1 text-xs font-bold text-white'>
                YOU
              </span>
            </div>
            <div className='flex items-center space-x-2 text-sm'>
              <span className={`font-bold ${rankDisplay.color}`}>
                {rankDisplay.text} place
              </span>
              <span className='text-gray-400'>•</span>
              <span className='text-gray-600'>점수: {score || 0}</span>
              <span className='text-gray-400'>•</span>
              <span className='text-xs text-gray-600'>{tierInfo.title}</span>
            </div>
          </div>
        </div>

        {/* 순위 및 액션 */}
        <div className='text-right'>
          <div className='flex items-center space-x-2'>
            <IconComponent className={`h-6 w-6 ${rankDisplay.color}`} />
            <div>
              <div className={`text-2xl font-bold ${rankDisplay.color}`}>
                #{rank || '?'}
              </div>
              <div className='text-xs text-gray-500'>순위</div>
            </div>
          </div>

          {onScrollToMyRank && rank && (
            <button
              onClick={onScrollToMyRank}
              className='mt-2 text-xs text-blue-600 underline hover:text-blue-800'
            >
              리더보드에서 찾기
            </button>
          )}
        </div>
      </div>

      {/* 추가 정보 */}
      {rank && (
        <div className='mt-3 flex items-center justify-between border-t border-gray-200/50 pt-3'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-1 text-xs text-gray-600'>
              <Clock className='h-3 w-3' />
              <span>점수: {score || 0}</span>
            </div>
          </div>

          <div className='text-xs text-gray-500'>
            {period === 'daily' && '오늘'}
            {period === 'weekly' && '이번 주'}
            {period === 'monthly' && '이번 달'} 기준
          </div>
        </div>
      )}
    </div>
  );
}
