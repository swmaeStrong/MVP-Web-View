'use client';

import { useQuery } from '@tanstack/react-query';

import { getPomodoroUsageLog } from '@/shared/api/get';

export const useDailyPomodoroDetails = (selectedDate: string) => {
  return useQuery({
    queryKey: ['dailyPomodoroDetails', selectedDate],
    queryFn: () => getPomodoroUsageLog(selectedDate),
    enabled: !!selectedDate,
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
      // 다른 에러는 최대 1번 재시도
      return failureCount < 1;
    },
  });
};