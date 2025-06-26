'use client';

import { Card, CardContent } from '@/shadcn/ui/card';
import { useTheme } from '@/hooks/useTheme';
import { cardSystem, componentStates, spacing } from '@/styles/design-system';

interface TotalTimeCardProps {
  totalTime: number; // seconds
}

export default function TotalTimeCard({
  totalTime,
}: TotalTimeCardProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();
  
  // 시간 포맷팅
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours === 0) {
      return `${minutes}분`;
    }
    if (minutes === 0) {
      return `${hours}시간`;
    }
    return `${hours}시간 ${minutes}분`;
  };

  // 항상 전체 시간 표시
  const displayTime = totalTime;
  const displayTitle = '전체 활동 시간';

  return (
    <Card className={`${cardSystem.base} ${cardSystem.variants.elevated} ${componentStates.default.transition} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className={`${cardSystem.content} ${spacing.inner.normal}`}>
        <div className="flex items-center justify-between">
          {/* 왼쪽: 제목 표시 */}
          <div className="flex items-center gap-3">
            <div>
              <h3 className={`text-lg font-semibold ${getThemeTextColor('primary')}`}>
                {displayTitle}
              </h3>
              <p className={`text-sm ${getThemeTextColor('secondary')}`}>
                오늘의 총 활동
              </p>
            </div>
          </div>

          {/* 오른쪽: 시간 표시 */}
          <div className="text-right">
            <div className={`text-3xl font-bold ${getThemeTextColor('primary')}`}>
              {formatTime(displayTime)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
