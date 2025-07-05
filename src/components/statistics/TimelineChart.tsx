'use client';

import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/shadcn/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { cardSystem, componentStates, spacing } from '@/styles/design-system';
import { Activity } from 'lucide-react';
import { useMemo, useRef, useState, useEffect } from 'react';
import NoData from '../common/NoData';

interface ScheduleItem {
  id: string;
  title?: string;
  startTime: string; // "09:00" format
  endTime: string; // "10:30" format
  type: 'primary' | 'secondary'; // productive | non-productive
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
  viewHours?: number; // Number of hours to display at once (default: 4)
  startHour?: number; // Starting hour of the view (default: 0)
}

export default function TimelineChart({ 
  schedules, 
  timelineData, 
  date, 
  isLoading,
  viewHours = 4,
  startHour = 0 
}: TimelineChartProps) {
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();

  // Get current hour for initial position
  const currentHour = new Date().getHours();
  const initialPosition = Math.max(0, Math.min(24 - viewHours, currentHour - Math.floor(viewHours / 2)));
  
  // State for scroll position
  const [scrollPosition, setScrollPosition] = useState(initialPosition);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Mouse drag states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });

  // Calculate visible hours based on scroll position
  const visibleHours = useMemo(() => {
    const hours = [];
    const start = Math.max(0, scrollPosition);
    const end = Math.min(24, scrollPosition + viewHours);
    for (let i = start; i <= end; i++) {
      hours.push(i);
    }
    return hours;
  }, [scrollPosition, viewHours]);

  // Full 24-hour range for calculations
  const fullDayHours = useMemo(() => {
    const hours = [];
    for (let i = 0; i <= 24; i++) {
      hours.push(i);
    }
    return hours;
  }, []);

  // Set initial scroll position when component mounts
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollPercentage = scrollPosition / (24 - viewHours);
      const scrollLeft = scrollPercentage * (scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth);
      scrollContainerRef.current.scrollLeft = scrollLeft;
    }
  }, []);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      scrollLeft: scrollContainerRef.current.scrollLeft
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    
    e.preventDefault();
    const deltaX = e.clientX - dragStart.x;
    scrollContainerRef.current.scrollLeft = dragStart.scrollLeft - deltaX;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Function to convert time to minutes (HH:MM format or ISO string)
  const timeToMinutes = (time: string): number => {
    if (!time) return 0;
    
    if (time.includes('T')) {
      // If ISO string
      const date = new Date(time);
      if (isNaN(date.getTime())) return 0;
      return date.getHours() * 60 + date.getMinutes();
    } else {
      // If HH:MM format
      const parts = time.split(':');
      if (parts.length !== 2) return 0;
      const [hours, minutes] = parts.map(Number);
      if (isNaN(hours) || isNaN(minutes)) return 0;
      return hours * 60 + minutes;
    }
  };

  // Function to convert minutes to time
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
        'work': { color: '#2E236C', type: 'primary' as const }, // 다크 네이비
        'DEVELOPMENT': { color: '#433D8B', type: 'primary' as const }, // 미드 퍼플
        'Documentation': { color: '#C8ACD6', type: 'primary' as const }, // 라이트 퍼플
        'Design': { color: '#433D8B', type: 'primary' as const }, // 미드 퍼플
        'LLM': { color: '#2E236C', type: 'primary' as const }, // 딥 퍼플
        'Learning': { color: '#C8ACD6', type: 'primary' as const }, // 라이트 퍼플
        
        // 회의/커뮤니케이션 - 퍼플 계열 (업무와 비슷한 톤)
        'meetings': { color: '#2E236C', type: 'primary' as const }, // 미드 퍼플
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

  // Convert timelineData to schedules format and sort
  const convertedSchedules = useMemo(() => {
    if (schedules && schedules.length > 0) return schedules;
    if (!timelineData || !Array.isArray(timelineData)) return [];
    
    return timelineData
      .filter(item => item && item.startedAt && item.endedAt)
      .map((item, index) => {
        const colorInfo = getCategoryColor(item.mergedCategory);
        return {
          id: `timeline-${index}`,
          title: item.title || item.app || 'Activity',
          startTime: item.startedAt,
          endTime: item.endedAt,
          type: colorInfo.type,
          mergedCategory: item.mergedCategory,
          app: item.app
        };
      })
      .sort((a, b) => {
        // Sort by start time
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

    // Productive categories first, non-productive categories later
    return categories.sort((a, b) => {
      if (a.type === 'primary' && b.type === 'secondary') return -1;
      if (a.type === 'secondary' && b.type === 'primary') return 1;
      return a.category.localeCompare(b.category);
    });
  }, [convertedSchedules]);

  // Check for no data state
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
              <p className={getThemeClass('textSecondary')}>Loading timeline data...</p>
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
      <CardHeader className={cn(cardSystem.header, '')}>
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
              title="No timeline data available"
              message="No activity records for today. Start tracking your usage."
              icon={Activity}
              showBorder={false}
              size="medium"
            />
          </div>
        ) : (
        <div className="relative">
          {/* Current time range indicator */}
          <div className={cn('text-center text-sm font-medium mb-2', getThemeTextColor('secondary'))}>
            {`${scrollPosition.toString().padStart(2, '0')}:00 - ${Math.min(24, scrollPosition + viewHours).toString().padStart(2, '0')}:00`}
          </div>

          {/* Scrollable timeline container */}
          <div 
            className={cn(
              "w-full overflow-x-auto",
              "scrollbar-thin",
              isDarkMode ? "scrollbar-thumb-gray-600 scrollbar-track-gray-800" : "scrollbar-thumb-gray-400 scrollbar-track-gray-200",
              "hover:scrollbar-thumb-gray-500"
            )}
            ref={scrollContainerRef}
            onScroll={(e) => {
              const scrollLeft = e.currentTarget.scrollLeft;
              const scrollWidth = e.currentTarget.scrollWidth - e.currentTarget.clientWidth;
              const scrollPercentage = scrollLeft / scrollWidth;
              const newPosition = Math.round(scrollPercentage * (24 - viewHours));
              setScrollPosition(newPosition);
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative" style={{ width: `${(24 / viewHours) * 100}%` }}>
              {/* Timeline bar */}
              <div className="relative mb-2">
              {/* 배경 바 (어두운 배경) */}
              <div className={cn(
                'w-full h-16 lg:h-20 relative overflow-hidden rounded-sm shadow-inner',
                getThemeClass('componentSecondary'),
                'border-2',
                getThemeClass('border')
              )}>
                  {/* Time grid lines (1-hour intervals) - for full 24 hours */}
                  <div className="absolute inset-0 flex">
                    {fullDayHours.slice(0, -1).map((hour, index) => (
                      <div
                        key={hour}
                        className={cn('flex-1 border-r', getThemeClass('border'))}
                      />
                    ))}
                  </div>

                  {/* Activity blocks - for full 24 hours */}
                  {convertedSchedules.map((schedule, index) => {
                    const startMinutes = timeToMinutes(schedule.startTime);
                    const endMinutes = timeToMinutes(schedule.endTime);
                    const timelineStart = 0 * 60; // 0:00
                    const timelineEnd = 24 * 60; // 24:00
                    const timelineWidth = timelineEnd - timelineStart;

                    const left = ((startMinutes - timelineStart) / timelineWidth) * 100;
                    const width = ((endMinutes - startMinutes) / timelineWidth) * 100;

                  const category = schedule.mergedCategory || 'others';
                  const colorInfo = getCategoryColor(category);
                  
                  // Calculate z-index to prevent overlap (by time order)
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

              {/* Time labels (bottom) - for full 24 hours */}
              <div className="relative">
                <div className="flex justify-between">
                  {fullDayHours.map((hour, index) => (
                    <div
                      key={hour}
                      className={cn(
                        'text-center text-xs lg:text-sm font-medium',
                        getThemeTextColor('secondary'),
                        // Show every hour on the expanded timeline
                        'block'
                      )}
                    >
                      {hour === 24 ? '24:00' : `${hour.toString().padStart(2, '0')}:00`}
                    </div>
                  ))}
                </div>
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