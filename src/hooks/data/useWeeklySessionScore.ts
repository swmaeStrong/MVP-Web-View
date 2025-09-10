'use client';

import { getWeeklySessionScore } from '@/shared/api/get';
import { useQuery } from '@tanstack/react-query';

export const useWeeklySessionScore = (selectedDate: string) => {
  return useQuery({
    queryKey: ['weeklySessionScore', selectedDate],
    queryFn: () => getWeeklySessionScore(selectedDate),
    enabled: !!selectedDate,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    refetchOnWindowFocus: false,
  });
};