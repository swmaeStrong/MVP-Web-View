'use client';

import { Badge } from '@/shadcn/ui/badge';
import { Card, CardContent } from '@/shadcn/ui/card';
import { formatTime, secondsToHours } from '@/utils/statisticsUtils';
import { Clock } from 'lucide-react';

interface TotalTimeCardProps {
  totalTime: number; // seconds
  periodLabel: string;
}

export default function TotalTimeCard({
  totalTime,
  periodLabel,
}: TotalTimeCardProps) {
  const hours = secondsToHours(totalTime);

  // 레벨 시스템
  const getLevel = () => {
    if (hours >= 12)
      return {
        level: '전설',
        color: 'from-purple-600 to-pink-600',
        icon: '👑',
        message: '전설적인 집중력!',
      };
    if (hours >= 10)
      return {
        level: '마스터',
        color: 'from-blue-600 to-purple-600',
        icon: '🏆',
        message: '마스터급 몰입!',
      };
    if (hours >= 8)
      return {
        level: '전문가',
        color: 'from-green-600 to-blue-600',
        icon: '🔥',
        message: '프로다운 집중력!',
      };
    if (hours >= 6)
      return {
        level: '숙련자',
        color: 'from-yellow-600 to-green-600',
        icon: '⚡',
        message: '훌륭한 진전!',
      };
    if (hours >= 4)
      return {
        level: '중급자',
        color: 'from-orange-600 to-yellow-600',
        icon: '✨',
        message: '좋은 시작!',
      };
    if (hours >= 2)
      return {
        level: '초급자',
        color: 'from-gray-600 to-orange-600',
        icon: '🌱',
        message: '시작이 중요해요!',
      };
    return {
      level: '새싹',
      color: 'from-gray-400 to-gray-600',
      icon: '🌿',
      message: '조금씩 시작해보세요!',
    };
  };

  const levelInfo = getLevel();

  return (
    <Card className='relative overflow-hidden border-2 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'>
      {/* 배경 그라데이션 */}
      <div className='absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5'></div>

      {/* 장식적 요소 */}
      <div className='absolute -top-10 -right-10 h-20 w-20 rounded-full bg-gradient-to-br from-purple-400/20 to-blue-400/20'></div>
      <div className='absolute -bottom-5 -left-5 h-15 w-15 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20'></div>

      <CardContent className='relative p-6 text-center'>
        {/* 헤더 */}
        <div className='mb-4 flex items-center justify-center gap-2'>
          <Clock className='h-5 w-5 text-purple-600' />
          <Badge className='bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-white shadow-md'>
            {periodLabel}
          </Badge>
        </div>

        {/* 메인 시간 표시 */}
        <div className='space-y-3'>
          <div className='flex items-end justify-center gap-2'>
            <span className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl'>
              {hours}
            </span>
            <span className='mb-2 text-2xl font-medium text-gray-700 sm:text-3xl'>
              시간
            </span>
          </div>

          <div className='text-sm text-gray-500'>
            정확한 시간: {formatTime(totalTime)}
          </div>
        </div>

        {/* 레벨 시스템 */}
        <div className='mt-6 space-y-3'>
          <div className='flex items-center justify-center gap-2'>
            <div className='text-3xl'>{levelInfo.icon}</div>
            <Badge
              className={`bg-gradient-to-r ${levelInfo.color} font-bold text-white shadow-lg`}
            >
              {levelInfo.level}
            </Badge>
          </div>

          <p className='text-sm font-medium text-gray-700'>
            {levelInfo.message}
          </p>

          {/* 진행률 바 */}
          <div className='mx-auto max-w-xs'>
            <div className='h-2 w-full rounded-full bg-gray-200'>
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${levelInfo.color} transition-all duration-1000 ease-out`}
                style={{ width: `${Math.min((hours / 12) * 100, 100)}%` }}
              ></div>
            </div>
            <div className='mt-1 flex justify-between text-xs text-gray-500'>
              <span>0h</span>
              <span>12h</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
