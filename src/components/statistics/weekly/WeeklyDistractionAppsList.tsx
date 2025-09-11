'use client';

import { useWeeklyPomodoroDetails } from '@/hooks/data/useWeeklyPomodoroDetails';
import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { ScrollArea } from '@/shadcn/ui/scroll-area';
import React from 'react';

interface WeeklyDistractionAppsListProps {
  selectedDate: string;
}

export default function WeeklyDistractionAppsList({ selectedDate }: WeeklyDistractionAppsListProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();

  // API 호출 - WeeklyTimelineView와 같은 쿼리 사용
  const { data: weeklyPomodoroData, isLoading, isError } = useWeeklyPomodoroDetails(selectedDate);

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
              Distraction Apps
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0">
            {isLoading ? (
              <div className="space-y-1">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className={`py-1 px-2 rounded-md border ${getThemeClass('border')} ${getThemeClass('componentSecondary')}`}>
                    <div className="flex items-center justify-between">
                      <div className={`h-3 w-20 rounded animate-pulse ${getThemeClass('borderLight')}`}></div>
                      <div className={`h-3 w-16 rounded animate-pulse ${getThemeClass('borderLight')}`}></div>
                    </div>
                  </div>
                ))}
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
                  {weeklyDistractionApps.slice(0, 8).map((app, index) => (
                    <div key={index} className={`py-1.5 px-2 rounded-md border ${getThemeClass('border')} ${getThemeClass('componentSecondary')} hover:${getThemeClass('component')} transition-colors`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`text-[10px] font-medium ${getThemeTextColor('secondary')} flex-shrink-0`}>
                            #{index + 1}
                          </span>
                          <span className={`text-xs font-medium truncate ${getThemeTextColor('primary')}`}>
                            {app.name}
                          </span>
                        </div>
                        <span className={`text-[10px] ${getThemeTextColor('secondary')} flex-shrink-0`}>
                          {formatHours(app.hours)} / {app.count} times
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