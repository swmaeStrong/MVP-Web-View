'use client';

import { Card, CardContent } from '@/shadcn/ui/card';
import { Button } from '@/shadcn/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { cardSystem, componentStates, spacing } from '@/styles/design-system';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatKSTDate } from '@/utils/timezone';
import { ChartConfig, ChartContainer } from '@/shadcn/ui/chart';
import { PolarGrid, RadialBar, RadialBarChart } from 'recharts';
import { useState } from 'react';

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
    <Card className={`${cardSystem.base} ${cardSystem.variants.elevated} ${componentStates.default.transition} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className={`${cardSystem.content} ${spacing.inner.normal}`}>
        {/* Date navigation header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className={`text-lg font-semibold ${getThemeTextColor('primary')}`}>
              {formattedDate}
            </h3>
            
            {/* Goal circles */}
            <div className="flex gap-2">
              {chartConfigs.map((config, index) => {
                const percentage = config.data[0].value;
                const isFilled = percentage >= 100;
                
                return (
                  <div key={index} className="relative">
                    <ChartContainer
                      config={{
                        Progress: {
                          label: 'Progress',
                          color: isFilled ? '#10b981' : '#a855f7',
                        },
                      }}
                      className="aspect-square w-12 h-12"
                    >
                      <RadialBarChart
                        data={config.data}
                        startAngle={90}
                        endAngle={-270}
                        innerRadius={18}
                        outerRadius={24}
                      >
                        <PolarGrid
                          gridType="circle"
                          radialLines={false}
                          stroke="none"
                          className="first:fill-muted last:fill-background"
                          polarRadius={[20, 16]}
                        />
                        <RadialBar
                          dataKey="value"
                          background
                          cornerRadius={6}
                          fill={isFilled ? '#10b981' : '#a855f7'}
                        />
                      </RadialBarChart>
                    </ChartContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-xs font-bold ${getThemeTextColor('primary')}`}>
                        {config.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className={`h-8 w-8 rounded-lg p-0 transition-all duration-200 hover:scale-105 border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeClass('textPrimary')} hover:border-purple-300 hover:bg-purple-50 dark:hover:border-purple-600 dark:hover:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-current disabled:hover:bg-current`}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={onNext}
              disabled={!canGoNext}
              className={`h-8 w-8 rounded-lg p-0 transition-all duration-200 hover:scale-105 border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeClass('textPrimary')} hover:border-purple-300 hover:bg-purple-50 dark:hover:border-purple-600 dark:hover:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-current disabled:hover:bg-current`}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
