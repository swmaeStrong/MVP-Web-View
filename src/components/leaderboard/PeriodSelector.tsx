'use client';

import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/ui/tooltip';
import { FONT_SIZES } from '@/styles/font-sizes';
import { formatKSTDate, getKSTDate } from '@/utils/timezone';
import { ChevronLeft, ChevronRight, Info, RefreshCw } from 'lucide-react';
import { getThemeColor } from '../../utils/theme-detector';

interface PeriodSelectorProps {
  selectedPeriod: 'daily' | 'weekly' | 'monthly';
  setSelectedPeriod: (period: 'daily' | 'weekly' | 'monthly') => void;
  selectedDateIndex: number;
  setSelectedDateIndex: (index: number) => void;
  currentDate: Date;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function PeriodSelector({
  selectedPeriod,
  setSelectedPeriod,
  selectedDateIndex,
  setSelectedDateIndex,
  currentDate,
  onRefresh,
  isRefreshing = false,
}: PeriodSelectorProps) {
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();
  const timeLabels = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
  };
  
  // 최소 허용 날짜: 2025년 7월 7일
  const MIN_DATE = new Date('2025-07-07T00:00:00+09:00'); // KST 시간대

  const handlePreviousDate = () => {
    if (canGoPrevious()) {
      setSelectedDateIndex(selectedDateIndex + 1);
    }
  };

  const handleNextDate = () => {
    if (selectedDateIndex > 0) {
      setSelectedDateIndex(selectedDateIndex - 1);
    }
  };

  const canGoPrevious = () => {
    // 기본 제한: 30일
    if (selectedDateIndex >= 30) return false;
    
    const kstCurrentDate = getKSTDate();
    let targetDate: Date;
    
    if (selectedPeriod === 'daily') {
      targetDate = new Date(
        kstCurrentDate.getTime() - (selectedDateIndex + 1) * 24 * 60 * 60 * 1000
      );
    } else if (selectedPeriod === 'weekly') {
      targetDate = new Date(
        kstCurrentDate.getTime() - (selectedDateIndex + 1) * 7 * 24 * 60 * 60 * 1000
      );
    } else if (selectedPeriod === 'monthly') {
      const nextMonthDate = new Date(kstCurrentDate);
      nextMonthDate.setMonth(nextMonthDate.getMonth() - (selectedDateIndex + 1));
      targetDate = nextMonthDate;
    } else {
      return false;
    }
    
    // 2025-07-07 이전으로는 갈 수 없음
    return targetDate >= MIN_DATE;
  };

  const canGoNext = () => {
    return selectedDateIndex > 0;
  };

