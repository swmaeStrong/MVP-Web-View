import React from 'react';
import { Button } from '@/shadcn/ui/button';
import { Badge } from '@/shadcn/ui/badge';
import { useDesignSystem } from '@/hooks/useDesignSystem';
import { cardSystem, buttonSystem, badgeSystem, componentStates, spacing, layouts } from '@/styles/design-system';

export default function HeroSection() {
  // const { getCardStyle, getButtonStyle } = useDesignSystem(); // 제거됨
  
  const handleCopyCommand = () => {
    const command = 'brew install productivity-tracker';
    navigator.clipboard.writeText(command);
  };

  // 시간대별 집중도 데이터 (0-23시간)
  const focusData = [
    { hour: 9, focus: 45 },
    { hour: 10, focus: 62 },
    { hour: 11, focus: 78 },
    { hour: 12, focus: 55 },
    { hour: 13, focus: 40 },
    { hour: 14, focus: 85 },
    { hour: 15, focus: 92 },
    { hour: 16, focus: 88 },
    { hour: 17, focus: 75 },
    { hour: 18, focus: 50 },
    { hour: 19, focus: 35 },
    { hour: 20, focus: 68 },
    { hour: 21, focus: 73 },
  ];

  return (
    <div className={`${spacing.section.loose} ${layouts.grid.cols2} items-center ${spacing.between.loose}`}>
      {/* 왼쪽 콘텐츠 */}
      <div>
        <Badge className={`${badgeSystem.base} ${spacing.section.normal} ${componentStates.clickable.cursor} bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg ${componentStates.clickable.transition} hover:scale-105 hover:from-purple-600 hover:to-blue-600`}>
          🚀 베타 테스터 모집 중 - 평생 특가!
        </Badge>

        <h1 className={`${spacing.section.normal} text-4xl leading-tight font-bold text-gray-900 lg:text-5xl`}>
          개발자를 위한
          <br />
          <span className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>
            스마트 생산성
          </span>{' '}
          추적기
          <br />
          <span className='bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent'>
            +
          </span>{' '}
          <span className='text-3xl text-gray-700 lg:text-4xl'>
            경쟁 플랫폼
          </span>{' '}
          🏆
        </h1>

        <p className={`${spacing.section.relaxed} text-lg leading-relaxed text-gray-600 lg:text-xl`}>
          <strong className='text-blue-600'>IDE별 코딩 시간</strong>부터{' '}
          <strong className='text-purple-600'>시간대별 집중도 패턴</strong>까지
          완벽 분석!
          <br />
          친구들과 리더보드 경쟁하며 생산성을 게임처럼 즐겨보세요.
          <br />
          <span className='mt-2 mr-2 inline-block rounded-lg bg-purple-100 px-3 py-1 text-base font-semibold text-purple-700'>
            다양한 활동 추적
          </span>
          <span className='mt-2 mr-2 inline-block rounded-lg bg-blue-100 px-3 py-1 text-base font-semibold text-blue-700'>
            자동 분류
          </span>
          <span className='mt-2 mr-2 inline-block rounded-lg bg-green-100 px-3 py-1 text-base font-semibold text-green-700'>
            실시간 통계
          </span>
        </p>

        {/* 다운로드 버튼들 - 깔끔하게 개선 */}
        <div className={`${spacing.section.normal} ${cardSystem.base} ${cardSystem.variants.gradient} border border-gray-200 p-6`}>
          <h3 className={`${spacing.inner.normal} text-center text-lg font-bold text-gray-800`}>
            지금 바로 시작하세요
          </h3>

          <div className={`${spacing.inner.normal} ${layouts.grid.cols2} ${spacing.between.normal}`}>
            <Button
              size='lg'
              className={`h-auto bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-lg ${componentStates.clickable.transition} hover:scale-105 hover:from-purple-700 hover:to-blue-700 active:scale-95`}
              onClick={() =>
                window.open(
                  'https://github.com/productivity-tracker/releases/latest',
                  '_blank'
                )
              }
            >
              <div className='flex flex-col items-center'>
                <span className='mb-1 text-2xl'>🍎</span>
                <span>Mac App</span>
                <span className='text-xs opacity-80'>GUI 버전</span>
              </div>
            </Button>

            <Button
              variant='outline'
              size='lg'
              className={`h-auto border-2 border-purple-300 bg-white px-6 py-4 text-lg font-semibold text-purple-700 shadow-lg ${componentStates.clickable.transition} hover:scale-105 hover:bg-purple-50 active:scale-95`}
              onClick={handleCopyCommand}
            >
              <div className='flex flex-col items-center'>
                <span className='mb-1 text-2xl'>⚡</span>
                <span>Homebrew</span>
                <span className='text-xs opacity-80'>CLI 복사</span>
              </div>
            </Button>
          </div>

          {/* CLI 명령어 */}
          <div className='rounded-xl bg-gray-900 p-4'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-medium text-gray-400'>
                터미널에서 실행
              </span>
              <button
                onClick={handleCopyCommand}
                className='rounded px-3 py-1 text-sm font-medium text-green-400 transition-all duration-200 hover:bg-gray-800 hover:text-green-300'
              >
                복사
              </button>
            </div>
            <div className='rounded-lg bg-gray-800 p-3'>
              <code className='font-mono text-sm text-green-400'>
                $ brew install productivity-tracker
              </code>
            </div>
          </div>
        </div>

        <div className='rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 text-base text-gray-600'>
          💡 <span className='font-semibold text-gray-800'>베타 기능:</span> AI
          기반 생산성 분석 & 맞춤형{' '}
          <span className='font-semibold text-green-600'>게임화 시스템</span>
        </div>
      </div>

      {/* 오른쪽 실시간 대시보드 */}
      <div className='relative'>
        <div className='group rotate-1 transform cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-0'>
          <div className='mb-4 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 p-6 transition-all duration-300 group-hover:from-purple-100 group-hover:to-blue-100'>
            <div className='mb-6 flex items-center justify-between'>
              <span className='text-lg font-bold text-gray-800'>
                실시간 활동 분석
              </span>
              <Badge className='bg-green-100 text-xs font-medium text-green-800'>
                🔴 LIVE
              </Badge>
            </div>

            {/* 현재 활동 상태 */}
            <div className='mb-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
              <div className='mb-3 flex items-center justify-between'>
                <span className='text-sm font-semibold text-gray-700'>
                  현재 활동
                </span>
                <div className='flex items-center space-x-2'>
                  <div className='h-2 w-2 animate-pulse rounded-full bg-green-400'></div>
                  <span className='font-mono text-xs text-gray-600'>
                    VS Code
                  </span>
                </div>
              </div>

              <div className='mb-2 text-lg font-bold text-purple-700'>
                React 컴포넌트 개발
              </div>
              <div className='mb-3 text-sm text-gray-600'>
                집중 시간: <span className='font-mono'>47분 32초</span>
              </div>

              {/* 카테고리별 시간 */}
              <div className='grid grid-cols-2 gap-3'>
                <div className='rounded-lg bg-blue-50 p-3 text-center'>
                  <div className='text-sm font-bold text-blue-700'>💻 코딩</div>
                  <div className='font-mono text-xs text-blue-600'>3h 24m</div>
                </div>
                <div className='rounded-lg bg-purple-50 p-3 text-center'>
                  <div className='text-sm font-bold text-purple-700'>
                    📝 문서화
                  </div>
                  <div className='font-mono text-xs text-purple-600'>18m</div>
                </div>
              </div>
            </div>

            {/* 시간대별 집중도 꺾은선 그래프 */}
            <div className='mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
              <div className='mb-3 flex items-center justify-between'>
                <span className='text-sm font-semibold text-gray-700'>
                  오늘의 집중도 패턴
                </span>
                <span className='text-xs text-gray-500'>9시-21시</span>
              </div>

              {/* 그래프 */}
              <div className='relative mb-3 h-24'>
                <svg className='h-full w-full' viewBox='0 0 280 80'>
                  {/* 그리드 라인 */}
                  <defs>
                    <pattern
                      id='grid'
                      width='20'
                      height='16'
                      patternUnits='userSpaceOnUse'
                    >
                      <path
                        d='M 20 0 L 0 0 0 16'
                        fill='none'
                        stroke='#f3f4f6'
                        strokeWidth='0.5'
                      />
                    </pattern>
                  </defs>
                  <rect width='280' height='80' fill='url(#grid)' />

                  {/* 꺾은선 그래프 */}
                  <polyline
                    fill='none'
                    stroke='url(#focusGradient)'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    points={focusData
                      .map(
                        (point, index) =>
                          `${index * 22 + 10},${70 - point.focus * 0.6}`
                      )
                      .join(' ')}
                  />

                  {/* 그라데이션 정의 */}
                  <defs>
                    <linearGradient
                      id='focusGradient'
                      x1='0%'
                      y1='0%'
                      x2='100%'
                      y2='0%'
                    >
                      <stop offset='0%' stopColor='#8b5cf6' />
                      <stop offset='50%' stopColor='#3b82f6' />
                      <stop offset='100%' stopColor='#10b981' />
                    </linearGradient>
                  </defs>

                  {/* 데이터 포인트 */}
                  {focusData.map((point, index) => (
                    <circle
                      key={index}
                      cx={index * 22 + 10}
                      cy={70 - point.focus * 0.6}
                      r='3'
                      fill='#8b5cf6'
                      className='hover:r-4 transition-all duration-200'
                    />
                  ))}
                </svg>

                {/* 최고점 표시 */}
                <div className='absolute top-0 left-1/2 -translate-x-1/2 transform rounded bg-purple-600 px-2 py-1 text-xs font-bold text-white'>
                  92% (15시)
                </div>
              </div>

              {/* 시간대 라벨 */}
              <div className='mb-3 flex justify-between text-xs text-gray-500'>
                <span>9시</span>
                <span>12시</span>
                <span>15시</span>
                <span>18시</span>
                <span>21시</span>
              </div>

              <div className='rounded bg-gray-50 p-2 text-center text-xs text-gray-500'>
                🎯 오후 2-4시가 가장 집중력이 높아요!
              </div>
            </div>

            {/* 오늘의 리더보드 순위 */}
            <div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
              <div className='mb-3 flex items-center justify-between'>
                <span className='text-sm font-semibold text-gray-700'>
                  오늘의 순위
                </span>
                <Badge className='bg-purple-100 text-xs text-purple-800'>
                  🏆 3위
                </Badge>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600'>
                    🥇 김개발 <span className='text-green-600'>(+2↗️)</span>
                  </span>
                  <span className='font-mono font-bold text-green-600'>
                    847점
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600'>🥈 박코더</span>
                  <span className='font-mono font-bold text-blue-600'>
                    792점
                  </span>
                </div>
                <div className='flex items-center justify-between rounded bg-purple-50 px-2 py-1 text-sm'>
                  <span className='font-medium text-purple-700'>
                    🥉 나 (당신)
                  </span>
                  <span className='font-mono font-bold text-purple-700'>
                    734점
                  </span>
                </div>
              </div>

              <div className='mt-3 rounded bg-gray-50 p-2 text-center text-xs text-gray-500'>
                🔥 김개발을 추월하려면 <span className='font-mono'>113점</span>{' '}
                더 필요!
              </div>
            </div>
          </div>
        </div>

        {/* 부유하는 요소들 */}
        <div className='absolute -top-4 -right-4 flex h-16 w-16 animate-pulse cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-blue-400 text-xl font-bold text-white opacity-80 shadow-lg transition-all duration-300 hover:scale-110 hover:opacity-100'>
          🏆
        </div>
        <div className='absolute -bottom-4 -left-4 flex h-12 w-12 animate-bounce cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-400 text-lg text-white opacity-60 shadow-lg transition-all duration-300 hover:scale-110 hover:opacity-100'>
          ⚡
        </div>
      </div>
    </div>
  );
}
