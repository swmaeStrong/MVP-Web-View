'use client';

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
    if (selectedPeriod === 'daily') {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - selectedDateIndex);
      return date.toLocaleDateString('ko-KR');
    } else if (selectedPeriod === 'weekly') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(
        weekStart.getDate() - selectedDateIndex * 7 - weekStart.getDay()
      );
      return `${weekStart.getMonth() + 1}월 ${Math.ceil(weekStart.getDate() / 7)}주차`;
    } else {
      // 월간의 경우 해당 월의 1일로 직접 생성
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const targetMonth = currentMonth - selectedDateIndex;

      // 년도와 월 계산 (음수 월 처리)
      let targetYear = currentYear;
      let finalMonth = targetMonth;

      while (finalMonth < 0) {
        finalMonth += 12;
        targetYear -= 1;
      }

      // 해당 월의 1일로 새 Date 객체 생성
      const month = new Date(targetYear, finalMonth, 1);
      return `${month.getFullYear()}년 ${month.getMonth() + 1}월`;
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
