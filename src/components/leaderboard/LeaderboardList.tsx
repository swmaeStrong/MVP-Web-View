'use client';

import { extendedRankColors, rankColors } from '@/styles';
import Image from 'next/image';
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

interface User {
  id: number;
  name: string;
  hours: number;
  avatar: string;
  isMe: boolean;
  category: string;
  trend: 'up' | 'down' | 'same';
  streak: number;
  todayGain: number;
  level: number;
}

interface LeaderboardListProps {
  users: User[];
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
const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (h === 0 && m === 0) return '0m';
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

// 상위 3위 특별 스타일 가져오기
const getTopRankStyle = (rank: number) => {
  if (rank === 1) {
    return {
      icon: '/icons/rank/challenger.png',
      title: 'CHALLENGER',
      borderClass:
        'border-yellow-400 bg-gradient-to-r from-yellow-50 to-blue-50',
      glowAnimation: 'challenger-glow 2s ease-in-out infinite alternate',
      rankBg: 'bg-gradient-to-r from-yellow-400 to-blue-500',
      rankText: 'text-white',
      nameColor:
        'text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-blue-600 font-extrabold',
    };
  } else if (rank === 2) {
    return {
      icon: '/icons/rank/grandMaster.png',
      title: 'GRANDMASTER',
      borderClass: 'border-red-400 bg-gradient-to-r from-red-50 to-pink-50',
      glowAnimation: 'grandmaster-glow 2.5s ease-in-out infinite alternate',
      rankBg: 'bg-transparent border-red-500',
      rankText: 'text-red-600 font-bold',
      nameColor: 'text-red-600 font-extrabold',
    };
  } else if (rank === 3) {
    return {
      icon: '/icons/rank/master.png',
      title: 'MASTER',
      borderClass:
        'border-purple-500 bg-gradient-to-r from-purple-50 to-violet-50',
      glowAnimation: 'master-glow 3s ease-in-out infinite alternate',
      rankBg: 'bg-transparent border-purple-500',
      rankText: 'text-purple-600 font-bold',
      nameColor: 'text-purple-600 font-extrabold',
    };
  }
  return null;
};

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
          {users.map((user: User, index: number) => {
            const rank = index + 1;
            const rankInfo = getRankInfo(index);
            const topRankStyle = getTopRankStyle(rank);

            return (
              <div
                key={`rank-${rank}-${user.id || user.name || index}`}
                className={`group relative flex items-center justify-between rounded-xl border-2 bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
                  topRankStyle
                    ? `${topRankStyle.borderClass} ring-opacity-50 ring-2`
                    : 'border-gray-200 hover:border-purple-200'
                } ${
                  user.isMe
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
                  {(topRankStyle || rank > 3) && (
                    <div className='flex h-12 w-12 items-center justify-center'>
                      <Image
                        src={
                          topRankStyle
                            ? topRankStyle.icon
                            : '/icons/rank/bronze.png'
                        }
                        alt={topRankStyle ? topRankStyle.title : 'BRONZE'}
                        width={48}
                        height={48}
                        className='drop-shadow-lg transition-transform duration-200 group-hover:scale-110'
                      />
                    </div>
                  )}

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
                        {user.name}
                      </h3>

                      {/* 사용자 표시 */}
                      {user.isMe && (
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
                    {formatTime(user.hours)}
                  </div>
                  <div className='text-xs text-gray-500'>작업 시간</div>
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
