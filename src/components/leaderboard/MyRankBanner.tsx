'use client';

import { useMyRank } from '@/hooks/useMyRank';
import {
  Award,
  ChevronUp,
  Clock,
  Crown,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
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

// 파티클 애니메이션 컴포넌트
const AnimatedParticles = ({ rank }: { rank: number | null }) => {
  if (!rank || rank > 3) return null;

  return (
    <div className='pointer-events-none absolute inset-0 overflow-hidden'>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`absolute animate-bounce ${
            rank === 1
              ? 'text-yellow-400'
              : rank === 2
                ? 'text-gray-400'
                : 'text-amber-500'
          }`}
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + (i % 2) * 20}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '2s',
          }}
        >
          <Star className='h-3 w-3 animate-pulse' />
        </div>
      ))}
    </div>
  );
};

// 상위 랭크 글로우 효과
const TopRankGlow = ({ rank }: { rank: number | null }) => {
  if (!rank || rank > 3) return null;

  const glowColor =
    rank === 1
      ? 'bg-yellow-400/20'
      : rank === 2
        ? 'bg-gray-400/20'
        : 'bg-amber-400/20';

  return (
    <div
      className={`absolute inset-0 ${glowColor} animate-pulse rounded-xl`}
    ></div>
  );
};

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
    bgGradient: 'from-gray-50 to-white', // 기본 스타일
    borderColor: 'border-gray-200',
    shadowColor: 'shadow-gray-100/50',
  },
  silver: {
    icon: '/icons/rank/silver.png',
    title: 'Silver',
    bgGradient: 'from-gray-50 to-white', // 기본 스타일
    borderColor: 'border-gray-200',
    shadowColor: 'shadow-gray-100/50',
  },
  bronze: {
    icon: '/icons/rank/bronze.png',
    title: 'Bronze',
    bgGradient: 'from-gray-50 to-white', // 기본 스타일
    borderColor: 'border-gray-200',
    shadowColor: 'shadow-gray-100/50',
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
  userId?: string; // 고정된 userId를 props로 받음
}

