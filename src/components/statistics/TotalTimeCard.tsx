'use client';

import { Card, CardContent } from '@/shadcn/ui/card';
import { Button } from '@/shadcn/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { cardSystem, componentStates, spacing } from '@/styles/design-system';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatKSTDate } from '@/utils/timezone';

interface TotalTimeCardProps {
  totalTime: number; // seconds
  currentDate: string;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLoading?: boolean;
}

export default function TotalTimeCard({
  totalTime,
  currentDate,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isLoading = false,
}: TotalTimeCardProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();
  
  // Time formatting
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours === 0) {
      return `${minutes}m`;
    }
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  // Always display total time
  const displayTime = totalTime;
  const displayTitle = 'Total Activity Time';
  
  // Format current date for display
  const formattedDate = formatKSTDate(new Date(currentDate + 'T00:00:00Z'));

  if (isLoading) {
    return (
      <Card className={`${cardSystem.base} ${cardSystem.variants.elevated} ${componentStates.default.transition} ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardContent className={`${cardSystem.content} ${spacing.inner.normal}`}>
          {/* Date navigation header skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div className={`h-7 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
            <div className='flex gap-2'>
              <div className={`h-8 w-8 animate-pulse rounded-lg ${getThemeClass('componentSecondary')}`}></div>
              <div className={`h-8 w-8 animate-pulse rounded-lg ${getThemeClass('componentSecondary')}`}></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Left: title skeleton */}
            <div className="flex items-center gap-3">
              <div className={`h-7 w-40 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
            </div>

            {/* Right: time skeleton */}
            <div className="text-right">
              <div className={`h-9 w-20 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className={`text-lg font-semibold ${getThemeTextColor('primary')}`}>
              {formattedDate}
            </h3>
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

        <div className="flex items-center justify-between">
          {/* Left: title display */}
          <div className="flex items-center gap-3">
            <div>
              <h3 className={`text-lg font-semibold ${getThemeTextColor('primary')}`}>
                {displayTitle}
              </h3>
            </div>
          </div>

          {/* Right: time display */}
          <div className="text-right">
            <div className={`text-3xl font-bold ${getThemeTextColor('primary')}`}>
              {formatTime(displayTime)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
