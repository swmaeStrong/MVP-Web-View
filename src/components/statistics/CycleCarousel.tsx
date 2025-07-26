'use client';

import { useTheme } from '@/hooks/useTheme';
import { getSession } from '@/shared/api/get';
import { CycleData, CycleSegment } from '@/types/domains/usage/cycle';
import { getKSTDateString } from '@/utils/timezone';
import { useQuery } from '@tanstack/react-query';
import React, { memo, useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { EffectCoverflow, FreeMode, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shadcn/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface SessionCarouselProps {
  selectedDate?: string;
  currentSessionIndex?: number;
  onSessionSelect?: (sessionIndex: number) => void;
}

const SessionCarousel = memo(function SessionCarousel({ 
  selectedDate = getKSTDateString(),
  currentSessionIndex,
  onSessionSelect
}: SessionCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { getThemeClass, isDarkMode } = useTheme();
  const swiperRef = React.useRef<any>(null);

  // 세션 데이터 조회
  const { data: sessionData, isLoading, error } = useQuery({
    queryKey: ['sessions', selectedDate],
    queryFn: () => getSession(selectedDate),
    retry: 1,
  });

  // Session API 데이터를 CycleData 형태로 변환
  const cycles = React.useMemo(() => {
    if (!sessionData) return [];
    
    return sessionData.map((session, index): CycleData => {
      // details를 segments로 변환
      const segments: CycleSegment[] = session.details.map((detail, detailIndex) => {
        // category 값을 type으로 매핑
        let segmentType: 'work' | 'distraction' | 'afk' = 'work';
        
        if (detail.category === 'work') {
          segmentType = 'work';
        } else if (detail.category === 'distraction') {
          segmentType = 'distraction';
        } else if (detail.category === 'afk') {
          segmentType = 'afk';
        } else if (detail.category === 'break') {
          segmentType = 'distraction'; // break를 distraction으로 매핑
        } else {
          segmentType = 'work'; // 알 수 없는 카테고리는 work로 기본 설정
        }

        return {
          id: `${session.session}-${detailIndex}`,
          type: segmentType,
          startTime: new Date(detail.timestamp * 1000).toISOString(),
          endTime: new Date((detail.timestamp + detail.duration) * 1000).toISOString(),
          duration: detail.duration, // 타입과 맞추기 위해 초를 분으로 변환하되, 실제 초 값을 별도 저장
          category: detail.categoryDetail || detail.category,
          durationInSeconds: detail.duration // 실제 초 단위 값 저장
        } as CycleSegment & { durationInSeconds: number };
      });

      // 타입별 총계 계산
      let totalWorkTime = 0;
      let totalDistractionTime = 0;
      let totalAfkTime = 0;
      
      session.details.forEach(detail => {
        switch (detail.category) {
          case 'work':
            totalWorkTime += detail.duration;
            break;
          case 'distraction':
            totalDistractionTime += detail.duration;
            break;
          case 'afk':
            totalAfkTime += detail.duration;
            break;
        }
      });

      // 카테고리별로 집계 (categoryDetail 기준)
      const categoryMap = new Map<string, { duration: number; count: number; type: string }>();
      session.details.forEach(detail => {
        const categoryKey = detail.categoryDetail || detail.category;
        const existing = categoryMap.get(categoryKey) || { duration: 0, count: 0, type: detail.category };
        categoryMap.set(categoryKey, {
          duration: existing.duration + detail.duration,
          count: existing.count + 1,
          type: detail.category
        });
      });

      // 카테고리 색상 함수 (getSegmentColor와 일치)
      const getCategoryColor = (type: string) => {
        switch (type) {
          case 'work':
            return 'bg-purple-600'; // 보라색
          case 'distraction':
            return 'bg-red-500'; // 빨간색
          case 'afk':
            return 'bg-yellow-500'; // 노란색
          default:
            return 'bg-gray-400';
            }
      };

      // 카테고리 배열 생성 (상위 카테고리 순으로 정렬)
      const categories = Array.from(categoryMap.entries())
        .map(([name, data]) => ({
          name,
          duration: Math.round(data.duration / 60), // 초를 분으로 변환
          percentage: Math.round((data.duration / session.duration) * 100),
          color: getCategoryColor(data.type)
        }))
        .sort((a, b) => b.duration - a.duration);

      return {
        id: session.session.toString(),
        startTime: new Date(session.timestamp * 1000).toISOString(),
        endTime: new Date((session.timestamp + session.duration) * 1000).toISOString(),
        duration: Math.round(session.duration / 60), // 초를 분으로 변환
        segments,
        categories,
        totalProductivity: session.score,
        breakTime: Math.round(totalDistractionTime / 60), // distraction을 break로 표시
        afkTime: Math.round(totalAfkTime / 60), // afk 시간
        title: session.title
      };
    });
  }, [sessionData]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [cycles]);

  // currentSessionIndex가 변경되면 해당 인덱스로 이동
  useEffect(() => {
    if (currentSessionIndex !== undefined && currentSessionIndex !== currentIndex && swiperRef.current) {
      swiperRef.current.slideTo(currentSessionIndex);
      setCurrentIndex(currentSessionIndex);
    }
  }, [currentSessionIndex]);

  const handleSlideChange = React.useCallback((swiper: any) => {
    setCurrentIndex(swiper.activeIndex);
    if (onSessionSelect) {
      onSessionSelect(swiper.activeIndex);
    }
  }, [onSessionSelect]);


  const getSegmentColorClass = (segment: CycleSegment) => {
    switch (segment.type) {
      case 'work':
        return 'bg-purple-600'; // 보라색
      case 'distraction':
        return 'bg-red-500'; // 빨간색
      case 'afk':
        return 'bg-yellow-500'; // 노란색
      default:
        return 'bg-gray-400';
    }
  };

  const mergeConsecutiveSegments = (segments: (CycleSegment & { durationInSeconds: number })[]): (CycleSegment & { durationInSeconds: number })[] => {
    const merged: (CycleSegment & { durationInSeconds: number })[] = [];
    segments.forEach(segment => {
      const lastSegment = merged[merged.length - 1];
      
      if (lastSegment && 
          lastSegment.type === segment.type && 
          new Date(lastSegment.endTime).getTime() === new Date(segment.startTime).getTime()) {
        lastSegment.endTime = segment.endTime;
        lastSegment.duration += segment.duration;
        lastSegment.durationInSeconds += segment.durationInSeconds;
      } else {
        merged.push({ ...segment });
      }
    });
    return merged;
  };

  // 성능 최적화: 세그먼트 병합을 useMemo로 캐시
  const memoizedCycles = React.useMemo(() => {
    return cycles.map(cycle => {
      // 실제 work 시간 계산 (초 단위를 분으로 변환)
      const actualWorkTime = Math.round(cycle.segments
        .filter(segment => segment.type === 'work')
        .reduce((total, segment) => total + (segment as any).durationInSeconds, 0) / 60);
      
      return {
        ...cycle,
        workTime: actualWorkTime,
        mergedSegments: mergeConsecutiveSegments(cycle.segments as (CycleSegment & { durationInSeconds: number })[])
      };
    });
  }, [cycles]);

  // 메모이제이션으로 렌더링 최적화
  const renderCycleCard = React.useCallback((cycle: CycleData, workTime: number, mergedSegments: CycleSegment[]) => {
    return (
      <div className={`rounded-lg p-4 h-[240px] w-full transform-gpu border ${getThemeClass('border')} ${getThemeClass('component')} overflow-hidden`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className={`font-semibold text-base ${getThemeClass('textPrimary')} truncate`}>
              {cycle.title || `Session #${cycle.id}`}
            </h3>
            <p className={`text-xs ${getThemeClass('textSecondary')} truncate`}>
              Duration: {cycle.duration} minutes
            </p>
          </div>
          <div className={`text-xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} flex-shrink-0`}>
            {cycle.totalProductivity}
          </div>
        </div>

        {/* Timeline Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className={`text-xs ${getThemeClass('textSecondary')}`}>
              {new Date(cycle.startTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className={`text-xs ${getThemeClass('textSecondary')}`}>
              {new Date(cycle.endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex relative transform-gpu">
            {mergedSegments.map((segment, index) => {
              const segmentWithSeconds = segment as CycleSegment & { durationInSeconds: number };
              const widthPercentage = (segmentWithSeconds.durationInSeconds / (cycle.duration * 60)) * 100;
              const minWidthPercentage = Math.max(widthPercentage, 0.5); // 최소 0.5% 너비 보장
              
              return (
                <div 
                  key={index}
                  className={`h-full relative group ${getSegmentColorClass(segment)} hover:brightness-110 transition-all duration-200 cursor-pointer`}
                  style={{ 
                    width: `${minWidthPercentage}%`,
                    minWidth: '2px', // 최소 2px 너비 보장
                  }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30 shadow-lg">
                    <div className="font-medium text-white">
                      {segment.type.toUpperCase()}
                    </div>
                    <div className="text-gray-300 mt-1">
                      {segment.category && segment.category !== segment.type && (
                        <div>{segment.category}</div>
                      )}
                      <div>
                        {segmentWithSeconds.durationInSeconds >= 60 
                          ? `${Math.floor(segmentWithSeconds.durationInSeconds / 60)}m ${Math.round(segmentWithSeconds.durationInSeconds % 60)}s`
                          : segmentWithSeconds.durationInSeconds >= 1
                            ? `${Math.round(segmentWithSeconds.durationInSeconds)}s`
                            : `${(segmentWithSeconds.durationInSeconds).toFixed(1)}s`
                        }
                      </div>
                      <div className="text-gray-400 text-xs">
                        {new Date(segment.startTime).toLocaleTimeString('ko-KR', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-purple-500 flex-shrink-0"></div>
              <span className={`text-xs ${getThemeClass('textSecondary')}`}>Work ({workTime}m)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-red-500 flex-shrink-0"></div>
              <span className={`text-xs ${getThemeClass('textSecondary')}`}>Distraction ({cycle.breakTime}m)</span>
            </div>
            {cycle.afkTime > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-yellow-500 flex-shrink-0"></div>
                <span className={`text-xs ${getThemeClass('textSecondary')}`}>AFK ({cycle.afkTime}m)</span>
              </div>
            )}
          </div>
        </div>

        {/* Top Categories */}
        <div className="space-y-1">
          <p className={`text-xs font-medium ${getThemeClass('textPrimary')} mb-1`}>Top Activities</p>
          {cycle.categories && cycle.categories.length > 0 ? (
            cycle.categories.slice(0, 2).map((category, index) => (
              <div key={index} className="flex items-center gap-2 min-w-0">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <span className={`text-xs ${getThemeClass('textPrimary')} flex-1 truncate`}>
                  {category.name}
                </span>
                <span className={`text-xs ${getThemeClass('textSecondary')} flex-shrink-0`}>
                  {category.duration}m
                </span>
              </div>
            ))
          ) : (
            <span className={`text-xs ${getThemeClass('textSecondary')}`}>No activities</span>
          )}
        </div>
      </div>
    );
  }, [getThemeClass, isDarkMode]);

  if (isLoading) {
    return (
      <div className={`${getThemeClass('component')} rounded-lg p-8 h-[280px] flex items-center justify-center border ${getThemeClass('border')}`}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (!cycles || cycles.length === 0) {
    return (
      <div className={`${getThemeClass('component')} rounded-lg p-8 h-[280px] flex items-center justify-center border ${getThemeClass('border')}`}>
        <p className={getThemeClass('textPrimary')}>No session data available</p>
      </div>
    );
  }

  return (
    <div className={`${getThemeClass('component')} rounded-lg p-8 border ${getThemeClass('border')}`}>
      <div className="flex items-center justify-center mb-6">
        <h2 className={`text-xl font-semibold ${getThemeClass('textPrimary')}`}>
          Activity Timeline
        </h2>
      </div>

      <div className="relative h-[520px] w-full flex items-center justify-center overflow-hidden">
        <Swiper
          ref={swiperRef}
          modules={[EffectCoverflow, Navigation, Pagination, Mousewheel, FreeMode]}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          direction="vertical"
          effect="coverflow"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          mousewheel={{
            enabled: true,
            sensitivity: 1.0,
            releaseOnEdges: false,
            forceToAxis: true,
            thresholdDelta: 6,
            thresholdTime: 150,
          }}
          freeMode={{
            enabled: true,
            sticky: true,
            momentumRatio: 0.3,
            momentumVelocityRatio: 0.3,
            momentumBounce: false,
            minimumVelocity: 0.02,
          }}
          pagination={{
            clickable: true,
            bulletActiveClass: `${isDarkMode ? '!bg-purple-400' : '!bg-purple-600'}`,
            bulletClass: `${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} w-2 h-2 rounded-full transition-all duration-200`,
          }}
          navigation={false}
          onSlideChange={handleSlideChange}
          speed={400}
          className="h-full w-full"
          slideToClickedSlide={true}
          resistance={true}
          resistanceRatio={0.85}
          longSwipesRatio={0.15}
          longSwipesMs={200}
          shortSwipes={true}
          touchReleaseOnEdges={true}
          updateOnWindowResize={false}
          observer={false}
          observeParents={false}
        >
          {memoizedCycles.map((cycle, index) => (
            <SwiperSlide key={cycle.id} className="slide-inner" style={{ height: '240px', maxHeight: '280px' }}>
              {({ isActive, isPrev, isNext }) => (
                <div 
                  className={`will-change-transform transition-all duration-300 ease-out cursor-pointer transform-gpu mx-auto ${
                    isActive 
                      ? 'scale-100 opacity-100 z-20' 
                      : 'scale-85 opacity-90 z-10 hover:opacity-95 hover:scale-90'
                  }`}
                  style={{
                    width: '100%',
                    maxWidth: '420px',
                    height: '100%',
                    filter: isActive ? 'none' : 'brightness(0.95)',
                  }}
                  onClick={() => {
                    if (!isActive && swiperRef.current) {
                      swiperRef.current.slideTo(index);
                    }
                  }}
                >
                  {renderCycleCard(cycle, cycle.workTime, cycle.mergedSegments)}
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Score Chart */}
      <div className={`mt-6 ${getThemeClass('component')} rounded-lg p-4 border ${getThemeClass('border')}`}>
        <h3 className={`text-lg font-semibold ${getThemeClass('textPrimary')} mb-4`}>
          Session Scores
        </h3>
        <div className="h-48 w-full">
          <ChartContainer
            config={{
              score: {
                label: "Score",
                color: isDarkMode ? "#9333ea" : "#7c3aed",
              },
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cycles.map((cycle, index) => ({
                  session: `S${index + 1}`,
                  score: cycle.totalProductivity,
                  title: cycle.title || `Session ${index + 1}`
                }))}
                margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
              >
                <XAxis 
                  dataKey="session" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="score" 
                  fill={isDarkMode ? "#9333ea" : "#7c3aed"}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
});

export default SessionCarousel;