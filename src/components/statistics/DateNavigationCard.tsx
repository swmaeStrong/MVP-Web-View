'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { cardSystem, componentStates, spacing } from '@/styles/design-system';
import { formatKSTDate } from '@/utils/timezone';
import { useState } from 'react';
import DateNavigation from '@/components/common/DateNavigation';

interface TotalTimeCardProps {
  totalTime: number; // seconds
  currentDate: string;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  goalTime?: number; // seconds, default 8 hours
  isLoading?: boolean;
}

export default function TotalTimeCard({
  totalTime,
  currentDate,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  goalTime = 8 * 3600, // 8 hours default
  isLoading = false,
}: TotalTimeCardProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const [currentGoal, setCurrentGoal] = useState(goalTime / 3600); // Store in hours
  
  // Format current date for display
  const formattedDate = formatKSTDate(new Date(currentDate + 'T00:00:00Z'));

  // Calculate values for each radial chart
  const hours = Math.floor(totalTime / 3600);
  const goalHours = currentGoal;
  
  const firstChartHours = Math.min(hours, Math.ceil(goalHours / 3));
  const secondChartHours = Math.max(0, Math.min(hours - Math.ceil(goalHours / 3), Math.ceil(goalHours / 3)));
  const thirdChartHours = Math.max(0, Math.min(hours - 2 * Math.ceil(goalHours / 3), Math.ceil(goalHours / 3)));

  // Create data for RadialBarChart
  const createChartData = (value: number, maxValue: number) => {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
    return [{
      name: 'Progress',
      value: Math.min(percentage, 100),
    }];
  };

  const chartConfigs = [
    {
      data: createChartData(firstChartHours, Math.ceil(goalHours / 3)),
      value: firstChartHours,
      max: Math.ceil(goalHours / 3),
    },
    {
      data: createChartData(secondChartHours, Math.ceil(goalHours / 3)),
      value: secondChartHours,
      max: Math.ceil(goalHours / 3),
    },
    {
      data: createChartData(thirdChartHours, Math.ceil(goalHours / 3)),
      value: thirdChartHours,
      max: Math.ceil(goalHours / 3),
    },
  ];

  if (isLoading) {
    return (
      <Card className={getCommonCardClass()}>
        <CardContent className={`${cardSystem.content} ${spacing.inner.normal}`}>
          {/* Date navigation header skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-7 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
              {/* Goal circles skeleton */}
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`w-12 h-12 animate-pulse rounded-full ${getThemeClass('componentSecondary')}`}></div>
                ))}
              </div>
            </div>
            <div className='flex gap-2'>
              <div className={`h-8 w-8 animate-pulse rounded-lg ${getThemeClass('componentSecondary')}`}></div>
              <div className={`h-8 w-8 animate-pulse rounded-lg ${getThemeClass('componentSecondary')}`}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 ${componentStates.default.transition} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className={`${cardSystem.content} ${spacing.inner.normal}`}>
        {/* Date navigation header */}
        <div className="flex items-center justify-center w-full">
          <DateNavigation
            currentDate={currentDate}
            onPrevious={onPrevious}
            onNext={onNext}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            formatDate={(date) => date}
          />
        </div>
      </CardContent>
    </Card>
  );
}
