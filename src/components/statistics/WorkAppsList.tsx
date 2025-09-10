'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { ScrollArea } from '@/shadcn/ui/scroll-area';
import { getPomodoroDetails } from '@/shared/api/get';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

// Types
interface WorkApp {
  name: string;
  duration: number;
  accessCount: number;
  productivity: number; // 0-100
  category: string;
}

interface WorkAppsListProps {
  workApps?: WorkApp[];
  selectedDate?: string;
}

// Mock data for development
const mockWorkApps: WorkApp[] = [
  { name: 'Visual Studio Code', duration: 12600, accessCount: 45, productivity: 95, category: 'Development' },
  { name: 'IntelliJ IDEA', duration: 8400, accessCount: 32, productivity: 92, category: 'Development' },
  { name: 'Figma', duration: 5400, accessCount: 28, productivity: 88, category: 'Design' },
  { name: 'Terminal', duration: 4200, accessCount: 67, productivity: 90, category: 'Development' },
  { name: 'Notion', duration: 3600, accessCount: 24, productivity: 85, category: 'Documentation' },
  { name: 'Slack', duration: 2700, accessCount: 89, productivity: 75, category: 'Communication' },
  { name: 'Docker Desktop', duration: 2400, accessCount: 15, productivity: 87, category: 'Development' },
  { name: 'Postman', duration: 1800, accessCount: 18, productivity: 82, category: 'Development' },
  { name: 'TablePlus', duration: 1200, accessCount: 12, productivity: 89, category: 'Development' },
  { name: 'Chrome DevTools', duration: 900, accessCount: 34, productivity: 91, category: 'Development' }
];

// Format time helper
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${remainingSeconds}s`;
  }
};

// Get productivity color
const getProductivityColor = (productivity: number): string => {
  if (productivity >= 90) return 'text-green-500';
  if (productivity >= 80) return 'text-blue-500';
  if (productivity >= 70) return 'text-yellow-500';
  return 'text-red-500';
};

const getProductivityBgColor = (productivity: number): string => {
  if (productivity >= 90) return 'bg-green-500';
  if (productivity >= 80) return 'bg-blue-500';
  if (productivity >= 70) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Work app item component
const WorkAppItem: React.FC<{
  app: WorkApp;
  rank: number;
  getThemeClass: (type: string) => string;
  getThemeTextColor: (type: string) => string;
  isDarkMode: boolean;
}> = ({ app, rank, getThemeClass, getThemeTextColor, isDarkMode }) => {
  return (
    <div className={`py-1.5 px-2 rounded-md border ${getThemeClass('border')} ${getThemeClass('componentSecondary')} hover:${getThemeClass('componentHover')} transition-colors`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`text-[10px] font-medium ${getThemeTextColor('secondary')} flex-shrink-0`}>
            #{rank}
          </span>
          <span className={`text-xs font-medium truncate ${getThemeTextColor('primary')}`}>
            {app.name}
          </span>
        </div>
        <span className={`text-[10px] ${getThemeTextColor('secondary')} flex-shrink-0`}>
          {formatTime(app.duration)} / {app.accessCount} times
        </span>
      </div>
    </div>
  );
};

// Loading skeleton
const LoadingSkeleton: React.FC<{ getThemeClass: (type: string) => string }> = ({ getThemeClass }) => (
  <div className="space-y-1">
    {[...Array(8)].map((_, index) => (
      <div key={index} className={`py-1 px-2 rounded-md border ${getThemeClass('border')} ${getThemeClass('componentSecondary')}`}>
        <div className="flex items-center justify-between">
          <div className={`h-3 w-24 rounded animate-pulse ${getThemeClass('borderLight')}`}></div>
          <div className={`h-3 w-16 rounded animate-pulse ${getThemeClass('borderLight')}`}></div>
        </div>
      </div>
    ))}
  </div>
);

export default function WorkAppsList({ selectedDate }: WorkAppsListProps) {
  const { isDarkMode, getThemeClass, getThemeTextColor } = useTheme();
  
  // API 데이터 가져오기
  const { data, isLoading, isError } = useQuery({
    queryKey: ['pomodoroDetails', selectedDate],
    queryFn: () => getPomodoroDetails(selectedDate),
    enabled: Boolean(selectedDate),
  });

  // API 데이터를 WorkApp 형태로 변환
  const workApps: WorkApp[] = React.useMemo(() => {
    if (!data?.workAppUsage) return [];
    
    return data.workAppUsage.map((app: Session.AppUsageDetail) => ({
      name: app.app,
      duration: app.duration,
      accessCount: app.count,
      productivity: 90, // API에서 제공하지 않으므로 기본값
      category: 'Work', // API에서 제공하지 않으므로 기본값
    }));
  }, [data]);

  // Sort by duration (most used first)
  const sortedApps = [...workApps].sort((a, b) => b.duration - a.duration);

  return (
    <Card className={`h-auto pt-0 lg:h-[280px] rounded-lg border transition-all duration-200 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className="h-auto lg:h-full p-3">
        <div className="h-auto lg:h-full flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <p className={`text-xs font-semibold ${getThemeTextColor('secondary')} mb-2 uppercase tracking-wider`}>
              Work Apps
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0">
            {isLoading ? (
              <LoadingSkeleton getThemeClass={getThemeClass as (type: string) => string} />
            ) : isError ? (
              <div className={`flex items-center justify-center h-full ${getThemeTextColor('secondary')}`}>
                <p className="text-xs">Failed to load work apps</p>
              </div>
            ) : sortedApps.length === 0 ? (
              <div className={`flex items-center justify-center h-full ${getThemeTextColor('secondary')}`}>
                <p className="text-xs">No work apps data</p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="space-y-1">
                  {sortedApps.slice(0, 8).map((app, index) => (
                    <WorkAppItem
                      key={index}
                      app={app}
                      rank={index + 1}
                      getThemeClass={getThemeClass as (type: string) => string}
                      getThemeTextColor={getThemeTextColor as (type: string) => string}
                      isDarkMode={isDarkMode}
                    />
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