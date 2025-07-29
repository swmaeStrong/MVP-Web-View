'use client';

import { useTheme } from '@/hooks/useTheme';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { ChartConfig, ChartContainer } from '@/shadcn/ui/chart';
import { getSession, getSessionDetail } from '@/shared/api/get';
import { getKSTDateString } from '@/utils/timezone';
import { useQuery } from '@tanstack/react-query';
import { Activity, Target } from 'lucide-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import StateDisplay from '../common/StateDisplay';

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
  details: Session.SessionDetailApiResponse[];
}

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
  if (score >= 80) return isDarkMode ? '#44C743' : '#44C743'; // green
  if (score >= 60) return isDarkMode ? '#f59e0b' : '#d97706'; // yellow
  if (score >= 40) return isDarkMode ? '#f97316' : '#ea580c'; // orange
  return isDarkMode ? '#ef4444' : '#dc2626'; // red
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Improvement';
};


const getCategoryIcon = (category: string | undefined) => {
  if (!category) return '📊';
  
  switch (category.toLowerCase()) {
    case 'development':
    case 'coding':
      return '💻';
    case 'meeting':
    case 'meetings':
      return '🤝';
    case 'documentation':
    case 'docs':
      return '📝';
    case 'research':
      return '🔍';
    case 'design':
      return '🎨';
    case 'testing':
      return '🧪';
    default:
      return '📊';
  }
};

