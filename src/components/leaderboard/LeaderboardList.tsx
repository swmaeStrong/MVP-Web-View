'use client';

import { useCurrentUser, User } from '@/stores/userStore';
import { extendedRankColors, rankColors } from '@/styles';
import Image from 'next/image';
import { useRef } from 'react';
import EmptyState from './EmptyState';

// CSS 애니메이션 추가
const styles = `
  @keyframes challenger-glow {
    0%, 100% { 
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.6), 
                  0 0 40px rgba(59, 130, 246, 0.4), 
                  inset 0 0 30px rgba(255, 255, 255, 0.1); 
    }
    50% { 
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.8), 
                  0 0 60px rgba(59, 130, 246, 0.6), 
                  inset 0 0 40px rgba(255, 255, 255, 0.2); 
    }
  }

  @keyframes grandmaster-glow {
    0%, 100% { 
      box-shadow: 0 0 15px rgba(239, 68, 68, 0.6), 
                  0 0 30px rgba(239, 68, 68, 0.4); 
    }
    50% { 
      box-shadow: 0 0 25px rgba(239, 68, 68, 0.8), 
                  0 0 45px rgba(239, 68, 68, 0.6); 
    }
  }

  @keyframes master-glow {
    0%, 100% { 
      box-shadow: 0 0 12px rgba(147, 51, 234, 0.6), 
                  0 0 25px rgba(147, 51, 234, 0.4); 
    }
    50% { 
      box-shadow: 0 0 20px rgba(147, 51, 234, 0.8), 
                  0 0 40px rgba(147, 51, 234, 0.6); 
    }
  }
`;

// User 타입은 이제 userStore에서 import (id: string, nickname: string만 사용)

// 리더보드 표시용 확장된 User 타입
type LeaderboardUser = User & {
  score: number;
  rank: number;
  isMe?: boolean; // 현재 유저 표시용 옵셔널 필드
};

