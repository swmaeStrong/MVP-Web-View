import React from 'react';
import { Button } from '@/shadcn/ui/button';
import { useDesignSystem } from '@/hooks/useDesignSystem';
import { buttonSystem, componentStates, spacing, layouts } from '@/styles/design-system';

export default function Navigation() {
  const { getButtonStyle } = useDesignSystem();
  
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
        <a
          href='#features'
          className={`font-korean font-medium text-gray-700 ${componentStates.hoverable.transition} hover:text-purple-600`}
        >
          기능
        </a>
        <a
          href='#pricing'
          className={`font-korean font-medium text-gray-700 ${componentStates.hoverable.transition} hover:text-purple-600`}
        >
          요금제
        </a>
        <a
          href='#testimonials'
          className={`font-korean font-medium text-gray-700 ${componentStates.hoverable.transition} hover:text-purple-600`}
        >
          후기
        </a>
        <a
          href='#contact'
          className={`font-korean font-medium text-gray-700 ${componentStates.hoverable.transition} hover:text-purple-600`}
        >
          문의
        </a>
      </div>

      <div className={`${layouts.listItem.right} ${spacing.between.normal}`}>
        <Button variant='ghost' className={`font-korean font-medium ${componentStates.clickable.transition}`}>
          로그인
        </Button>
        <Button className={`btn-primary font-display bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-white hover:from-purple-700 hover:to-blue-700 ${componentStates.clickable.transition}`}>
          무료로 시작하기
        </Button>
      </div>
    </nav>
  );
}
