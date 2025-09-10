'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { ScrollArea } from '@/shadcn/ui/scroll-area';
import { getPomodoroDetails } from '@/shared/api/get';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

// Types
interface DistractionApp {
  name: string;
  duration: number;
  accessCount: number;
  impact: number; // 0-100 (higher = more distracting)
  category: string;
  timeBlocks: number; // Number of separate usage sessions
}

interface DistractionAppsListProps {
  distractionApps?: DistractionApp[];
  selectedDate?: string;
}

// Mock data for development
const mockDistractionApps: DistractionApp[] = [
  { name: 'YouTube', duration: 4800, accessCount: 23, impact: 85, category: 'Entertainment', timeBlocks: 8 },
  { name: 'Twitter', duration: 3600, accessCount: 67, impact: 78, category: 'Social Media', timeBlocks: 15 },
  { name: 'Instagram', duration: 2700, accessCount: 34, impact: 72, category: 'Social Media', timeBlocks: 12 },
  { name: 'Reddit', duration: 2400, accessCount: 18, impact: 68, category: 'Social Media', timeBlocks: 6 },
  { name: 'Netflix', duration: 1800, accessCount: 5, impact: 90, category: 'Entertainment', timeBlocks: 3 },
  { name: 'TikTok', duration: 1500, accessCount: 45, impact: 88, category: 'Social Media', timeBlocks: 18 },
  { name: 'Discord', duration: 1200, accessCount: 12, impact: 65, category: 'Communication', timeBlocks: 4 },
  { name: 'Twitch', duration: 900, accessCount: 8, impact: 82, category: 'Entertainment', timeBlocks: 4 },
  { name: 'Facebook', duration: 600, accessCount: 15, impact: 70, category: 'Social Media', timeBlocks: 7 },
  { name: 'Steam', duration: 450, accessCount: 3, impact: 95, category: 'Gaming', timeBlocks: 2 }
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

// Get impact color
const getImpactColor = (impact: number): string => {
  if (impact >= 85) return 'text-red-500';
  if (impact >= 70) return 'text-orange-500';
  if (impact >= 55) return 'text-yellow-500';
  return 'text-green-500';
};

const getImpactBgColor = (impact: number): string => {
  if (impact >= 85) return 'bg-red-500';
  if (impact >= 70) return 'bg-orange-500';
  if (impact >= 55) return 'bg-yellow-500';
  return 'bg-green-500';
};

const getImpactLabel = (impact: number): string => {
  if (impact >= 85) return 'High';
  if (impact >= 70) return 'Medium';
  if (impact >= 55) return 'Low';
  return 'Minimal';
};

// Distraction app item component
const DistractionAppItem: React.FC<{
  app: DistractionApp;
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
          <div className={`h-3 w-20 rounded animate-pulse ${getThemeClass('borderLight')}`}></div>
          <div className={`h-3 w-16 rounded animate-pulse ${getThemeClass('borderLight')}`}></div>
        </div>
      </div>
    ))}
  </div>
);

export default function DistractionAppsList({ selectedDate }: DistractionAppsListProps) {
  const { isDarkMode, getThemeClass, getThemeTextColor } = useTheme();
  
  // API 데이터 가져오기
  const { data, isLoading, isError } = useQuery({
    queryKey: ['pomodoroDetails', selectedDate],
    queryFn: () => getPomodoroDetails(selectedDate),
    enabled: Boolean(selectedDate),
  });

  // API 데이터를 DistractionApp 형태로 변환
  const distractionApps: DistractionApp[] = React.useMemo(() => {
    if (!data?.distractedAppUsage) return [];
    
    return data.distractedAppUsage.map((app: Session.AppUsageDetail) => ({
      name: app.app,
      duration: app.duration,
      accessCount: app.count,
      impact: 75, // API에서 제공하지 않으므로 기본값
      category: 'Distraction', // API에서 제공하지 않으므로 기본값
      timeBlocks: Math.ceil(app.count / 3), // 대략적인 계산
    }));
  }, [data]);

  // Sort by duration (most distracting first)
  const sortedApps = [...distractionApps].sort((a, b) => b.duration - a.duration);
  
  // Calculate total distraction time
  const totalDistractionTime = sortedApps.reduce((total, app) => total + app.duration, 0);

  return (
    <Card className={`h-auto pt-0 lg:h-[280px] rounded-lg border transition-all duration-200 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className="h-auto lg:h-full p-3">
        <div className="h-auto lg:h-full flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <p className={`text-xs font-semibold ${getThemeTextColor('secondary')} mb-2 uppercase tracking-wider`}>
              Distraction Apps
            </p>
            <div className="flex items-center justify-between">
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0">
            {isLoading ? (
              <LoadingSkeleton getThemeClass={getThemeClass as (type: string) => string} />
            ) : isError ? (
              <div className={`flex items-center justify-center h-full ${getThemeTextColor('secondary')}`}>
                <p className="text-xs">Failed to load distraction apps</p>
              </div>
            ) : sortedApps.length === 0 ? (
              <div className={`flex items-center justify-center h-full ${getThemeTextColor('secondary')}`}>
                <p className="text-xs">No distraction apps data</p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="space-y-1">
                  {sortedApps.slice(0, 8).map((app, index) => (
                    <DistractionAppItem
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