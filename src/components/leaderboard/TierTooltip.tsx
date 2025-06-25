'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { componentSizes, componentStates, spacing } from '@/styles/design-system';

interface TierTooltipProps {
  tier: string;
  icon: string;
  title: string;
  className?: string;
}

const tierDescriptions = {
  challenger: {
    description: '최상위 1%의 전설적인 사용자들',
    requirement: '상위 1%',
    color: 'text-yellow-600',
    bgColor: 'bg-gradient-to-r from-yellow-50 to-blue-50',
    borderColor: 'border-yellow-400',
  },
  grandmaster: {
    description: '뛰어난 실력을 지닌 상위 랭커들',
    requirement: '상위 3%',
    color: 'text-red-600',
    bgColor: 'bg-gradient-to-r from-red-50 to-pink-50',
    borderColor: 'border-red-400',
  },
  master: {
    description: '마스터급 실력의 고수들',
    requirement: '상위 5%',
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-r from-purple-50 to-violet-50',
    borderColor: 'border-purple-400',
  },
  diamond: {
    description: '다이아몬드처럼 빛나는 실력자들',
    requirement: '상위 10%',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
  },
  emerald: {
    description: '꾸준한 성장을 보이는 상급자들',
    requirement: '상위 15%',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-400',
  },
  platinum: {
    description: '안정적인 실력의 플래티넘 등급',
    requirement: '상위 30%',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-400',
  },
  gold: {
    description: '황금빛 실력을 지닌 중급자들',
    requirement: '상위 50%',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-400',
  },
  silver: {
    description: '은빛 열정으로 노력하는 사용자들',
    requirement: '상위 80%',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-400',
  },
  bronze: {
    description: '시작하는 모든 이들을 응원합니다',
    requirement: '나머지',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-400',
  },
};

export default function TierTooltip({
  tier,
  icon,
  title,
  className = '',
}: TierTooltipProps) {
  const { getThemeTextColor } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const tierInfo = tierDescriptions[tier as keyof typeof tierDescriptions];

  if (!tierInfo) return null;

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* 트리거 아이콘 */}
      <div className='cursor-help'>
        <Image
          src={icon}
          alt={title}
          width={20}
          height={20}
          className='opacity-70 transition-opacity duration-200 hover:opacity-100'
        />
      </div>

      {/* 툴팁 */}
      {isVisible && (
        <div
          className={`absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 transform ${componentSizes.medium.borderRadius} ${componentSizes.medium.border} ${componentSizes.medium.padding} ${componentSizes.large.shadow} ${tierInfo.bgColor} ${tierInfo.borderColor}`}
        >
          {/* 화살표 */}
          <div
            className={`absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-transparent ${tierInfo.borderColor.replace('border-', 'border-t-')}`}
          ></div>

          <div className='mb-3 flex items-center space-x-3'>
            <Image
              src={icon}
              alt={title}
              width={32}
              height={32}
              className='drop-shadow-sm'
            />
            <div>
              <h3 className={`text-lg font-bold ${tierInfo.color}`}>{title}</h3>
              <p className={`text-sm font-semibold ${tierInfo.color}`}>
                {tierInfo.requirement}
              </p>
            </div>
          </div>

          <p className={`text-sm leading-relaxed ${getThemeTextColor('primary')}`}>
            {tierInfo.description}
          </p>
        </div>
      )}
    </div>
  );
}