  const getPeriodLabel = () => {
    // 한국 시간대 기준으로 현재 날짜를 가져옴
    const kstCurrentDate = getKSTDate();

    if (selectedPeriod === 'daily') {
      const targetDate = new Date(
        kstCurrentDate.getTime() - selectedDateIndex * 24 * 60 * 60 * 1000
      );
      return formatKSTDate(targetDate);
    } else if (selectedPeriod === 'weekly') {
      // 주간: 날짜 범위로 표시 (예: 24-06-09 ~ 24-06-15)
      const targetDate = new Date(
        kstCurrentDate.getTime() - selectedDateIndex * 7 * 24 * 60 * 60 * 1000
      );

      // 주의 시작일 (월요일)을 계산
      const dayOfWeek = targetDate.getUTCDay(); // 0=일요일, 1=월요일, ...
      // 월요일을 주의 시작으로: (dayOfWeek + 6) % 7 → 월(0), 화(1), ..., 일(6)
      const daysFromMonday = (dayOfWeek + 6) % 7;
      const startOfWeek = new Date(
        targetDate.getTime() - daysFromMonday * 24 * 60 * 60 * 1000
      );
      const endOfWeek = new Date(
        startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000
      );

      // 년도 뒤 2자리와 월/일 포맷
      const formatDateShort = (date: Date) => {
        const year = date.getUTCFullYear().toString().slice(-2);
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      return `${formatDateShort(startOfWeek)} ~ ${formatDateShort(endOfWeek)}`;
    } else {
      // 월간의 경우 - 한국 시간대 기준
      const currentYear = kstCurrentDate.getUTCFullYear();
      const currentMonth = kstCurrentDate.getUTCMonth(); // 0-based

      let targetYear = currentYear;
      let targetMonth = currentMonth - selectedDateIndex;

      // 음수 월 처리
      while (targetMonth < 0) {
        targetMonth += 12;
        targetYear -= 1;
      }

      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
      return `${monthNames[targetMonth]} ${targetYear}`;
    }
  };

  return (
    <div className={`mb-6 rounded-lg border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')} relative`}>
      {/* Information Tooltip과 새로고침 버튼 - 우측 하단에 위치 */}
      <div className='absolute bottom-2 right-2 flex items-center gap-2'>
        {/* 새로고침 버튼 */}
        {onRefresh && (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full transition-all duration-200 cursor-pointer ${FONT_SIZES.LEADERBOARD.SECONDARY} border hover:shadow-sm ${
                  isRefreshing 
                    ? 'opacity-50 cursor-not-allowed'
                    : isDarkMode 
                      ? `${getThemeColor('component')} border-[rgb(80,80,80)] text-[rgb(153,153,153)] hover:text-[rgb(220,220,220)] hover:border-[rgb(120,120,120)] hover:scale-105` 
                      : `bg-gray-50 border-gray-200 text-[rgb(142,142,142)] hover:text-[rgb(43,43,43)] hover:border-gray-300 hover:scale-105`
                }`}
              >
                <RefreshCw className={`h-3 w-3 ${getThemeTextColor('primary')} ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className={`${getThemeColor('background')} ${getThemeTextColor('primary')}`}>Refresh</span>
              </button>
            </TooltipTrigger>
          </Tooltip>
        )}

        {/* Info 버튼 */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div 
              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full transition-all duration-200 cursor-pointer ${FONT_SIZES.LEADERBOARD.SECONDARY} border hover:shadow-sm ${
                isDarkMode 
                  ? `${getThemeColor('component')} border-[rgb(80,80,80)] text-[rgb(153,153,153)] hover:text-[rgb(220,220,220)] hover:border-[rgb(120,120,120)]` 
                  : `bg-gray-50 border-gray-200 text-[rgb(142,142,142)] hover:text-[rgb(43,43,43)] hover:border-gray-300`
              }`} 
            >
              <Info className={`h-3 w-3 ${getThemeTextColor('primary')}`} />
              <span className={`${getThemeColor('background')} ${getThemeTextColor('primary')}`}>Info</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="end" className="max-w-xs text-sm leading-relaxed">
            <div className='space-y-3'>
              <div className="leading-relaxed">
                <span className='font-semibold text-[rgb(220,220,220)]'>Data Updates:</span>
                <br />
                <span className="text-[rgb(153,153,153)]">All user data is updated every 20-30 seconds</span>
              </div>
              <div className="leading-relaxed">
                <span className='font-semibold text-[rgb(220,220,220)]'>Work Category:</span>
                <br />
                <span className="text-[rgb(153,153,153)]">Only work activities (Development, Design, LLM, Documentation, etc.)</span>
                <br />
                <span className="text-[rgb(153,153,153)]">Excludes: Entertainment, Game, SNS</span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-row gap-3'>
            {Object.keys(timeLabels).map(period => (
              <button
                key={period}
                className={
                  selectedPeriod === period
                    ? `rounded-lg px-4 py-2 ${FONT_SIZES.LEADERBOARD.PRIMARY} font-semibold border-2 transition-all duration-200 ${isDarkMode ? 'border-purple-400' : 'border-purple-300'} ${getThemeClass('component')} ${getThemeTextColor('primary')}`
                    : `rounded-lg px-4 py-2 ${FONT_SIZES.LEADERBOARD.PRIMARY} font-medium transition-all duration-200 border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} hover:${getThemeClass('borderLight')}`
                }
                onClick={() => setSelectedPeriod(period as any)}
              >
                {timeLabels[period as keyof typeof timeLabels]}
              </button>
            ))}
          </div>

          {/* 이전/다음 버튼 */}
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handlePreviousDate}
              disabled={!canGoPrevious()}
              className={`h-8 w-8 rounded-lg p-0 transition-all duration-200 hover:scale-105 border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeClass('textPrimary')} hover:border-purple-300 hover:bg-purple-50 dark:hover:border-purple-600 dark:hover:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-current disabled:hover:bg-current`}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={handleNextDate}
              disabled={!canGoNext()}
              className={`h-8 w-8 rounded-lg p-0 transition-all duration-200 hover:scale-105 border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeClass('textPrimary')} hover:border-purple-300 hover:bg-purple-50 dark:hover:border-purple-600 dark:hover:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-current disabled:hover:bg-current`}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* 현재 선택된 기간 표시 */}
        <div className='flex justify-center'>
          <div className={`inline-block rounded-lg px-4 py-2 border ${getThemeClass('border')} ${getThemeClass('component')}`}>
            <span className={`${FONT_SIZES.LEADERBOARD.PRIMARY} font-semibold ${getThemeTextColor('primary')}`}>
              {getPeriodLabel()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
