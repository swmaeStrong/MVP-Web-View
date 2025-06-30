'use client';

import { Info } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { componentSizes, componentStates, spacing } from '@/styles/design-system';

export default function TierSystemTooltip() {
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();
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
      percentage: 'Top 1%',
      color: 'text-yellow-600',
      icon: '/icons/rank/challenger.png',
    },
    {
      tier: 'GRANDMASTER',
      percentage: 'Top 3%',
      color: 'text-red-600',
      icon: '/icons/rank/grandMaster.png',
    },
    {
      tier: 'MASTER',
      percentage: 'Top 5%',
      color: 'text-purple-600',
      icon: '/icons/rank/master.png',
    },
    {
      tier: 'DIAMOND',
      percentage: 'Top 10%',
      color: 'text-blue-600',
      icon: '/icons/rank/diamond.png',
    },
    {
      tier: 'EMERALD',
      percentage: 'Top 15%',
      color: 'text-emerald-600',
      icon: '/icons/rank/emerald.png',
    },
    {
      tier: 'PLATINUM',
      percentage: 'Top 30%',
      color: 'text-slate-600',
      icon: '/icons/rank/platinum.png',
    },
    {
      tier: 'GOLD',
      percentage: 'Top 50%',
      color: 'text-amber-600',
      icon: '/icons/rank/gold.png',
    },
    {
      tier: 'SILVER',
      percentage: 'Top 80%',
      color: 'text-gray-600',
      icon: '/icons/rank/silver.png',
    },
    {
      tier: 'BRONZE',
      percentage: '나머지',
      color: 'text-orange-600',
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
      {/* 트리거 버튼 - 컴팩트 */}
      <button
        className={`flex w-16 cursor-help items-center justify-center space-x-1 rounded-lg border px-2 py-1.5 ${componentStates.hoverable.transition} ${getThemeClass('border')} ${getThemeClass('component')} hover:${getThemeClass('componentSecondary')} hover:${getThemeClass('borderLight')}`}
        style={{ zIndex: 99998 }}
      >
        <Info className={`h-3 w-3 ${getThemeTextColor('secondary')}`} />
        <span className={`text-xs font-medium ${getThemeTextColor('primary')}`}>Tier</span>
      </button>

      {/* 툴팁 */}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute top-full ${tooltipPosition.left} mt-2 w-[280px] rounded-lg border p-3 shadow-xl ${getThemeClass('borderLight')} ${getThemeClass('component')}`}
          style={{ zIndex: 99999 }}
        >
          {/* 화살표 - 항상 위쪽을 가리킴 */}
          <div
            className={`absolute bottom-full h-0 w-0 border-r-4 border-b-4 border-l-4 border-transparent ${
              tooltipPosition.left === 'right-0' ? 'right-6' : 'left-6'
            }`}
            style={{ 
              zIndex: 99999,
              borderBottomColor: isDarkMode ? 'rgb(120, 120, 120)' : '#e5e7eb'
            }}
          ></div>

          <div className='mb-3'>
            <h3 className={`mb-1 text-sm font-bold ${getThemeTextColor('primary')}`}>
              🏆 Tier System
            </h3>
            <p className={`text-xs ${getThemeTextColor('secondary')} leading-tight`}>
              When there are fewer than 100 participants, certain Top tiers may not exist.
            </p>
          </div>

          {/* Compact grid layout */}
          <div className='grid grid-cols-3 gap-1.5'>
            {tierSystemInfo.map((tier, index) => (
              <div
                key={tier.tier}
                className={`flex flex-col items-center space-y-1 rounded-md border p-1.5 text-center ${getThemeClass('border')} ${getThemeClass('componentSecondary')}`}
              >
                <Image
                  src={tier.icon}
                  alt={tier.tier}
                  width={14}
                  height={14}
                  className='drop-shadow-sm'
                />
                <div className='w-full'>
                  <div className={`text-xs font-bold ${tier.color} mb-0.5 leading-tight truncate`}>
                    {tier.tier}
                  </div>
                  <div className={`text-xs font-semibold ${getThemeTextColor('primary')}`}>
                    {tier.percentage}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-2 pt-2 ${getThemeClass('borderLight')}`} style={{borderTopWidth: '1px'}}>
            <p className={`text-center text-xs ${getThemeTextColor('secondary')}`}>
              순위에 따라 자동으로 티어가 부여됩니다
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
