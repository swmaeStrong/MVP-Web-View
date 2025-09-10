'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { ScrollArea } from '@/shadcn/ui/scroll-area';
import { getWeeklyPomodoroDetails } from '@/shared/api/get';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface WeeklyDistractionAppsListProps {
  selectedDate: string;
}

export default function WeeklyDistractionAppsList({ selectedDate }: WeeklyDistractionAppsListProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();

  // API 호출 - WeeklyTimelineView와 같은 쿼리 사용
  const { data: weeklyPomodoroData, isLoading, isError } = useQuery({
    queryKey: ['weeklyPomodoroDetails', selectedDate],
    queryFn: () => getWeeklyPomodoroDetails(selectedDate),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours === 0 && minutes === 0) {
      return '0m';
    }
    if (hours === 0) {
      return `${minutes}m`;
    }
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  // API 데이터에서 distraction apps 추출
  const weeklyDistractionApps = React.useMemo(() => {
    if (!weeklyPomodoroData?.distractedAppUsage) return [];
    
    return weeklyPomodoroData.distractedAppUsage
      .map(app => ({
        name: app.app,
        duration: app.duration, // seconds
        count: app.count,
        hours: app.duration / 3600, // convert to hours
        avgPerDay: formatDuration(app.duration / 7), // average per day
      }))
      .sort((a, b) => b.duration - a.duration); // sort by duration desc
  }, [weeklyPomodoroData, formatDuration]);

  const formatHours = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (wholeHours === 0 && minutes === 0) {
      return '0m';
    }
    if (wholeHours === 0) {
      return `${minutes}m`;
    }
    if (minutes === 0) {
      return `${wholeHours}h`;
    }
    return `${wholeHours}h ${minutes}m`;
  };

  const totalHours = weeklyDistractionApps.reduce((sum, app) => sum + app.hours, 0);

  return (
    <Card className={`h-auto pt-0 lg:h-[280px] rounded-lg border transition-all duration-200 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className="h-auto lg:h-full p-3">
        <div className="h-auto lg:h-full flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <p className={`text-xs font-semibold ${getThemeTextColor('secondary')} mb-2 uppercase tracking-wider`}>
              Weekly Distraction Apps
            </p>
            <div className="flex items-center justify-between">
              <p className={`text-xs ${getThemeTextColor('secondary')}`}>
                Total: {formatHours(totalHours)}
              </p>
              <p className={`text-xs font-medium ${totalHours < 40 ? 'text-green-500' : 'text-red-500'}`}>
                {totalHours < 40 ? '✓ Under control' : '⚠ High usage'}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse space-y-2 w-full">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                  ))}
                </div>
              </div>
            ) : isError ? (
              <div className="h-full flex items-center justify-center">
                <p className={`text-sm ${getThemeTextColor('secondary')}`}>Failed to load distraction apps</p>
              </div>
            ) : weeklyDistractionApps.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className={`text-sm ${getThemeTextColor('secondary')}`}>No distraction apps data</p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="space-y-1">
                  {weeklyDistractionApps.map((app, index) => (
                    <div key={index} className={`py-1.5 px-2 rounded-md border ${getThemeClass('border')} ${getThemeClass('componentSecondary')} transition-colors`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`text-[10px] font-medium ${getThemeTextColor('secondary')} flex-shrink-0`}>
                            #{index + 1}
                          </span>
                          <span className={`text-xs font-medium truncate ${getThemeTextColor('primary')}`}>
                            {app.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] ${getThemeTextColor('secondary')} flex-shrink-0`}>
                            {app.count} times
                          </span>
                          <span className={`text-[10px] font-semibold ${getThemeTextColor('primary')} flex-shrink-0 w-12 text-right`}>
                            {formatHours(app.hours)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1">
                        <span className={`text-[9px] ${getThemeTextColor('secondary')}`}>
                          Avg/day: {app.avgPerDay}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}