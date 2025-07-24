'use client';

import { useTheme } from '@/hooks/useTheme';
import { CycleData, CycleSegment } from '@/types/domains/usage/cycle';
import React, { useEffect, useState, memo } from 'react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { EffectCoverflow, FreeMode, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface SessionCarouselProps {
  cycles: CycleData[];
  isLoading?: boolean;
  currentSessionIndex?: number;
  onSessionSelect?: (sessionIndex: number) => void;
}

const SessionCarousel = memo(function SessionCarousel({ 
  cycles, 
  isLoading, 
  currentSessionIndex,
  onSessionSelect
}: SessionCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { getThemeClass, isDarkMode } = useTheme();
  const swiperRef = React.useRef<any>(null);

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


  const getSegmentColor = (segment: CycleSegment) => {
    switch (segment.type) {
      case 'work':
        return '#9333ea'; // 보라색
      case 'break':
        return '#ef4444'; // 빨간색
      case 'afk':
        return '#eab308'; // 노란색
      default:
        return '#e5e5e5';
    }
  };

  const mergeConsecutiveSegments = (segments: CycleSegment[]): CycleSegment[] => {
    const merged: CycleSegment[] = [];
    segments.forEach(segment => {
      const lastSegment = merged[merged.length - 1];
      
      if (lastSegment && 
          lastSegment.type === segment.type && 
          new Date(lastSegment.endTime).getTime() === new Date(segment.startTime).getTime()) {
        lastSegment.endTime = segment.endTime;
        lastSegment.duration += segment.duration;
      } else {
        merged.push({ ...segment });
      }
    });
    return merged;
  };

  // 성능 최적화: 세그먼트 병합을 useMemo로 캐시
  const memoizedCycles = React.useMemo(() => {
    return cycles.map(cycle => ({
      ...cycle,
      workTime: cycle.duration - cycle.breakTime - cycle.afkTime,
      mergedSegments: mergeConsecutiveSegments(cycle.segments)
    }));
  }, [cycles]);

  // 메모이제이션으로 렌더링 최적화
  const renderCycleCard = React.useCallback((cycle: CycleData, workTime: number, mergedSegments: CycleSegment[]) => {
    return (
      <div className="rounded-lg p-4 h-[240px] w-full transform-gpu">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className={`font-semibold text-lg ${getThemeClass('textPrimary')}`}>
              Session #{cycle.id}
            </h3>
            <p className={`text-sm ${getThemeClass('textSecondary')}`}>
              Duration: {cycle.duration} minutes
            </p>
          </div>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            {cycle.totalProductivity}
          </div>
        </div>

        {/* Timeline Bar */}
        <div className="mb-4">
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
              const widthPercentage = (segment.duration / cycle.duration) * 100;
              
              return (
                <div 
                  key={index}
                  className="h-full relative group"
                  style={{ 
                    width: `${widthPercentage}%`,
                    backgroundColor: getSegmentColor(segment),
                    borderRight: index < mergedSegments.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none'
                  }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                    <div className="font-medium">
                      {segment.type.toUpperCase()}
                    </div>
                    <div className="text-gray-300">
                      {segment.duration} minutes
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-purple-500"></div>
              <span className={`text-xs ${getThemeClass('textSecondary')} font-medium`}>Work ({workTime}m)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className={`text-xs ${getThemeClass('textSecondary')} font-medium`}>Break ({cycle.breakTime}m)</span>
            </div>
            {cycle.afkTime > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span className={`text-xs ${getThemeClass('textSecondary')} font-medium`}>AFK ({cycle.afkTime}m)</span>
              </div>
            )}
          </div>
        </div>

        {/* Top Categories */}
        <div className="space-y-2">
          <p className={`text-sm font-medium ${getThemeClass('textPrimary')} mb-2`}>Top Activities</p>
          {cycle.categories.slice(0, 2).map((category, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className={`text-xs ${getThemeClass('textPrimary')} flex-1`}>
                {category.name}
              </span>
              <span className={`text-xs ${getThemeClass('textSecondary')}`}>
                {category.duration}m
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }, [getThemeClass, isDarkMode]);

  if (isLoading) {
    return (
      <div className={`${getThemeClass('component')} rounded-lg p-6 h-[280px] flex items-center justify-center`}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (!cycles || cycles.length === 0) {
    return (
      <div className={`${getThemeClass('component')} rounded-lg p-6 h-[280px] flex items-center justify-center`}>
        <p className={getThemeClass('textPrimary')}>No session data available</p>
      </div>
    );
  }

  return (
    <div className={`${getThemeClass('component')} rounded-lg p-6`}>
      <div className="flex items-center justify-center mb-6">
        <h2 className={`text-xl font-semibold ${getThemeClass('textPrimary')}`}>
          Total Sessions: {cycles.length} sessions
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
                      : 'scale-85 opacity-60 z-10 hover:opacity-80 hover:scale-90'
                  }`}
                  style={{
                    width: '100%',
                    maxWidth: '420px',
                    height: '100%',
                    filter: isActive ? 'none' : 'brightness(0.8)',
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
    </div>
  );
});

export default SessionCarousel;