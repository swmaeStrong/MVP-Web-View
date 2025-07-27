'use client';

import { useTheme } from '@/hooks/useTheme';
import { getSession } from '@/shared/api/get';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shadcn/ui/chart';
import { getKSTDateString } from '@/utils/timezone';
import { useQuery } from '@tanstack/react-query';
import { Activity, Clock, Target, TrendingUp, Award, Timer } from 'lucide-react';
import { useMemo, useState, useCallback, useRef } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
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

const getScoreColor = (score: number, isDarkMode: boolean) => {
  if (score >= 80) return isDarkMode ? '#10b981' : '#059669'; // green
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
      .sort((a, b) => b.score - a.score); // Sort by score descending (highest to lowest)

    const chartData = sessions.map((session) => ({
      session: session.sessionNumber,
      score: session.score,
      duration: session.duration,
      fill: session.scoreColor,
      sessionData: session,
    }));

    // Pagination: 10 items per page
    const itemsPerPage = 10;
    const totalPages = Math.ceil(sessions.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentChartData = chartData.slice(startIndex, endIndex);

    return { chartData, processedSessions: sessions, totalPages, currentChartData };
  }, [sessionData, isDarkMode, currentPage]);

  // Handle bar click
  const handleBarClick = useCallback((data: any) => {
    if (data && data.sessionData) {
      setSelectedSession(data.sessionData);
    }
  }, []);

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

  // Set first session as default selected
  const selectedSessionData = selectedSession || processedSessions[0];

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
          <CardTitle className={`flex items-center gap-2 text-lg font-semibold ${getThemeTextColor('primary')}`}>
            <Activity className="h-5 w-5 text-purple-600" />
            Session Analysis
          </CardTitle>
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
        <CardTitle className={`flex items-center gap-2 text-lg font-semibold ${getThemeTextColor('primary')}`}>
          <Activity className="h-5 w-5 text-purple-600" />
          Session Analysis
        </CardTitle>
        
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
            <ChartContainer config={chartConfig} className="h-64 w-full" ref={chartContainerRef}>
              <BarChart
                data={currentChartData}
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
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                  onClick={handleBarClick}
                />
              </BarChart>
            </ChartContainer>
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
                    <h4 className={`font-semibold ${getThemeTextColor('primary')}`}>
                      {selectedSessionData.title}
                    </h4>
                    <p className={`text-sm ${getThemeTextColor('secondary')}`}>
                      {selectedSessionData.startTime} • {formatTime(selectedSessionData.duration)}
                    </p>
                  </div>
                  <div 
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: selectedSessionData.scoreColor }}
                  >
                    {selectedSessionData.score}%
                  </div>
                </div>

                {/* Score Analysis */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                      Performance: {selectedSessionData.scoreLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-blue-600" />
                    <span className={`text-sm ${getThemeTextColor('secondary')}`}>
                      Duration: {formatTime(selectedSessionData.duration)}
                    </span>
                  </div>
                </div>

                {/* Activity Breakdown */}
                <div className="space-y-3">
                  <h5 className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                    Activity Breakdown
                  </h5>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedSessionData.details.map((detail, index) => (
                      <div key={index} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {getCategoryIcon(detail.categoryDetail || detail.category)}
                          </span>
                          <span className={`text-xs ${getThemeTextColor('secondary')}`}>
                            {detail.categoryDetail || detail.category}
                          </span>
                        </div>
                        <span className={`text-xs font-medium ${getThemeTextColor('primary')}`}>
                          {formatTime(detail.duration)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
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