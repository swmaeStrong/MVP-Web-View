'use client';

import { useAvailableDates, useUsageStatistics } from '@/hooks/useStatistics';
import { useTheme } from '@/hooks/useTheme';
import { getTimeline } from '@/shared/api/get';
import { useCurrentUser } from '@/stores/userStore';
import { PeriodType, StatisticsCategory } from '@/types/statistics';
import { getDateString } from '@/utils/statisticsUtils';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// 컴포넌트 임포트
import {
  HourlyUsageComparisonSkeleton,
  StatisticsChartSkeleton,
  TimelineChartSkeleton,
  TotalTimeCardSkeleton
} from '@/components/common/StatisticsSkeleton';
import ActivityList from '@/components/statistics/ActivityList';
import HourlyUsageComparison from '@/components/statistics/HourlyUsageComparison';
import StatisticsChart from '@/components/statistics/StatisticsChart';
import TimelineChart from '@/components/statistics/TimelineChart';
import TotalTimeCard from '@/components/statistics/TotalTimeCard';
import { useInitUser } from '@/hooks/useInitUser';
import ErrorState from '../../components/common/ErrorState';

export default function StatisticsPage() {
  const [selectedPeriod] = useState<PeriodType>('daily');
  // 가용한 날짜 목록 (최근 30일)
  const availableDates = useAvailableDates();

  // 초기 날짜 설정
  const [selectedDate, setSelectedDate] = useState(getDateString(new Date()));
  const [selectedCategory, setSelectedCategory] =
    useState<StatisticsCategory | null>(null);

  // Hook 순서를 항상 동일하게 유지
  const currentUser = useCurrentUser();
  const { initializeUser } = useInitUser();
  const { getThemeClass, getThemeTextColor } = useTheme();

  // Handle user initialization with useEffect
  useEffect(() => {
    if (!currentUser) {
      console.log('🔄 사용자 정보가 없어 초기화 시도...');
      initializeUser().catch(error => {
        console.error('❌ 사용자 초기화 실패:', error);
      });
    }
  }, [currentUser, initializeUser]);

  // 선택된 날짜의 통계 데이터 조회
  const {
    data: dailyData,
    isLoading,
    isError,
    error,
    refetch,
  } = useUsageStatistics(selectedDate, currentUser?.id || '');

  // 타임라인 데이터 조회
  const {
    data: timelineData,
    isLoading: isTimelineLoading,
    isError: isTimelineError,
  } = useQuery({
    queryKey: ['timeline', currentUser?.id, selectedDate],
    queryFn: async () => {
      if (!currentUser?.id) {
        throw new Error('User ID is required');
      }
      return getTimeline(currentUser.id, selectedDate);
    },
    enabled: !!currentUser?.id && !!selectedDate,
    staleTime: 5 * 60 * 1000, // 5분
    retry: false, // 타임라인은 선택적 기능이므로 재시도하지 않음
  });

  // availableDates 변경 모니터링
  React.useEffect(() => {
    console.log(
      'availableDates 배열 변경됨:',
      availableDates.length,
      availableDates.slice(0, 3)
    );
  }, [availableDates]);

  // availableDates가 로드되면 오늘 날짜(첫 번째 요소)로 설정
  React.useEffect(() => {
    if (availableDates.length > 0) {
      console.log('Statistics 페이지 - 오늘 날짜로 설정:', availableDates[0]);
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates]);

  // 데이터가 로드되면 기본 카테고리를 top1으로 설정
  React.useEffect(() => {
    if (dailyData && dailyData.categories.length > 0) {
      setSelectedCategory(dailyData.categories[0]);
    }
  }, [dailyData, selectedDate]);

  // 날짜가 변경될 때마다 selectedCategory 초기화
  React.useEffect(() => {
    console.log('selectedDate 변경됨:', selectedDate);
    setSelectedCategory(null);
  }, [selectedDate]);

  const handlePreviousDate = useCallback(() => {
    const currentIndex = availableDates.indexOf(selectedDate);
    console.log(
      '이전 날짜 클릭 - 현재 인덱스:',
      currentIndex,
      '현재 날짜:',
      selectedDate
    );
    if (currentIndex < availableDates.length - 1) {
      const newDate = availableDates[currentIndex + 1];
      console.log('새로운 날짜로 변경:', newDate);
      setSelectedDate(newDate);
    } else {
      console.log('이전 날짜로 갈 수 없음');
    }
  }, [availableDates, selectedDate]);

  const handleNextDate = useCallback(() => {
    const currentIndex = availableDates.indexOf(selectedDate);
    console.log(
      '다음 날짜 클릭 - 현재 인덱스:',
      currentIndex,
      '현재 날짜:',
      selectedDate
    );
    if (currentIndex > 0) {
      const newDate = availableDates[currentIndex - 1];
      console.log('새로운 날짜로 변경:', newDate);
      setSelectedDate(newDate);
    } else {
      console.log('다음 날짜로 갈 수 없음');
    }
  }, [availableDates, selectedDate]);

  const canGoPrevious = useMemo(() => {
    const currentIndex = availableDates.indexOf(selectedDate);
    const canGo = currentIndex < availableDates.length - 1;
    console.log(
      'canGoPrevious 체크 - 인덱스:',
      currentIndex,
      '가능여부:',
      canGo
    );
    return canGo;
  }, [availableDates, selectedDate]);

  const canGoNext = useMemo(() => {
    const currentIndex = availableDates.indexOf(selectedDate);
    const canGo = currentIndex > 0;
    console.log('canGoNext 체크 - 인덱스:', currentIndex, '가능여부:', canGo);
    return canGo;
  }, [availableDates, selectedDate]);

  const handleCategorySelect = (category: StatisticsCategory | null) => {
    setSelectedCategory(category);
  };


  // 로딩 상태
  if (isLoading) {
    return (
      <div className={`min-h-screen p-3 sm:p-4 lg:p-6 ${getThemeClass('background')}`}>
        <div className='mx-auto max-w-6xl space-y-4 sm:space-y-6'>
          {/* 메인 콘텐츠 스켈레톤 */}
          <div className='grid gap-4 sm:gap-6 lg:grid-cols-2 min-h-[500px]'>
            {/* 왼쪽: 총 작업시간 & 상위 카테고리 스켈레톤 */}
            <div className='flex flex-col space-y-3'>
              <div className='flex-shrink-0'>
                <TotalTimeCardSkeleton />
              </div>
              <div className='flex-1'>
                <StatisticsChartSkeleton />
              </div>
            </div>

            {/* 오른쪽: 차트 스켈레톤 */}
            <StatisticsChartSkeleton />
          </div>

          {/* 타임라인 차트 스켈레톤 */}
          <div className='col-span-1 lg:col-span-2'>
            <TimelineChartSkeleton />
          </div>

          {/* 시간별 사용량 비교 차트 스켈레톤 */}
          <div className='col-span-1 lg:col-span-2'>
            <HourlyUsageComparisonSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${getThemeClass('background')}`}>
        <div className='mx-auto max-w-6xl'>
          <ErrorState
            title='Unable to load statistics data'
            message={
              error?.message ||
              'A server error occurred. Please try again later.'
            }
            onRetry={refetch}
            retryText='Refresh'
            className='h-64'
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-3 sm:p-4 lg:p-6 ${getThemeClass('background')}`}>
      <div className='mx-auto max-w-6xl space-y-4 sm:space-y-6'>
        {/* 메인 콘텐츠 */}
        <div className='grid gap-4 sm:gap-6 lg:grid-cols-2 min-h-[500px]'>
          {/* 왼쪽: 총 작업시간 & 상위 카테고리 */}
          <div className='flex flex-col space-y-3'>
            {/* 작업시간 카드 - 컴팩트하게 */}
            <div className='flex-shrink-0'>
            <TotalTimeCard
              totalTime={dailyData?.totalTime || 0}
              currentDate={selectedDate}
              onPrevious={handlePreviousDate}
              onNext={handleNextDate}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
              />
            </div>

            {/* Activity 목록 */}
            <div className='flex-1'>
            <StatisticsChart
            selectedPeriod={selectedPeriod}
            data={dailyData || null}
            currentDate={selectedDate}
          />
            </div>
          </div>

          {/* 오른쪽: 차트 */}
          <ActivityList date={selectedDate} />

        </div>

        {/* 타임라인 차트 - 전체 너비 사용 */}
        <div className='col-span-1 lg:col-span-2'>
          <TimelineChart 
            timelineData={timelineData}
            isLoading={isTimelineLoading}
          />
        </div>

        {/* 시간별 사용량 비교 차트 - 전체 너비 사용 */}
        {currentUser && (
          <div className='col-span-1 lg:col-span-2'>
            <HourlyUsageComparison
              userId={currentUser?.id}
              date={selectedDate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
