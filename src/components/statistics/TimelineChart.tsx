'use client';

import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/shadcn/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { cardSystem, componentStates, spacing } from '@/styles/design-system';
import { Activity, ZoomIn, ZoomOut } from 'lucide-react';
import { useMemo, useRef, useState, useEffect } from 'react';
import NoData from '../common/NoData';

// Constants
const TIMELINE_CONSTANTS = {
  MIN_BLOCK_WIDTH: 2, // px
  TIMELINE_START: 0, // hours
  TIMELINE_END: 24, // hours
  DEFAULT_VIEW_HOURS: 12,
  ZOOM_LEVELS: [4, 8, 12, 24], // Available zoom levels
  SCROLL_DELAY: 100, // ms
  MIN_WIDTH_PERCENTAGE: 0.1, // %
  Z_INDEX_BASE: 100,
  LEGEND_WIDTH: 6, // w-6 in tailwind
  LEGEND_HEIGHT: 3, // h-3 in tailwind
} as const;

interface ScheduleItem {
  id: string;
  title?: string;
  startTime: string; // "09:00" format
  endTime: string; // "10:30" format
  type: 'primary' | 'secondary'; // productive | non-productive
  mergedCategory?: string;
  app?: string;
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
  isLoading?: boolean;
  viewHours?: typeof TIMELINE_CONSTANTS.ZOOM_LEVELS[number]; // Number of hours to display at once
}

