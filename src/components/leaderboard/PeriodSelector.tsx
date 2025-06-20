'use client';

import { formatKSTDate, getKSTDate } from '@/utils/timezone';

interface PeriodSelectorProps {
  selectedPeriod: 'daily' | 'weekly' | 'monthly';
  setSelectedPeriod: (period: 'daily' | 'weekly' | 'monthly') => void;
  selectedDateIndex: number;
  setSelectedDateIndex: (index: number) => void;
  currentDate: Date;
}

export default function PeriodSelector({
  selectedPeriod,
  setSelectedPeriod,
  selectedDateIndex,
  setSelectedDateIndex,
  currentDate,
}: PeriodSelectorProps) {
  const timeLabels = {
    daily: '일간',
    weekly: '주간',
    monthly: '월간',
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
    <div className='mb-6 rounded-lg border border-gray-100 bg-gradient-to-br from-purple-50/50 to-blue-50/50 p-4 shadow-sm transition-shadow duration-200 hover:shadow-md'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-2 sm:flex-row sm:gap-3'>
            {Object.keys(timeLabels).map(period => (
              <button
                key={period}
                className={
                  selectedPeriod === period
                    ? 'rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-purple-700 hover:to-blue-700'
                    : 'rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50'
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
                  ? 'h-8 w-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 transition-all duration-200 hover:bg-gray-50'
                  : 'h-8 w-8 cursor-not-allowed rounded-lg bg-gray-100 text-sm text-gray-400'
              }
              onClick={handlePreviousDate}
              disabled={!canGoPrevious()}
            >
              ←
            </button>
            <button
              className={
                canGoNext()
                  ? 'h-8 w-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 transition-all duration-200 hover:bg-gray-50'
                  : 'h-8 w-8 cursor-not-allowed rounded-lg bg-gray-100 text-sm text-gray-400'
              }
              onClick={handleNextDate}
              disabled={!canGoNext()}
            >
              →
            </button>
          </div>
        </div>

        {/* 현재 선택된 기간 표시 */}
        <div className='text-center'>
          <div className='inline-block rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 shadow-sm'>
            <span className='text-sm font-semibold text-white'>
              {getPeriodLabel()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
