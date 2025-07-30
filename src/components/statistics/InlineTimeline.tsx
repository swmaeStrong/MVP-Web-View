'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { CycleData, CycleSegment } from '@/types/domains/usage/cycle';
import { ArrowLeft, Clock, Coffee, UserX } from 'lucide-react';
import React from 'react';

interface InlineTimelineProps {
  cycles: CycleData[];
  date: string;
  onBack: () => void;
  showHeader?: boolean;
  onSessionClick?: (sessionIndex: number) => void;
}

export default function InlineTimeline({ cycles, date, onBack, showHeader = true, onSessionClick }: InlineTimelineProps) {
  const { getThemeClass, isDarkMode } = useTheme();
  const [hoveredSessionId, setHoveredSessionId] = React.useState<string | null>(null);

  // 24시간 타임라인 생성 (0시부터 24시까지)
  const generateHourlyTimeline = () => {
    const timeline: Array<{ hour: number; segments: (CycleSegment & { sessionId: string })[] }> = [];
    
    for (let hour = 0; hour < 24; hour++) {
      const hourStart = new Date(date);
      hourStart.setHours(hour, 0, 0, 0);
      const hourEnd = new Date(date);
      hourEnd.setHours(hour + 1, 0, 0, 0);
      
      const hourSegments: (CycleSegment & { sessionId: string })[] = [];
      
      cycles.forEach(cycle => {
        cycle.segments.forEach(segment => {
          const segmentStart = new Date(segment.startTime);
          const segmentEnd = new Date(segment.endTime);
          
          // 이 세그먼트가 현재 시간대와 겹치는지 확인
          if (segmentStart < hourEnd && segmentEnd > hourStart) {
            // 겹치는 부분만 계산
            const overlapStart = new Date(Math.max(segmentStart.getTime(), hourStart.getTime()));
            const overlapEnd = new Date(Math.min(segmentEnd.getTime(), hourEnd.getTime()));
            const overlapDuration = (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60); // minutes
            
            if (overlapDuration > 0) {
              hourSegments.push({
                ...segment,
                sessionId: cycle.id,
                startTime: overlapStart.toISOString(),
                endTime: overlapEnd.toISOString(),
                duration: overlapDuration
              });
            }
          }
        });
      });
      
      timeline.push({ hour, segments: hourSegments });
    }
    
    return timeline;
  };

  const getSegmentColor = (segment: CycleSegment) => {
    switch (segment.type) {
      case 'work':
        return '#9333ea'; // 보라색
      case 'distraction':
        return '#ef4444'; // 빨간색
      case 'afk':
        return '#eab308'; // 노란색
      default:
        return '#e5e5e5';
    }
  };

  const getSegmentIcon = (type: string) => {
    switch (type) {
      case 'work':
        return <Clock className="w-3 h-3" />;
      case 'break':
        return <Coffee className="w-3 h-3" />;
      case 'afk':
        return <UserX className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const mergeConsecutiveSegments = (segments: (CycleSegment & { sessionId: string })[]): (CycleSegment & { sessionId: string })[] => {
    const merged: (CycleSegment & { sessionId: string })[] = [];
    segments.forEach(segment => {
      const lastSegment = merged[merged.length - 1];
      
      if (lastSegment && 
          lastSegment.type === segment.type && 
          lastSegment.sessionId === segment.sessionId &&
          new Date(lastSegment.endTime).getTime() === new Date(segment.startTime).getTime()) {
        lastSegment.endTime = segment.endTime;
        lastSegment.duration += segment.duration;
      } else {
        merged.push({ ...segment });
      }
    });
    return merged;
  };

  const timeline = generateHourlyTimeline();
  const totalWorkTime = cycles.reduce((sum, cycle) => sum + (cycle.duration - cycle.breakTime - cycle.afkTime), 0);
  const totalBreakTime = cycles.reduce((sum, cycle) => sum + cycle.breakTime, 0);
  const totalAfkTime = cycles.reduce((sum, cycle) => sum + cycle.afkTime, 0);

  return (
    <div className={showHeader ? `${getThemeClass('component')} rounded-lg p-6` : ''}>
      {showHeader && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getThemeClass('componentSecondary')} hover:opacity-80 transition-colors text-sm font-medium`}
              >
                <ArrowLeft className="w-4 h-4" />
                세션보기
              </button>
              <div>
                <h2 className={`text-xl font-semibold ${getThemeClass('textPrimary')}`}>
                  Daily Timeline
                </h2>
                <p className={`text-sm ${getThemeClass('textSecondary')}`}>
                  {new Date(date).toLocaleDateString('ko-KR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </p>
              </div>
            </div>
            
            {/* Summary */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-purple-500"></div>
                <span className={getThemeClass('textSecondary')}>Work {totalWorkTime}m</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className={getThemeClass('textSecondary')}>Break {totalBreakTime}m</span>
              </div>
              {totalAfkTime > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-yellow-500"></div>
                  <span className={getThemeClass('textSecondary')}>AFK {totalAfkTime}m</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Timeline Content */}
      <div className="w-full">
        <div className="w-full">
          {/* Hour labels */}
          <div className="flex mb-2">
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={hour} className="flex-1 text-center">
                <span className={`text-xs font-medium ${getThemeClass('textSecondary')}`}>
                  {hour.toString().padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>
          
          {/* Timeline bar */}
          <div className="relative h-16 bg-gray-100 dark:bg-gray-800 rounded-lg border overflow-hidden">
            <div className="flex h-full">
              {timeline.map(({ hour, segments }) => {
                const hasActivity = segments.length > 0;
                
                return (
                  <div key={hour} className="flex-1 relative border-r border-gray-300 dark:border-gray-600 last:border-r-0">
                    {hasActivity && (
                      <div className="flex h-full">
                        {mergeConsecutiveSegments(segments).map((segment, segIndex) => {
                          const widthPercentage = (segment.duration / 60) * 100; // 60분 기준
                          
                          return (
                            <div
                              key={segIndex}
                              className="h-full relative group cursor-pointer transition-all hover:brightness-110"
                              style={{
                                width: `${Math.min(widthPercentage, 100)}%`,
                                backgroundColor: getSegmentColor(segment),
                                borderRight: segIndex < mergeConsecutiveSegments(segments).length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none'
                              }}
                              onMouseEnter={() => setHoveredSessionId(segment.sessionId)}
                              onMouseLeave={() => setHoveredSessionId(null)}
                              onClick={() => {
                                const sessionIndex = cycles.findIndex(cycle => cycle.id === segment.sessionId);
                                if (sessionIndex !== -1 && onSessionClick) {
                                  onSessionClick(sessionIndex);
                                }
                              }}
                            >
                              {/* Session start/end markers for timeline blocks */}
                              {hoveredSessionId === segment.sessionId && (
                                <>
                                  {/* Check if this is the first segment of the session */}
                                  {(() => {
                                    const sessionSegments = cycles.find(c => c.id === segment.sessionId)?.segments || [];
                                    const isFirstSegment = sessionSegments[0]?.startTime === segment.startTime;
                                    const isLastSegment = sessionSegments[sessionSegments.length - 1]?.endTime === segment.endTime;
                                    
                                    return (
                                      <>
                                        {isFirstSegment && (
                                          <div className="absolute left-0 top-0 w-0.5 h-full bg-white opacity-80 z-20" />
                                        )}
                                        {isLastSegment && (
                                          <div className="absolute right-0 top-0 w-0.5 h-full bg-white opacity-80 z-20" />
                                        )}
                                      </>
                                    );
                                  })()}
                                </>
                              )}
                              
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                                <div className="font-medium">
                                  Session #{segment.sessionId} - {segment.type.toUpperCase()}
                                </div>
                                <div className="text-gray-300">
                                  {new Date(segment.startTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} - {new Date(segment.endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} ({Math.round(segment.duration)}분)
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* Quarter hour markers */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                      {[25, 50, 75].map(percentage => (
                        <div
                          key={percentage}
                          className="absolute top-0 h-full w-px bg-gray-400 dark:bg-gray-500 opacity-40"
                          style={{ left: `${percentage}%` }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Session info below timeline */}
          <div className="mt-3 relative" style={{ height: '40px' }}>
            {/* Horizontal lines for each session */}
            {cycles.map((cycle, cycleIndex) => {
              // Calculate session's time span positions
              const sessionStart = new Date(cycle.startTime);
              const sessionEnd = new Date(cycle.endTime);
              const dayStart = new Date(date);
              dayStart.setHours(0, 0, 0, 0);
              const dayEnd = new Date(date);
              dayEnd.setHours(24, 0, 0, 0);
              
              const startPercentage = Math.max(0, (sessionStart.getTime() - dayStart.getTime()) / (dayEnd.getTime() - dayStart.getTime()) * 100);
              const endPercentage = Math.min(100, (sessionEnd.getTime() - dayStart.getTime()) / (dayEnd.getTime() - dayStart.getTime()) * 100);
              const widthPercentage = endPercentage - startPercentage;
              
              if (widthPercentage <= 0) return null;
              
              return (
                <div 
                  key={cycle.id} 
                  className="absolute"
                  style={{ 
                    top: `2px`,
                    width: '100%'
                  }}
                >
                  {/* Session line */}
                  <div
                    className="h-1 rounded-full relative transition-all cursor-pointer hover:brightness-110"
                    style={{
                      width: `${widthPercentage}%`,
                      left: `${startPercentage}%`,
                      backgroundColor: '#9333ea' // Purple for session
                    }}
                    onMouseEnter={() => setHoveredSessionId(cycle.id)}
                    onMouseLeave={() => setHoveredSessionId(null)}
                    onClick={() => {
                      const sessionIndex = cycles.findIndex(c => c.id === cycle.id);
                      if (sessionIndex !== -1 && onSessionClick) {
                        onSessionClick(sessionIndex);
                      }
                    }}
                  >
                    {/* Session start marker */}
                    <div
                      className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all ${
                        hoveredSessionId === cycle.id 
                          ? 'bg-green-400 ring-2 ring-green-300 scale-125' 
                          : 'bg-green-500'
                      }`}
                    />
                    
                    {/* Session end marker */}
                    <div
                      className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all ${
                        hoveredSessionId === cycle.id 
                          ? 'bg-red-400 ring-2 ring-red-300 scale-125' 
                          : 'bg-red-500'
                      }`}
                    />
                  </div>
                  
                  {/* Session info - only visible on hover */}
                  {hoveredSessionId === cycle.id && (
                    <div
                      className="absolute text-center transition-all opacity-100 animate-in fade-in duration-200"
                      style={{
                        left: `${startPercentage + widthPercentage / 2}%`,
                        transform: 'translateX(-50%)',
                        top: '6px'
                      }}
                    >
                      <div className={`text-xs font-medium ${getThemeClass('textPrimary')}`}>
                        Session #{cycle.id}
                      </div>
                      <div className={`text-xs ${getThemeClass('textSecondary')}`}>
                        {new Date(cycle.startTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} - {new Date(cycle.endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Current time indicator (if today) */}
          {new Date(date).toDateString() === new Date().toDateString() && (
            <div className="relative mt-2">
              <div 
                className="absolute w-0.5 h-4 bg-yellow-500 rounded-full"
                style={{ 
                  left: `${((new Date().getHours() + new Date().getMinutes() / 60) / 24) * 100}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}