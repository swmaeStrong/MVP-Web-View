'use client';

import { useAvailableDates, useUsageStatistics } from '@/hooks/useStatistics';
import { PeriodType, StatisticsCategory } from '@/types/statistics';
import { getDateString } from '@/utils/statisticsUtils';
import React, { useState } from 'react';

// 컴포넌트 임포트
import CategoryList from '@/components/statistics/CategoryList';
import StatisticsChart from '@/components/statistics/StatisticsChart';
import TotalTimeCard from '@/components/statistics/TotalTimeCard';

export default function StatisticsPage() {
  const [selectedPeriod] = useState<PeriodType>('daily');
  const [selectedDate, setSelectedDate] = useState(getDateString(new Date()));
  const [selectedCategory, setSelectedCategory] =
    useState<StatisticsCategory | null>(null);

  // 가용한 날짜 목록 (최근 30일)
  const availableDates = useAvailableDates();

  // 선택된 날짜의 통계 데이터 조회
  const {
    data: dailyData,
    isLoading,
    isError,
    error,
  } = useUsageStatistics(selectedDate);

  // 데이터가 로드되면 기본 카테고리를 top1으로 설정
  React.useEffect(() => {
    if (dailyData && dailyData.categories.length > 0) {
      setSelectedCategory(dailyData.categories[0]);
    }
  }, [dailyData, selectedDate]);

  // 날짜가 변경될 때마다 selectedCategory 초기화
  React.useEffect(() => {
    setSelectedCategory(null);
  }, [selectedDate]);

  const handlePreviousDate = () => {
    const currentIndex = availableDates.indexOf(selectedDate);
    if (currentIndex < availableDates.length - 1) {
      setSelectedDate(availableDates[currentIndex + 1]);
    }
  };

  const handleNextDate = () => {
    const currentIndex = availableDates.indexOf(selectedDate);
    if (currentIndex > 0) {
      setSelectedDate(availableDates[currentIndex - 1]);
    }
  };

  const canGoPrevious = () => {
    const currentIndex = availableDates.indexOf(selectedDate);
    return currentIndex < availableDates.length - 1;
  };

  const canGoNext = () => {
    const currentIndex = availableDates.indexOf(selectedDate);
    return currentIndex > 0;
  };

  const handleCategorySelect = (category: StatisticsCategory | null) => {
    setSelectedCategory(category);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8'>
        <div className='mx-auto max-w-6xl'>
          <div className='mb-8 text-center'>
            <h1 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
              📊 작업 통계
            </h1>
            <p className='mt-2 text-gray-600'>
              일별, 주별, 월별 작업 시간을 확인하세요
            </p>
          </div>
          <div className='flex h-64 items-center justify-center'>
            <div className='text-center'>
              <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600'></div>
              <p className='text-gray-600'>통계 데이터를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8'>
        <div className='mx-auto max-w-6xl'>
          <div className='mb-8 text-center'>
            <h1 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
              📊 작업 통계
            </h1>
            <p className='mt-2 text-gray-600'>
              일별, 주별, 월별 작업 시간을 확인하세요
            </p>
          </div>
          <div className='flex h-64 items-center justify-center'>
            <div className='text-center text-red-600'>
              <div className='mb-4 text-4xl'>⚠️</div>
              <h3 className='mb-2 text-lg font-semibold'>
                데이터를 불러올 수 없습니다
              </h3>
              <p className='text-sm text-gray-600'>
                {error?.message ||
                  '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-6xl space-y-6 sm:space-y-8'>
        {/* 헤더 */}
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
            📊 작업 통계
          </h1>
          <p className='mt-2 text-gray-600'>
            카테고리별 레벨과 성장을 확인하세요
          </p>
        </div>

        {/* 메인 콘텐츠 */}
        <div className='grid gap-6 sm:gap-8 lg:grid-cols-2'>
          {/* 왼쪽: 총 작업시간 & 상위 카테고리 */}
          <div className='flex flex-col space-y-3'>
            {/* 작업시간 카드 - 컴팩트하게 */}
            <div className='flex-shrink-0'>
              <TotalTimeCard
                totalTime={dailyData?.totalTime || 0}
                selectedCategory={selectedCategory}
              />
            </div>

            {/* 상위 6개 카테고리 목록 - 더 많은 공간 */}
            {dailyData && dailyData.categories.length > 0 && (
              <div className='min-h-0 flex-1'>
                <CategoryList
                  categories={dailyData.categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleCategorySelect}
                />
              </div>
            )}
          </div>

          {/* 오른쪽: 차트 */}
          <StatisticsChart
            selectedPeriod={selectedPeriod}
            data={dailyData || null}
            onPrevious={handlePreviousDate}
            onNext={handleNextDate}
            canGoPrevious={canGoPrevious()}
            canGoNext={canGoNext()}
            currentDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
}
