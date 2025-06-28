'use client';

import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/shadcn/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { cardSystem, componentStates, spacing } from '@/styles/design-system';
import React, { useMemo } from 'react';
import NoData from '../common/NoData';
import { Clock } from 'lucide-react';

interface ScheduleItem {
  id: string;
  title?: string;
  startTime: string; // "09:00" 형식
  endTime: string; // "10:30" 형식
  type: 'primary' | 'secondary'; // 생산성 | 비생산성
  mergedCategory?: string;
  app?: string;
  colorClass?: string;
  hoverColorClass?: string;
}

interface TimelineChartProps {
  schedules?: ScheduleItem[];
  timelineData?: Array<{
    mergedCategory: string;
    startedAt: string; // ISO string
    endedAt: string; // ISO string
    app: string;
    title: string;
  }>;
  date?: string;
  isLoading?: boolean;
}

export default function TimelineChart({ schedules, timelineData, date, isLoading }: TimelineChartProps) {
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();

  // 0:00-23:00 시간 범위 (1시간 간격) - 전체 하루로 확장
  const timeHours = useMemo(() => {
    const hours = [];
    for (let i = 0; i <= 23; i++) {
      hours.push(i);
    }
    return hours;
  }, []);

  // 시간을 분 단위로 변환하는 함수 (HH:MM 형식 또는 ISO string)
  const timeToMinutes = (time: string): number => {
    if (!time) return 0;
    
    if (time.includes('T')) {
      // ISO string인 경우
      const date = new Date(time);
      if (isNaN(date.getTime())) return 0;
      return date.getHours() * 60 + date.getMinutes();
    } else {
      // HH:MM 형식인 경우
      const parts = time.split(':');
      if (parts.length !== 2) return 0;
      const [hours, minutes] = parts.map(Number);
      if (isNaN(hours) || isNaN(minutes)) return 0;
      return hours * 60 + minutes;
    }
  };

  // 분을 시간으로 변환하는 함수
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // 테마별 카테고리 색상 매핑 - 깔끔하고 세련된 색상 시스템
  const getCategoryColor = (category: string) => {
    // 새로운 퍼플 그라데이션 팔레트
    const timelineColors = {
      dark: {
        // 업무 카테고리 - 퍼플 그라데이션 계열
        'work': { color: '#17153B', type: 'primary' as const }, // 다크 네이비
        'DEVELOPMENT': { color: '#433D8B', type: 'primary' as const }, // 미드 퍼플
        'Documentation': { color: '#C8ACD6', type: 'primary' as const }, // 라이트 퍼플
        'Design': { color: '#433D8B', type: 'primary' as const }, // 미드 퍼플
        'LLM': { color: '#2E236C', type: 'primary' as const }, // 딥 퍼플
        'Learning': { color: '#C8ACD6', type: 'primary' as const }, // 라이트 퍼플
        
        // 회의/커뮤니케이션 - 퍼플 계열 (업무와 비슷한 톤)
        'meetings': { color: '#433D8B', type: 'primary' as const }, // 미드 퍼플
        'Communication': { color: '#C8ACD6', type: 'primary' as const }, // 라이트 퍼플
        
        // 휴식/오락 - 다크 계열 (대비되는 쿨톤)
        'breaks': { color: '#C8ACD6', type: 'secondary' as const }, // 라이트 퍼플 (가장 연한 색)
        'Gaming': { color: '#17153B', type: 'secondary' as const }, // 다크 네이비
        'YouTube': { color: '#17153B', type: 'secondary' as const }, // 다크 네이비
        'SNS': { color: '#17153B', type: 'secondary' as const }, // 다크 네이비
        
        // 기타
        'Uncategorized': { color: '#2E236C', type: 'secondary' as const }, // 딥 퍼플
        'others': { color: '#2E236C', type: 'secondary' as const },
      },
      light: {
        // 업무 카테고리 - 딥 블루 그레이 계열
        'work': { color: '#405D72', type: 'primary' as const }, // 딥 블루 그레이
        'DEVELOPMENT': { color: '#405D72', type: 'primary' as const }, // 딥 블루 그레이
        'Documentation': { color: '#758694', type: 'primary' as const }, // 미드 그레이
        'Design': { color: '#405D72', type: 'primary' as const }, // 딥 블루 그레이
        'LLM': { color: '#405D72', type: 'primary' as const }, // 딥 블루 그레이
        'Learning': { color: '#758694', type: 'primary' as const }, // 미드 그레이
        
        // 회의/커뮤니케이션 - 그레이 계열
        'meetings': { color: '#758694', type: 'primary' as const }, // 미드 그레이
        'Communication': { color: '#405D72', type: 'primary' as const }, // 딥 블루 그레이
        
        // 휴식/오락 - 베이지 계열 (따뜻한 대비)
        'breaks': { color: '#FFF8F3', type: 'secondary' as const }, // 가장 연한 베이지
        'Gaming': { color: '#F7E7DC', type: 'secondary' as const }, // 라이트 베이지
        'YouTube': { color: '#F7E7DC', type: 'secondary' as const }, // 라이트 베이지
        'SNS': { color: '#F7E7DC', type: 'secondary' as const }, // 라이트 베이지
        
        // 기타
        'Uncategorized': { color: '#758694', type: 'secondary' as const }, // 미드 그레이
        'others': { color: '#758694', type: 'secondary' as const },
      }
    };

    const currentColors = timelineColors[isDarkMode ? 'dark' : 'light'];
    const exactMatch = currentColors[category as keyof typeof currentColors];
    const lowerMatch = currentColors[category.toLowerCase() as keyof typeof currentColors];
    
    return exactMatch || lowerMatch || currentColors.others;
  };

  // timelineData를 schedules 형식으로 변환 및 정렬
  const convertedSchedules = useMemo(() => {
    if (schedules && schedules.length > 0) return schedules;
    if (!timelineData || !Array.isArray(timelineData)) return [];
    
    return timelineData
      .filter(item => item && item.startedAt && item.endedAt)
      .map((item, index) => {
        const colorInfo = getCategoryColor(item.mergedCategory);
        return {
          id: `timeline-${index}`,
          title: item.title || item.app || '활동',
          startTime: item.startedAt,
          endTime: item.endedAt,
          type: colorInfo.type,
          mergedCategory: item.mergedCategory,
          app: item.app
        };
      })
      .sort((a, b) => {
        // 시작 시간 순으로 정렬
        const timeA = timeToMinutes(a.startTime);
        const timeB = timeToMinutes(b.startTime);
        return timeA - timeB;
      });
  }, [schedules, timelineData]);


  // 카테고리별 범례 데이터 생성
  const legendData = useMemo(() => {
    const categories = convertedSchedules.reduce((acc, schedule) => {
      if (schedule.mergedCategory && !acc.some(item => item.category === schedule.mergedCategory)) {
        const colorInfo = getCategoryColor(schedule.mergedCategory);
        acc.push({
          category: schedule.mergedCategory,
          color: colorInfo.color,
          type: colorInfo.type
        });
      }
      return acc;
    }, [] as Array<{ category: string; color: string; type: 'primary' | 'secondary' }>);

    // 생산성 카테고리 먼저, 비생산성 카테고리 나중에
    return categories.sort((a, b) => {
      if (a.type === 'primary' && b.type === 'secondary') return -1;
      if (a.type === 'secondary' && b.type === 'primary') return 1;
      return a.category.localeCompare(b.category);
    });
  }, [convertedSchedules]);

  // 데이터 없음 상태 체크
  const hasNoData = !isLoading && convertedSchedules.length === 0;

  if (isLoading) {
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
        <CardContent className={cn(cardSystem.content, 'pb-4')}>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
              <p className={getThemeClass('textSecondary')}>타임라인 데이터를 불러오는 중...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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

      <CardContent className={cn(cardSystem.content, 'pb-4')}>
        {hasNoData ? (
          <div className="flex h-[200px] items-center justify-center">
            <NoData
              title="타임라인 데이터가 없습니다"
              message="오늘 하루 동안의 활동 기록이 없습니다. 사용률 추적을 시작해보세요."
              icon={Clock}
              showBorder={false}
              size="medium"
            />
          </div>
        ) : (
        <div className="relative">
          <div className="w-full">
            {/* 타임라인 바 */}
            <div className="relative mb-2">
              {/* 배경 바 (어두운 배경) */}
              <div className={cn(
                'w-full h-16 lg:h-20 relative overflow-hidden rounded-sm shadow-inner',
                getThemeClass('componentSecondary'),
                getThemeClass('border')
              )}
              style={{
                border: '2px solid'
              }}>
                {/* 시간 눈금선 (1시간 간격) */}
                <div className="absolute inset-0 flex">
                  {timeHours.slice(0, -1).map((hour, index) => (
                    <div
                      key={hour}
                      className={cn('flex-1 border-r', getThemeClass('border'))}
                    />
                  ))}
                </div>

                {/* 활동 블록들 */}
                {convertedSchedules.map((schedule, index) => {
                  const startMinutes = timeToMinutes(schedule.startTime);
                  const endMinutes = timeToMinutes(schedule.endTime);
                  const timelineStart = 0 * 60; // 0:00 (0분)
                  const timelineEnd = 24 * 60; // 24:00 (1440분)
                  const timelineWidth = timelineEnd - timelineStart; // 1440분

                  const left = ((startMinutes - timelineStart) / timelineWidth) * 100;
                  const width = ((endMinutes - startMinutes) / timelineWidth) * 100;

                  const category = schedule.mergedCategory || 'others';
                  const colorInfo = getCategoryColor(category);
                  
                  // 겹침 방지를 위한 z-index 계산 (시간 순서대로)
                  const zIndex = 100 + index;
                  
                  // 명확한 블록 스타일 - 투명도 없이 순수 색상만
                  const blockStyle = {
                    position: 'absolute' as const,
                    left: `${Math.max(left, 0)}%`,
                    width: `${Math.max(width, 0.1)}%`,
                    minWidth: '2px',
                    height: '100%',
                    top: '0',
                    zIndex: zIndex,
                    backgroundColor: colorInfo?.color || '#9ca3af',
                    opacity: 1, // 완전 불투명
                    cursor: 'default'
                  };

                  return (
                    <div
                      key={`${schedule.id}-${index}`}
                      style={blockStyle}
                    />
                  );
                })}
              </div>
            </div>

            {/* 시간 라벨 (하단) */}
            <div className="relative">
              <div className="flex justify-between">
                {timeHours.map((hour, index) => (
                  <div
                    key={hour}
                    className={cn(
                      'text-center text-xs lg:text-sm font-medium',
                      getThemeTextColor('secondary'),
                      // 작은 화면에서는 4시간 간격으로 표시, 큰 화면에서는 2시간 간격
                      'lg:block',
                      index % 4 === 0 ? 'block' : 'hidden lg:block',
                      index % 2 !== 0 ? 'lg:hidden' : ''
                    )}
                  >
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 카테고리별 범례 */}
          <div className={cn(
            'mt-4 p-3',
            getThemeClass('componentSecondary'),
            'border border-solid rounded-lg',
            getThemeClass('border')
          )}>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {legendData.map((legend) => {
                const colorInfo = getCategoryColor(legend.category);
                return (
                  <div key={legend.category} className="flex items-center gap-2">
                    <div 
                      className="w-6 h-3 flex-shrink-0 shadow-sm rounded-sm"
                      style={{ backgroundColor: colorInfo.color }}
                    ></div>
                    <span className={cn(
                      'text-xs font-medium', 
                      getThemeTextColor('primary')
                    )}>
                      {legend.category}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
}