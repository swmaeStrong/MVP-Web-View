'use client';

import { Badge } from '@/shadcn/ui/badge';
import { Card, CardContent } from '@/shadcn/ui/card';
import { StatisticsCategory } from '@/types/statistics';

interface TotalTimeCardProps {
  totalTime: number; // seconds
  selectedCategory: StatisticsCategory | null; // 선택된 카테고리
}

export default function TotalTimeCard({
  totalTime,
  selectedCategory,
}: TotalTimeCardProps) {
  // 시간과 분 계산
  const getTimeDisplay = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours === 0) {
      return { hours: 0, minutes, display: `${minutes}m` };
    }
    if (minutes === 0) {
      return { hours, minutes: 0, display: `${hours}h` };
    }
    return { hours, minutes, display: `${hours}h ${minutes}m` };
  };

  // 선택된 카테고리의 시간 또는 총 시간 사용
  const displayTime = selectedCategory ? selectedCategory.time : totalTime;
  const timeInfo = getTimeDisplay(displayTime);
  const totalHours = displayTime / 3600; // 진행률 계산용

  // 카테고리별 레벨 시스템
  const getCategoryLevelInfo = () => {
    const categoryName = selectedCategory?.name || 'ALL';

    // 카테고리별로 다른 레벨 구간 설정
    const getLevelThresholds = (category: string) => {
      switch (category) {
        case 'DEVELOPMENT':
        case '개발':
          return [0, 3, 6, 10, 15, 20, 30]; // 개발은 더 높은 기준
        case 'Design':
        case '디자인':
          return [0, 2, 4, 7, 12, 18, 25];
        case 'LLM':
          return [0, 1, 3, 6, 10, 15, 22];
        default:
          return [0, 2, 4, 6, 8, 12, 16]; // 기본 기준
      }
    };

    const thresholds = getLevelThresholds(categoryName);
    const levels = [
      '새싹',
      '초급자',
      '중급자',
      '숙련자',
      '전문가',
      '마스터',
      '전설',
    ];
    const icons = ['🌿', '🌱', '✨', '⚡', '🔥', '🏆', '👑'];
    const colors = [
      'from-gray-400 to-gray-600',
      'from-gray-600 to-orange-600',
      'from-orange-600 to-yellow-600',
      'from-yellow-600 to-green-600',
      'from-green-600 to-blue-600',
      'from-blue-600 to-purple-600',
      'from-purple-600 to-pink-600',
    ];

    let currentLevelIndex = 0;
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (totalHours >= thresholds[i]) {
        currentLevelIndex = i;
        break;
      }
    }

    const isMaxLevel = currentLevelIndex === levels.length - 1;
    const nextLevelIndex = Math.min(currentLevelIndex + 1, levels.length - 1);
    const nextTarget = thresholds[nextLevelIndex];
    const currentTarget = thresholds[currentLevelIndex];

    return {
      level: levels[currentLevelIndex],
      color: colors[currentLevelIndex],
      icon: icons[currentLevelIndex],
      categoryName,
      nextLevel: isMaxLevel ? null : levels[nextLevelIndex],
      nextTarget,
      currentTarget,
      motivationMessage: isMaxLevel
        ? '최고 레벨 달성! 🎉'
        : `${levels[nextLevelIndex]}까지 ${(nextTarget - totalHours).toFixed(1)}시간 남았어요!`,
      progressPercentage: Math.min((totalHours / nextTarget) * 100, 100),
    };
  };

  const levelInfo = getCategoryLevelInfo();

  return (
    <Card className='rounded-lg border border-gray-100 bg-gradient-to-br from-purple-50/50 to-blue-50/50 shadow-sm transition-all duration-300 hover:shadow-md'>
      <CardContent className='p-4'>
        {/* 카테고리별 3분할 레이아웃 */}
        <div className='flex items-center justify-between gap-4'>
          {/* 왼쪽: 카테고리와 레벨 정보 */}
          <div className='flex flex-1 items-center gap-2'>
            <div className='text-2xl'>{levelInfo.icon}</div>
            <div>
              <div className='mb-1 flex items-center gap-2'>
                {selectedCategory && (
                  <div
                    className='h-3 w-3 rounded-full'
                    style={{ backgroundColor: selectedCategory.color }}
                  />
                )}
                <Badge
                  className={`bg-gradient-to-r ${levelInfo.color} px-3 py-1 text-sm font-bold text-white shadow-sm`}
                >
                  {levelInfo.level}
                </Badge>
              </div>
              <div className='text-xs leading-tight text-gray-600'>
                {selectedCategory ? selectedCategory.name : '전체 활동'}
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div className='h-14 w-px bg-gray-200'></div>

          {/* 가운데: 예쁜 시간 표시 */}
          <div className='flex-1 text-center'>
            <div className='relative'>
              <div
                className={`bg-gradient-to-r text-3xl font-bold ${levelInfo.color} bg-clip-text text-transparent`}
              >
                {timeInfo.display}
              </div>
              <div className='absolute -top-1 -right-1 text-xs text-gray-400'>
                ✨
              </div>
            </div>
            <div className='mt-1 text-xs text-gray-500'>
              {selectedCategory ? '카테고리 시간' : '전체 시간'}
            </div>
          </div>

          {/* 구분선 */}
          <div className='h-14 w-px bg-gray-200'></div>

          {/* 오른쪽: 동기부여 정보 */}
          <div className='flex-1'>
            <div className='text-center'>
              <div className='mb-1 text-xs text-gray-500'>다음 단계</div>
              {levelInfo.nextLevel ? (
                <>
                  <div className='mb-1 text-sm font-semibold text-purple-700'>
                    {levelInfo.nextLevel}
                  </div>
                  <div className='mb-2 text-xs leading-tight text-gray-600'>
                    {levelInfo.motivationMessage}
                  </div>
                </>
              ) : (
                <div className='mb-3 text-xs font-semibold text-purple-700'>
                  {levelInfo.motivationMessage}
                </div>
              )}

              {/* 진행률 바 */}
              <div className='w-full'>
                <div className='mb-1 h-2 w-full rounded-full bg-gray-200'>
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${levelInfo.color} transition-all duration-1000 ease-out`}
                    style={{
                      width: `${levelInfo.progressPercentage}%`,
                    }}
                  ></div>
                </div>
                <div className='flex justify-between text-xs text-gray-400'>
                  <span>{levelInfo.currentTarget}h</span>
                  <span>{levelInfo.nextTarget}h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
