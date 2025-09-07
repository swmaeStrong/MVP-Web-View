'use client';

import { useTheme } from '@/hooks/ui/useTheme';
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

  const dateText = formatDate(currentDate);
  
  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous button */}
      <Button
        size='sm'
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`h-8 w-8 rounded-lg p-0 transition-all duration-200 border shadow-none ${getThemeClass('border')} ${getThemeClass('componentSecondary')} ${getThemeClass('textPrimary')} ${canGoPrevious ? 'hover:scale-105 hover:border-gray-700 dark:hover:border-gray-400 hover:' + getThemeClass('componentSecondary') + ' hover:' + getThemeClass('textPrimary') : 'opacity-50 cursor-not-allowed'}`}
      >
        <ChevronLeft className='h-4 w-4' />
      </Button>
      
      {/* Date display - 빈 문자열이 아닌 경우에만 표시 */}
      {dateText && (
        <div className={`text-lg font-bold px-4 ${getThemeTextColor('primary')}`}>
          {dateText}
        </div>
      )}
      
      {/* Next button */}
      <Button
        size='sm'
        onClick={onNext}
        disabled={!canGoNext}
        className={`h-8 w-8 rounded-lg p-0 transition-all duration-200 border shadow-none ${getThemeClass('border')} ${getThemeClass('componentSecondary')} ${getThemeClass('textPrimary')} ${canGoNext ? 'hover:scale-105 hover:border-gray-700 dark:hover:border-gray-400 hover:' + getThemeClass('componentSecondary') + ' hover:' + getThemeClass('textPrimary') : 'opacity-50 cursor-not-allowed'}`}
      >
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  );
}