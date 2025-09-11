'use client';

import DateNavigation from '@/components/common/DateNavigation';
import { useState } from 'react';

interface TotalTimeCardProps {
  currentDate: string;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  selectedPeriod?: 'day' | 'week';
  setSelectedPeriod?: (period: 'day' | 'week') => void;
}

export default function TotalTimeCard({
  currentDate,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  selectedPeriod: externalSelectedPeriod,
  setSelectedPeriod: externalSetSelectedPeriod,
}: TotalTimeCardProps) {
  // 내부 상태를 외부 props와 연결
  const [internalSelectedPeriod, internalSetSelectedPeriod] = useState<'day' | 'week'>('day');
  
  // props가 없으면 내부 상태 사용, 있으면 외부 상태 사용
  const selectedPeriod = externalSelectedPeriod ?? internalSelectedPeriod;
  const setSelectedPeriod = externalSetSelectedPeriod ?? internalSetSelectedPeriod;

  // 주간 날짜 범위 계산
  const getWeekRange = (date: string) => {
    const [year, month, day] = date.split('-').map(Number);
    const currentDate = new Date(year, month - 1, day);
    
    // 해당 주의 월요일 찾기
    const dayOfWeek = currentDate.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(currentDate.getTime() + diff * 24 * 60 * 60 * 1000);
    
    // 해당 주의 일요일 찾기
    const sunday = new Date(monday.getTime() + 6 * 24 * 60 * 60 * 1000);
    
    const formatDate = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${y}.${m}.${dd}`;
    };
    
    return `${formatDate(monday)} - ${formatDate(sunday)}`;
  };

  return (
    <div className="flex items-center justify-end w-full mb-6">
      <div className="flex items-center gap-4">
        {/* 날짜 표시 */}
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          {selectedPeriod === 'week' ? getWeekRange(currentDate) : currentDate}
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
