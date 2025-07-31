'use client';

import { getStreakCalendar, getStreakCount } from '@/shared/api/get';
import { useQuery } from '@tanstack/react-query';
import { streakCalendarQueryKey, streakCountQueryKey } from '@/config/constants/query-keys';

/**
 * 스트릭 캘린더 데이터를 조회하는 훅
 * @param year - 연도
 * @param month - 월 (0부터 시작)
 */
export const useStreakCalendar = (year: number, month: number) => {
  return useQuery({
    queryKey: streakCalendarQueryKey(year, month),
    queryFn: () => getStreakCalendar(),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    refetchOnWindowFocus: false,
  });
};

/**
 * 스트릭 카운트를 조회하는 훅
 */
export const useStreakCount = () => {
  return useQuery({
    queryKey: streakCountQueryKey(),
    queryFn: () => getStreakCount(),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    refetchOnWindowFocus: false,
  });
};