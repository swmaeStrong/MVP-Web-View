'use client';

import { useQuery } from '@tanstack/react-query';

import { getWeeklyStreak } from '@/shared/api/get';

export const useWeeklyStreak = (selectedDate: string) => {
  return useQuery({
    queryKey: ['weeklyStreak', selectedDate],
    queryFn: () => getWeeklyStreak(selectedDate),
    enabled: !!selectedDate,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    refetchOnWindowFocus: false,
  });
};