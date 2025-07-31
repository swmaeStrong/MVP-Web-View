'use client';

import { getUsageLog, getPomodoroUsageLog } from '@/shared/api/get';
import {
  getDateString,
  transformUsageLogToDaily,
} from '@/utils/statisticsUtils';
import { useQuery } from '@tanstack/react-query';
import { usageStatisticsQueryKey, multiDateStatisticsQueryKey } from '@/config/constants/query-keys';

// 특정 날짜의 사용 기록 조회 (userId 파라미터 추가)
export const useUsageStatistics = (selectedDate: string, userId: string) => {
  return useQuery({
    queryKey: usageStatisticsQueryKey(selectedDate, userId),
    queryFn: async () => {
      const usageData = await getPomodoroUsageLog(userId, selectedDate);

      // API에서 받은 데이터를 DailyStatistics로 변환
      return transformUsageLogToDaily(usageData, selectedDate);
    },
    enabled: !!userId && !!selectedDate,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // 401, 403, 404 에러는 재시도하지 않음
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as any).status;
        if ([401, 403, 404].includes(status)) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });
};

// 여러 날짜의 데이터를 조회하는 훅 (userId 파라미터 추가)
export const useMultiDateStatistics = (dates: string[], userId: string) => {
  return useQuery({
    queryKey: multiDateStatisticsQueryKey(dates, userId),
    queryFn: async () => {
      // 현재는 단일 API만 있어서 같은 데이터를 반환
      // 향후 날짜별 API가 추가되면 수정 필요
      const usageData = await getPomodoroUsageLog(userId, dates[0] || '');

      // 각 날짜별로 데이터 생성 (현재는 동일한 데이터)
      return dates.map(date => transformUsageLogToDaily(usageData, date));
    },
    enabled: dates.length > 0 && !!userId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

import { getKSTDate, getKSTDateStringFromDate } from '@/utils/timezone';
import { useMemo } from 'react';

// 가용한 날짜 목록 생성 (2025년 7월 31일부터 오늘까지만 - 한국 시간대 기준)
export const useAvailableDates = () => {
  return useMemo(() => {
    const dates: string[] = [];
    
    // 한국 시간대 기준 오늘 날짜
    const todayKST = getKSTDate();
    const todayDateString = getKSTDateStringFromDate(todayKST);
    
    // 2025년 7월 31일을 최소 날짜로 설정 (한국 시간대)
    const minDateString = '2025-07-31';
    
    // 오늘부터 시작해서 최소 날짜까지 날짜 문자열 생성
    let currentDateString = todayDateString;
    while (currentDateString >= minDateString) {
      dates.push(currentDateString);
      
      // 하루 전 날짜 계산 (한국 시간대 기준)
      const currentDate = new Date(currentDateString + 'T00:00:00+09:00');
      const previousDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      currentDateString = getKSTDateStringFromDate(previousDate);
    }

    // 디버깅용 로그
    console.log(
      'useAvailableDates - 한국 시간대 기준 생성된 날짜 배열:',
      dates.slice(0, 5),
      '...(총',
      dates.length,
      '개)'
    );
    console.log('useAvailableDates - 오늘 날짜 (KST):', dates[0]);
    console.log('useAvailableDates - 최소 날짜 (마지막):', dates[dates.length - 1]);
    console.log('useAvailableDates - 제한 날짜:', minDateString);

    return dates;
  }, []); // 의존성이 없으므로 컴포넌트 생명주기 동안 한 번만 계산
};
