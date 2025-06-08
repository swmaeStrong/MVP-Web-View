'use client';

import { Info } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function TierSystemTooltip() {
  const [isVisible, setIsVisible] = useState(false);

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
      className='relative inline-block'
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* 트리거 버튼 */}
      <button className='flex cursor-help items-center space-x-2 rounded-lg border border-gray-300 bg-white px-3 py-2 transition-colors duration-200 hover:bg-gray-50'>
        <Info className='h-4 w-4 text-gray-600' />
        <span className='text-sm font-medium text-gray-700'>티어 설명</span>
      </button>

      {/* 툴팁 */}
      {isVisible && (
        <div className='absolute top-full left-0 z-50 mt-2 w-96 rounded-lg border-2 border-gray-200 bg-white p-6 shadow-xl'>
          {/* 화살표 */}
          <div className='absolute bottom-full left-6 h-0 w-0 border-r-4 border-b-4 border-l-4 border-transparent border-b-gray-200'></div>

          <div className='mb-4'>
            <h3 className='mb-2 text-lg font-bold text-gray-800'>
              🏆 티어 시스템
            </h3>
            <p className='mb-4 text-sm text-gray-600'>
              100명 이상 참가 시 순위에 따른 티어가 자동으로 부여됩니다.
            </p>
          </div>

          {/* 2열 그리드 레이아웃 */}
          <div className='grid grid-cols-2 gap-x-4 gap-y-3'>
            {tierSystemInfo.map((tier, index) => (
              <div
                key={tier.tier}
                className='flex items-center space-x-3 rounded-lg bg-gray-50/50 p-3'
              >
                <div className='flex items-center space-x-2'>
                  <Image
                    src={tier.icon}
                    alt={tier.tier}
                    width={20}
                    height={20}
                    className='drop-shadow-sm'
                  />
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <span className={`text-xs font-bold ${tier.color}`}>
                        {tier.tier}
                      </span>
                    </div>
                    <div className='mt-1'>
                      <p className='text-xs font-semibold text-gray-700'>
                        {tier.percentage}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {tier.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='mt-4 border-t border-gray-200 pt-4'>
            <p className='text-center text-xs text-gray-500'>
              더 높은 티어를 향해 달려보세요! 💪
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
