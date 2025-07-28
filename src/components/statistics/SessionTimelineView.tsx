'use client';

import { useTheme } from '@/hooks/useTheme';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { ChartConfig, ChartContainer } from '@/shadcn/ui/chart';
import { getSession } from '@/shared/api/get';
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
  
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
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

// Mock data for detailed feedback
const getSessionFeedback = (score: number) => {
  if (score >= 80) {
    return "🎉 Outstanding performance! You maintained excellent focus throughout this session.";
  } else if (score >= 60) {
    return "👍 Great job! You had solid focus with minor distractions.";
  } else if (score >= 40) {
    return "⚡ Good effort, but there's room for improvement.";
  } else {
    return "💪 Don't worry - every expert was once a beginner.";
  }
};

// Mock data for score breakdown
const getScoreBreakdown = (score: number) => {
  // Simulate what caused point deductions
  const mockBreakdown = [
    { 
      factor: "Social Media", 
      deduction: 15, 
      icon: "📱", 
      timeSpent: "23분", 
      accessCount: 8 
    },
    { 
      factor: "News Websites", 
      deduction: 8, 
      icon: "📰", 
      timeSpent: "12분", 
      accessCount: 5 
    },
    { 
      factor: "YouTube", 
      deduction: 12, 
      icon: "🎥", 
      timeSpent: "18분", 
      accessCount: 3 
    },
    { 
      factor: "Idle Time", 
      deduction: 10, 
      icon: "⏱️", 
      timeSpent: "15분", 
      accessCount: 1 
    },
    { 
      factor: "Non-work Apps", 
      deduction: 5, 
      icon: "📋", 
      timeSpent: "8분", 
      accessCount: 4 
    }
  ];
  
  const totalDeduction = 100 - score;
  if (totalDeduction <= 0) return [];
  
  // Randomly select factors that sum up to the total deduction
  const factors = [];
  let remainingDeduction = totalDeduction;
  
  for (let i = 0; i < mockBreakdown.length && remainingDeduction > 0; i++) {
    if (Math.random() > 0.5 && remainingDeduction >= 3) {
      const deduction = Math.min(mockBreakdown[i].deduction, remainingDeduction);
      factors.push({
        ...mockBreakdown[i],
        deduction
      });
      remainingDeduction -= deduction;
    }
  }
  
  return factors;
};

// Mock data for most distracting service
const getMostDistractingService = (score: number) => {
  const services = [
    { name: "Instagram", time: "23 minutes", category: "Social Media", icon: "📸" },
    { name: "YouTube", time: "18 minutes", category: "Entertainment", icon: "🎥" },
    { name: "Twitter", time: "15 minutes", category: "Social Media", icon: "🐦" },
    { name: "Reddit", time: "12 minutes", category: "Forum", icon: "🔴" },
    { name: "Slack", time: "8 minutes", category: "Communication", icon: "💬" }
  ];
  
  if (score >= 80) return null; // High scores have minimal distractions
  
  return services[Math.floor(Math.random() * services.length)];
};

