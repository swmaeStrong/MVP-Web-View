'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { ScrollArea } from '@/shadcn/ui/scroll-area';
import React from 'react';

interface WeeklyCategoriesListProps {
  selectedDate?: string;
}

// Weekly 카테고리 데이터
const weeklyCategories = [
  { name: 'Development', hours: 35.5, percentage: 45, trend: '+12%' },
  { name: 'Documentation', hours: 18.2, percentage: 23, trend: '+5%' },
  { name: 'Communication', hours: 12.8, percentage: 16, trend: '-3%' },
  { name: 'Research', hours: 8.3, percentage: 10, trend: '+8%' },
  { name: 'Design', hours: 3.2, percentage: 4, trend: '+2%' },
  { name: 'Testing', hours: 1.5, percentage: 2, trend: '-1%' },
];

export default function WeeklyCategoriesList({ selectedDate }: WeeklyCategoriesListProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();

  const formatHours = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  const getTrendColor = (trend: string): string => {
    if (trend.startsWith('+')) return 'text-green-500';
    if (trend.startsWith('-')) return 'text-red-500';
    return getThemeTextColor('secondary');
  };

  return (
    <Card className={`h-auto pt-0 lg:h-[280px] rounded-lg border transition-all duration-200 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className="h-auto lg:h-full p-3">
        <div className="h-auto lg:h-full flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <p className={`text-xs font-semibold ${getThemeTextColor('secondary')} mb-2 uppercase tracking-wider`}>
              Weekly Categories
            </p>
            <p className={`text-xs ${getThemeTextColor('secondary')}`}>
              Total: {formatHours(weeklyCategories.reduce((sum, cat) => sum + cat.hours, 0))}
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="space-y-2.5">
                {weeklyCategories.slice(0, 6).map((category, index) => (
                  <div key={index} className="flex items-center gap-2 py-1.5">
                    <span className={`${getThemeTextColor('secondary')} text-xs font-medium w-24 flex-shrink-0 text-left`}>
                      {category.name}
                    </span>
                    <div className="flex-1 mx-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 lg:h-3 overflow-hidden min-w-[30px]">
                      <div
                        className={`h-full bg-[#3F72AF] transition-all duration-500 ease-out rounded-full`}
                        style={{ width: `${Math.min(category.percentage, 100)}%` }}
                      />
                    </div>
                    <span className={`${getThemeTextColor('primary')} text-xs font-semibold flex-shrink-0 w-16 text-right`}>
                      {formatHours(category.hours)}
                    </span>
                    <span className={`text-xs font-medium flex-shrink-0 w-10 text-right ${getTrendColor(category.trend)}`}>
                      {category.trend}
                    </span>
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