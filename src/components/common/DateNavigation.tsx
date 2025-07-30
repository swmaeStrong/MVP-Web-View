'use client';

import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/shadcn/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateNavigationProps {
  currentDate: string;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  formatDate: (date: string) => string;
}

export default function DateNavigation({
  currentDate,
  onPrevious,
  onNext,
  canGoPrevious = true,
  canGoNext = true,
  formatDate,
}: DateNavigationProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous button */}
      <Button
        size='sm'
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`h-8 w-8 rounded-lg p-0 transition-all duration-200 border ${getThemeClass('border')} ${getThemeClass('componentSecondary')} ${getThemeClass('textPrimary')} ${canGoPrevious ? 'hover:scale-105 hover:border-gray-700 dark:hover:border-gray-400 hover:' + getThemeClass('componentSecondary') + ' hover:' + getThemeClass('textPrimary') : 'opacity-50 cursor-not-allowed'}`}
      >
        <ChevronLeft className='h-4 w-4' />
      </Button>
      
      {/* Date display */}
      <div className={`text-lg font-bold px-4 ${getThemeTextColor('primary')}`}>
        {formatDate(currentDate)}
      </div>
      
      {/* Next button */}
      <Button
        size='sm'
        onClick={onNext}
        disabled={!canGoNext}
        className={`h-8 w-8 rounded-lg p-0 transition-all duration-200 border ${getThemeClass('border')} ${getThemeClass('componentSecondary')} ${getThemeClass('textPrimary')} ${canGoNext ? 'hover:scale-105 hover:border-gray-700 dark:hover:border-gray-400 hover:' + getThemeClass('componentSecondary') + ' hover:' + getThemeClass('textPrimary') : 'opacity-50 cursor-not-allowed'}`}
      >
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  );
}