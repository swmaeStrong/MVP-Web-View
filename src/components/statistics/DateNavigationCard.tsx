'use client';

import DateNavigation from '@/components/common/DateNavigation';
import { useState } from 'react';

interface TotalTimeCardProps {
  currentDate: string;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export default function TotalTimeCard({
  currentDate,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: TotalTimeCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week'>('day');

  return (
    <div className="flex items-center justify-end w-full mb-6">
      <div className="flex items-center gap-4">
        {/* 날짜 표시 */}
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          {currentDate}
        </h1>
        
        {/* Day/Week 선택자 */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setSelectedPeriod('day')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              selectedPeriod === 'day'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              selectedPeriod === 'week'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Week
          </button>
        </div>

        {/* 날짜 네비게이션 */}
        <DateNavigation
          currentDate={currentDate}
          onPrevious={onPrevious}
          onNext={onNext}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          formatDate={() => ''} // 날짜 표시는 별도로 처리하므로 빈 문자열 반환
        />
      </div>
    </div>
  );
}
