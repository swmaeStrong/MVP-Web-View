'use client';

import { formatKSTDate, getKSTDate } from '@/utils/timezone';
import { useTheme } from '@/hooks/useTheme';
import { componentSizes, componentStates, spacing } from '@/styles/design-system';
import TierSystemTooltip from './TierSystemTooltip';

interface PeriodSelectorProps {
  selectedPeriod: 'daily' | 'weekly' | 'monthly';
  setSelectedPeriod: (period: 'daily' | 'weekly' | 'monthly') => void;
  selectedDateIndex: number;
  setSelectedDateIndex: (index: number) => void;
  currentDate: Date;
  showTierTooltip?: boolean;
}

export default function PeriodSelector({
  selectedPeriod,
  setSelectedPeriod,
  selectedDateIndex,
  setSelectedDateIndex,
  currentDate,
  showTierTooltip = true,
}: PeriodSelectorProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();
  const timeLabels = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
  };

  const handlePreviousDate = () => {
    setSelectedDateIndex(selectedDateIndex + 1);
  };

  const handleNextDate = () => {
    if (selectedDateIndex > 0) {
      setSelectedDateIndex(selectedDateIndex - 1);
    }
  };

  const canGoPrevious = () => {
    return selectedDateIndex < 30;
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

      return `${targetYear}년 ${targetMonth + 1}월`;
    }
  };

  return (
    <div className={`mb-6 rounded-lg border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')} relative`}>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-row gap-3'>
            {Object.keys(timeLabels).map(period => (
              <button
                key={period}
                className={
                  selectedPeriod === period
                    ? 'rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-purple-700 hover:to-blue-700'
                    : `rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} hover:${getThemeClass('borderLight')}`
                }
                onClick={() => setSelectedPeriod(period as any)}
              >
                {timeLabels[period as keyof typeof timeLabels]}
              </button>
            ))}
          </div>

          {/* 이전/다음 버튼 */}
          <div className='flex gap-2'>
            <button
              className={
                canGoPrevious()
                  ? `h-8 w-8 rounded-lg text-sm transition-all duration-200 border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} hover:${getThemeClass('borderLight')}`
                  : `h-8 w-8 cursor-not-allowed rounded-lg text-sm border ${getThemeClass('border')} ${getThemeClass('componentSecondary')} ${getThemeTextColor('secondary')}`
              }
              onClick={handlePreviousDate}
              disabled={!canGoPrevious()}
            >
              ←
            </button>
            <button
              className={
                canGoNext()
                  ? `h-8 w-8 rounded-lg text-sm transition-all duration-200 border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} hover:${getThemeClass('borderLight')}`
                  : `h-8 w-8 cursor-not-allowed rounded-lg text-sm border ${getThemeClass('border')} ${getThemeClass('componentSecondary')} ${getThemeTextColor('secondary')}`
              }
              onClick={handleNextDate}
              disabled={!canGoNext()}
            >
              →
            </button>
          </div>
        </div>

        {/* 현재 선택된 기간 표시와 티어 설명을 함께 배치 */}
        <div className='flex items-center justify-between'>
          {/* 좌측 하단: 티어 설명 */}
          {showTierTooltip && (
            <div className='flex-shrink-0'>
              <TierSystemTooltip />
            </div>
          )}
          
          {/* 중앙: 현재 선택된 기간 표시 */}
          <div className='flex-1 text-center'>
            <div className='inline-block rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 shadow-sm'>
              <span className='text-sm font-semibold text-white'>
                {getPeriodLabel()}
              </span>
            </div>
          </div>
          
          {/* 우측: 빈 공간 (균형을 위해) */}
          <div className='flex-shrink-0 w-16'></div>
        </div>
      </div>
    </div>
  );
}