interface LeaderboardListProps {
  users: LeaderboardUser[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  isFetchingNextPage: boolean;
  refetch: () => void;
  selectedPeriod: 'daily' | 'weekly' | 'monthly';
  selectedCategory: string;
  selectedDateIndex: number;
}

// 초 단위를 시간, 분 형식으로 변환하는 함수
// formatTime 함수 제거 (간소화된 User 타입에서 점수만 표시)

// 티어별 설정 정의
const tierConfig = {
  challenger: {
    icon: '/icons/rank/challenger.png',
    title: 'CHALLENGER',
    borderClass: 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-blue-50',
    glowAnimation: 'challenger-glow 2s ease-in-out infinite alternate',
    rankBg: 'bg-gradient-to-r from-yellow-400 to-blue-500',
    rankText: 'text-white',
    nameColor:
      'text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-blue-600 font-extrabold',
  },
  grandmaster: {
    icon: '/icons/rank/grandMaster.png',
    title: 'GRANDMASTER',
    borderClass: 'border-red-400 bg-gradient-to-r from-red-50 to-pink-50',
    glowAnimation: 'grandmaster-glow 2.5s ease-in-out infinite alternate',
    rankBg: 'bg-transparent border-red-300',
    rankText: 'text-red-500 font-bold',
    nameColor: 'text-red-600 font-extrabold',
  },
  master: {
    icon: '/icons/rank/master.png',
    title: 'MASTER',
    borderClass:
      'border-purple-500 bg-gradient-to-r from-purple-50 to-violet-50',
    glowAnimation: 'master-glow 3s ease-in-out infinite alternate',
    rankBg: 'bg-transparent border-purple-300',
    rankText: 'text-purple-500 font-bold',
    nameColor: 'text-purple-600 font-extrabold',
  },
  diamond: {
    icon: '/icons/rank/diamond.png',
    title: 'DIAMOND',
    borderClass: 'border-blue-300 bg-white',
    glowAnimation: '',
    rankBg: 'bg-transparent border-blue-300',
    rankText: 'text-blue-500 font-bold',
    nameColor: 'text-blue-600 font-bold',
  },
  emerald: {
    icon: '/icons/rank/emerald.png',
    title: 'EMERALD',
    borderClass: 'border-emerald-300 bg-white',
    glowAnimation: '',
    rankBg: 'bg-transparent border-emerald-300',
    rankText: 'text-emerald-500 font-bold',
    nameColor: 'text-emerald-600 font-bold',
  },
  platinum: {
    icon: '/icons/rank/platinum.png',
    title: 'PLATINUM',
    borderClass: 'border-slate-300 bg-white',
    glowAnimation: '',
    rankBg: 'bg-transparent border-slate-300',
    rankText: 'text-slate-500 font-bold',
    nameColor: 'text-slate-600 font-bold',
  },
  gold: {
    icon: '/icons/rank/gold.png',
    title: 'GOLD',
    borderClass: 'border-amber-300 bg-white',
    glowAnimation: '',
    rankBg: 'bg-transparent border-amber-300',
    rankText: 'text-amber-500 font-bold',
    nameColor: 'text-amber-600 font-bold',
  },
  silver: {
    icon: '/icons/rank/silver.png',
    title: 'SILVER',
    borderClass: 'border-gray-300 bg-white',
    glowAnimation: '',
    rankBg: 'bg-transparent border-gray-300',
    rankText: 'text-gray-500 font-bold',
    nameColor: 'text-gray-600 font-bold',
  },
  bronze: {
    icon: '/icons/rank/bronze.png',
    title: 'BRONZE',
    borderClass: 'border-orange-300 bg-white',
    glowAnimation: '',
    rankBg: 'bg-transparent border-orange-300',
    rankText: 'text-orange-500 font-bold',
    nameColor: 'text-orange-600 font-bold',
  },
};

// 순위에 따른 티어 계산 (100명 이상 기준)
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

// 티어별 스타일 가져오기
const getTierStyle = (rank: number, totalUsers: number) => {
  const tier = getTierByRank(rank, totalUsers);
  return tierConfig[tier];
};

// TierTooltip 컴포넌트 (임시로 여기에 포함)
import { useState } from 'react';

interface TierTooltipProps {
  tier: string;
  icon: string;
  title: string;
  className?: string;
}

const tierDescriptions = {
  challenger: {
    description: '최상위 1%의 전설적인 사용자들',
    requirement: '상위 1%',
    color: 'text-yellow-600',
    bgColor: 'bg-gradient-to-r from-yellow-50 to-blue-50',
    borderColor: 'border-yellow-400',
  },
  grandmaster: {
    description: '뛰어난 실력을 지닌 상위 랭커들',
    requirement: '상위 3%',
    color: 'text-red-600',
    bgColor: 'bg-gradient-to-r from-red-50 to-pink-50',
    borderColor: 'border-red-400',
  },
  master: {
    description: '마스터급 실력의 고수들',
    requirement: '상위 5%',
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-r from-purple-50 to-violet-50',
    borderColor: 'border-purple-400',
  },
  diamond: {
    description: '다이아몬드처럼 빛나는 실력자들',
    requirement: '상위 10%',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
  },
  emerald: {
    description: '꾸준한 성장을 보이는 상급자들',
    requirement: '상위 15%',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-400',
  },
  platinum: {
    description: '안정적인 실력의 플래티넘 등급',
    requirement: '상위 30%',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-400',
  },
  gold: {
    description: '황금빛 실력을 지닌 중급자들',
    requirement: '상위 50%',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-400',
  },
  silver: {
    description: '은빛 열정으로 노력하는 사용자들',
    requirement: '상위 80%',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-400',
  },
  bronze: {
    description: '시작하는 모든 이들을 응원합니다',
    requirement: '나머지',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-400',
  },
};

function TierTooltip({ tier, icon, title, className = '' }: TierTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tierInfo = tierDescriptions[tier as keyof typeof tierDescriptions];

  if (!tierInfo) return null;

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* 트리거 아이콘 */}
      <div className='cursor-help'>
        <Image
          src={icon}
          alt={title}
          width={20}
          height={20}
          className='opacity-70 transition-opacity duration-200 hover:opacity-100'
        />
      </div>

      {/* 툴팁 */}
      {isVisible && (
        <div
          className={`absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 transform rounded-lg border-2 p-4 shadow-lg ${tierInfo.bgColor} ${tierInfo.borderColor}`}
        >
          {/* 화살표 */}
          <div
            className={`absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-transparent ${tierInfo.borderColor.replace('border-', 'border-t-')}`}
          ></div>

          <div className='mb-3 flex items-center space-x-3'>
            <Image
              src={icon}
              alt={title}
              width={32}
              height={32}
              className='drop-shadow-sm'
            />
            <div>
              <h3 className={`text-lg font-bold ${tierInfo.color}`}>{title}</h3>
              <p className={`text-sm font-semibold ${tierInfo.color}`}>
                {tierInfo.requirement}
              </p>
            </div>
          </div>

          <p className='text-sm leading-relaxed text-gray-700'>
            {tierInfo.description}
          </p>
        </div>
      )}
    </div>
  );
}

