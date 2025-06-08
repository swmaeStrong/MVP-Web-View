'use client';

import { getUsageLog } from '@/shared/api/get';
import {
  getDateString,
  transformUsageLogToDaily,
} from '@/utils/statisticsUtils';
import { useQuery } from '@tanstack/react-query';

// 특정 날짜의 사용 기록 조회 (현재는 전체 조회만 가능)
export const useUsageStatistics = (selectedDate: string) => {
  return useQuery({
    queryKey: ['usage-statistics', selectedDate],
    queryFn: async () => {
      const usageData = await getUsageLog(selectedDate);

      // API에서 받은 데이터를 DailyStatistics로 변환
      return transformUsageLogToDaily(usageData, selectedDate);
    },
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

// 여러 날짜의 데이터를 조회하는 훅 (향후 주별/월별 구현용)
export const useMultiDateStatistics = (dates: string[]) => {
  return useQuery({
    queryKey: ['multi-date-statistics', dates],
    queryFn: async () => {
      // 현재는 단일 API만 있어서 같은 데이터를 반환
      // 향후 날짜별 API가 추가되면 수정 필요
      const usageData = await getUsageLog();

      // 각 날짜별로 데이터 생성 (현재는 동일한 데이터)
      return dates.map(date => transformUsageLogToDaily(usageData, date));
    },
    enabled: dates.length > 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

import { getKSTDate } from '@/utils/timezone';

// 가용한 날짜 목록 생성 (최근 30일 - 한국 시간대 기준)
export const useAvailableDates = () => {
  const dates: string[] = [];
  const today = getKSTDate();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    dates.push(getDateString(date));
  }

  // 디버깅용 로그
  console.log(
    'useAvailableDates - 생성된 날짜 배열:',
    dates.slice(0, 5),
    '...(총',
    dates.length,
    '개)'
  );
  console.log('useAvailableDates - 오늘 날짜:', dates[0]);

  return dates;
};
