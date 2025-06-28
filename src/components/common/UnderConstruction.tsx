'use client';

import { Construction, Hammer, Sparkles, Star, Wrench } from 'lucide-react';
import { useDesignSystem, type ComponentSize } from '@/hooks/useDesignSystem';
import { cardSystem, componentStates, spacing, componentSizes } from '@/styles/design-system';

interface UnderConstructionProps {
  title?: string;
  message?: string;
  size?: ComponentSize;
  showAnimation?: boolean;
}

// 정적 배경 아이콘 컴포넌트
const StaticIcons = () => {
  const icons = [
    {
      Icon: Hammer,
      position: { top: '15%', left: '10%' },
    },
    {
      Icon: Wrench,
      position: { top: '25%', right: '15%' },
    },
    {
      Icon: Star,
      position: { top: '60%', left: '20%' },
    },
    {
      Icon: Sparkles,
      position: { bottom: '20%', right: '10%' },
    },
    {
      Icon: Construction,
      position: { top: '45%', left: '5%' },
    },
  ];

  return (
    <div className='pointer-events-none absolute inset-0 overflow-hidden'>
      {icons.map(({ Icon, position }, index) => (
        <div
          key={index}
          className='absolute text-purple-300 opacity-20'
          style={position}
        >
          <Icon className='h-4 w-4' />
        </div>
      ))}
    </div>
  );
};

// 진행 바 애니메이션 컴포넌트
const ProgressBar = () => (
  <div className='mt-6 w-full'>
    <div className='mb-2 flex items-center justify-between text-xs'>
      <span className='font-medium text-purple-600'>개발 진행률</span>
      <span className='text-purple-500'>진행중...</span>
    </div>
    <div className='h-2 w-full overflow-hidden rounded-full bg-purple-100'>
      <div className='relative h-full overflow-hidden rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500'></div>
    </div>
  </div>
);

export default function UnderConstruction({
  title = '기능 개발중',
  message = '더 나은 서비스를 위해 열심히 개발하고 있어요!',
  size = 'medium',
  showAnimation = true,
}: UnderConstructionProps) {
  const { getCardStyle } = useDesignSystem();
  
  // 디자인 시스템 스타일 적용
  const cardStyles = getCardStyle(size, 'hoverable');
  const sizeStyles = componentSizes[size];

  return (
    <div className='w-full'>
      <div
        className={`relative overflow-hidden ${cardSystem.base} ${cardSystem.variants.glass} border-purple-200 bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-blue-50/80 shadow-lg shadow-purple-100/50 backdrop-blur-sm ${componentStates.hoverable.transition} ${cardSystem.hover.lift} ${sizeStyles.padding}`}
      >
        {/* 배경 효과 */}
        {showAnimation && <StaticIcons />}

        {/* 그라데이션 오버레이 */}
        <div className='absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5'></div>

        {/* 메인 콘텐츠 */}
        <div className='relative z-10 text-center'>
          {/* 아이콘 섹션 */}
          <div className='mb-4 flex justify-center'>
            <div className='relative'>
              {/* 글로우 효과 */}
              <div className='absolute inset-0 rounded-full bg-purple-400/10 blur-lg'></div>

              {/* 메인 아이콘 */}
              <div className='relative flex items-center justify-center rounded-full border-2 border-purple-200 bg-gradient-to-br from-purple-100 to-pink-100 p-3'>
                <Construction
                  className={`${
                    sizeStyles.text === 'text-sm' ? 'h-8 w-8' :
                    sizeStyles.text === 'text-base' ? 'h-12 w-12' :
                    'h-16 w-16'
                  } text-purple-600`}
                />
              </div>

              {/* 작은 장식 아이콘들 */}
              {showAnimation && (
                <>
                  <div className='absolute -top-1 -right-1'>
                    <Sparkles className='h-4 w-4 text-yellow-500' />
                  </div>
                  <div className='absolute -bottom-1 -left-1'>
                    <Star className='h-3 w-3 text-pink-500' />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 텍스트 섹션 */}
          <div className={spacing.inner.tight}>
            <h3
              className={`${sizeStyles.text === 'text-sm' ? 'text-lg' : sizeStyles.text === 'text-base' ? 'text-xl' : 'text-2xl'} font-bold tracking-wide text-gray-800`}
            >
              🚧 {title}
            </h3>
            <p
              className={`${sizeStyles.text === 'text-sm' ? 'text-sm' : sizeStyles.text === 'text-base' ? 'text-sm' : 'text-base'} mx-auto max-w-md leading-relaxed text-gray-600`}
            >
              {message}
            </p>
          </div>

          {/* 진행 바 (medium, large 사이즈에만 표시) */}
          {size !== 'small' && showAnimation && <ProgressBar />}

          {/* 추가 정보 */}
          {size === 'large' && (
            <div className='mt-6 flex items-center justify-center space-x-4 text-xs text-gray-500'>
              <div className='flex items-center space-x-1'>
                <div className='h-2 w-2 rounded-full bg-green-500'></div>
                <span>개발팀이 작업중</span>
              </div>
              <span>•</span>
              <div className='flex items-center space-x-1'>
                <Hammer className='h-3 w-3 text-purple-500' />
                <span>곧 출시 예정</span>
              </div>
            </div>
          )}
        </div>

        {/* 하단 장식 */}
        <div className='absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-30'></div>
      </div>
    </div>
  );
}
