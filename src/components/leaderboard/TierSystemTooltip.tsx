'use client';

import { Info } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function TierSystemTooltip() {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({
    top: 'top-full',
    left: 'left-0',
  });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 툴팁 위치 조정 로직 - 항상 아래로만 표시
  useEffect(() => {
    if (isVisible && tooltipRef.current && containerRef.current) {
      const tooltip = tooltipRef.current;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      let newPosition = { top: 'top-full', left: 'left-0' };

      // 우측 경계 체크만 수행 (항상 아래로 표시)
      if (rect.left + tooltipRect.width > viewportWidth - 20) {
        newPosition.left = 'right-0';
      }

      setTooltipPosition(newPosition);
    }
  }, [isVisible]);

  const tierSystemInfo = [
    {
      tier: 'CHALLENGER',
      percentage: '상위 1%',
      color: 'text-yellow-600',
      description: '최고의 전설들',
      icon: '/icons/rank/challenger.png',
    },
    {
      tier: 'GRANDMASTER',
      percentage: '상위 3%',
      color: 'text-red-600',
      description: '뛰어난 상위 랭커들',
      icon: '/icons/rank/grandMaster.png',
    },
    {
      tier: 'MASTER',
      percentage: '상위 5%',
      color: 'text-purple-600',
      description: '마스터급 고수들',
      icon: '/icons/rank/master.png',
    },
    {
      tier: 'DIAMOND',
      percentage: '상위 10%',
      color: 'text-blue-600',
      description: '빛나는 실력자들',
      icon: '/icons/rank/diamond.png',
    },
    {
      tier: 'EMERALD',
      percentage: '상위 15%',
      color: 'text-emerald-600',
      description: '꾸준한 상급자들',
      icon: '/icons/rank/emerald.png',
    },
    {
      tier: 'PLATINUM',
      percentage: '상위 30%',
      color: 'text-slate-600',
      description: '안정적인 실력',
      icon: '/icons/rank/platinum.png',
    },
    {
      tier: 'GOLD',
      percentage: '상위 50%',
      color: 'text-amber-600',
      description: '황금빛 중급자들',
      icon: '/icons/rank/gold.png',
    },
    {
      tier: 'SILVER',
      percentage: '상위 80%',
      color: 'text-gray-600',
      description: '은빛 열정',
      icon: '/icons/rank/silver.png',
    },
    {
      tier: 'BRONZE',
      percentage: '나머지',
      color: 'text-orange-600',
      description: '시작하는 모든 이들',
      icon: '/icons/rank/bronze.png',
    },
  ];

  return (
    <div
      ref={containerRef}
      className='relative inline-block'
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      style={{ zIndex: 99998 }}
    >
      {/* 트리거 버튼 */}
      <button
        className='flex w-[120px] cursor-help items-center justify-center space-x-2 rounded-lg border border-gray-300 bg-white px-3 py-2 transition-colors duration-200 hover:bg-gray-50'
        style={{ zIndex: 99998 }}
      >
        <Info className='h-4 w-4 text-gray-600' />
        <span className='text-sm font-medium text-gray-700'>티어 설명</span>
      </button>

      {/* 툴팁 */}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute top-full ${tooltipPosition.left} mt-2 w-[480px] rounded-lg border-2 border-gray-200 bg-white p-5 shadow-xl`}
          style={{ zIndex: 99999 }}
        >
          {/* 화살표 - 항상 위쪽을 가리킴 */}
          <div
            className={`absolute bottom-full h-0 w-0 border-r-4 border-b-4 border-l-4 border-transparent border-b-gray-200 ${
              tooltipPosition.left === 'right-0' ? 'right-6' : 'left-6'
            }`}
            style={{ zIndex: 99999 }}
          ></div>

          <div className='mb-4'>
            <h3 className='mb-2 text-lg font-bold text-gray-800'>
              🏆 티어 시스템
            </h3>
            <p className='text-sm text-gray-600'>
              참가자가 100명 이하일 경우 특정 상위 티어는 존재하지 않을 수
              있습니다.
            </p>
          </div>

          {/* 3열 그리드 레이아웃 */}
          <div className='grid grid-cols-3 gap-3'>
            {tierSystemInfo.map((tier, index) => (
              <div
                key={tier.tier}
                className='flex flex-col items-center space-y-2 rounded-lg bg-gray-50/50 p-3 text-center'
              >
                <Image
                  src={tier.icon}
                  alt={tier.tier}
                  width={24}
                  height={24}
                  className='drop-shadow-sm'
                />
                <div className='w-full'>
                  <div className={`text-xs font-bold ${tier.color} mb-1`}>
                    {tier.tier}
                  </div>
                  <div className='mb-1 text-xs font-semibold text-gray-700'>
                    {tier.percentage}
                  </div>
                  <p className='text-xs leading-tight text-gray-500'>
                    {tier.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className='mt-4 border-t border-gray-200 pt-3'>
            <p className='text-center text-xs text-gray-500'>
              순위에 따라 자동으로 티어가 부여됩니다
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
