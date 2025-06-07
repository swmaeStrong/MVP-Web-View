'use client';

import { extendedRankColors, rankColors } from '@/styles';
import { Crown, Medal, Trophy, Users } from 'lucide-react';
import EmptyState from './EmptyState';

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
      {/* 상위 3명 - 큰 화면에서만 특별 디스플레이, 작은 화면에서는 일반 리스트 */}
      <div className='mb-8 hidden md:block'>
        <div className='mb-6 text-center'>
          <h2 className='mb-2 text-2xl font-bold text-gray-800'>
            🏆 명예의 전당
          </h2>
          <p className='text-sm text-gray-600'>최고의 성과를 달성한 챔피언들</p>
        </div>

        <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3'>
          {users.slice(0, 3).map((user: User, index: number) => {
            const rank = index + 1;
            const configs = [
              {
                medal: '🥇',
                icon: <Crown className='h-8 w-8' />,
                title: '1위',
                bgGradient: 'from-purple-400 via-violet-500 to-blue-600',
                borderGradient: 'from-purple-300 to-violet-400',
                textGradient: 'from-purple-600 to-blue-700',
                shadowColor: 'shadow-purple-400/40',
                glowColor: 'ring-purple-400/30',
                accentGradient: 'from-purple-300 via-violet-400 to-blue-500',
              },
              {
                medal: '🥈',
                icon: <Trophy className='h-7 w-7' />,
                title: '2위',
                bgGradient: 'from-indigo-400 via-blue-500 to-cyan-600',
                borderGradient: 'from-indigo-300 to-blue-400',
                textGradient: 'from-indigo-600 to-blue-700',
                shadowColor: 'shadow-indigo-400/40',
                glowColor: 'ring-indigo-400/30',
                accentGradient: 'from-indigo-300 via-blue-400 to-cyan-500',
              },
              {
                medal: '🥉',
                icon: <Medal className='h-6 w-6' />,
                title: '3위',
                bgGradient: 'from-slate-400 via-gray-500 to-blue-600',
                borderGradient: 'from-slate-300 to-gray-400',
                textGradient: 'from-slate-600 to-blue-700',
                shadowColor: 'shadow-slate-400/40',
                glowColor: 'ring-slate-400/30',
                accentGradient: 'from-slate-300 via-gray-400 to-blue-500',
              },
            ];

            const config = configs[index];

            return (
              <div
                key={`top3-${index}-${user.id || user.name || index}`}
                className={`group relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br ${config.bgGradient} p-8 shadow-xl ${config.shadowColor} transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${user.isMe ? `ring-2 ring-white/40 ${config.glowColor}` : `ring-1 ring-white/20`}`}
                style={{
                  background: `linear-gradient(135deg, var(--tw-gradient-stops)), 
                              radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
                  borderColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {/* 품격있는 배경 효과 */}
                <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-white/12 to-transparent'></div>
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-tl ${config.accentGradient} opacity-12`}
                ></div>
                <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/8 to-transparent'></div>
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${config.bgGradient} opacity-15 blur-lg`}
                ></div>
                <div className='absolute inset-0 rounded-3xl bg-gradient-to-t from-black/5 via-transparent to-white/10'></div>

                {/* 세련된 빛 효과 */}
                <div className='absolute top-6 left-6 h-1 w-4 animate-pulse rounded-full bg-white/25 opacity-70 blur-sm'></div>
                <div className='absolute top-8 right-8 h-3 w-1 animate-pulse rounded-full bg-white/20 opacity-60 blur-sm delay-1000'></div>
                <div className='absolute bottom-6 left-1/2 h-1 w-6 -translate-x-1/2 transform animate-pulse rounded-full bg-white/30 opacity-80 blur-sm delay-2000'></div>
                <div className='absolute top-1/3 left-4 h-2 w-1 -translate-y-1/2 transform animate-pulse rounded-full bg-white/18 opacity-50 blur-sm delay-3000'></div>
                <div className='absolute right-5 bottom-1/3 h-1 w-1 -translate-y-1/2 transform animate-pulse rounded-full bg-white/15 opacity-40 blur-md delay-4000'></div>

                {/* 우아한 순위 표시 */}
                <div className='relative z-10 mb-6 pt-4 text-center'>
                  <div
                    className={`bg-gradient-to-r text-6xl font-bold ${config.textGradient} mb-3 bg-clip-text tracking-wider text-transparent drop-shadow-lg`}
                    style={{
                      filter:
                        'drop-shadow(0 0 12px rgba(255,255,255,0.6)) drop-shadow(0 0 24px rgba(255,255,255,0.3))',
                      textShadow:
                        '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2)',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      letterSpacing: '0.1em',
                    }}
                  >
                    #{rank}
                  </div>
                </div>

                {/* 우아한 사용자 정보 */}
                <div className='relative z-10 mb-6 text-center'>
                  <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg ring-2 ring-white/30 backdrop-blur-sm'>
                    <Users className='h-8 w-8 text-gray-600' />
                  </div>
                  <h3
                    className='mb-3 text-lg font-semibold tracking-wide text-white drop-shadow-md'
                    style={{
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {user.name}
                  </h3>
                  {user.isMe && (
                    <div className='inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/30 backdrop-blur-sm'>
                      <span className='opacity-90'>✨ YOU ✨</span>
                    </div>
                  )}
                </div>

                {/* 시간 정보 */}
                <div className='relative z-10 text-center'>
                  <div className='mb-2 text-3xl font-black text-white drop-shadow-lg'>
                    {formatTime(user.hours)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 작은 화면에서 모든 사용자를 일반 리스트로 표시 */}
      <div className='mb-8 block md:hidden'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='flex items-center gap-2 text-lg font-bold text-gray-800'>
            🏆 리더보드
            <span className='text-sm font-normal text-gray-500'>
              ({users.length}명)
            </span>
          </h2>
          <div className='rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500'>
            실시간 업데이트
          </div>
        </div>

        <div className='space-y-2'>
          {users.map((user: User, index: number) => {
            const rank = index + 1;
            const rankInfo = getRankInfo(index);

            return (
              <div
                key={`mobile-rank-${rank}-${user.id || user.name || index}`}
                className={`group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-purple-200 hover:shadow-lg ${user.isMe ? 'border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 ring-2 ring-purple-300' : ''}`}
              >
                {/* 좌측 - 순위 & 사용자 정보 */}
                <div className='flex items-center space-x-4'>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold ${rankInfo.bgColor} ${rankInfo.textColor} ${rankInfo.borderColor} transition-transform duration-200 group-hover:scale-110`}
                  >
                    {rank}
                  </div>

                  <div className='flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 transition-all duration-200 group-hover:border-purple-300 group-hover:from-purple-100 group-hover:to-blue-100'>
                    <Users className='h-6 w-6 text-gray-600 group-hover:text-purple-600' />
                  </div>

                  <div className='flex-1'>
                    <div className='flex items-center space-x-2'>
                      <h3 className='font-bold text-gray-800 transition-colors duration-200 group-hover:text-purple-700'>
                        {user.name}
                      </h3>
                      {user.isMe && (
                        <span className='animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs font-bold text-white shadow-sm'>
                          YOU
                        </span>
                      )}
                    </div>
                    <p className='text-xs text-gray-500 transition-colors duration-200 group-hover:text-purple-600'>
                      {rank}위 도전자
                    </p>
                  </div>
                </div>

                {/* 우측 - 시간 정보 */}
                <div className='text-right'>
                  <div className='text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-purple-700'>
                    {formatTime(user.hours)}
                  </div>
                  <div className='text-xs text-gray-500'>작업 시간</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4위 이하 - 경쟁적인 리스트 (큰 화면에서만) */}
      {users.length > 3 && (
        <div className='mb-8 hidden md:block'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='flex items-center gap-2 text-lg font-bold text-gray-800'>
              🔥 경쟁자들
              <span className='text-sm font-normal text-gray-500'>
                ({users.length - 3}명)
              </span>
            </h2>
            <div className='rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500'>
              실시간 업데이트
            </div>
          </div>

          <div className='space-y-2'>
            {users.slice(3).map((user: User, index: number) => {
              const rank = index + 4;
              const rankInfo = getRankInfo(index + 3);

              return (
                <div
                  key={`rank-${rank}-${user.id || user.name || index}`}
                  className={`group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-purple-200 hover:shadow-lg ${user.isMe ? 'border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 ring-2 ring-purple-300' : ''}`}
                >
                  {/* 좌측 - 순위 & 사용자 정보 */}
                  <div className='flex items-center space-x-4'>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold ${rankInfo.bgColor} ${rankInfo.textColor} ${rankInfo.borderColor} transition-transform duration-200 group-hover:scale-110`}
                    >
                      {rank}
                    </div>

                    <div className='flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 transition-all duration-200 group-hover:border-purple-300 group-hover:from-purple-100 group-hover:to-blue-100'>
                      <Users className='h-6 w-6 text-gray-600 group-hover:text-purple-600' />
                    </div>

                    <div className='flex-1'>
                      <div className='flex items-center space-x-2'>
                        <h3 className='font-bold text-gray-800 transition-colors duration-200 group-hover:text-purple-700'>
                          {user.name}
                        </h3>
                        {user.isMe && (
                          <span className='animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs font-bold text-white shadow-sm'>
                            YOU
                          </span>
                        )}
                      </div>
                      <p className='text-xs text-gray-500 transition-colors duration-200 group-hover:text-purple-600'>
                        {rank}위 도전자
                      </p>
                    </div>
                  </div>

                  {/* 우측 - 시간 정보 */}
                  <div className='text-right'>
                    <div className='text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-purple-700'>
                      {formatTime(user.hours)}
                    </div>
                    <div className='text-xs text-gray-500'>작업 시간</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
