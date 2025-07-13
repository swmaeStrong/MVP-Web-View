'use client';

import React from 'react';
import { X, Clock, Coffee, UserX } from 'lucide-react';
import { CycleData, CycleSegment } from '@/types/domains/usage/cycle';
import { useTheme } from '@/hooks/useTheme';

interface DayTimelineProps {
  cycles: CycleData[];
  date: string;
  onClose: () => void;
}

export default function DayTimeline({ cycles, date, onClose }: DayTimelineProps) {
  const { getThemeClass, isDarkMode } = useTheme();

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
        return segment.color || '#9333ea';
      case 'break':
        return '#06b6d4';
      case 'afk':
        return '#ef4444';
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

  const timeline = generateHourlyTimeline();
  const totalWorkTime = cycles.reduce((sum, cycle) => sum + (cycle.duration - cycle.breakTime - cycle.afkTime), 0);
  const totalBreakTime = cycles.reduce((sum, cycle) => sum + cycle.breakTime, 0);
  const totalAfkTime = cycles.reduce((sum, cycle) => sum + cycle.afkTime, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${getThemeClass('component')} rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className={`text-2xl font-bold ${getThemeClass('textPrimary')}`}>
              Daily Timeline
            </h2>
            <p className={`text-sm ${getThemeClass('textSecondary')} mt-1`}>
              {new Date(date).toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Summary */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-purple-500"></div>
                <span className={getThemeClass('textSecondary')}>Work {totalWorkTime}m</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-cyan-500"></div>
                <span className={getThemeClass('textSecondary')}>Break {totalBreakTime}m</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className={getThemeClass('textSecondary')}>AFK {totalAfkTime}m</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${getThemeClass('componentSecondary')} hover:opacity-80 transition-colors`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-2">
            {timeline.map(({ hour, segments }) => {
              const hasActivity = segments.length > 0;
              const hourDisplay = hour.toString().padStart(2, '0') + ':00';
              
              return (
                <div key={hour} className="flex items-center gap-4">
                  {/* Time Label */}
                  <div className={`w-16 text-sm font-medium ${getThemeClass('textSecondary')} text-right`}>
                    {hourDisplay}
                  </div>
                  
                  {/* Hour Bar */}
                  <div className="flex-1 h-12 relative">
                    <div className={`w-full h-full ${hasActivity ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'} rounded border`}>
                      {hasActivity && (
                        <div className="flex h-full">
                          {segments.map((segment, segIndex) => {
                            const widthPercentage = (segment.duration / 60) * 100; // 60분 기준
                            
                            return (
                              <div
                                key={segIndex}
                                className="h-full relative group flex items-center justify-center"
                                style={{
                                  width: `${Math.min(widthPercentage, 100)}%`,
                                  backgroundColor: getSegmentColor(segment),
                                  borderRight: segIndex < segments.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none'
                                }}
                              >
                                {widthPercentage > 10 && (
                                  <div className="flex items-center gap-1 text-white text-xs">
                                    {getSegmentIcon(segment.type)}
                                    {segment.type === 'work' && segment.category ? (
                                      <span className="font-medium">{segment.category.substring(0, 4)}</span>
                                    ) : (
                                      <span className="font-medium">{segment.type}</span>
                                    )}
                                  </div>
                                )}
                                
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                                  <div className="font-medium">
                                    Session #{segment.sessionId} - {segment.type === 'work' ? segment.category : segment.type.toUpperCase()}
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
                    </div>
                    
                    {/* Hour markers */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                      {[15, 30, 45].map(minute => (
                        <div
                          key={minute}
                          className="absolute top-0 h-full w-px bg-gray-300 dark:bg-gray-600 opacity-30"
                          style={{ left: `${(minute / 60) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}