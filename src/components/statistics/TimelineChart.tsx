'use client';

import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/shadcn/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { cardSystem, componentStates, spacing } from '@/styles/design-system';
import { useMemo } from 'react';

interface ScheduleItem {
  id: string;
  title?: string;
  startTime: string; // "09:00" 형식
  endTime: string; // "10:30" 형식
  type: 'primary' | 'secondary'; // 보라색 | 청록색
}

interface TimelineChartProps {
  schedules: ScheduleItem[];
  date?: string;
}

export default function TimelineChart({ schedules, date }: TimelineChartProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();

  // 6:00-21:00 시간 범위 (1시간 간격)
  const timeHours = useMemo(() => {
    const hours = [];
    for (let i = 6; i <= 21; i++) {
      hours.push(i);
    }
    return hours;
  }, []);

  // 시간을 분 단위로 변환하는 함수
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // 분을 시간으로 변환하는 함수
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={cn(
      cardSystem.base,
      cardSystem.variants.elevated,
      componentStates.default.transition,
      getThemeClass('border'),
      getThemeClass('component'),
      'shadow-sm hover:shadow-md'
    )}>
      <CardHeader className={cn(cardSystem.header, spacing.section.tight)}>
        <CardTitle className={cn(
          'flex items-center gap-3 text-lg font-bold',
          getThemeTextColor('primary')
        )}>
          TIMELINE
        </CardTitle>
      </CardHeader>

      <CardContent className={cn(cardSystem.content, 'pb-6')}>
        <div className="relative overflow-x-auto">
          <div className="min-w-[900px]">
            {/* 타임라인 바 */}
            <div className="relative mb-6">
              {/* 배경 바 */}
              <div className={cn(
                'w-full h-16 relative overflow-hidden',
                getThemeClass('componentSecondary'),
                'border border-solid',
                getThemeClass('border'),
                'rounded-sm'
              )}>
                {/* 시간 눈금선 (1시간 간격) */}
                <div className="absolute inset-0 flex">
                  {timeHours.slice(0, -1).map((hour, index) => (
                    <div
                      key={hour}
                      className={cn(
                        'flex-1 border-r border-opacity-30',
                        getThemeClass('border')
                      )}
                    />
                  ))}
                </div>

                {/* 활동 블록들 */}
                {schedules.map((schedule) => {
                  const startMinutes = timeToMinutes(schedule.startTime);
                  const endMinutes = timeToMinutes(schedule.endTime);
                  const timelineStart = 6 * 60; // 6:00 (360분)
                  const timelineEnd = 21 * 60; // 21:00 (1260분)
                  const timelineWidth = timelineEnd - timelineStart; // 900분

                  const left = ((startMinutes - timelineStart) / timelineWidth) * 100;
                  const width = ((endMinutes - startMinutes) / timelineWidth) * 100;

                  return (
                    <div
                      key={schedule.id}
                      className={cn(
                        'absolute h-16 transition-all duration-200 cursor-pointer group',
                        'top-0 z-10',
                        // 퍼플 테마 색상 사용 - 보조 활동은 더 밝은 색상으로 구분
                        schedule.type === 'primary'
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                          : 'bg-gradient-to-r from-indigo-400 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600',
                        'hover:z-20',
                        'shadow-sm hover:shadow-md'
                      )}
                      style={{
                        left: `${left}%`,
                        width: `${Math.max(width, 2)}%`,
                        minWidth: '8px'
                      }}
                      title={`${schedule.title || '활동'} (${schedule.startTime}-${schedule.endTime})`}
                    >
                      {/* 호버 시 상세 정보 */}
                      <div className={cn(
                        'absolute -top-14 left-1/2 transform -translate-x-1/2 px-3 py-2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30',
                        getThemeClass('component'),
                        'border shadow-lg rounded-lg',
                        getThemeClass('border')
                      )}>
                        <div className={cn('font-medium', getThemeTextColor('primary'))}>
                          {schedule.title || '활동'}
                        </div>
                        <div className={cn('text-xs mt-1', getThemeTextColor('secondary'))}>
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 시간 라벨 (하단) */}
            <div className="relative">
              <div className="flex justify-between">
                {timeHours.map((hour) => (
                  <div
                    key={hour}
                    className={cn(
                      'text-center text-sm font-medium',
                      getThemeTextColor('secondary')
                    )}
                  >
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 범례 */}
          <div className={cn(
            'mt-8 flex flex-wrap gap-6 p-4',
            getThemeClass('componentSecondary'),
            'border border-solid rounded-lg',
            getThemeClass('border')
          )}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-3 bg-gradient-to-r from-purple-500 to-purple-600 flex-shrink-0 shadow-sm rounded-sm"></div>
              <span className={cn('text-sm font-medium', getThemeTextColor('primary'))}>
                주요 활동
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-3 bg-gradient-to-r from-indigo-400 to-indigo-500 flex-shrink-0 shadow-sm rounded-sm"></div>
              <span className={cn('text-sm font-medium', getThemeTextColor('primary'))}>
                보조 활동
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}