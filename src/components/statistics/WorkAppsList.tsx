'use client';

import React from 'react';
import { Card, CardContent } from '@/shadcn/ui/card';
import { useTheme } from '@/hooks/ui/useTheme';
import { ScrollArea } from '@/shadcn/ui/scroll-area';
import { Code2, Trophy, Clock } from 'lucide-react';

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
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
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
  getThemeClass: (type: string) => string;
  getThemeTextColor: (type: string) => string;
  isDarkMode: boolean;
}> = ({ app, getThemeClass, getThemeTextColor, isDarkMode }) => {
  const borderColor = isDarkMode 
    ? 'border-green-400/50 bg-green-900/10' 
    : 'border-green-200 bg-green-50/50';

  return (
    <div className={`py-1 px-2 rounded-md border ${borderColor}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium truncate ${getThemeTextColor('primary')}`}>
          {app.name}
        </span>
        <span className={`text-[10px] ${getThemeTextColor('secondary')}`}>
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

export default function WorkAppsList({ workApps = mockWorkApps, selectedDate }: WorkAppsListProps) {
  const { isDarkMode, getThemeClass, getThemeTextColor } = useTheme();
  const isLoading = false; // Replace with actual loading state

  // Sort by duration (most used first)
  const sortedApps = [...workApps].sort((a, b) => b.duration - a.duration);

  return (
    <Card className={`h-auto lg:h-[280px] rounded-lg border-2 transition-all duration-300 ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className="h-auto lg:h-full p-4">
        <div className="h-auto lg:h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Code2 className={`w-5 h-5 text-green-500`} />
              <h3 className={`font-semibold text-lg ${getThemeTextColor('primary')}`}>
                Work Apps
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${getThemeTextColor('secondary')}`}>
                {sortedApps.length} apps
              </span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className={`text-xs ${getThemeTextColor('secondary')}`}>Productive</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0">
            {isLoading ? (
              <LoadingSkeleton getThemeClass={getThemeClass as (type: string) => string} />
            ) : (
              <ScrollArea className="h-full">
                <div className="space-y-1">
                  {sortedApps.slice(0, 8).map((app, index) => (
                    <WorkAppItem
                      key={index}
                      app={app}
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