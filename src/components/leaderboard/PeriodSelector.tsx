'use client';

import { utils } from '@/styles';

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
    const today = new Date();

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
      const month = new Date(currentDate);
      month.setMonth(month.getMonth() - selectedDateIndex);
      return `${month.getFullYear()}년 ${month.getMonth() + 1}월`;
    }
  };

  return (
    <div className='mb-8 rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-sm'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-3 sm:flex-row sm:gap-4'>
            {Object.keys(timeLabels).map(period => (
              <button
                key={period}
                className={utils.cn(
                  'flex-1 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-300',
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:from-purple-700 hover:to-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
                onClick={() => setSelectedPeriod(period as any)}
              >
                {timeLabels[period as keyof typeof timeLabels]}
              </button>
            ))}
          </div>

          {/* 이전/다음 버튼 */}
          <div className='flex gap-2'>
            <button
              className={utils.cn(
                'h-10 w-10 rounded-lg bg-gray-100 text-gray-600 transition-all duration-300 hover:bg-gray-200',
                !canGoPrevious() && 'cursor-not-allowed opacity-50'
              )}
              onClick={handlePreviousDate}
              disabled={!canGoPrevious()}
            >
              ←
            </button>
            <button
              className={utils.cn(
                'h-10 w-10 rounded-lg bg-gray-100 text-gray-600 transition-all duration-300 hover:bg-gray-200',
                !canGoNext() && 'cursor-not-allowed opacity-50'
              )}
              onClick={handleNextDate}
              disabled={!canGoNext()}
            >
              →
            </button>
          </div>
        </div>

        {/* 현재 선택된 기간 표시 */}
        <div className='text-center'>
          <div className='inline-block rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-2'>
            <span className='text-lg font-semibold text-gray-800'>
              📅 {getPeriodLabel()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
