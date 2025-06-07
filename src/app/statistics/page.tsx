'use client';
import { useAvailableDates, useUsageStatistics } from '@/hooks/useStatistics';
import { PeriodType } from '@/types/statistics';
import { getDateString } from '@/utils/statisticsUtils';
import { useState } from 'react';

// 컴포넌트 임포트
import StatisticsChart from '@/components/statistics/StatisticsChart';
import StatisticsPeriodSelector from '@/components/statistics/StatisticsPeriodSelector';
import TopCategoryCard from '@/components/statistics/TopCategoryCard';
import TotalTimeCard from '@/components/statistics/TotalTimeCard';

export default function StatisticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('daily');
  const [selectedDate, setSelectedDate] = useState(getDateString(new Date()));

  // 가용한 날짜 목록 (최근 30일)
  const availableDates = useAvailableDates();

  // 선택된 날짜의 통계 데이터 조회
  const {
    data: dailyData,
    isLoading,
    isError,
    error,
  } = useUsageStatistics(selectedDate);

  // 기간 변경 핸들러
  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
    // 일별이 아닌 경우 오늘로 초기화
    if (period !== 'daily') {
      setSelectedDate(getDateString(new Date()));
    }
  };

  // 날짜 변경 핸들러
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  // 이전/다음 날짜 네비게이션
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
            일별, 주별, 월별 작업 시간을 확인하세요
          </p>
        </div>

        {/* 기간 선택 */}
        <StatisticsPeriodSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          availableDates={availableDates}
        />

        {/* 메인 콘텐츠 */}
        <div className='grid gap-6 sm:gap-8 lg:grid-cols-2'>
          {/* 왼쪽: 총 작업시간 & 최고 카테고리 */}
          <div className='space-y-6'>
            <TotalTimeCard
              totalTime={dailyData?.totalTime || 0}
              periodLabel={selectedDate}
            />

            <TopCategoryCard topCategory={dailyData?.categories[0] || null} />
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

        {/* Top 3 카테고리 하이라이트 */}
        {dailyData && dailyData.categories.length > 0 && (
          <div className='space-y-6'>
            <div className='text-center'>
              <h2 className='mb-2 text-2xl font-bold text-gray-800'>
                🏆 상위 카테고리
              </h2>
              <p className='text-sm text-gray-600'>
                가장 많은 시간을 투자한 영역입니다
              </p>
            </div>

            <div className='grid gap-4 md:grid-cols-3'>
              {dailyData.categories.slice(0, 3).map((category, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-xl border-2 bg-gradient-to-br p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    index === 0
                      ? 'border-yellow-300 from-yellow-50 to-orange-50'
                      : index === 1
                        ? 'border-silver-300 from-gray-50 to-blue-50'
                        : 'border-orange-300 from-orange-50 to-red-50'
                  }`}
                >
                  {/* 순위 배지 */}
                  <div className='absolute -top-2 -right-2'>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg ${
                        index === 0
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                          : index === 1
                            ? 'bg-gradient-to-r from-gray-400 to-blue-500'
                            : 'bg-gradient-to-r from-orange-400 to-red-500'
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  <div className='text-center'>
                    <div
                      className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl text-white shadow-lg'
                      style={{ backgroundColor: category.color }}
                    >
                      {category.icon}
                    </div>

                    <h3 className='mb-2 text-lg font-bold text-gray-800'>
                      {category.name}
                    </h3>

                    <div className='space-y-1'>
                      <div className='text-2xl font-bold text-gray-900'>
                        {Math.round((category.time / 3600) * 10) / 10}시간
                      </div>
                      <div className='text-sm text-gray-600'>
                        전체의 {category.percentage}%
                      </div>
                    </div>

                    {/* 프로그레스 바 */}
                    <div className='mt-3 h-2 w-full rounded-full bg-gray-200'>
                      <div
                        className='h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500'
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 전체 카테고리 상세 리스트 */}
        {dailyData && dailyData.categories.length > 3 && (
          <div className='space-y-4'>
            <div className='text-center'>
              <h3 className='mb-2 text-xl font-bold text-gray-800'>
                📊 전체 카테고리 상세
              </h3>
              <p className='text-sm text-gray-600'>
                모든 작업 카테고리의 상세 시간입니다
              </p>
            </div>

            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {dailyData.categories.map((category, index) => (
                <div
                  key={index}
                  className='group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:scale-102 hover:border-purple-300 hover:shadow-md'
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className='flex h-10 w-10 items-center justify-center rounded-lg text-lg text-white shadow-sm transition-transform group-hover:scale-110'
                      style={{ backgroundColor: category.color }}
                    >
                      {category.icon}
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h4 className='truncate font-semibold text-gray-800 group-hover:text-purple-700'>
                        {category.name}
                      </h4>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <span className='font-medium'>
                          {Math.round((category.time / 3600) * 10) / 10}h
                        </span>
                        <span className='text-xs'>•</span>
                        <span>{category.percentage}%</span>
                      </div>

                      {/* 미니 프로그레스 바 */}
                      <div className='mt-1 h-1 w-full rounded-full bg-gray-100'>
                        <div
                          className='h-1 rounded-full transition-all duration-300'
                          style={{
                            width: `${category.percentage}%`,
                            backgroundColor: category.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
