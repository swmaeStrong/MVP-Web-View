'use client';

import { Users, Zap } from 'lucide-react';

// User 타입은 userStore에서 import
import { User } from '@/stores/userStore';

interface StatsSectionProps {
  users: User[];
}

// 실시간 경쟁 표시기 컴포넌트 (분리)
export function LiveIndicator() {
  return (
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
  );
}

// 총 경쟁자 정보 컴포넌트 (분리)
export function CompetitorStats({ users }: StatsSectionProps) {
  const totalCompetitors = users.length;

  return (
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
          {totalCompetitors}
        </div>
        <div className='text-xs font-medium text-purple-600'>명의 도전자들</div>
      </div>
      <div className='absolute right-0 bottom-0 left-0 h-1 rounded-b-xl bg-gradient-to-r from-purple-400 to-blue-400'></div>
    </div>
  );
}

// 기존 StatsSection은 하위 호환성을 위해 유지 (전체 표시)
export default function StatsSection({ users }: StatsSectionProps) {
  return (
    <>
      <LiveIndicator />
      <div className='mb-8 flex justify-center'>
        <CompetitorStats users={users} />
      </div>
    </>
  );
}
