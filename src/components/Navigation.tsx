import React from 'react';
import { Button } from '@/shadcn/ui/button';
import { useDesignSystem } from '@/hooks/useDesignSystem';
import { useRouter } from 'next/navigation';
import { buttonSystem, componentStates, spacing, layouts } from '@/styles/design-system';

export default function Navigation() {
  const { getButtonStyle } = useDesignSystem();
  const router = useRouter();
  
  return (
    <nav className={`sticky top-0 z-50 ${layouts.listItem.container} border-b border-gray-100 bg-white/80 p-6 backdrop-blur-md`}>
      <div className={`${layouts.listItem.left} ${spacing.between.normal}`}>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 ${componentStates.hoverable.transition} hover:scale-110`}>
          <span className='text-sm font-bold text-white'>📊</span>
        </div>
        <span className={`font-display font-korean text-lg font-semibold text-gray-900 ${componentStates.hoverable.transition} hover:text-purple-700`}>
          생산성 추적기
        </span>
      </div>

      <div className={`hidden items-center ${spacing.between.loose} md:flex`}>
        <button
          onClick={() => router.push('/home')}
          className={`font-korean font-medium text-gray-700 ${componentStates.hoverable.transition} hover:text-purple-600`}
        >
          대시보드
        </button>
        <button
          onClick={() => router.push('/leaderboard')}
          className={`font-korean font-medium text-gray-700 ${componentStates.hoverable.transition} hover:text-purple-600`}
        >
          리더보드
        </button>
        <button
          onClick={() => router.push('/statistics')}
          className={`font-korean font-medium text-gray-700 ${componentStates.hoverable.transition} hover:text-purple-600`}
        >
          통계
        </button>
        <button
          onClick={() => router.push('/subscription')}
          className={`font-korean font-medium text-purple-600 ${componentStates.hoverable.transition} hover:text-purple-800 font-semibold`}
        >
          프리미엄
        </button>
      </div>

      <div className={`${layouts.listItem.right} ${spacing.between.normal}`}>
        <Button 
          variant='ghost' 
          onClick={() => router.push('/home')}
          className={`font-korean font-medium ${componentStates.clickable.transition}`}
        >
          시작하기
        </Button>
        <Button 
          onClick={() => router.push('/subscription')}
          className={`btn-primary font-display bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-white hover:from-purple-700 hover:to-blue-700 ${componentStates.clickable.transition}`}
        >
          프리미엄 구독
        </Button>
      </div>
    </nav>
  );
}
