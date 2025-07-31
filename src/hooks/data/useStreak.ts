'use client';

import { streakCalendarQueryKey, streakCountQueryKey } from '@/config/constants/query-keys';
import { getStreakCalendar, getStreakCount } from '@/shared/api/get';
import { useQuery } from '@tanstack/react-query';
import { getKSTFirstDayOfMonth } from '../../utils/timezone';

/**
 * 스트릭 캘린더 데이터를 조회하는 훅
 * @param year - 연도
 * @param month - 월 (0부터 시작)
 */
export const useStreakCalendar = (year: number, month: number) => {
  return useQuery({
    queryKey: streakCalendarQueryKey(year, month),
    queryFn: () => {
      // 해당 월의 첫 번째 날을 API 호출 파라미터로 사용
      return getStreakCalendar(getKSTFirstDayOfMonth(year, month));
    },
    enabled: !!(year && month !== undefined), // month는 0일 수 있으므로 undefined 체크
    retry: 1,
    staleTime: 0, // 캐시 제거 - 항상 새로운 데이터 페칭
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