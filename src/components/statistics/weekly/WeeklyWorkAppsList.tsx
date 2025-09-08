'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { ScrollArea } from '@/shadcn/ui/scroll-area';
import React from 'react';

interface WeeklyWorkAppsListProps {
  selectedDate?: string;
}

// Weekly work apps 데이터
const weeklyWorkApps = [
  { name: 'Visual Studio Code', hours: 42.5, days: 7, avgPerDay: '6h 4m' },
  { name: 'IntelliJ IDEA', hours: 18.3, days: 5, avgPerDay: '3h 40m' },
  { name: 'Terminal', hours: 12.8, days: 7, avgPerDay: '1h 50m' },
  { name: 'Figma', hours: 8.2, days: 3, avgPerDay: '2h 44m' },
  { name: 'Notion', hours: 6.5, days: 6, avgPerDay: '1h 5m' },
  { name: 'Slack', hours: 5.8, days: 5, avgPerDay: '1h 10m' },
  { name: 'Postman', hours: 3.2, days: 4, avgPerDay: '48m' },
  { name: 'Docker Desktop', hours: 2.1, days: 3, avgPerDay: '42m' },
];

export default function WeeklyWorkAppsList({ selectedDate }: WeeklyWorkAppsListProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();

  const formatHours = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  return (
    <Card className={`h-auto pt-0 lg:h-[280px] rounded-lg border transition-all duration-200 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className="h-auto lg:h-full p-3">
        <div className="h-auto lg:h-full flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <p className={`text-xs font-semibold ${getThemeTextColor('secondary')} mb-2 uppercase tracking-wider`}>
              Weekly Work Apps
            </p>
            <p className={`text-xs ${getThemeTextColor('secondary')}`}>
              Active Days & Daily Average
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="space-y-1">
                {weeklyWorkApps.map((app, index) => (
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
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] ${getThemeTextColor('secondary')} flex-shrink-0`}>
                          {app.days}d
                        </span>
                        <span className={`text-[10px] font-semibold ${getThemeTextColor('primary')} flex-shrink-0 w-12 text-right`}>
                          {formatHours(app.hours)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 flex justify-between">
                      <span className={`text-[9px] ${getThemeTextColor('secondary')}`}>
                        Avg/day: {app.avgPerDay}
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