export default function LeaderboardList({
  users,
  isLoading,
  isError,
  error,
  isFetchingNextPage,
  refetch,
  selectedPeriod,
  selectedCategory,
  selectedDateIndex,
}: LeaderboardListProps) {
  const currentUser = useCurrentUser();

  // 현재 유저 하이라이트를 위한 ref
  const currentUserRef = useRef<HTMLDivElement>(null);

  const getRankInfo = (index: number) => {
    const rank = index + 1;
    if (rank <= 10) {
      return rankColors[rank as keyof typeof rankColors];
    } else if (rank <= 20) {
      return extendedRankColors.expert;
    } else if (rank <= 35) {
      return extendedRankColors.challenger;
    } else {
      return extendedRankColors.rookie;
    }
  };

  // 로딩 및 에러 상태
  if (isLoading) {
    return (
      <div className='mb-8 flex justify-center'>
        <div className='rounded-lg border border-gray-100 bg-gradient-to-br from-purple-50/50 to-blue-50/50 p-8 text-center shadow-sm'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600'></div>
          <p className='text-gray-600'>리더보드 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError && error) {
    return (
      <div className='mb-8 flex justify-center'>
        <div className='rounded-lg border border-red-200 bg-gradient-to-br from-red-50/50 to-pink-50/50 p-8 text-center shadow-sm'>
          <p className='mb-4 font-medium text-red-600'>
            ❌ {error.message || '데이터를 불러오는 중 오류가 발생했습니다.'}
          </p>
          <p className='mb-4 text-sm text-gray-500'>
            서버 요청이 중단되었습니다. 잠시 후 다시 시도해주세요.
          </p>
          <button
            onClick={() => refetch()}
            className='rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700'
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <EmptyState
        selectedPeriod={selectedPeriod}
        selectedCategory={selectedCategory}
        selectedDateIndex={selectedDateIndex}
        refetch={refetch}
      />
    );
  }

  return (
    <>
      <style>{styles}</style>

      {/* 통합 리더보드 */}
      <div className='mb-8'>
        <div className='mb-6 text-center'>
          <h2 className='mb-2 text-2xl font-bold text-gray-800'>🏆 리더보드</h2>
          <p className='text-sm text-gray-600'>
            실시간 순위표 ({users.length}명)
          </p>
        </div>

        <div className='space-y-3'>
          {users.map((user: LeaderboardUser, index: number) => {
            const rank = index + 1;
            const rankInfo = getRankInfo(index);
            const topRankStyle = getTierStyle(rank, users.length);

            // 현재 유저인지 확인
            const isCurrentUser = currentUser && user.id === currentUser.id;

            return (
              <div
                key={`rank-${rank}-${user.id || user.nickname || index}`}
                data-user-id={user.id}
                className={`group relative flex items-center justify-between rounded-xl border-2 bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
                  topRankStyle
                    ? `${topRankStyle.borderClass} ring-opacity-50 ring-2`
                    : 'border-gray-200 hover:border-purple-200'
                } ${
                  isCurrentUser
                    ? topRankStyle
                      ? 'ring-4 ring-purple-300'
                      : 'border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 ring-2 ring-purple-300'
                    : ''
                }`}
                style={
                  topRankStyle
                    ? {
                        animation: topRankStyle.glowAnimation,
                      }
                    : {}
                }
              >
                {/* 좌측 - 순위 & 특별 아이콘 & 사용자 정보 */}
                <div className='flex items-center space-x-4'>
                  {/* 순위 표시 */}
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold transition-transform duration-200 group-hover:scale-110 ${
                      topRankStyle
                        ? `${topRankStyle.rankBg} ${topRankStyle.rankText} border-white shadow-lg`
                        : `${rankInfo.bgColor} ${rankInfo.textColor} ${rankInfo.borderColor}`
                    }`}
                  >
                    {rank}
                  </div>

                  {/* 순위 아이콘 */}
                  <div className='flex h-12 w-12 items-center justify-center'>
                    <Image
                      src={topRankStyle.icon}
                      alt={topRankStyle.title}
                      width={48}
                      height={48}
                      className='drop-shadow-lg transition-transform duration-200 group-hover:scale-110'
                    />
                  </div>

                  {/* 사용자 정보 */}
                  <div className='flex-1'>
                    <div className='flex items-center space-x-3'>
                      <h3
                        className={`text-lg font-bold transition-colors duration-200 ${
                          topRankStyle
                            ? topRankStyle.nameColor
                            : 'text-gray-800 group-hover:text-purple-700'
                        }`}
                      >
                        {user.nickname}
                      </h3>

                      {/* 사용자 표시 */}
                      {isCurrentUser && (
                        <span className='animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs font-bold text-white shadow-sm'>
                          YOU
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 우측 - 시간 정보 */}
                <div className='text-right'>
                  <div
                    className={`text-2xl font-bold transition-colors duration-200 ${
                      topRankStyle
                        ? 'text-gray-900'
                        : 'text-gray-900 group-hover:text-purple-700'
                    }`}
                  >
                    {user.score}
                  </div>
                  <div className='text-xs text-gray-500'>점수</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 무한 스크롤 로딩 표시 */}
      {isFetchingNextPage && (
        <div className='flex justify-center'>
          <div className='rounded-lg border border-gray-100 bg-gradient-to-br from-purple-50/50 to-blue-50/50 p-4 shadow-sm'>
            <div className='mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600'></div>
            <p className='text-sm text-gray-600'>
              더 많은 경쟁자들을 불러오는 중...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
