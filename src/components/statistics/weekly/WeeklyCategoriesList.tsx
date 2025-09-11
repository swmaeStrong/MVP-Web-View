'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { ScrollArea } from '@/shadcn/ui/scroll-area';
import { useWeeklyPomodoroDetails } from '@/hooks/data/useWeeklyPomodoroDetails';
import React from 'react';

interface WeeklyCategoriesListProps {
  selectedDate: string;
}

export default function WeeklyCategoriesList({ selectedDate }: WeeklyCategoriesListProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();

  // API 호출
  const { data: weeklyPomodoroData, isLoading, isError } = useWeeklyPomodoroDetails(selectedDate);

  // API 데이터에서 카테고리 데이터 처리
  const weeklyCategories = React.useMemo(() => {
    if (!weeklyPomodoroData?.categoryUsages || weeklyPomodoroData.categoryUsages.length === 0) {
      return [];
    }

    const totalDuration = weeklyPomodoroData.categoryUsages.reduce((sum, cat) => sum + cat.duration, 0);

    return weeklyPomodoroData.categoryUsages
      .map(cat => ({
        name: cat.category,
        duration: cat.duration, // seconds
        percentage: totalDuration > 0 ? (cat.duration / totalDuration) * 100 : 0,
      }))
      .sort((a, b) => b.duration - a.duration) // 시간 내림차순 정렬
      .slice(0, 10); // 상위 10개만
  }, [weeklyPomodoroData?.categoryUsages]);

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

  return (
    <Card className={`h-auto pt-0 lg:h-[280px] rounded-lg border transition-all duration-200 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className="h-auto lg:h-full p-3">
        <div className="h-auto lg:h-full flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <p className={`text-xs font-semibold ${getThemeTextColor('secondary')} mb-2 uppercase tracking-wider`}>
              Categories
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0">
            {isLoading ? (
              <div className="space-y-2.5">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="flex items-center gap-1.5 py-1.5">
                    <div className={`h-3 w-20 lg:w-24 rounded animate-pulse ${getThemeClass('borderLight')}`}></div>
                    <div className={`flex-1 h-2 lg:h-3 rounded-full animate-pulse ${getThemeClass('borderLight')}`}></div>
                    <div className={`h-3 w-14 lg:w-16 rounded animate-pulse ${getThemeClass('borderLight')}`}></div>
                  </div>
                ))}
              </div>
            ) : isError || weeklyCategories.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className={`text-sm ${getThemeTextColor('secondary')}`}>
                  {isError ? 'Failed to load data' : 'No data available'}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="space-y-2.5">
                  {weeklyCategories.map((category, index) => (
                    <div key={`${category.name}-${index}`} className="flex items-center gap-1">
                      <span 
                        className={`${getThemeTextColor('secondary')} text-xs font-medium w-20 lg:w-24 flex-shrink-0 text-left overflow-hidden text-ellipsis whitespace-nowrap`}
                        title={category.name}
                      >
                        {category.name}
                      </span>
                      <div className="flex-1 mx-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 lg:h-3 overflow-hidden min-w-[30px]">
                        <div
                          className={`h-full bg-[#3F72AF] transition-all duration-500 ease-out rounded-full`}
                          style={{ width: `${Math.min(category.percentage, 100)}%` }}
                        />
                      </div>
                      <span className={`${getThemeTextColor('primary')} text-xs font-semibold flex-shrink-0 w-14 lg:w-16 text-right whitespace-nowrap`}>
                        {formatTime(category.duration)}
                      </span>
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