export default function MyRankBanner({
  category,
  period,
  selectedDateIndex,
  onScrollToMyRank,
  totalUsers = 1000, // 기본값 설정 (나중에 props로 받아올 수 있음)
  userId = 'a', // 기본값으로 'a' 사용
}: MyRankBannerProps) {
  // 날짜 계산 - 리더보드와 동일한 로직 사용
  const getDateForAPI = () => {
    const today = new Date();

    if (period === 'daily') {
      // 일간: selectedDateIndex에 따라 과거 날짜로
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() - selectedDateIndex);
      return targetDate.toISOString().split('T')[0];
    } else if (period === 'weekly') {
      // 주간: 현재 주차(0)는 오늘 날짜, 이전 주차는 7일씩 빼기
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() - selectedDateIndex * 7);
      return targetDate.toISOString().split('T')[0];
    } else if (period === 'monthly') {
      // 월간의 경우 해당 월의 1일 사용
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;

      let targetYear = currentYear;
      let targetMonth = currentMonth - selectedDateIndex;

      while (targetMonth <= 0) {
        targetMonth += 12;
        targetYear -= 1;
      }

      const yearStr = targetYear.toString();
      const monthStr = targetMonth.toString().padStart(2, '0');
      return `${yearStr}-${monthStr}-01`;
    }

    return today.toISOString().split('T')[0];
  };

  const date = getDateForAPI();

  console.log('🔷 MyRankBanner props:', { category, userId, date });

  const { myRank, rank, score, isLoading, isError } = useMyRank({
    category,
    type: period, // period를 type으로 전달
    date,
    userId, // props로 받은 userId 사용
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
      <div
        className='relative mb-6 rounded-xl border border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 p-4'
        style={{ zIndex: 1 }}
      >
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
      <div
        className='relative mb-6 rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 p-4'
        style={{ zIndex: 1 }}
      >
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
    <>
      <div
        className={`mb-6 rounded-xl border-2 bg-gradient-to-r ${getRankStyle(rank)} relative overflow-hidden p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
        style={{ zIndex: 1 }}
      >
        {/* 배경 효과들 */}
        <TopRankGlow rank={rank} />
        <AnimatedParticles rank={rank} />

        {/* 좌상단 장식 */}
        <div className='absolute top-2 left-2'>
          <Sparkles className='h-4 w-4 animate-pulse text-purple-400' />
        </div>

        {/* 우상단 순위 표시 강화 */}
        {rank && rank <= 10 && (
          <div className='absolute top-2 right-2 flex items-center space-x-1'>
            <Award
              className={`h-4 w-4 ${rank <= 3 ? 'text-yellow-500' : 'text-blue-500'}`}
            />
            <span className='text-xs font-bold text-gray-600'>TOP {rank}</span>
          </div>
        )}

        <div className='relative z-10 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            {/* 티어 아이콘 - 향상된 디자인 */}
            <div className='group relative'>
              <div className='absolute inset-0 rounded-full bg-white/30 blur-sm transition-all duration-300 group-hover:blur-md'></div>
              <Image
                src={tierInfo.icon}
                alt={tierInfo.title}
                width={56}
                height={56}
                className='relative z-10 drop-shadow-lg transition-transform duration-300 group-hover:scale-110'
              />
            </div>

            {/* 유저 정보 - 향상된 디자인 */}
            <div>
              <div className='flex items-center space-x-3'>
                <h3 className='text-xl font-bold tracking-wide text-gray-800'>
                  {myRank.nickname}
                </h3>
                <div className='flex items-center space-x-1'>
                  <span className='animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs font-bold text-white shadow-lg'>
                    YOU
                  </span>
                  {rank && rank <= 5 && (
                    <div className='animate-bounce'>
                      <Zap className='h-4 w-4 text-yellow-500' />
                    </div>
                  )}
                </div>
              </div>

              <div className='mt-2 flex items-center space-x-2 text-sm'>
                <div
                  className={`inline-flex items-center space-x-1 rounded-full px-2 py-1 ${
                    rank && rank <= 3
                      ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800'
                      : rank && rank <= 10
                        ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <IconComponent className={`h-3 w-3 ${rankDisplay.color}`} />
                  <span className={`font-bold ${rankDisplay.color}`}>
                    {rankDisplay.text} place
                  </span>
                </div>

                <span className='text-gray-400'>•</span>

                <div className='inline-flex items-center space-x-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 px-2 py-1'>
                  <Clock className='h-3 w-3 text-green-600' />
                  <span className='font-medium text-green-700'>
                    {formatTime(score || 0)}
                  </span>
                </div>

                <span className='text-gray-400'>•</span>

                <div className='inline-flex items-center space-x-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 px-2 py-1'>
                  <Star className='h-3 w-3 text-indigo-600' />
                  <span className='text-xs font-medium text-indigo-700'>
                    {tierInfo.title}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 순위 및 액션 - 향상된 디자인 */}
          <div className='text-right'>
            <div className='flex items-center justify-end space-x-3'>
              <div className='relative'>
                <div
                  className={`absolute inset-0 ${
                    rank && rank <= 3
                      ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20'
                      : rank && rank <= 10
                        ? 'bg-gradient-to-r from-blue-400/20 to-purple-400/20'
                        : 'bg-gray-400/10'
                  } rounded-full blur-lg`}
                ></div>

                <div
                  className={`relative flex h-16 w-16 items-center justify-center rounded-full ${
                    rank && rank <= 3
                      ? 'border-2 border-yellow-300 bg-gradient-to-r from-yellow-100 to-orange-100'
                      : rank && rank <= 10
                        ? 'border-2 border-blue-300 bg-gradient-to-r from-blue-100 to-purple-100'
                        : 'border-2 border-gray-300 bg-gradient-to-r from-gray-100 to-gray-50'
                  } shadow-lg`}
                >
                  <div className='text-center'>
                    <div className={`text-2xl font-bold ${rankDisplay.color}`}>
                      #{rank || '?'}
                    </div>
                  </div>
                </div>

                {rank && rank <= 3 && (
                  <div className='absolute -top-1 -right-1 animate-spin'>
                    <Star className='h-4 w-4 text-yellow-500' />
                  </div>
                )}
              </div>
            </div>

            <div className='mt-2 text-xs font-medium text-gray-600'>
              전체 {totalUsers}명 중
            </div>

            {onScrollToMyRank && rank && (
              <button
                onClick={onScrollToMyRank}
                className='mt-3 inline-flex items-center space-x-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1.5 text-xs font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'
              >
                <ChevronUp className='h-3 w-3' />
                <span>리더보드에서 찾기</span>
              </button>
            )}
          </div>
        </div>

        {/* 추가 정보 - 향상된 디자인 */}
        {rank && (
          <div className='relative mt-4'>
            <div className='absolute inset-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent'></div>
            <div className='flex items-center justify-between pt-4'>
              <div className='flex items-center space-x-6'>
                <div className='flex items-center space-x-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1.5'>
                  <Clock className='h-4 w-4 text-indigo-600' />
                  <span className='text-sm font-medium text-indigo-700'>
                    총 활동시간: {formatTime(score || 0)}
                  </span>
                </div>

                <div className='flex items-center space-x-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1.5'>
                  <TrendingUp className='h-4 w-4 text-green-600' />
                  <span className='text-sm font-medium text-green-700'>
                    상위 {Math.round((rank / totalUsers) * 100)}%
                  </span>
                </div>
              </div>

              <div className='flex items-center space-x-2 rounded-full bg-gradient-to-r from-gray-50 to-slate-50 px-3 py-1.5'>
                <div
                  className={`h-2 w-2 rounded-full ${
                    period === 'daily'
                      ? 'bg-blue-500'
                      : period === 'weekly'
                        ? 'bg-purple-500'
                        : 'bg-green-500'
                  } animate-pulse`}
                ></div>
                <span className='text-sm font-medium text-gray-700'>
                  {period === 'daily' && '오늘'}
                  {period === 'weekly' && '이번 주'}
                  {period === 'monthly' && '이번 달'} 기준
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 구분선 */}
      <div className='mb-6 flex justify-center'>
        <div className='h-px w-full max-w-md bg-gradient-to-r from-transparent via-gray-300 to-transparent'></div>
      </div>
    </>
  );
}