export default function TimelineChart({ 
  schedules, 
  timelineData, 
  isLoading,
  viewHours: initialViewHours = TIMELINE_CONSTANTS.DEFAULT_VIEW_HOURS
}: TimelineChartProps) {
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();

  // State for view hours (zoom level)
  const [viewHours, setViewHours] = useState<typeof TIMELINE_CONSTANTS.ZOOM_LEVELS[number]>(
    initialViewHours as typeof TIMELINE_CONSTANTS.ZOOM_LEVELS[number]
  );
  const [zoomCenter, setZoomCenter] = useState<number | null>(null);

  // Get current hour for initial position
  const currentHour = new Date().getHours();
  const calculateInitialPosition = (hours: number) => {
    const position = currentHour - Math.floor(hours / 2);
    return Math.max(0, Math.min(TIMELINE_CONSTANTS.TIMELINE_END - hours, position));
  };
  
  // State for scroll position
  const [scrollPosition, setScrollPosition] = useState(() => calculateInitialPosition(viewHours));
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Mouse drag states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });


  // Full 24-hour range for calculations
  const fullDayHours = useMemo(() => {
    const hours = [];
    for (let i = TIMELINE_CONSTANTS.TIMELINE_START; i <= TIMELINE_CONSTANTS.TIMELINE_END; i++) {
      hours.push(i);
    }
    return hours;
  }, []);

  // Helper function to update scroll position
  const updateScrollPosition = (position: number, targetViewHours?: number) => {
    if (!scrollContainerRef.current) return;
    
    const hours = targetViewHours || viewHours;
    const safePosition = Math.max(0, Math.min(position, TIMELINE_CONSTANTS.TIMELINE_END - hours));
    
    // For 24-hour view, no scrolling needed
    if (hours >= 24) {
      scrollContainerRef.current.scrollLeft = 0;
      return;
    }
    
    const scrollPercentage = safePosition / (TIMELINE_CONSTANTS.TIMELINE_END - hours);
    const scrollWidth = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
    
    if (scrollWidth > 0) {
      const scrollLeft = scrollPercentage * scrollWidth;
      scrollContainerRef.current.scrollLeft = scrollLeft;
    }
  };

  // Track if initial scroll has been set
  const [hasInitialScroll, setHasInitialScroll] = useState(false);

  // Set initial scroll position after data loads
  useEffect(() => {
    // Only set initial position when:
    // 1. Not loading
    // 2. Haven't set initial scroll yet
    // 3. Container is available
    if (isLoading || hasInitialScroll || !scrollContainerRef.current) return;
    
    // Use requestAnimationFrame to ensure DOM is fully painted
    requestAnimationFrame(() => {
      const position = calculateInitialPosition(viewHours);
      updateScrollPosition(position, viewHours);
      setHasInitialScroll(true);
    });
  }, [isLoading, hasInitialScroll, viewHours]);

  // Handle zoom center preservation
  useEffect(() => {
    if (zoomCenter !== null && scrollContainerRef.current) {
      const newScrollPosition = Math.max(
        0,
        Math.min(
          TIMELINE_CONSTANTS.TIMELINE_END - viewHours,
          zoomCenter - viewHours / 2
        )
      );
      
      setScrollPosition(newScrollPosition);
      updateScrollPosition(newScrollPosition, viewHours);
      setZoomCenter(null); // Reset after use
    }
  }, [viewHours, zoomCenter]);

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


  // Zoom handlers
  const handleZoomIn = () => {
    const currentIndex = TIMELINE_CONSTANTS.ZOOM_LEVELS.indexOf(viewHours);
    if (currentIndex > 0) {
      const newViewHours = TIMELINE_CONSTANTS.ZOOM_LEVELS[currentIndex - 1];
      
      // Calculate the center of the current view
      const centerHour = scrollPosition + viewHours / 2;
      
      // Set the center for the zoom effect
      setZoomCenter(centerHour);
      setViewHours(newViewHours);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = TIMELINE_CONSTANTS.ZOOM_LEVELS.indexOf(viewHours);
    if (currentIndex < TIMELINE_CONSTANTS.ZOOM_LEVELS.length - 1) {
      const newViewHours = TIMELINE_CONSTANTS.ZOOM_LEVELS[currentIndex + 1];
      
      // Calculate the center of the current view
      const centerHour = scrollPosition + viewHours / 2;
      
      // Set the center for the zoom effect
      if (newViewHours >= 24) {
        // For 24-hour view, just reset to 0
        setViewHours(newViewHours);
        setScrollPosition(0);
      } else {
        setZoomCenter(centerHour);
        setViewHours(newViewHours);
      }
    }
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


  // 테마별 카테고리 색상 매핑 - work와 breaks만 지원
  const getCategoryColor = (category: string) => {
    const timelineColors = {
      dark: {
        'work': { color: '#433D8B', type: 'primary' as const }, // 진한 퍼플 (생산적인 활동)
        'breaks': { color: '#C8ACD6', type: 'secondary' as const }, // 연한 퍼플 (휴식)
      },
      light: {
        'work': { color: '#405D72', type: 'primary' as const }, // 진한 블루 그레이 (생산적인 활동)
        'breaks': { color: '#F7E7DC', type: 'secondary' as const }, // 연한 베이지 (휴식)
      }
    };

    const currentColors = timelineColors[isDarkMode ? 'dark' : 'light'];
    return currentColors[category as keyof typeof currentColors] || currentColors.work; // 기본값은 work
  };

  // Convert timelineData to schedules format and sort
  const convertedSchedules = useMemo(() => {
    if (schedules && schedules.length > 0) return schedules;
    if (!timelineData || !Array.isArray(timelineData)) return [];
    
    // Work와 Breaks 시간 집계 (mergedCategory 기준)
    const workTotal = timelineData.reduce((sum, item) => {
      if (item && item.startedAt && item.endedAt && item.mergedCategory === 'work') {
        const startMinutes = timeToMinutes(item.startedAt);
        const endMinutes = timeToMinutes(item.endedAt);
        const duration = endMinutes - startMinutes;
        return sum + (duration > 0 ? duration : 0);
      }
      return sum;
    }, 0);
    
    const breakTotal = timelineData.reduce((sum, item) => {
      if (item && item.startedAt && item.endedAt && item.mergedCategory === 'breaks') {
        const startMinutes = timeToMinutes(item.startedAt);
        const endMinutes = timeToMinutes(item.endedAt);
        const duration = endMinutes - startMinutes;
        return sum + (duration > 0 ? duration : 0);
      }
      return sum;
    }, 0);
    
    const totalTime = workTotal + breakTotal;
    
    console.log('⏰ 시간 집계 (mergedCategory 기준):');
    console.log('📊 Work 시간:', (workTotal / 60).toFixed(2) + '시간', totalTime > 0 ? `(${((workTotal / totalTime) * 100).toFixed(1)}%)` : '');
    console.log('☕ Breaks 시간:', (breakTotal / 60).toFixed(2) + '시간', totalTime > 0 ? `(${((breakTotal / totalTime) * 100).toFixed(1)}%)` : '');
    console.log('🎯 전체 시간:', (totalTime / 60).toFixed(2) + '시간');
    
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


  // 카테고리별 범례 데이터 생성 - work와 breaks만 지원
  const legendData = useMemo(() => {
    const categoryMap = new Map<string, { color: string; type: 'primary' | 'secondary' }>();
    
    convertedSchedules.forEach(schedule => {
      if (schedule.mergedCategory && 
          !categoryMap.has(schedule.mergedCategory) &&
          (schedule.mergedCategory === 'work' || schedule.mergedCategory === 'breaks')) {
        const colorInfo = getCategoryColor(schedule.mergedCategory);
        categoryMap.set(schedule.mergedCategory, colorInfo);
      }
    });

    const categories = Array.from(categoryMap.entries()).map(([category, colorInfo]) => ({
      category,
      color: colorInfo.color,
      type: colorInfo.type
    }));

    // work가 먼저, breaks가 나중에
    return categories.sort((a, b) => {
      if (a.category === 'work' && b.category === 'breaks') return -1;
      if (a.category === 'breaks' && b.category === 'work') return 1;
      return 0;
    });
  }, [convertedSchedules]);

  // Check for no data state
  const hasNoData = !isLoading && convertedSchedules.length === 0;

  // Common card styles
  const cardStyles = cn(
    cardSystem.base,
    cardSystem.variants.elevated,
    componentStates.default.transition,
    getThemeClass('border'),
    getThemeClass('component'),
    'shadow-sm hover:shadow-md'
  );

  if (isLoading) {
    return (
      <Card className={cardStyles}>
        <CardHeader className={cn(cardSystem.header, spacing.section.tight)}>
          <CardTitle className={cn(
            'flex items-center gap-3 text-lg font-bold',
            getThemeTextColor('primary')
          )}>
            TIMELINE
          </CardTitle>
        </CardHeader>
        <CardContent className={cn(cardSystem.content, 'pb-4')}>
          <div className="relative">
            {/* Current time range skeleton */}
            <div className="text-center mb-2">
              <div className={`h-5 w-24 mx-auto animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
            </div>

            {/* Timeline container skeleton */}
            <div className="w-full overflow-hidden">
              <div className="relative mb-2">
                {/* Timeline bar skeleton */}
                <div className={cn(
                  'w-full h-16 lg:h-20 relative overflow-hidden rounded-sm',
                  getThemeClass('componentSecondary'),
                  'border-2',
                  getThemeClass('border')
                )}>
                  {/* Activity blocks skeleton */}
                  <div className="absolute inset-0 flex gap-1 p-1">
                    {[...Array(8)].map((_, index) => (
                      <div
                        key={index}
                        className={`flex-1 animate-pulse rounded ${getThemeClass('borderLight')}`}
                        style={{ 
                          height: '100%',
                          animationDelay: `${index * 100}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Time labels skeleton */}
                <div className="relative mt-2">
                  <div className="flex justify-between">
                    {[...Array(6)].map((_, index) => (
                      <div
                        key={index}
                        className={`h-4 w-10 animate-pulse rounded ${getThemeClass('borderLight')}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend skeleton */}
            <div className={cn(
              'mt-4 p-3',
              getThemeClass('componentSecondary'),
              'border border-solid rounded-lg',
              getThemeClass('border')
            )}>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-6 h-3 animate-pulse rounded-sm ${getThemeClass('borderLight')}`}></div>
                    <div className={`h-4 w-16 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${cardStyles} relative z-10`}>
      <CardHeader className={cn(cardSystem.header, '')}>
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            'flex items-center gap-3 text-lg font-bold',
            getThemeTextColor('primary')
          )}>
            TIMELINE
          </CardTitle>
          
          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={viewHours === TIMELINE_CONSTANTS.ZOOM_LEVELS[TIMELINE_CONSTANTS.ZOOM_LEVELS.length - 1]}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                getThemeClass('componentSecondary'),
                'hover:bg-opacity-80',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'border',
                getThemeClass('border')
              )}
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            
            <span className={cn('text-sm font-medium px-2', getThemeTextColor('secondary'))}>
              {viewHours}h
            </span>
            
            <button
              onClick={handleZoomIn}
              disabled={viewHours === TIMELINE_CONSTANTS.ZOOM_LEVELS[0]}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                getThemeClass('componentSecondary'),
                'hover:bg-opacity-80',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'border',
                getThemeClass('border')
              )}
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>
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
            {viewHours >= TIMELINE_CONSTANTS.ZOOM_LEVELS[TIMELINE_CONSTANTS.ZOOM_LEVELS.length - 1]
              ? '00:00 - 24:00'
              : `${Math.round(scrollPosition).toString().padStart(2, '0')}:00 - ${Math.round(Math.min(TIMELINE_CONSTANTS.TIMELINE_END, scrollPosition + viewHours)).toString().padStart(2, '0')}:00`
            }
          </div>

          {/* Scrollable timeline container */}
          <div 
            className={cn(
              "w-full",
              viewHours < TIMELINE_CONSTANTS.ZOOM_LEVELS[TIMELINE_CONSTANTS.ZOOM_LEVELS.length - 1] ? "overflow-x-auto timeline-scroll-hide" : "overflow-x-hidden"
            )}
            ref={scrollContainerRef}
            onScroll={(e) => {
              // Only handle scroll if not showing full 24 hours
              if (viewHours >= TIMELINE_CONSTANTS.ZOOM_LEVELS[TIMELINE_CONSTANTS.ZOOM_LEVELS.length - 1]) return;
              
              const scrollLeft = e.currentTarget.scrollLeft;
              const scrollWidth = e.currentTarget.scrollWidth - e.currentTarget.clientWidth;
              
              if (scrollWidth > 0) {
                const scrollPercentage = scrollLeft / scrollWidth;
                const newPosition = Math.round(scrollPercentage * (TIMELINE_CONSTANTS.TIMELINE_END - viewHours));
                const safePosition = Math.max(0, Math.min(newPosition, TIMELINE_CONSTANTS.TIMELINE_END - viewHours));
                
                if (!isNaN(safePosition)) {
                  setScrollPosition(safePosition);
                }
              }
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative" style={{ width: `${(TIMELINE_CONSTANTS.TIMELINE_END / viewHours) * 100}%` }}>
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
                    const timelineStart = TIMELINE_CONSTANTS.TIMELINE_START * 60; // 0:00
                    const timelineEnd = TIMELINE_CONSTANTS.TIMELINE_END * 60; // 24:00
                    const timelineWidth = timelineEnd - timelineStart;

                    const left = ((startMinutes - timelineStart) / timelineWidth) * 100;
                    const width = ((endMinutes - startMinutes) / timelineWidth) * 100;

                  const category = schedule.mergedCategory || 'others';
                  const colorInfo = getCategoryColor(category);
                  
                  // Calculate z-index to prevent overlap (by time order)
                  const zIndex = TIMELINE_CONSTANTS.Z_INDEX_BASE + index;
                  
                  // 명확한 블록 스타일 - 투명도 없이 순수 색상만
                  const blockStyle = {
                    position: 'absolute' as const,
                    left: `${Math.max(left, 0)}%`,
                    width: `${Math.max(width, TIMELINE_CONSTANTS.MIN_WIDTH_PERCENTAGE)}%`,
                    minWidth: `${TIMELINE_CONSTANTS.MIN_BLOCK_WIDTH}px`,
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
                  {fullDayHours.map((hour, index) => {
                    // Dynamic label display based on zoom level
                    const showLabel = 
                      viewHours === 24 ? hour % 6 === 0 :  // Show every 6 hours for full day
                      viewHours === 12 ? hour % 3 === 0 :  // Show every 3 hours for 12h view
                      viewHours === 8 ? hour % 2 === 0 :   // Show every 2 hours for 8h view
                      true;                                 // Show every hour for 4h view
                    
                    return (
                      <div
                        key={hour}
                        className={cn(
                          'text-center text-xs lg:text-sm font-medium',
                          getThemeTextColor('secondary'),
                          showLabel ? 'block' : 'hidden'
                        )}
                      >
                        {hour === TIMELINE_CONSTANTS.TIMELINE_END ? '24:00' : `${hour.toString().padStart(2, '0')}:00`}
                      </div>
                    );
                  })}
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
              {legendData.map((legend) => (
                <div key={legend.category} className="flex items-center gap-2">
                  <div 
                    className="w-6 h-3 flex-shrink-0 shadow-sm rounded-sm"
                    style={{ backgroundColor: legend.color }}
                  ></div>
                  <span className={cn(
                    'text-xs font-medium', 
                    getThemeTextColor('primary')
                  )}>
                    {legend.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
}