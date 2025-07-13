import React from 'react';
import { Button } from '@/shadcn/ui/button';
// import { useDesignSystem } from '@/hooks/useDesignSystem'; // 단순화됨
import { useRouter } from 'next/navigation';
// import { buttonSystem, componentStates, spacing, layouts } from '@/styles/design-system'; // 단순화됨

export default function Navigation() {
  // const { getButtonStyle } = useDesignSystem(); // 단순화됨
  const router = useRouter();
  
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-100 bg-white/80 p-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 transition-all duration-200 hover:scale-110">
          <span className='text-sm font-bold text-white'>📊</span>
        </div>
        <span className="font-display font-korean text-lg font-semibold text-gray-900 transition-all duration-200 hover:text-purple-700">
          생산성 추적기
        </span>
      </div>

      <div className="hidden items-center gap-8 md:flex">
        <button
          onClick={() => router.push('/home')}
          className="font-korean font-medium text-gray-700 transition-all duration-200 hover:text-purple-600"
        >
          대시보드
        </button>
        <button
          onClick={() => router.push('/leaderboard')}
          className="font-korean font-medium text-gray-700 transition-all duration-200 hover:text-purple-600"
        >
          리더보드
        </button>
        <button
          onClick={() => router.push('/statistics')}
          className="font-korean font-medium text-gray-700 transition-all duration-200 hover:text-purple-600"
        >
          통계
        </button>
        <button
          onClick={() => router.push('/subscription')}
          className="font-korean font-medium text-purple-600 transition-all duration-200 hover:text-purple-800 font-semibold"
        >
          프리미엄
        </button>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button 
          variant='ghost' 
          onClick={() => router.push('/home')}
          className="font-korean font-medium transition-all duration-200"
        >
          시작하기
        </Button>
        <Button 
          onClick={() => router.push('/subscription')}
          className="btn-primary font-display bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
        >
          프리미엄 구독
        </Button>
      </div>
    </nav>
  );
}
