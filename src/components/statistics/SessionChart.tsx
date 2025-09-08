'use client';

import { useSessionChart } from '@/hooks/ui/useSessionChart';
import { useTheme } from '@/hooks/ui/useTheme';
import { ChartConfig, ChartContainer } from '@/shadcn/ui/chart';
import { ScrollArea, ScrollBar } from '@/shadcn/ui/scroll-area';
import type { SessionData } from '@/types/domains/usage/session';
import React from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

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
  <div className={`flex items-center justify-center gap-3 py-1 px-2 rounded-md ${getThemeClass('componentSecondary')}`}>
    <div className="flex items-center gap-1">
      <span className={`text-sm font-bold ${getThemeTextColor('primary')}`}>
        {stats.totalSessions}
      </span>
      <span className={`text-xs ${getThemeTextColor('secondary')}`}>Sessions</span>
    </div>
    <div className="flex items-center gap-1">
      <span className={`text-sm font-bold ${getThemeTextColor('primary')}`}>
        {stats.averageScore}
      </span>
      <span className={`text-xs ${getThemeTextColor('secondary')}`}>Avg</span>
    </div>
    <div className="flex items-center gap-1">
      <span className={`text-sm font-bold ${getThemeTextColor('primary')}`}>
        {stats.bestSession.score}
      </span>
      <span className={`text-xs ${getThemeTextColor('secondary')}`}>Best</span>
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
    <div className="h-full flex flex-col space-y-2">
      {/* Summary Stats */}
      {summaryStats && (
        <SummaryStats 
          stats={summaryStats} 
          getThemeClass={getThemeClass as (type: string) => string}
          getThemeTextColor={getThemeTextColor as (type: string) => string}
        />
      )}
      
      {/* Chart */}
      <div className={`relative flex-1 rounded-lg ${getThemeClass('component')} p-2`}>
        <ScrollArea className="w-full h-full">
          <div className="w-max pr-4">
            <ChartContainer 
              config={chartConfig} 
              className="h-[220px]" 
              style={{ 
                width: Math.max(320, allChartData.length * 40),
                minWidth: '100%'
              }}
              ref={chartContainerRef}
            >
              <BarChart
                data={allChartData}
                margin={{ top: 25, right: 15, left: 30, bottom: 25 }}
                width={Math.max(320, allChartData.length * 40)}
                barCategoryGap="5%"
              >
                <XAxis
                  dataKey="session"
                  axisLine={true}
                  tickLine={true}
                  tick={{ fontSize: 8, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                  height={30}
                  interval={allChartData.length > 8 ? Math.ceil(allChartData.length / 8) : 0}
                  stroke={isDarkMode ? '#4b5563' : '#d1d5db'}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={true}
                  tickLine={true}
                  tick={{ fontSize: 10, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                  stroke={isDarkMode ? '#4b5563' : '#d1d5db'}
                  width={30}
                />
                <Bar
                  dataKey="score"
                  shape={CustomizedBar}
                  maxBarSize={35}
                  fill={isDarkMode ? '#374151' : '#9ca3af'}
                />
              </BarChart>
            </ChartContainer>
          </div>
          <ScrollBar orientation="horizontal" className="h-2 [&>div]:bg-gray-300" />
        </ScrollArea>
        
        {/* Scroll indicators */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 pointer-events-none">
          <div className={`w-6 h-12 bg-gradient-to-r from-${isDarkMode ? 'gray-900' : 'white'} to-transparent opacity-50`}></div>
        </div>
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 pointer-events-none">
          <div className={`w-6 h-12 bg-gradient-to-l from-${isDarkMode ? 'gray-900' : 'white'} to-transparent opacity-50`}></div>
        </div>
      </div>
    </div>
  );
}