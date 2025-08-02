'use client';

import React from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer } from '@/shadcn/ui/chart';
import { ScrollArea, ScrollBar } from '@/shadcn/ui/scroll-area';
import { useTheme } from '@/hooks/ui/useTheme';
import { useSessionChart } from '@/hooks/ui/useSessionChart';
import type { SessionData } from '@/types/domains/usage/session';

interface SessionChartProps {
  sessionData: Session.SessionApiResponse[] | undefined;
  selectedSession: SessionData | null;
  onSessionSelect: (session: SessionData) => void;
  onScrollToMostRecent: () => void;
}

const SummaryStats: React.FC<{
  stats: {
    totalSessions: number;
    averageScore: number;
    bestSession: SessionData;
  };
  getThemeClass: (type: string) => string;
  getThemeTextColor: (type: string) => string;
}> = ({ stats, getThemeClass, getThemeTextColor }) => (
  <div className={`flex items-center justify-center gap-6 mb-1 py-1 px-3 rounded-md ${getThemeClass('componentSecondary')}`}>
    <div className="flex items-center gap-2">
      <span className={`text-base font-bold ${getThemeTextColor('primary')}`}>
        {stats.totalSessions}
      </span>
      <span className={`text-sm ${getThemeTextColor('secondary')}`}>Sessions</span>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-base font-bold ${getThemeTextColor('primary')}`}>
        {stats.averageScore}
      </span>
      <span className={`text-sm ${getThemeTextColor('secondary')}`}>Avg Score</span>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-base font-bold ${getThemeTextColor('primary')}`}>
        {stats.bestSession.score}
      </span>
      <span className={`text-sm ${getThemeTextColor('secondary')}`}>Best Score</span>
    </div>
  </div>
);

export default function SessionChart({ 
  sessionData, 
  selectedSession, 
  onSessionSelect,
  onScrollToMostRecent 
}: SessionChartProps) {
  const { isDarkMode, getThemeClass, getThemeTextColor } = useTheme();
  
  const {
    allChartData,
    summaryStats,
    getCustomBarProps,
    chartContainerRef,
    scrollToMostRecent,
    hoveredSessionId,
    setHoveredSessionId,
  } = useSessionChart({
    sessionData,
    selectedSession,
    onSessionSelect,
  });

  // Custom bar component
  const CustomizedBar = React.useCallback((props: any) => {
    const barProps = getCustomBarProps(props);
    return (
      <g>
        <rect {...barProps} />
        <text {...barProps.textProps} />
      </g>
    );
  }, [getCustomBarProps]);

  // Trigger scroll to most recent when data loads
  React.useEffect(() => {
    scrollToMostRecent();
    onScrollToMostRecent();
  }, [scrollToMostRecent, onScrollToMostRecent]);

  const chartConfig: ChartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="space-y-3">
      {/* Summary Stats */}
      {summaryStats && (
        <SummaryStats 
          stats={summaryStats} 
          getThemeClass={getThemeClass as (type: string) => string}
          getThemeTextColor={getThemeTextColor as (type: string) => string}
        />
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
  );
}