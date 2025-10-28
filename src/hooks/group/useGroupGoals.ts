'use client';

import { useQuery } from '@tanstack/react-query';

import { getGroupGoals } from '@/shared/api/get';

interface UseGroupGoalsOptions {
  groupId: number;
  date?: string;
  enabled?: boolean;
}

export function useGroupGoals({ groupId, date, enabled = true }: UseGroupGoalsOptions) {
  return useQuery({
    queryKey: ['groupGoals', groupId, date],
    queryFn: () => getGroupGoals(groupId, date),
    enabled: enabled && !!groupId,
    refetchInterval: 60 * 1000, // 1분마다 폴링
    refetchOnWindowFocus: false,
  });
}