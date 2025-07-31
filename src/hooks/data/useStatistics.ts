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

import { getKSTDateString, getKSTDateStringDaysAgo } from '@/utils/timezone';
import { DATE_LIMITS } from '@/config/constants/date-limits';

// 날짜 네비게이션 유틸리티 함수들 (한국 시간대 기준)
export const isDateBeforeLimit = (dateString: string): boolean => {
  const result = dateString < DATE_LIMITS.MIN_DATE;
  console.log(`isDateBeforeLimit: ${dateString} < ${DATE_LIMITS.MIN_DATE} = ${result}`);
  return result;
};

export const isDateAfterToday = (dateString: string): boolean => {
  const todayKST = getKSTDateString();
  const result = dateString > todayKST;
  console.log(`isDateAfterToday: ${dateString} > ${todayKST} = ${result}`);
  return result;
};

export const getPreviousDate = (dateString: string): string | null => {
  // 날짜 문자열을 UTC 기준으로 파싱하여 하루 전 날짜 계산
  const [year, month, day] = dateString.split('-').map(Number);
  const currentDate = new Date(year, month - 1, day); // month는 0-based
  const previousDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
  
  const previousYear = previousDate.getFullYear();
  const previousMonth = String(previousDate.getMonth() + 1).padStart(2, '0');
  const previousDay = String(previousDate.getDate()).padStart(2, '0');
  const previousDateString = `${previousYear}-${previousMonth}-${previousDay}`;
  
  if (isDateBeforeLimit(previousDateString)) {
    return null;
  }
  
  return previousDateString;
};

export const getNextDate = (dateString: string): string | null => {
  // 날짜 문자열을 UTC 기준으로 파싱하여 하루 뒤 날짜 계산
  const [year, month, day] = dateString.split('-').map(Number);
  const currentDate = new Date(year, month - 1, day); // month는 0-based
  const nextDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  
  const nextYear = nextDate.getFullYear();
  const nextMonth = String(nextDate.getMonth() + 1).padStart(2, '0');
  const nextDay = String(nextDate.getDate()).padStart(2, '0');
  const nextDateString = `${nextYear}-${nextMonth}-${nextDay}`;
  
  if (isDateAfterToday(nextDateString)) {
    return null;
  }
  
  return nextDateString;
};

// 날짜 네비게이션 가능 여부 체크
export const canNavigateToPrevious = (currentDate: string): boolean => {
  return getPreviousDate(currentDate) !== null;
};

export const canNavigateToNext = (currentDate: string): boolean => {
  return getNextDate(currentDate) !== null;
};
