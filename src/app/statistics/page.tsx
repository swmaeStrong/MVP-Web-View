'use client';

import { useAvailableDates, useUsageStatistics } from '@/hooks/data/useStatistics';
import { useTheme } from '@/hooks/ui/useTheme';
import { useCurrentUser } from '@/stores/userStore';
// namespace로 변경됨
import { getDateString } from '@/utils/statisticsUtils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// 컴포넌트 임포트
import {
  StatisticsChartSkeleton,
  TotalTimeCardSkeleton
} from '@/components/common/StatisticsSkeleton';
import SessionCarousel from '@/components/statistics/CycleCarousel';
import MonthlyStreak from '@/components/statistics/MonthlyStreak';
import SessionTimelineView from '@/components/statistics/SessionTimelineView';
import StatisticsChart from '@/components/statistics/StatisticsChart';
import { useInitUser } from '@/hooks/common/useInitUser';
// generateMockCycles import 제거 - API 사용으로 대체됨
import StateDisplay from '../../components/common/StateDisplay';
import TotalTimeCard from '../../components/statistics/DateNavigationCard';
import { getKSTDateString } from '../../utils/timezone';

export default function StatisticsPage() {
  const [selectedPeriod] = useState<Statistics.PeriodType>('daily');
  // 현재 선택된 월 상태 추가
  const [currentMonth, setCurrentMonth] = useState(new Date(getKSTDateString()));
  // 가용한 날짜 목록 (최근 30일)
  const availableDates = useAvailableDates();

  // 초기 날짜 설정
  const [selectedDate, setSelectedDate] = useState(getDateString(new Date()));
  // Hook 순서를 항상 동일하게 유지
  const currentUser = useCurrentUser();
  const { initializeUser } = useInitUser();
  const { getThemeClass } = useTheme();

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

  // cycleData 제거 - SessionCarousel에서 직접 API 호출

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



  // 로딩 상태
  if (isLoading) {
    return (
      <div className={`min-h-screen p-3 sm:p-4 lg:p-6 ${getThemeClass('background')}`}>
        <div className='mx-auto max-w-6xl space-y-4 sm:space-y-6'>
          {/* 메인 콘텐츠 스켈레톤 */}
          <div className='grid gap-4 sm:gap-6 lg:grid-cols-2'>
            {/* 왼쪽: 총 작업시간 & 상위 카테고리 스켈레톤 */}
            <div className='flex flex-col space-y-3'>
              <div className='flex-shrink-0'>
                <TotalTimeCardSkeleton />
              </div>
              <div className='flex-1'>
                <StatisticsChartSkeleton />
              </div>
            </div>

            {/* 오른쪽: 월별 스트릭 컴포넌트 (스켈레톤) */}
            <div className={`h-[400px] rounded-lg border-2 shadow-sm ${getThemeClass('border')} ${getThemeClass('component')}`}>
              <div className={`h-6 w-32 m-4 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
              <div className="p-4 space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className={`h-4 w-full animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                ))}
              </div>
            </div>
          </div>

          {/* 세션 타임라인 스켈레톤 */}
          <div className={`rounded-lg border-2 shadow-sm p-6 ${getThemeClass('border')} ${getThemeClass('component')}`}>
            <div className={`h-6 w-40 mb-4 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`h-12 w-12 animate-pulse rounded-full ${getThemeClass('componentSecondary')}`}></div>
                  <div className="flex-1 space-y-2">
                    <div className={`h-4 w-32 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                    <div className={`h-3 w-24 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                  </div>
                  <div className={`h-8 w-16 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* 하단: 세션 캐러셀 스켈레톤 */}
          <div className="w-full">
            <SessionCarousel selectedDate={selectedDate} />
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
          <StateDisplay
            type="error"
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
        <TotalTimeCard
                totalTime={dailyData?.totalTime || 0}
                currentDate={selectedDate}
                onPrevious={handlePreviousDate}
                onNext={handleNextDate}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
                goalTime={8 * 3600} // 8 hours default goal
              />
        <div className='grid gap-4 sm:gap-6 lg:grid-cols-2'>
          {/* 왼쪽: 날짜 네비게이션, 목표 설정, 카테고리 분석 */}
          
              <StatisticsChart
                selectedPeriod={selectedPeriod}
                data={dailyData || null}
                currentDate={selectedDate}
              />
          {/* 오른쪽: 월별 스트릭 컴포넌트 (기존 ActivityList 위치) */}
          <MonthlyStreak 
            initialMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />

        </div>

        {/* 세션 타임라인 뷰 */}
        <SessionTimelineView selectedDate={selectedDate} />

        {/* 하단: 세션 캐러셀 (전체 너비 사용) */}
        <div className="w-full">
        </div>
      </div>

    </div>
  );
}