const getCategoryIcon = (category: string) => {
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
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 p-4 rounded-lg ${getThemeClass('componentSecondary')}`}>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
                {summaryStats.totalSessions}
              </div>
              <div className={`text-xs ${getThemeTextColor('secondary')}`}>Sessions</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
                {formatTime(summaryStats.totalDuration)}
              </div>
              <div className={`text-xs ${getThemeTextColor('secondary')}`}>Total Time</div>
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
              className="h-64 w-full cursor-pointer relative"
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
              <ChartContainer config={chartConfig} className="h-full w-full" ref={chartContainerRef}>
              <BarChart
                data={currentChartData}
                margin={{ top: 35, right: 10, left: 10, bottom: 30 }}
                onClick={handleChartClick}
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
                
                {/* Activity Progress Bar */}
                {(() => {
                  // Calculate work, distraction, afk times from session details
                  let workTime = 0, distractionTime = 0, afkTime = 0;
                  
                  selectedSessionData.details.forEach(detail => {
                    switch (detail.category) {
                      case 'work':
                        workTime += detail.duration;
                        break;
                      case 'distraction':
                      case 'break':
                        distractionTime += detail.duration;
                        break;
                      case 'afk':
                        afkTime += detail.duration;
                        break;
                      default:
                        workTime += detail.duration; // Unknown categories as work
                        break;
                    }
                  });
                  
                  // Use sessionMinutes as the total allocated time (in seconds)
                  const totalAllocatedTime = selectedSessionData.duration; // This should be sessionMinutes * 60 if available
                  const actualUsedTime = workTime + distractionTime + afkTime;
                  const unusedTime = Math.max(0, totalAllocatedTime - actualUsedTime);
                  
                  // Calculate percentages based on total allocated time
                  const workPercent = totalAllocatedTime > 0 ? (workTime / totalAllocatedTime) * 100 : 0;
                  const distractionPercent = totalAllocatedTime > 0 ? (distractionTime / totalAllocatedTime) * 100 : 0;
                  const afkPercent = totalAllocatedTime > 0 ? (afkTime / totalAllocatedTime) * 100 : 0;
                  const unusedPercent = totalAllocatedTime > 0 ? (unusedTime / totalAllocatedTime) * 100 : 0;
                  
                  return (
                    <div className="mb-4">
                      {/* Progress Bar */}
                      <div className="flex h-1 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                        {workPercent > 0 && (
                          <div 
                            className="bg-green-600 h-full" 
                            style={{ width: `${workPercent}%` }}
                            title={`Work: ${formatTime(workTime)}`}
                          />
                        )}
                        {distractionPercent > 0 && (
                          <div 
                            className="bg-red-500 h-full" 
                            style={{ width: `${distractionPercent}%` }}
                            title={`Distraction: ${formatTime(distractionTime)}`}
                          />
                        )}
                        {afkPercent > 0 && (
                          <div 
                            className="bg-yellow-500 h-full" 
                            style={{ width: `${afkPercent}%` }}
                            title={`AFK: ${formatTime(afkTime)}`}
                          />
                        )}
                        {unusedPercent > 0 && (
                          <div 
                            className="bg-gray-400 h-full" 
                            style={{ width: `${unusedPercent}%` }}
                            title={`Unused: ${formatTime(unusedTime)}`}
                          />
                        )}
                      </div>
                      
                      {/* Legend */}
                      <div className="flex items-center justify-center gap-4 mt-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded bg-green-600"></div>
                          <span className={`text-xs ${getThemeTextColor('secondary')}`}>
                            Work ({formatTime(workTime)})
                          </span>
                        </div>
                        {distractionTime > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded bg-red-500"></div>
                            <span className={`text-xs ${getThemeTextColor('secondary')}`}>
                              Distraction ({formatTime(distractionTime)})
                            </span>
                          </div>
                        )}
                        {afkTime > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded bg-yellow-500"></div>
                            <span className={`text-xs ${getThemeTextColor('secondary')}`}>
                              AFK ({formatTime(afkTime)})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

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


                {/* Performance Feedback */}
                <div className="mb-4">
                  <div className={`p-3 rounded-lg ${getThemeClass('componentSecondary')} text-center`}>
                    <p className={`text-sm ${getThemeTextColor('primary')}`}>
                      {getSessionFeedback(selectedSessionData.score)}
                    </p>
                  </div>
                </div>

                {/* Score Breakdown */}
                {(() => {
                  const breakdown = getScoreBreakdown(selectedSessionData.score);
                  return breakdown.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      <h5 className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                        What Affected Your Score
                      </h5>
                      <div className="space-y-2">
                        {breakdown.map((factor, index) => (
                          <div key={index} className="py-2 px-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{factor.icon}</span>
                                <span className={`text-xs font-medium ${getThemeTextColor('primary')}`}>
                                  {factor.factor}
                                </span>
                              </div>
                              <span className="text-xs font-medium text-red-600 dark:text-red-400">
                                -{factor.deduction} pts
                              </span>
                            </div>
                            <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                              <span>체류 시간: {factor.timeSpent}</span>
                              <span>접근 횟수: {factor.accessCount}회</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}

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