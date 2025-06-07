'use client';

import { Flame, Trophy, Users, Zap } from 'lucide-react';

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

interface StatsSectionProps {
  users: User[];
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

export default function StatsSection({ users }: StatsSectionProps) {
  const getTotalStats = () => ({
    totalCompetitors: users.length,
    topRecord: users[0]?.hours || 0,
    myRank: users.findIndex((user: User) => user.isMe) + 1,
  });

  const stats = getTotalStats();

  return (
    <>
      {/* 화려한 실시간 표시기 */}
      <div className='mb-6 flex justify-center'>
        <div className='relative flex transform items-center gap-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'>
          <div className='relative'>
            <div className='h-3 w-3 animate-pulse rounded-full bg-white'></div>
            <div className='absolute inset-0 h-3 w-3 animate-ping rounded-full bg-white opacity-75'></div>
            <div className='absolute -inset-1 h-5 w-5 animate-ping rounded-full bg-white opacity-20'></div>
          </div>
          <span className='text-lg font-bold tracking-wide'>
            🔥 실시간 경쟁 중
          </span>
          <Zap className='h-5 w-5 animate-bounce' />
        </div>
      </div>

      {/* 화려한 경쟁 통계 */}
      <div className='mb-8 grid grid-cols-3 gap-6'>
        {/* 총 경쟁자 */}
        <div className='group relative overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 via-purple-100 to-blue-100 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl'>
          <div className='absolute -top-4 -right-4 text-6xl opacity-10 transition-opacity duration-300 group-hover:opacity-20'>
            <Users />
          </div>
          <div className='relative z-10 text-center'>
            <div className='mb-2 flex items-center justify-center gap-2'>
              <Users className='h-6 w-6 text-purple-600' />
              <span className='text-sm font-semibold tracking-wide text-purple-700 uppercase'>
                총 경쟁자
              </span>
            </div>
            <div className='mb-1 text-4xl font-black text-purple-700 transition-transform duration-300 group-hover:scale-110'>
              {stats.totalCompetitors}
            </div>
            <div className='text-xs font-medium text-purple-600'>
              명의 도전자들
            </div>
          </div>
          <div className='absolute right-0 bottom-0 left-0 h-1 rounded-b-xl bg-gradient-to-r from-purple-400 to-blue-400'></div>
        </div>

        {/* 1위 기록 */}
        <div className='group relative overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 via-purple-100 to-blue-100 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl'>
          <div className='absolute -top-4 -right-4 text-6xl opacity-10 transition-opacity duration-300 group-hover:opacity-20'>
            <Trophy />
          </div>
          <div className='relative z-10 text-center'>
            <div className='mb-2 flex items-center justify-center gap-2'>
              <Trophy className='h-6 w-6 text-purple-600' />
              <span className='text-sm font-semibold tracking-wide text-purple-700 uppercase'>
                1위 기록
              </span>
            </div>
            <div className='mb-1 text-4xl font-black text-purple-700 transition-transform duration-300 group-hover:scale-110'>
              {formatTime(stats.topRecord)}
            </div>
            <div className='text-xs font-medium text-purple-600'>최고 성취</div>
          </div>
          <div className='absolute right-0 bottom-0 left-0 h-1 rounded-b-xl bg-gradient-to-r from-purple-400 to-blue-400'></div>
        </div>

        {/* 내 순위 */}
        <div className='group relative overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 via-purple-100 to-blue-100 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl'>
          <div className='absolute -top-4 -right-4 text-6xl opacity-10 transition-opacity duration-300 group-hover:opacity-20'>
            <Flame />
          </div>
          <div className='relative z-10 text-center'>
            <div className='mb-2 flex items-center justify-center gap-2'>
              <Flame className='h-6 w-6 text-purple-600' />
              <span className='text-sm font-semibold tracking-wide text-purple-700 uppercase'>
                내 순위
              </span>
            </div>
            <div
              className={`mb-1 text-4xl font-black transition-transform duration-300 group-hover:scale-110 ${stats.myRank <= 3 ? 'animate-pulse text-yellow-600' : 'text-purple-700'}`}
            >
              #{stats.myRank || '-'}
            </div>
            <div className='text-xs font-medium text-purple-600'>
              {stats.myRank
                ? stats.myRank <= 3
                  ? '상위권 진입!'
                  : '계속 도전하세요!'
                : '참여해보세요!'}
            </div>
          </div>
          <div className='absolute right-0 bottom-0 left-0 h-1 rounded-b-xl bg-gradient-to-r from-purple-400 to-blue-400'></div>
        </div>
      </div>

      {/* 경쟁 동기부여 메시지 */}
      <div className='mb-6 text-center'>
        <div className='inline-block rounded-lg border border-gray-200 bg-gradient-to-r from-orange-50 to-red-50 px-6 py-3 shadow-sm'>
          <p className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
            <Flame className='h-4 w-4 text-orange-500' />
            지금 이 순간도 치열한 경쟁이 펼쳐지고 있습니다!
            <Flame className='h-4 w-4 text-orange-500' />
          </p>
        </div>
      </div>
    </>
  );
}
