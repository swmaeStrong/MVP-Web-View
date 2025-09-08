'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { ScrollArea } from '@/shadcn/ui/scroll-area';
import React from 'react';

interface WeeklyDistractionAppsListProps {
  selectedDate?: string;
}

// Weekly distraction apps 데이터
const weeklyDistractionApps = [
  { name: 'YouTube', hours: 12.5, days: 7, reduction: '-15%' },
  { name: 'Twitter', hours: 8.3, days: 6, reduction: '-8%' },
  { name: 'Reddit', hours: 5.2, days: 5, reduction: '+3%' },
  { name: 'Instagram', hours: 4.8, days: 4, reduction: '-12%' },
  { name: 'Netflix', hours: 3.5, days: 3, reduction: '-20%' },
  { name: 'Discord', hours: 2.8, days: 5, reduction: '+5%' },
  { name: 'TikTok', hours: 1.5, days: 2, reduction: '-25%' },
  { name: 'Facebook', hours: 0.8, days: 2, reduction: '-30%' },
];

export default function WeeklyDistractionAppsList({ selectedDate }: WeeklyDistractionAppsListProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();

  const formatHours = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  const getReductionColor = (reduction: string): string => {
    if (reduction.startsWith('-')) return 'text-green-500';
    if (reduction.startsWith('+')) return 'text-red-500';
    return getThemeTextColor('secondary');
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
            <ScrollArea className="h-full">
              <div className="space-y-1">
                {weeklyDistractionApps.map((app, index) => (
                  <div key={index} className={`py-1.5 px-2 rounded-md border ${getThemeClass('border')} ${getThemeClass('componentSecondary')} hover:${getThemeClass('componentHover')} transition-colors`}>
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
                        <span className={`text-[10px] font-medium ${getReductionColor(app.reduction)}`}>
                          {app.reduction}
                        </span>
                        <span className={`text-[10px] font-semibold ${getThemeTextColor('primary')} flex-shrink-0 w-12 text-right`}>
                          {formatHours(app.hours)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1">
                      <span className={`text-[9px] ${getThemeTextColor('secondary')}`}>
                        Active {app.days} days
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}