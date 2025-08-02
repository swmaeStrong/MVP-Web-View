'use client';

import { useSessionDetail, useSessions } from '@/hooks/data/useSession';
import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { ChartConfig, ChartContainer } from '@/shadcn/ui/chart';
import { ScrollArea, ScrollBar } from '@/shadcn/ui/scroll-area';
import { getKSTDateString } from '@/utils/timezone';
import { Activity, Target } from 'lucide-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import StateDisplay from '../common/StateDisplay';

// Types
interface SessionTimelineViewProps {
  selectedDate?: string;
}

interface SessionData {
  id: number;
  title: string;
  startTime: string;
  duration: number;
  score: number;
  timestamp: number;
  scoreColor: string;
  scoreLabel: string;
  sessionNumber: string;
}

interface TimelineSegment {
  timeRange: string;
  startTime: number;
  endTime: number;
  workTime: number;
  distractionTime: number;
  afkTime: number;
  unusedTime: number;
  segmentDuration: number;
}

// Utility functions
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}분 ${remainingSeconds}초`;
  } else {
    return `${remainingSeconds}초`;
  }
};

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });
};

const formatTimeRange = (startTimestamp: number, duration: number): string => {
  const startTime = formatTimestamp(startTimestamp);
  const endTimestamp = startTimestamp + duration;
  const endTime = formatTimestamp(endTimestamp);
  return `${startTime}-${endTime}`;
};

const getScoreColor = (score: number, isDarkMode: boolean) => {
  if (score >= 85) return '#44C743';
  if (score >= 51) return isDarkMode ? '#f59e0b' : '#d97706';
  return isDarkMode ? '#ef4444' : '#dc2626';
};

const getScoreLabel = (score: number) => {
  if (score >= 85) return 'Excellent';
  if (score >= 51) return 'Good';
  return 'Needs Improvement';
};

// Components
const LoadingSkeleton: React.FC<{ getThemeClass: (type: string) => string }> = ({ getThemeClass }) => (
  <Card className={`rounded-lg border-2 transition-all duration-300 ${getThemeClass('border')} ${getThemeClass('component')}`}>
    <CardHeader className="pb-3">
      <div className={`h-6 w-40 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="h-64 w-full">
            <div className="h-full flex items-end gap-2 px-4">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className={`w-full animate-pulse rounded ${getThemeClass('componentSecondary')}`} 
                    style={{ height: `${Math.random() * 150 + 50}px` }}
                  ></div>
                  <div className={`h-3 w-8 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className={`h-6 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`h-4 w-4 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                <div className={`h-4 flex-1 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProgressBar: React.FC<{
  segments: TimelineSegment[];
  totalTime: number;
  isDarkMode: boolean;
  getThemeTextColor: (type: string) => string;
}> = ({ segments, totalTime, isDarkMode, getThemeTextColor }) => (
  <div className="mb-4">
    <div className="space-y-2">
      <div className="flex h-3 w-full rounded-full overflow-hidden bg-gray-200">
        {segments.map((segment, index) => {
          const segmentPercent = totalTime > 0 ? (segment.segmentDuration / totalTime) * 100 : 0;
          const workPercent = segment.segmentDuration > 0 ? (segment.workTime / segment.segmentDuration) * 100 : 0;
          const distractionPercent = segment.segmentDuration > 0 ? (segment.distractionTime / segment.segmentDuration) * 100 : 0;
          const afkPercent = segment.segmentDuration > 0 ? (segment.afkTime / segment.segmentDuration) * 100 : 0;
          
          return (
            <div 
              key={index}
              className="flex h-full"
              style={{ width: `${segmentPercent}%` }}
              title={`${segment.timeRange}: Work ${formatTime(segment.workTime)}, Distraction ${formatTime(segment.distractionTime)}, AFK ${formatTime(segment.afkTime)}`}
            >
              {workPercent > 0 && (
                <div 
                  className="h-full" 
                  style={{ 
                    width: `${workPercent}%`,
                    backgroundColor: '#5ed462'
                  }}
                />
              )}
              {distractionPercent > 0 && (
                <div 
                  className="h-full"
                  style={{ 
                    width: `${distractionPercent}%`,
                    backgroundColor: '#ff5871'
                  }}
                />
              )}
              {afkPercent > 0 && (
                <div 
                  className="bg-yellow-500 h-full" 
                  style={{ width: `${afkPercent}%` }}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Time labels */}
      <div className="flex justify-between text-xs text-gray-500 overflow-hidden">
        {segments.length > 0 && (
          <>
            <span className="text-[9px] truncate px-1">
              {formatTimestamp(segments[0].startTime)}
            </span>
            <span className="text-[9px] truncate px-1">
              {formatTimestamp(segments[segments.length - 1].endTime)}
            </span>
          </>
        )}
      </div>
    </div>
    
    {/* Legend */}
    <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded" style={{ backgroundColor: '#5ed462' }}></div>
        <span className={`text-xs ${getThemeTextColor('secondary')}`}>Work</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded" style={{ backgroundColor: '#ff5871' }}></div>
        <span className={`text-xs ${getThemeTextColor('secondary')}`}>Distraction</span>
      </div>
      {segments.some(segment => segment.afkTime > 0) && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-yellow-500"></div>
          <span className={`text-xs ${getThemeTextColor('secondary')}`}>AFK</span>
        </div>
      )}
    </div>
  </div>
);

export default function SessionTimelineView({ selectedDate = getKSTDateString() }: SessionTimelineViewProps) {
  const { isDarkMode, getThemeClass, getThemeTextColor } = useTheme();
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
  const [hoveredSessionId, setHoveredSessionId] = useState<number | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialScrolled = useRef(false);

  // Reset when date changes
  React.useEffect(() => {
    hasInitialScrolled.current = false;
    setSelectedSession(null);
  }, [selectedDate]);

  // Fetch data
  const { data: sessionData, isLoading, isError, refetch } = useSessions(selectedDate);
  const { data: sessionDetailData } = useSessionDetail(selectedSession?.id, selectedDate);

  // Process sessions for visualization
  const { processedSessions, allChartData } = useMemo(() => {
    if (!sessionData || sessionData.length === 0) return { 
      processedSessions: [], 
      allChartData: [] 
    };

    const sessions = sessionData
      .map((session): SessionData => ({
        id: session.session,
        title: session.title || `Session ${session.session}`,
        startTime: formatTimestamp(session.timestamp),
        duration: session.duration,
        score: session.score,
        timestamp: session.timestamp,
        scoreColor: getScoreColor(session.score, isDarkMode),
        scoreLabel: getScoreLabel(session.score),
        sessionNumber: `S${session.session}`,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    const chartData = sessions.map((session) => ({
      session: formatTimeRange(session.timestamp, session.duration),
      sessionNumber: session.sessionNumber,
      score: session.score,
      duration: session.duration,
      fill: isDarkMode ? '#374151' : '#9ca3af',
      sessionData: session,
      id: session.id,
    }));

    return { processedSessions: sessions, allChartData: chartData };
  }, [sessionData, isDarkMode]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (processedSessions.length === 0) return null;

    const totalDuration = processedSessions.reduce((sum, session) => sum + session.duration, 0);
    const averageScore = processedSessions.reduce((sum, session) => sum + session.score, 0) / processedSessions.length;
    const bestSession = processedSessions.reduce((best, session) => 
      session.score > best.score ? session : best
    );

    return {
      totalSessions: processedSessions.length,
      totalDuration,
      averageScore: Math.round(averageScore),
      bestSession,
    };
  }, [processedSessions]);

  // Custom bar component
  const CustomizedBar = useCallback((props: any) => {
    const { x, y, width, height, payload } = props;
    const isSelected = selectedSession?.id === payload.sessionData.id;
    const isHovered = hoveredSessionId === payload.sessionData.id;
    const isHighlighted = isSelected || isHovered;
    
    const minBarHeight = 8;
    const adjustedHeight = Math.max(height, minBarHeight);
    const adjustedY = height < minBarHeight ? y + height - minBarHeight : y;
    
    return (
      <g>
        <rect
          x={x}
          y={adjustedY}
          width={width}
          height={adjustedHeight}
          fill={isSelected ? (isDarkMode ? '#1e3a8a' : '#1e40af') : payload.fill}
          stroke={isSelected ? (isDarkMode ? '#60a5fa' : '#3b82f6') : 'transparent'}
          strokeWidth={isSelected ? 2 : 0}
          rx={4}
          ry={4}
          style={{ 
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setSelectedSession(payload.sessionData)}
          onMouseEnter={() => setHoveredSessionId(payload.sessionData.id)}
          onMouseLeave={() => setHoveredSessionId(null)}
        />
        <text
          x={x + width / 2}
          y={y - 15}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill={isHighlighted ? (isDarkMode ? '#ffffff' : '#374151') : (isDarkMode ? '#ffffff' : '#374151')}
          style={{ cursor: 'pointer' }}
        >
          {payload.score}
        </text>
      </g>
    );
  }, [selectedSession, isDarkMode, hoveredSessionId]);

  // Get timeline breakdown
  const getTimelineBreakdown = useCallback((sessionId: number): TimelineSegment[] => {
    const session = sessionData?.find(s => s.session === sessionId);
    if (!session) return [];

    const sessionStartTime = session.timestamp;
    const sessionDuration = session.duration;

    if (!sessionDuration || sessionDuration <= 0) return [];

    // Create timeline array
    const timeline = new Array(Math.floor(sessionDuration)).fill(1);

    // Mark distraction/AFK periods from session details
    if (session.details && session.details.length > 0) {
      session.details.forEach((detail) => {
        if (!detail || typeof detail.timestamp !== 'number' || typeof detail.duration !== 'number') return;
        
        const detailStartTime = Math.floor(detail.timestamp - sessionStartTime);
        const detailDuration = Math.floor(detail.duration);
        
        if (detailDuration <= 0 || detailDuration > sessionDuration) return;
        
        for (let i = 0; i < detailDuration; i++) {
          const timelineIndex = detailStartTime + i;
          if (timelineIndex >= 0 && timelineIndex < timeline.length) {
            if (detail.category === 'afk' || detail.category === 'idle') {
              timeline[timelineIndex] = 3; // AFK
            } else if (detail.category !== 'work' && detail.category !== 'coding') {
              timeline[timelineIndex] = 2; // Distraction
            }
          }
        }
      });
    }

    // Group into segments
    const segments: TimelineSegment[] = [];
    let currentSegmentStart = 0;
    let currentSegmentType = timeline[0];
    
    for (let i = 1; i <= timeline.length; i++) {
      const isEndOfSession = i === timeline.length;
      const typeChanged = !isEndOfSession && timeline[i] !== currentSegmentType;
      
      if (typeChanged || isEndOfSession) {
        const segmentDuration = i - currentSegmentStart;
        segments.push({
          timeRange: `${formatTimestamp(sessionStartTime + currentSegmentStart)}-${formatTimestamp(sessionStartTime + i)}`,
          startTime: sessionStartTime + currentSegmentStart,
          endTime: sessionStartTime + i,
          workTime: currentSegmentType === 1 ? segmentDuration : 0,
          distractionTime: currentSegmentType === 2 ? segmentDuration : 0,
          afkTime: currentSegmentType === 3 ? segmentDuration : 0,
          unusedTime: 0,
          segmentDuration: segmentDuration
        });
        
        if (!isEndOfSession) {
          currentSegmentStart = i;
          currentSegmentType = timeline[i];
        }
      }
    }
    
    return segments;
  }, [sessionData]);

  // Set default selected session
  React.useEffect(() => {
    if (processedSessions.length > 0 && !selectedSession) {
      const mostRecentSession = processedSessions.reduce((latest, current) => 
        current.timestamp > latest.timestamp ? current : latest
      );
      setSelectedSession(mostRecentSession);
    }
  }, [processedSessions, selectedSession]);

  // Auto-scroll to most recent session
  React.useEffect(() => {
    if (processedSessions.length > 0 && chartContainerRef.current && allChartData.length > 0 && !hasInitialScrolled.current) {
      const mostRecentIndex = allChartData.findIndex(item => 
        item.sessionData.timestamp === Math.max(...allChartData.map(data => data.sessionData.timestamp))
      );
      
      if (mostRecentIndex !== -1) {
        const scrollContainer = chartContainerRef.current.closest('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          const barWidth = 110;
          const scrollPosition = mostRecentIndex * barWidth - (scrollContainer.clientWidth / 2) + (barWidth / 2);
          
          setTimeout(() => {
            scrollContainer.scrollTo({
              left: Math.max(0, scrollPosition),
              behavior: 'smooth'
            });
            hasInitialScrolled.current = true;
          }, 100);
        }
      }
    }
  }, [processedSessions, allChartData]);

  const chartConfig: ChartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--chart-1))",
    },
  };

  // Loading state
  if (isLoading) return <LoadingSkeleton getThemeClass={getThemeClass as (type: string) => string} />;

  // Error state
  if (isError || !sessionData) {
    return (
      <Card className={`rounded-lg border-2 ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardContent className="p-6">
          <StateDisplay
            type="error"
            title="Unable to load session data"
            message="A network error occurred. Please try again."
            onRetry={refetch}
            retryText="Refresh"
            showBorder={false}
            size="medium"
          />
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (processedSessions.length === 0) {
    return (
      <Card className={`rounded-lg border-2 ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardContent className="p-6">
          <StateDisplay
            type="empty"
            title="No sessions recorded"
            message="No work sessions were recorded for this date."
            icon={Activity}
            showBorder={false}
            size="medium"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`rounded-lg border-2 transition-all duration-300 py-2 pb-0 ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Bar Chart */}
          <div className="space-y-3">
            {/* Summary Stats */}
            {summaryStats && (
              <div className={`flex items-center justify-center gap-6 mb-1 py-1 px-3 rounded-md ${getThemeClass('componentSecondary')}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-base font-bold ${getThemeTextColor('primary')}`}>
                    {summaryStats.totalSessions}
                  </span>
                  <span className={`text-sm ${getThemeTextColor('secondary')}`}>Sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-base font-bold ${getThemeTextColor('primary')}`}>
                    {summaryStats.averageScore}
                  </span>
                  <span className={`text-sm ${getThemeTextColor('secondary')}`}>Avg Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-base font-bold ${getThemeTextColor('primary')}`}>
                    {summaryStats.bestSession.score}
                  </span>
                  <span className={`text-sm ${getThemeTextColor('secondary')}`}>Best Score</span>
                </div>
              </div>
            )}
            
            {/* Chart */}
            <div className={`relative rounded-lg ${getThemeClass('component')} p-2`}>
              <ScrollArea className="w-full h-96">
                <div className="w-max pr-4">
                  <ChartContainer 
                    config={chartConfig} 
                    className="h-96" 
                    style={{ 
                      width: Math.max(600, allChartData.length * 110),
                      minWidth: '600px'
                    }}
                    ref={chartContainerRef}
                  >
                    <BarChart
                      data={allChartData}
                      margin={{ top: 35, right: 30, left: 50, bottom: 30 }}
                      width={Math.max(600, allChartData.length * 110)}
                      barCategoryGap="10%"
                    >
                      <XAxis
                        dataKey="session"
                        axisLine={true}
                        tickLine={true}
                        tick={{ fontSize: 9, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                        height={40}
                        interval={0}
                        stroke={isDarkMode ? '#4b5563' : '#d1d5db'}
                      />
                      <YAxis
                        domain={[0, 100]}
                        axisLine={true}
                        tickLine={true}
                        tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                        stroke={isDarkMode ? '#4b5563' : '#d1d5db'}
                        width={45}
                      />
                      <Bar
                        dataKey="score"
                        shape={CustomizedBar}
                        maxBarSize={50}
                        fill={isDarkMode ? '#374151' : '#9ca3af'}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
                <ScrollBar orientation="horizontal" className="h-3 [&>div]:bg-gray-300" />
              </ScrollArea>
              
              {/* Scroll indicators */}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 pointer-events-none">
                <div className={`w-8 h-16 bg-gradient-to-r from-${isDarkMode ? 'gray-900' : 'white'} to-transparent opacity-50`}></div>
              </div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 pointer-events-none">
                <div className={`w-8 h-16 bg-gradient-to-l from-${isDarkMode ? 'gray-900' : 'white'} to-transparent opacity-50`}></div>
              </div>
            </div>
          </div>

          {/* Right: Session Details */}
          <div className={`space-y-4 ${selectedSession ? 'min-h-96' : ''}`}>
            {selectedSession ? (
              <div className={`p-4 rounded-lg ${getThemeClass('componentSecondary')}`}>
                {/* Session Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className={`font-semibold ${getThemeTextColor('primary')}`}>
                      {selectedSession.title}
                    </div>
                    <p className={`text-sm ${getThemeTextColor('secondary')}`}>
                      {formatTimeRange(selectedSession.timestamp, selectedSession.duration)}
                    </p>
                  </div>
                  <div className={`text-sm ${getThemeTextColor('secondary')}`}>
                    <span>Score: </span>
                    <span className={`font-bold ${getThemeTextColor('primary')}`}>
                      {selectedSession.score}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                {(() => {
                  const segments = getTimelineBreakdown(selectedSession.id);
                  if (segments.length === 0) {
                    return (
                      <div className="mb-4">
                        <div className={`p-3 rounded-lg ${getThemeClass('componentSecondary')} text-center`}>
                          <p className={`text-sm ${getThemeTextColor('secondary')}`}>
                            Unable to load session data.
                          </p>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <ProgressBar 
                      segments={segments} 
                      totalTime={selectedSession.duration} 
                      isDarkMode={isDarkMode}
                      getThemeTextColor={getThemeTextColor as (type: string) => string}
                    />
                  );
                })()}

                {/* Distractions */}
                {sessionDetailData && sessionDetailData.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <div className={`text-sm font-medium ${getThemeTextColor('primary')} flex items-center gap-2`}>
                      <span>🚫</span>
                      Distractions
                    </div>
                    <div className="space-y-2">
                      {sessionDetailData
                        .sort((a, b) => b.duration - a.duration)
                        .slice(0, 3)
                        .map((detail, index) => (
                          <div key={index} className={`py-2 px-3 rounded-lg border ${isDarkMode ? 'border-red-400 bg-red-900/20' : 'border-red-300 bg-red-50'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-medium ${getThemeTextColor('primary')}`}>
                                {detail.distractedApp}
                              </span>
                            </div>
                            <div className={`flex gap-4 text-xs ${getThemeTextColor('secondary')}`}>
                              <span>Duration: {formatTime(Math.round(detail.duration))}</span>
                              <span>Access Count: {detail.count} times</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`p-4 rounded-lg border ${getThemeClass('border')} ${getThemeClass('componentSecondary')} text-center`}>
                <Target className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className={`text-sm ${getThemeTextColor('secondary')}`}>
                  Click on a bar to view session details
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}