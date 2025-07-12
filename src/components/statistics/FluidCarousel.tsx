'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import { CycleData, CycleSegment } from '@/types/cycle';
import { useTheme } from '@/hooks/useTheme';
import InlineTimeline from './InlineTimeline';
import './FluidCarousel.css';

interface FluidCarouselProps {
  cycles: CycleData[];
  isLoading?: boolean;
  onViewTimeline?: () => void;
  showTimeline?: boolean;
  onBackToSessions?: () => void;
  selectedDate?: string;
  currentSessionIndex?: number;
  onSessionSelect?: (sessionIndex: number) => void;
}

export default function FluidCarousel({ 
  cycles, 
  isLoading, 
  onViewTimeline, 
  showTimeline, 
  onBackToSessions, 
  selectedDate,
  currentSessionIndex,
  onSessionSelect
}: FluidCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [colorUpdateTimer, setColorUpdateTimer] = useState(0);
  const { getThemeClass, isDarkMode } = useTheme();
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastUpdateTime = useRef(Date.now());

  // Fluid simulation config
  const config = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1440,
    CAPTURE_RESOLUTION: 512,
    DENSITY_DISSIPATION: 3.5,
    VELOCITY_DISSIPATION: 2,
    PRESSURE: 0.1,
    PRESSURE_ITERATIONS: 20,
    CURL: 10,
    SPLAT_RADIUS: 0.5,
    SPLAT_FORCE: 6900,
    SHADING: true,
    COLOR_UPDATE_SPEED: 10,
    PAUSED: false,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    TRANSPARENT: true,
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [cycles]);

  // currentSessionIndex가 변경되면 해당 인덱스로 이동
  useEffect(() => {
    if (currentSessionIndex !== undefined && currentSessionIndex !== currentIndex) {
      setCurrentIndex(currentSessionIndex);
      setRotation(-(currentSessionIndex * (360 / cycles.length)));
    }
  }, [currentSessionIndex, cycles.length]);

  // 색상 업데이트 애니메이션
  useEffect(() => {
    const updateColors = () => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateTime.current) / 1000;
      lastUpdateTime.current = now;

      setColorUpdateTimer(prev => prev + deltaTime * config.COLOR_UPDATE_SPEED);
      
      animationRef.current = requestAnimationFrame(updateColors);
    };

    if (!config.PAUSED) {
      animationRef.current = requestAnimationFrame(updateColors);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config.COLOR_UPDATE_SPEED, config.PAUSED]);

  const handleSlideChange = useCallback((newIndex: number) => {
    setCurrentIndex(newIndex);
    setRotation(-(newIndex * (360 / cycles.length)));
    if (onSessionSelect) {
      onSessionSelect(newIndex);
    }
  }, [cycles.length, onSessionSelect]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (showTimeline) return;
    
    e.preventDefault();
    const sensitivity = 0.5;
    const newRotation = rotation + (e.deltaY * sensitivity);
    const snapAngle = 360 / cycles.length;
    const newIndex = Math.round(-newRotation / snapAngle) % cycles.length;
    const normalizedIndex = newIndex < 0 ? cycles.length + newIndex : newIndex;
    
    setRotation(newRotation);
    
    // 스냅 효과
    setTimeout(() => {
      const snappedRotation = -(normalizedIndex * snapAngle);
      setRotation(snappedRotation);
      setCurrentIndex(normalizedIndex);
      if (onSessionSelect) {
        onSessionSelect(normalizedIndex);
      }
    }, 150);
  }, [rotation, cycles.length, onSessionSelect, showTimeline]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('wheel', handleWheel, { passive: false });
      return () => carousel.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

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

  const renderCycleCard = (cycle: CycleData, index: number) => {
    const workTime = cycle.duration - cycle.breakTime - cycle.afkTime;
    const mergedSegments = mergeConsecutiveSegments(cycle.segments);
    const isActive = index === currentIndex;
    
    return (
      <div 
        className={`carousel-item ${isActive ? 'active' : ''}`}
        style={{
          '--item-index': index,
          '--total-items': cycles.length,
        } as React.CSSProperties}
        onClick={() => !isActive && handleSlideChange(index)}
      >
        <div className={`fluid-card ${getThemeClass('component')}`}>
          <div className="fluid-background"></div>
          <div className="card-content">
            {/* Header with gradient title */}
            <div className="card-header">
              <div>
                <h3 className="session-title">
                  Session #{cycle.id}
                </h3>
                <p className={`duration-text ${getThemeClass('textSecondary')}`}>
                  Duration: {cycle.duration} minutes
                </p>
              </div>
              <div className={`productivity-score ${isDarkMode ? 'dark' : 'light'}`}>
                {cycle.totalProductivity}
              </div>
            </div>

            {/* Timeline Bar */}
            <div className="timeline-section">
              <div className="time-labels">
                <span className={`time-label ${getThemeClass('textSecondary')}`}>
                  {new Date(cycle.startTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className={`time-label ${getThemeClass('textSecondary')}`}>
                  {new Date(cycle.endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="timeline-bar">
                {mergedSegments.map((segment, segIndex) => {
                  const widthPercentage = (segment.duration / cycle.duration) * 100;
                  
                  return (
                    <div 
                      key={segIndex}
                      className="timeline-segment"
                      style={{ 
                        width: `${widthPercentage}%`,
                        backgroundColor: getSegmentColor(segment),
                        '--segment-color': getSegmentColor(segment),
                      } as React.CSSProperties}
                    >
                      <div className="segment-tooltip">
                        <div className="tooltip-title">{segment.type.toUpperCase()}</div>
                        <div className="tooltip-duration">{segment.duration} minutes</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="timeline-legend">
                <div className="legend-item">
                  <div className="legend-color work"></div>
                  <span className={`legend-text ${getThemeClass('textSecondary')}`}>Work ({workTime}m)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color break"></div>
                  <span className={`legend-text ${getThemeClass('textSecondary')}`}>Break ({cycle.breakTime}m)</span>
                </div>
                {cycle.afkTime > 0 && (
                  <div className="legend-item">
                    <div className="legend-color afk"></div>
                    <span className={`legend-text ${getThemeClass('textSecondary')}`}>AFK ({cycle.afkTime}m)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Top Categories */}
            <div className="categories-section">
              <p className={`categories-title ${getThemeClass('textPrimary')}`}>Top Activities</p>
              {cycle.categories.slice(0, 2).map((category, catIndex) => (
                <div key={catIndex} className="category-item">
                  <div 
                    className="category-color"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className={`category-name ${getThemeClass('textPrimary')}`}>
                    {category.name}
                  </span>
                  <span className={`category-duration ${getThemeClass('textSecondary')}`}>
                    {category.duration}m
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleSessionClickFromTimeline = (sessionIndex: number) => {
    if (onSessionSelect) {
      onSessionSelect(sessionIndex);
    }
    if (onBackToSessions) {
      onBackToSessions();
    }
  };

  if (isLoading) {
    return (
      <div className={`${getThemeClass('component')} rounded-lg p-6 h-[400px] flex items-center justify-center`}>
        <div className="loading-animation">
          <div className="loading-title">Loading Sessions...</div>
          <div className="loading-bar"></div>
        </div>
      </div>
    );
  }

  if (!cycles || cycles.length === 0) {
    return (
      <div className={`${getThemeClass('component')} rounded-lg p-6 h-[400px] flex items-center justify-center`}>
        <p className={getThemeClass('textPrimary')}>No session data available</p>
      </div>
    );
  }

  return (
    <div className={`fluid-carousel-container ${getThemeClass('component')}`}>
      <div className="carousel-header">
        <h2 className={`carousel-main-title ${getThemeClass('textPrimary')}`}>
          Total Sessions: {cycles.length} sessions
        </h2>
        <div className="carousel-controls">
          {!showTimeline && onViewTimeline && (
            <button
              onClick={onViewTimeline}
              className={`control-button ${getThemeClass('componentSecondary')}`}
            >
              <Calendar className="w-4 h-4" />
              전체보기
            </button>
          )}
          {showTimeline && onBackToSessions && (
            <button
              onClick={onBackToSessions}
              className={`control-button ${getThemeClass('componentSecondary')}`}
            >
              <ArrowLeft className="w-4 h-4" />
              세션별 보기
            </button>
          )}
        </div>
      </div>

      {!showTimeline ? (
        <div className="carousel-viewport">
          <div 
            ref={carouselRef}
            className="carousel"
            style={{
              transform: `rotateY(${rotation}deg)`,
              '--carousel-radius': '400px',
              '--total-items': cycles.length,
              '--color-timer': colorUpdateTimer,
            } as React.CSSProperties}
          >
            {cycles.map((cycle, index) => renderCycleCard(cycle, index))}
          </div>
          
          {/* 페이지네이션 */}
          <div className="carousel-pagination">
            {cycles.map((_, index) => (
              <button
                key={index}
                className={`pagination-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleSlideChange(index)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="timeline-container">
          <InlineTimeline 
            cycles={cycles}
            date={selectedDate || ''}
            onBack={() => {}}
            showHeader={false}
            onSessionClick={handleSessionClickFromTimeline}
          />
        </div>
      )}
    </div>
  );
}