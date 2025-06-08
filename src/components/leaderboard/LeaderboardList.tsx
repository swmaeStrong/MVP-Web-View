'use client';

import { extendedRankColors, rankColors } from '@/styles';
import { Users } from 'lucide-react';
import EmptyState from './EmptyState';

// CSS 애니메이션 추가
const styles = `
  @keyframes glow {
    0% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3), 0 0 40px rgba(147, 51, 234, 0.2), 0 0 60px rgba(147, 51, 234, 0.1); }
    100% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.5), 0 0 60px rgba(147, 51, 234, 0.3), 0 0 90px rgba(147, 51, 234, 0.2); }
  }
  
  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes champion-glow {
    0% { 
      box-shadow: 0 0 40px rgba(255, 215, 0, 0.8), 
                  0 0 80px rgba(255, 215, 0, 0.6), 
                  0 0 120px rgba(255, 215, 0, 0.4),
                  inset 0 0 60px rgba(255, 255, 255, 0.2); 
    }
    50% { 
      box-shadow: 0 0 60px rgba(255, 215, 0, 1), 
                  0 0 120px rgba(255, 215, 0, 0.8), 
                  0 0 180px rgba(255, 215, 0, 0.6),
                  inset 0 0 80px rgba(255, 255, 255, 0.3); 
    }
    100% { 
      box-shadow: 0 0 40px rgba(255, 215, 0, 0.8), 
                  0 0 80px rgba(255, 215, 0, 0.6), 
                  0 0 120px rgba(255, 215, 0, 0.4),
                  inset 0 0 60px rgba(255, 255, 255, 0.2); 
    }
  }

  @keyframes silver-glow {
    0% { 
      box-shadow: 0 0 30px rgba(192, 192, 192, 0.8), 
                  0 0 60px rgba(192, 192, 192, 0.6), 
                  0 0 90px rgba(192, 192, 192, 0.4); 
    }
    50% { 
      box-shadow: 0 0 45px rgba(192, 192, 192, 1), 
                  0 0 90px rgba(192, 192, 192, 0.8), 
                  0 0 135px rgba(192, 192, 192, 0.6); 
    }
    100% { 
      box-shadow: 0 0 30px rgba(192, 192, 192, 0.8), 
                  0 0 60px rgba(192, 192, 192, 0.6), 
                  0 0 90px rgba(192, 192, 192, 0.4); 
    }
  }

  @keyframes bronze-glow {
    0% { 
      box-shadow: 0 0 25px rgba(205, 127, 50, 0.8), 
                  0 0 50px rgba(205, 127, 50, 0.6), 
                  0 0 75px rgba(205, 127, 50, 0.4); 
    }
    50% { 
      box-shadow: 0 0 40px rgba(205, 127, 50, 1), 
                  0 0 80px rgba(205, 127, 50, 0.8), 
                  0 0 120px rgba(205, 127, 50, 0.6); 
    }
    100% { 
      box-shadow: 0 0 25px rgba(205, 127, 50, 0.8), 
                  0 0 50px rgba(205, 127, 50, 0.6), 
                  0 0 75px rgba(205, 127, 50, 0.4); 
    }
  }

  @keyframes pulse-crown {
    0%, 100% { transform: translateY(-8px) scale(1); }
    50% { transform: translateY(-12px) scale(1.1); }
  }

  @keyframes fire-flicker {
    0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
    25% { transform: scale(1.05) rotate(1deg); opacity: 1; }
    50% { transform: scale(0.98) rotate(-1deg); opacity: 0.9; }
    75% { transform: scale(1.02) rotate(0.5deg); opacity: 1; }
  }

  @keyframes magical-sparkle {
    0% { opacity: 0; transform: scale(0) rotate(0deg); }
    50% { opacity: 1; transform: scale(1) rotate(180deg); }
    100% { opacity: 0; transform: scale(0) rotate(360deg); }
  }

  @keyframes victory-bounce {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-15px) scale(1.05); }
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
                medal: '🏆',
                crown: '👑',
                fire: '🔥',
                title: '🥇 CHAMPION',
                subtitle: '절대적 왕좌',
                bgGradient: 'from-yellow-400 via-yellow-500 to-orange-600',
                borderGradient: 'from-yellow-300 to-orange-400',
                textGradient: 'from-yellow-600 to-orange-700',
                shadowColor: 'shadow-yellow-500/60',
                glowColor: 'ring-yellow-400/50',
                accentGradient: 'from-yellow-300 via-orange-400 to-red-500',
                animation: 'champion-glow 2s ease-in-out infinite alternate',
                specialEffect: 'animate-pulse',
                sparkleColor: 'bg-yellow-300',
                message: '전설이 탄생했다! 🌟',
              },
              {
                medal: '🥈',
                crown: '⚡',
                fire: '💎',
                title: '🥈 CHALLENGER',
                subtitle: '1위를 노리는 자',
                bgGradient: 'from-slate-300 via-slate-400 to-slate-600',
                borderGradient: 'from-slate-200 to-slate-500',
                textGradient: 'from-slate-600 to-slate-800',
                shadowColor: 'shadow-slate-500/60',
                glowColor: 'ring-slate-400/50',
                accentGradient: 'from-slate-200 via-slate-400 to-slate-600',
                animation: 'silver-glow 2.5s ease-in-out infinite alternate',
                specialEffect: 'animate-bounce',
                sparkleColor: 'bg-slate-300',
                message: '왕좌를 위협하는 도전자! ⚔️',
              },
              {
                medal: '🥉',
                crown: '💫',
                fire: '🌟',
                title: '🥉 WARRIOR',
                subtitle: '정상을 향한 의지',
                bgGradient: 'from-amber-600 via-orange-600 to-red-700',
                borderGradient: 'from-amber-500 to-red-600',
                textGradient: 'from-amber-700 to-red-800',
                shadowColor: 'shadow-amber-600/60',
                glowColor: 'ring-amber-500/50',
                accentGradient: 'from-amber-500 via-orange-600 to-red-700',
                animation: 'bronze-glow 3s ease-in-out infinite alternate',
                specialEffect: 'animate-pulse',
                sparkleColor: 'bg-amber-400',
                message: '불타는 전사의 혼! 🔥',
              },
            ];

            const config = configs[index];

            return (
              <div
                key={`top3-${index}-${user.id || user.name || index}`}
                className={`group relative overflow-hidden rounded-3xl border-4 bg-gradient-to-br ${config.bgGradient} p-8 shadow-2xl ${config.shadowColor} transform transition-all duration-700 hover:scale-110 hover:shadow-2xl ${user.isMe ? `ring-4 ring-white/60 ${config.glowColor} animate-pulse` : `ring-2 ring-white/30`}`}
                style={{
                  background: `linear-gradient(135deg, var(--tw-gradient-stops)), 
                              radial-gradient(circle at 20% 50%, rgba(255,255,255,0.25) 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
                              radial-gradient(circle at 50% 0%, rgba(255,255,255,0.2) 0%, transparent 70%)`,
                  borderColor:
                    rank === 1
                      ? 'rgba(255,215,0,0.8)'
                      : rank === 2
                        ? 'rgba(192,192,192,0.8)'
                        : 'rgba(205,127,50,0.8)',
                  backdropFilter: 'blur(15px)',
                  animation: config.animation,
                  boxShadow:
                    rank === 1
                      ? '0 0 60px rgba(255,215,0,0.8), 0 0 120px rgba(255,215,0,0.6), inset 0 0 40px rgba(255,255,255,0.2)'
                      : rank === 2
                        ? '0 0 40px rgba(192,192,192,0.8), 0 0 80px rgba(192,192,192,0.6)'
                        : '0 0 30px rgba(205,127,50,0.8), 0 0 60px rgba(205,127,50,0.6)',
                }}
              >
                {/* 화려한 배경 효과 */}
                <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-white/50 via-white/20 to-transparent'></div>
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-tl ${config.accentGradient} opacity-20`}
                ></div>
                <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/15 to-transparent'></div>
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${config.bgGradient} opacity-25 blur-2xl`}
                ></div>
                <div className='absolute inset-0 rounded-3xl bg-gradient-to-t from-black/10 via-transparent to-white/20'></div>

                {/* 극강 빛 효과 */}
                <div
                  className={`absolute top-6 left-6 h-2 w-6 animate-pulse rounded-full bg-white/40 opacity-80 blur-sm ${config.specialEffect}`}
                ></div>
                <div
                  className={`absolute top-8 right-8 h-4 w-2 animate-pulse rounded-full bg-white/30 opacity-70 blur-sm delay-1000 ${config.specialEffect}`}
                ></div>
                <div
                  className={`absolute bottom-6 left-1/2 h-2 w-8 -translate-x-1/2 transform animate-pulse rounded-full bg-white/40 opacity-90 blur-sm delay-2000 ${config.specialEffect}`}
                ></div>

                {/* 순위별 특별 파티클 효과 */}
                {rank === 1 && (
                  <>
                    {/* 황금 파티클들 */}
                    <div className='absolute top-4 left-1/4 h-3 w-3 animate-bounce animate-pulse rounded-full bg-yellow-300/80 blur-sm delay-500'></div>
                    <div className='absolute top-1/4 right-1/4 h-2 w-2 animate-ping rounded-full bg-yellow-400/60 delay-700'></div>
                    <div className='absolute bottom-1/4 left-1/3 h-2 w-2 animate-pulse rounded-full bg-yellow-200/70 delay-900'></div>
                    <div className='absolute top-2/3 right-1/3 h-3 w-3 animate-spin rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 opacity-50 blur-sm delay-1100'></div>
                    <div className='absolute top-1/2 left-1/6 h-2 w-4 animate-pulse rounded-full bg-white/30 opacity-80 blur-md delay-1300'></div>
                    {/* 추가 화려한 효과 */}
                    <div className='absolute top-3 right-1/3 h-1 w-1 animate-ping rounded-full bg-yellow-500/80 delay-400'></div>
                    <div className='absolute right-1/4 bottom-4 h-2 w-2 animate-bounce rounded-full bg-orange-300/70 delay-600'></div>
                    <div className='absolute top-1/3 left-1/5 h-1 w-3 animate-pulse rounded-full bg-yellow-400/60 delay-800'></div>
                  </>
                )}

                {rank === 2 && (
                  <>
                    {/* 은색 파티클들 */}
                    <div className='absolute top-4 right-1/4 h-3 w-3 animate-bounce rounded-full bg-slate-300/80 blur-sm delay-600'></div>
                    <div className='absolute bottom-1/4 left-1/4 h-2 w-2 animate-ping rounded-full bg-white/60 delay-800'></div>
                    <div className='absolute top-1/3 right-1/6 h-2 w-3 animate-pulse rounded-full bg-slate-200/70 delay-1000'></div>
                    <div className='absolute top-1/4 left-1/4 h-3 w-3 animate-bounce rounded-full bg-slate-400/70 blur-sm delay-500'></div>
                    <div className='absolute right-1/3 bottom-1/3 h-2 w-2 animate-ping rounded-full bg-slate-300/60 delay-1100'></div>
                    <div className='absolute top-2/3 left-1/6 h-2 w-4 animate-pulse rounded-full bg-white/40 opacity-80 blur-md delay-1300'></div>
                  </>
                )}

                {rank === 3 && (
                  <>
                    {/* 동색 파티클들 */}
                    <div className='absolute top-6 left-1/3 h-2 w-2 animate-ping rounded-full bg-amber-400/70 delay-700'></div>
                    <div className='absolute right-1/4 bottom-1/3 h-3 w-2 animate-pulse rounded-full bg-orange-300/60 delay-1200'></div>
                    <div className='absolute top-4 left-1/4 h-3 w-3 animate-bounce rounded-full bg-amber-500/80 blur-sm delay-500'></div>
                    <div className='absolute top-1/4 right-1/4 h-2 w-2 animate-ping rounded-full bg-red-400/60 delay-900'></div>
                    <div className='absolute bottom-1/4 left-1/3 h-2 w-3 animate-pulse rounded-full bg-orange-400/70 delay-1000'></div>
                    <div className='absolute top-1/2 right-1/6 h-2 w-2 animate-bounce rounded-full bg-amber-300/60 delay-1400'></div>
                  </>
                )}

                {/* 왕관과 메달 표시 */}
                <div className='relative z-10 mb-4 text-center'>
                  <div
                    className={`mb-2 text-4xl ${rank === 1 ? 'animate-bounce' : config.specialEffect}`}
                  >
                    {config.crown}
                  </div>
                  <div className='animate-pulse text-6xl'>{config.medal}</div>
                </div>

                {/* 극강 순위 표시 */}
                <div className='relative z-10 mb-6 text-center'>
                  <div
                    className={`mb-3 text-4xl font-black tracking-widest text-white drop-shadow-2xl ${rank <= 3 ? 'animate-pulse' : ''}`}
                    style={{
                      filter: `drop-shadow(0 0 ${rank === 1 ? '30px' : rank === 2 ? '25px' : '20px'} rgba(255,255,255,0.8)) drop-shadow(0 0 ${rank === 1 ? '60px' : rank === 2 ? '50px' : '40px'} rgba(255,255,255,0.4))`,
                      textShadow:
                        rank === 1
                          ? '0 0 40px rgba(255,215,0,0.8), 0 0 80px rgba(255,215,0,0.6), 0 0 120px rgba(255,215,0,0.4)'
                          : rank === 2
                            ? '0 0 30px rgba(192,192,192,0.8), 0 0 60px rgba(192,192,192,0.6)'
                            : '0 0 25px rgba(205,127,50,0.8), 0 0 50px rgba(205,127,50,0.6)',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      letterSpacing: '0.2em',
                      transform:
                        rank === 1
                          ? 'scale(1.2)'
                          : rank === 2
                            ? 'scale(1.1)'
                            : 'scale(1.05)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {config.title}
                  </div>

                  {/* 부제목 */}
                  <div
                    className={`mb-2 text-sm font-bold tracking-wide text-white/95 ${rank <= 3 ? 'animate-pulse' : ''}`}
                    style={{
                      textShadow: '0 0 20px rgba(255,255,255,0.6)',
                    }}
                  >
                    {config.subtitle}
                  </div>

                  {/* 특별 메시지 */}
                  <div
                    className={`text-xs font-medium text-white/90 ${config.specialEffect}`}
                  >
                    {config.message}
                  </div>
                </div>

                {/* 사용자 정보 */}
                <div className='relative z-10 mb-6 text-center'>
                  <div
                    className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-2xl ring-4 ring-white/40 backdrop-blur-sm ${rank === 1 ? 'animate-bounce' : ''}`}
                    style={{
                      boxShadow:
                        rank === 1
                          ? '0 0 40px rgba(255,215,0,0.6), inset 0 0 20px rgba(255,215,0,0.2)'
                          : rank === 2
                            ? '0 0 30px rgba(192,192,192,0.6)'
                            : '0 0 25px rgba(205,127,50,0.6)',
                    }}
                  >
                    <Users className='h-10 w-10 text-gray-600' />
                  </div>
                  <h3
                    className='mb-3 text-xl font-black tracking-wide text-white drop-shadow-lg'
                    style={{
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      textShadow:
                        '0 0 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.3)',
                    }}
                  >
                    {user.name}
                  </h3>
                  {user.isMe && (
                    <div
                      className={`inline-block rounded-full bg-white/30 px-6 py-3 text-sm font-bold text-white ring-2 ring-white/40 backdrop-blur-sm ${config.specialEffect}`}
                    >
                      <span className='opacity-95'>
                        ✨ 당신이 바로 전설! ✨
                      </span>
                    </div>
                  )}
                </div>

                {/* 극강 시간 정보 */}
                <div className='relative z-10 text-center'>
                  <div className='relative mx-auto mb-4 inline-block'>
                    <div
                      className={`absolute inset-0 rounded-2xl bg-white/30 backdrop-blur-sm ${rank <= 3 ? 'animate-pulse' : ''}`}
                      style={{
                        boxShadow:
                          rank === 1
                            ? '0 0 40px rgba(255,215,0,0.6), inset 0 0 30px rgba(255,255,255,0.2)'
                            : rank === 2
                              ? '0 0 30px rgba(192,192,192,0.6), inset 0 0 20px rgba(255,255,255,0.15)'
                              : '0 0 25px rgba(205,127,50,0.6), inset 0 0 15px rgba(255,255,255,0.1)',
                      }}
                    ></div>
                    <div
                      className={`relative px-8 py-4 text-4xl font-black text-white drop-shadow-2xl ${rank <= 3 ? 'animate-pulse' : ''}`}
                      style={{
                        textShadow:
                          rank === 1
                            ? '0 0 20px rgba(255,215,0,1), 0 0 40px rgba(255,215,0,0.8), 0 0 60px rgba(255,215,0,0.4)'
                            : rank === 2
                              ? '0 0 15px rgba(192,192,192,1), 0 0 30px rgba(192,192,192,0.8)'
                              : '0 0 12px rgba(205,127,50,1), 0 0 24px rgba(205,127,50,0.8)',
                        filter:
                          rank === 1
                            ? 'brightness(1.3)'
                            : rank === 2
                              ? 'brightness(1.2)'
                              : 'brightness(1.1)',
                        fontSize:
                          rank === 1
                            ? '2.5rem'
                            : rank === 2
                              ? '2.25rem'
                              : '2rem',
                      }}
                    >
                      {formatTime(user.hours)}
                    </div>
                  </div>

                  {/* 추가 장식 */}
                  <div
                    className={`text-xs font-medium text-white/80 ${config.specialEffect}`}
                  >
                    {rank === 1
                      ? '🔥 절대 최강자 🔥'
                      : rank === 2
                        ? '⚡ 왕좌 도전자 ⚡'
                        : '💫 떠오르는 스타 💫'}
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
