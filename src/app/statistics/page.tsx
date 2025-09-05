'use client';

import { canNavigateToNext, canNavigateToPrevious, getNextDate, getPreviousDate, useUsageStatistics } from '@/hooks/data/useStatistics';
import { useTheme } from '@/hooks/ui/useTheme';
import { useCurrentUserData } from '@/hooks/user/useCurrentUser';
// namespace로 변경됨
import { getKSTDateString } from '@/utils/timezone';
import React, { useCallback, useMemo, useState } from 'react';

// 컴포넌트 임포트
import SessionTimelineView from '@/components/statistics/SessionTimelineView';
import StatisticsChart from '@/components/statistics/StatisticsChart';
import WeeklyStreak from '@/components/statistics/WeeklyStreak';
// generateMockCycles import 제거 - API 사용으로 대체됨
import StateDisplay from '../../components/common/StateDisplay';
import TotalTimeCard from '../../components/statistics/DateNavigationCard';
import MonthlyStreak from '../../components/statistics/MonthlyStreak';

export default function StatisticsPage() {
  const [selectedPeriod] = useState<Statistics.PeriodType>('daily');
  // 현재 선택된 월 상태 추가
  const [currentMonth, setCurrentMonth] = useState(new Date(getKSTDateString()));
  // 날짜 제한 로직으로 변경 - 배열 생성 대신 상수 기반 체크

  // 초기 날짜 설정 (한국 시간대 기준)
  const [selectedDate, setSelectedDate] = useState(getKSTDateString());
  // Hook 순서를 항상 동일하게 유지
  const currentUser = useCurrentUserData();
  const { getThemeClass } = useTheme();
  const [selectedStreak, setSelectedStreak] = useState<'weekly' | 'monthly'>('weekly');

  
  // 선택된 날짜의 통계 데이터 조회
  const {
    data: dailyData,
    isLoading,
    isError,
    error,
    refetch,
  } = useUsageStatistics(selectedDate, currentUser?.id || '');

  // cycleData 제거 - SessionCarousel에서 직접 API 호출

  // 초기 날짜를 오늘 날짜로 설정
  React.useEffect(() => {
    // 이미 오늘 날짜로 초기화되어 있으므로 별도 처리 불필요
    console.log('Statistics 페이지 - 선택된 날짜:', selectedDate);
  }, [selectedDate]);


  const handlePreviousDate = useCallback(() => {
    const previousDate = getPreviousDate(selectedDate);
    if (previousDate) {
      console.log('이전 날짜로 변경:', previousDate);
      setSelectedDate(previousDate);
    } else {
      console.log('이전 날짜로 갈 수 없음 - 제한 날짜에 도달');
    }
  }, [selectedDate]);

  const handleNextDate = useCallback(() => {
    const nextDate = getNextDate(selectedDate);
    if (nextDate) {
      console.log('다음 날짜로 변경:', nextDate);
      setSelectedDate(nextDate);
    } else {
      console.log('다음 날짜로 갈 수 없음 - 오늘 날짜에 도달');
    }
  }, [selectedDate]);

  const canGoPrevious = useMemo(() => {
    const canGo = canNavigateToPrevious(selectedDate);
    console.log('canGoPrevious 체크 - 날짜:', selectedDate, '가능여부:', canGo);
    return canGo;
  }, [selectedDate]);

  const canGoNext = useMemo(() => {
    const canGo = canNavigateToNext(selectedDate);
    console.log('canGoNext 체크 - 날짜:', selectedDate, '가능여부:', canGo);
    return canGo;
  }, [selectedDate]);



  // 메인 렌더링 로직에서 스켈레톤은 각 컴포넌트에서 처리

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
      <div className='mx-auto space-y-4 sm:space-y-6'>
        {/* 메인 콘텐츠 */}
        <TotalTimeCard
                currentDate={selectedDate}
                onPrevious={handlePreviousDate}
                onNext={handleNextDate}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
              />
        <div className='grid gap-4 sm:gap-6 lg:grid-cols-2'>
          {/* 왼쪽: 날짜 네비게이션, 목표 설정, 카테고리 분석 */}
          
              <StatisticsChart
                currentDate={selectedDate}
              />
          {/* 오른쪽: 주별 스트릭 컴포넌트 (기존 ActivityList 위치) */}

          {selectedStreak === 'weekly' && <WeeklyStreak initialMonth={currentMonth} onMonthChange={setCurrentMonth} changeStreak={setSelectedStreak}/>}
          {selectedStreak === 'monthly' && <MonthlyStreak initialMonth={currentMonth} onMonthChange={setCurrentMonth} changeStreak={setSelectedStreak}/>}
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