export default function SessionTimelineView({ selectedDate = getKSTDateString() }: SessionTimelineViewProps) {
  const { isDarkMode, getThemeClass, getThemeTextColor } = useTheme();
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Fetch session data
  const { data: sessionData, isLoading, isError, refetch } = useQuery({
    queryKey: ['sessions', selectedDate],
    queryFn: () => getSession(selectedDate),
    retry: 1,
  });

  // Fetch selected session detail data
  const { data: sessionDetailData, isLoading: isDetailLoading, isError: isDetailError } = useQuery({
    queryKey: ['sessionDetail', selectedSession?.id, selectedDate],
    queryFn: () => selectedSession ? getSessionDetail(selectedSession.id, selectedDate) : Promise.resolve([]),
    enabled: Boolean(selectedSession),
    retry: 1,
  });

  // Process sessions for bar chart visualization
  const { chartData, processedSessions, totalPages, currentChartData } = useMemo(() => {
    if (!sessionData || sessionData.length === 0) return { 
      chartData: [], 
      processedSessions: [], 
      totalPages: 0, 
      currentChartData: [] 
    };

    // Sort sessions by score (highest on the right)
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
        details: session.details,
      }))
      .sort((a, b) => a.timestamp - b.timestamp); // Sort by time ascending (chronological order)

    const chartData = sessions.map((session) => ({
      session: formatTimeRange(session.timestamp, session.duration), // Use start-end time range
      sessionNumber: session.sessionNumber,
      score: session.score,
      duration: session.duration,
      fill: session.scoreColor,
      sessionData: session,
      id: session.id,
    }));

    // Pagination: 10 items per page
    const itemsPerPage = 10;
    const totalPages = Math.ceil(sessions.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentChartData = chartData.slice(startIndex, endIndex).map(item => ({
      ...item,
      fill: item.fill, // Keep original fill, will be overridden in CustomizedBar
      isSelected: selectedSession?.id === item.sessionData.id,
    }));

    return { chartData, processedSessions: sessions, totalPages, currentChartData };
  }, [sessionData, isDarkMode, currentPage, selectedSession]);

  // Handle bar click
  const handleBarClick = useCallback((sessionData: SessionData) => {
    console.log('Bar clicked with session:', sessionData); // Debug log
    setSelectedSession(sessionData);
  }, []);

  // Handle chart area click (for empty spaces)
  const handleChartClick = useCallback((data: any) => {
    console.log('Chart clicked:', data); // Debug log
    if (data && data.activePayload && data.activePayload[0] && data.activePayload[0].payload) {
      const sessionData = data.activePayload[0].payload.sessionData;
      if (sessionData) {
        setSelectedSession(sessionData);
      }
    }
  }, []);

  // State to track hovered session
  const [hoveredSessionId, setHoveredSessionId] = useState<number | null>(null);

  // Custom bar component with proper click handling and score label
  const CustomizedBar = useCallback((props: any) => {
    const { x, y, width, height, payload, index } = props;
    const isSelected = selectedSession?.id === payload.sessionData.id;
    const isHovered = hoveredSessionId === payload.sessionData.id;
    const isHighlighted = isSelected || isHovered;
    
    // Calculate full chart height (264px total height - 35px top margin - 30px bottom margin = 199px)
    const chartHeight = 199;
    const chartTopY = 35; // Top margin from BarChart
    
    return (
      <g>
        {/* Background wrapper for selected/hovered session - full height */}
        {isHighlighted && (
          <rect
            x={x - 4}
            y={chartTopY - 35} // Start from very top of chart area
            width={width + 8}
            height={chartHeight + 35} // Full height including margins
            fill={isDarkMode ? 'rgba(96, 165, 250, 0.15)' : 'rgba(30, 64, 175, 0.1)'}
            stroke={isDarkMode ? 'rgba(147, 197, 253, 0.4)' : 'rgba(30, 64, 175, 0.3)'}
            strokeWidth="2"
            rx={6}
            ry={6}
            style={{ 
              filter: 'blur(0.5px)',
              transition: 'all 0.3s ease'
            }}
          />
        )}
        
        {/* Main bar */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={isHighlighted ? (isDarkMode ? '#60a5fa' : '#1e40af') : payload.fill}
          stroke={isHighlighted ? (isDarkMode ? '#93c5fd' : '#1d4ed8') : 'transparent'}
          strokeWidth={isHighlighted ? 3 : 0}
          rx={4}
          ry={4}
          style={{ 
            cursor: 'pointer',
            filter: isHighlighted ? 'brightness(1.2) drop-shadow(0 4px 12px rgba(96, 165, 250, 0.4))' : 'none',
            transition: 'all 0.3s ease'
          }}
        />
        
        {/* Score text */}
        <text
          x={x + width / 2}
          y={y - 5}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill={isHighlighted ? (isDarkMode ? '#ffffff' : '#ffffff') : (isDarkMode ? '#ffffff' : '#374151')}
          style={{ 
            cursor: 'pointer',
            textShadow: isHighlighted ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
          }}
        >
          {payload.score}
        </text>
      </g>
    );
  }, [selectedSession, isDarkMode, hoveredSessionId]);

  // Pagination handlers
  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  }, [totalPages]);

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

  // Set most recent session as default selected when data loads
  React.useEffect(() => {
    if (processedSessions.length > 0 && !selectedSession) {
      const mostRecentSession = processedSessions.reduce((latest, current) => 
        current.timestamp > latest.timestamp ? current : latest
      );
      setSelectedSession(mostRecentSession);
    }
  }, [processedSessions, selectedSession]);

  // Get the selected session data
  const selectedSessionData = selectedSession;

  // Chart configuration
  const chartConfig: ChartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--chart-1))",
    },
  };

  if (isLoading) {
    return (
      <Card className={`rounded-lg border-2 shadow-sm transition-all duration-300 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardHeader className="pb-3">
          <div className={`h-6 w-40 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart skeleton */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`h-5 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
                <div className="flex items-center gap-2">
                  <div className={`h-6 w-6 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                  <div className={`h-4 w-16 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                  <div className={`h-6 w-6 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                </div>
              </div>
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
            {/* Detail skeleton */}
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
  }

  if (isError || !sessionData) {
    return (
      <Card className={`rounded-lg border-2 shadow-sm ${getThemeClass('border')} ${getThemeClass('component')}`}>
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

  if (processedSessions.length === 0) {
    return (
      <Card className={`rounded-lg border-2 shadow-sm ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardHeader>
        </CardHeader>
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
    <Card className={`rounded-lg border-2 shadow-sm transition-all duration-300 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardHeader className="pb-3">
        
        {/* Summary Stats */}
        {summaryStats && (
          <div className={`grid grid-cols-3 gap-4 mt-4 p-4 rounded-lg ${getThemeClass('componentSecondary')}`}>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
                {summaryStats.totalSessions}
              </div>
              <div className={`text-xs ${getThemeTextColor('secondary')}`}>Sessions</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getThemeTextColor('accent')}`}>
                {summaryStats.averageScore}
              </div>
              <div className={`text-xs ${getThemeTextColor('secondary')}`}>Avg Score</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold`} style={{ color: summaryStats.bestSession.scoreColor }}>
                {summaryStats.bestSession.score}
              </div>
              <div className={`text-xs ${getThemeTextColor('secondary')}`}>Best Score</div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Bar Chart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                Session Scores {totalPages > 1 && `(Page ${currentPage + 1} of ${totalPages})`}
              </h3>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className={`px-2 py-1 rounded text-sm transition-colors ${
                      currentPage === 0
                        ? `${getThemeTextColor('secondary')} cursor-not-allowed`
                        : `${getThemeTextColor('primary')} hover:${getThemeClass('componentSecondary')}`
                    }`}
                  >
                    ←
                  </button>
                  <span className={`text-xs ${getThemeTextColor('secondary')}`}>
                    {Math.min(currentPage * 10 + 1, processedSessions.length)}-{Math.min((currentPage + 1) * 10, processedSessions.length)} of {processedSessions.length}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                    className={`px-2 py-1 rounded text-sm transition-colors ${
                      currentPage === totalPages - 1
                        ? `${getThemeTextColor('secondary')} cursor-not-allowed`
                        : `${getThemeTextColor('primary')} hover:${getThemeClass('componentSecondary')}`
                    }`}
                  >
                    →
                  </button>
                </div>
              )}
            </div>
            <div 
              className="h-64 w-full cursor-pointer relative overflow-x-auto"
              onClick={(e) => {
                // Calculate which bar area was clicked based on position
                const rect = chartContainerRef.current?.getBoundingClientRect();
                if (rect && currentChartData.length > 0) {
                  const x = e.clientX - rect.left;
                  const chartWidth = rect.width - 20; // Account for margins
                  const barWidth = chartWidth / currentChartData.length;
                  const clickedIndex = Math.floor(x / barWidth);
                  
                  if (clickedIndex >= 0 && clickedIndex < currentChartData.length) {
                    const sessionData = currentChartData[clickedIndex]?.sessionData;
                    if (sessionData) {
                      console.log('Container clicked, selecting session at index:', clickedIndex);
                      setSelectedSession(sessionData);
                    }
                  }
                }
              }}
              onMouseMove={(e) => {
                // Calculate which bar area is being hovered based on position
                const rect = chartContainerRef.current?.getBoundingClientRect();
                if (rect && currentChartData.length > 0) {
                  const x = e.clientX - rect.left;
                  const chartWidth = rect.width - 20; // Account for margins
                  const barWidth = chartWidth / currentChartData.length;
                  const hoveredIndex = Math.floor(x / barWidth);
                  
                  if (hoveredIndex >= 0 && hoveredIndex < currentChartData.length) {
                    const sessionData = currentChartData[hoveredIndex]?.sessionData;
                    if (sessionData) {
                      setHoveredSessionId(sessionData.id);
                    }
                  } else {
                    setHoveredSessionId(null);
                  }
                }
              }}
              onMouseLeave={() => setHoveredSessionId(null)}
            >
              <ChartContainer 
                config={chartConfig} 
                className="h-full" 
                style={{ width: Math.max(400, currentChartData.length * 80) }}
                ref={chartContainerRef}
              >
              <BarChart
                data={currentChartData}
                margin={{ top: 35, right: 10, left: 10, bottom: 30 }}
                onClick={handleChartClick}
                width={Math.max(400, currentChartData.length * 80)}
              >
                <XAxis
                  dataKey="session"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                  height={40}
                  interval={0}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                />
                <Bar
                  dataKey="score"
                  shape={CustomizedBar}
                  maxBarSize={60}
                />
              </BarChart>
              </ChartContainer>
            </div>
          </div>

          {/* Right: Session Details */}
          <div className="space-y-4">
            <h3 className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
              Session Details
            </h3>
            
            {selectedSessionData ? (
              <div className={`p-4 rounded-lg border ${getThemeClass('border')} ${getThemeClass('componentSecondary')}`}>
                
                {/* Session Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`font-semibold ${getThemeTextColor('primary')}`}>
                        {selectedSessionData.title}
                      </h4>
                    </div>
                    <p className={`text-sm ${getThemeTextColor('secondary')}`}>
                      {selectedSessionData.startTime} • {formatTime(selectedSessionData.duration)}
                    </p>
                  </div>
                  <div 
                    className="px-3 py-1 rounded-full text-sm font-medium text-white shadow-lg"
                    style={{ backgroundColor: selectedSessionData.scoreColor }}
                  >
                    {selectedSessionData.score}
                  </div>
                </div>

                {/* Activity Progress Bar - Timeline-based segments */}
                {(() => {
                  // Create timeline segments based on session data
                  const getTimelineBreakdown = () => {
                    // Get all sessions for the selected date to create timeline segments
                    const selectedSessionFromApi = sessionData?.find(s => s.session === selectedSessionData.id);
                    
                    if (!selectedSessionFromApi) {
                      return [];
                    }
                    
                    // Create timeline segments using session details
                    const sessionStartTime = selectedSessionFromApi.timestamp;
                    const sessionDuration = selectedSessionFromApi.duration;
                    const sessionMinutes = selectedSessionFromApi.sessionMinutes;
                    
                    // Use sessionMinutes as the total allocated time (in seconds)
                    const totalAllocatedTime = sessionMinutes * 60; // Convert minutes to seconds
                    
                    // Debug logging
                    console.log('SessionDuration:', sessionDuration, 'SessionMinutes:', sessionMinutes, 'TotalAllocatedTime:', totalAllocatedTime);
                    
                    // Ensure valid allocated time with stricter checks
                    if (!totalAllocatedTime || 
                        typeof totalAllocatedTime !== 'number' || 
                        totalAllocatedTime <= 0 || 
                        totalAllocatedTime > 86400 || // Max 24 hours
                        !Number.isFinite(totalAllocatedTime) ||
                        Number.isNaN(totalAllocatedTime)) {
                      console.warn('Invalid totalAllocatedTime:', totalAllocatedTime);
                      return [];
                    }
                    
                    // Create second-by-second timeline array based on allocated time
                    // 0 = empty/unused, 1 = work, 2 = distraction, 3 = afk
                    let timeline;
                    try {
                      timeline = new Array(Math.floor(totalAllocatedTime)).fill(0); // Initially all empty/unused time
                      
                      // Fill actual session duration with work time (up to the actual session duration)
                      const actualSessionEnd = Math.min(sessionDuration, totalAllocatedTime);
                      for (let i = 0; i < actualSessionEnd; i++) {
                        timeline[i] = 1; // Mark as work time
                      }
                    } catch (error) {
                      console.error('Failed to create timeline array:', error, 'AllocatedTime:', totalAllocatedTime);
                      return [];
                    }
                    
                    // Mark distraction periods using session details from /session API
                    if (selectedSessionFromApi.details && selectedSessionFromApi.details.length > 0) {
                      selectedSessionFromApi.details.forEach((detail, detailIndex) => {
                        // Validate detail data
                        if (!detail || typeof detail.timestamp !== 'number' || typeof detail.duration !== 'number') {
                          console.warn(`Invalid detail at index ${detailIndex}:`, detail);
                          return;
                        }
                        
                        // Calculate relative position within the session
                        const detailStartTime = Math.floor(detail.timestamp - sessionStartTime); // seconds from session start
                        const detailDuration = Math.floor(detail.duration);
                        
                        // Validate calculated values
                        if (detailDuration <= 0 || detailDuration > totalAllocatedTime) {
                          console.warn(`Invalid detail duration: ${detailDuration}`, detail);
                          return;
                        }
                        
                        // Mark distraction/AFK periods in timeline
                        for (let i = 0; i < detailDuration; i++) {
                          const timelineIndex = detailStartTime + i;
                          if (timelineIndex >= 0 && timelineIndex < timeline.length) {
                            // Categorize based on detail category
                            if (detail.category === 'afk' || detail.category === 'idle') {
                              timeline[timelineIndex] = 3; // Mark as AFK
                            } else if (detail.category !== 'work' && detail.category !== 'coding') {
                              timeline[timelineIndex] = 2; // Mark as distraction
                            }
                          }
                        }
                      });
                    }
                    
                    // Group consecutive seconds into segments for display
                    const segments = [];
                    
                    if (timeline.length === 0) {
                      console.warn('Timeline is empty');
                      return [];
                    }
                    
                    let currentSegmentStart = 0;
                    let currentSegmentType = timeline[0];
                    
                    const timelineDuration = timeline.length;
                    
                    for (let i = 1; i <= timelineDuration; i++) {
                      const isEndOfSession = i === timelineDuration;
                      const typeChanged = !isEndOfSession && timeline[i] !== currentSegmentType;
                      
                      if (typeChanged || isEndOfSession) {
                        const segmentDuration = i - currentSegmentStart;
                        const segmentStartTime = sessionStartTime + currentSegmentStart;
                        const segmentEndTime = sessionStartTime + i;
                        
                        // Validate segment data
                        if (segmentDuration > 0 && segmentStartTime >= 0 && segmentEndTime > segmentStartTime) {
                          segments.push({
                            timeRange: `${formatTimestamp(segmentStartTime)}-${formatTimestamp(segmentEndTime)}`,
                            startTime: segmentStartTime,
                            endTime: segmentEndTime,
                            workTime: currentSegmentType === 1 ? segmentDuration : 0,
                            distractionTime: currentSegmentType === 2 ? segmentDuration : 0,
                            afkTime: currentSegmentType === 3 ? segmentDuration : 0,
                            unusedTime: currentSegmentType === 0 ? segmentDuration : 0, // New: unused time
                            segmentDuration: segmentDuration
                          });
                        }
                        
                        if (!isEndOfSession) {
                          currentSegmentStart = i;
                          currentSegmentType = timeline[i];
                        }
                      }
                    }
                    
                    return segments;
                  };
                  
                  const timelineBreakdown = getTimelineBreakdown();
                  const selectedSessionFromApi = sessionData?.find(s => s.session === selectedSessionData.id);
                  const totalAllocatedTime = selectedSessionFromApi?.sessionMinutes ? selectedSessionFromApi.sessionMinutes * 60 : selectedSessionData.duration;
                  
                  if (timelineBreakdown.length === 0) {
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
                    <div className="mb-4">
                      {/* Timeline-based Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex h-3 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                          {timelineBreakdown.map((segment, index) => {
                            const segmentTotalTime = segment.segmentDuration;
                            const segmentPercent = totalAllocatedTime > 0 ? (segmentTotalTime / totalAllocatedTime) * 100 : 0;
                            const workPercent = segmentTotalTime > 0 ? (segment.workTime / segmentTotalTime) * 100 : 0;
                            const distractionPercent = segmentTotalTime > 0 ? (segment.distractionTime / segmentTotalTime) * 100 : 0;
                            const afkPercent = segmentTotalTime > 0 ? (segment.afkTime / segmentTotalTime) * 100 : 0;
                            const unusedPercent = segmentTotalTime > 0 ? (segment.unusedTime / segmentTotalTime) * 100 : 0;
                            
                            return (
                              <div 
                                key={index}
                                className="flex h-full"
                                style={{ width: `${segmentPercent}%` }}
                                title={`${segment.timeRange}: Work ${formatTime(segment.workTime)}, Distraction ${formatTime(segment.distractionTime)}, AFK ${formatTime(segment.afkTime)}, Unused ${formatTime(segment.unusedTime)}`}
                              >
                                {workPercent > 0 && (
                                  <div 
                                    className="h-full" 
                                    style={{ 
                                      width: `${workPercent}%`,
                                      backgroundColor: 'rgb(68, 199, 67)'
                                    }}
                                  />
                                )}
                                {distractionPercent > 0 && (
                                  <div 
                                    className="bg-red-500 h-full" 
                                    style={{ width: `${distractionPercent}%` }}
                                  />
                                )}
                                {afkPercent > 0 && (
                                  <div 
                                    className="bg-yellow-500 h-full" 
                                    style={{ width: `${afkPercent}%` }}
                                  />
                                )}
                                {unusedPercent > 0 && (
                                  <div 
                                    className="bg-gray-400 h-full" 
                                    style={{ width: `${unusedPercent}%` }}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Time labels */}
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 overflow-hidden">
                          {timelineBreakdown.length > 0 && (
                            <>
                              <span className="text-[9px] truncate px-1">
                                {formatTimestamp(timelineBreakdown[0].startTime)}
                              </span>
                              <span className="text-[9px] truncate px-1">
                                {formatTimestamp(timelineBreakdown[timelineBreakdown.length - 1].endTime)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Legend */}
                      <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
                        <div className="flex items-center gap-1">
                          <div 
                            className="w-2 h-2 rounded"
                            style={{ backgroundColor: 'rgb(68, 199, 67)' }}
                          ></div>
                          <span className={`text-xs ${getThemeTextColor('secondary')}`}>
                            Work
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded bg-red-500"></div>
                          <span className={`text-xs ${getThemeTextColor('secondary')}`}>
                            Distraction
                          </span>
                        </div>
                        {timelineBreakdown.some(segment => segment.afkTime > 0) && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded bg-yellow-500"></div>
                            <span className={`text-xs ${getThemeTextColor('secondary')}`}>
                              AFK
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded bg-gray-400"></div>
                          <span className={`text-xs ${getThemeTextColor('secondary')}`}>
                            Unused
                          </span>
                        </div>
                      </div>
                      
                    </div>
                  );
                })()}

                {/* Score Breakdown */}
                {sessionDetailData && sessionDetailData.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <h5 className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                      Factors Affecting Your Score
                    </h5>
                    <div className="space-y-2">
                      {sessionDetailData
                        .sort((a, b) => b.duration - a.duration) // Sort by duration (longest first)
                        .slice(0, 3) // Take only top 3
                        .map((detail, index) => (
                          <div key={index} className={`py-2 px-3 rounded-lg border ${getThemeClass('border')} ${getThemeClass('componentSecondary')}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-medium ${getThemeTextColor('primary')}`}>
                                {detail.distractedApp}
                              </span>
                            </div>
                            <div className={`flex gap-4 text-xs ${getThemeTextColor('secondary')}`}>
                              <span>Duration: {formatTime(detail.duration)}</span>
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