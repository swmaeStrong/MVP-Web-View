'use client';

import { useQuery } from '@tanstack/react-query';

import { getGroupLeaderboard } from '@/shared/api/get';

interface UseGroupLeaderboardOptions {
  groupId: number;
  period: 'DAILY' | 'WEEKLY';
  selectedDate: string;
  enabled?: boolean;
}

export function useGroupLeaderboard({ 
  groupId, 
  period,
  selectedDate, 
  enabled = true 
}: UseGroupLeaderboardOptions) {
  return useQuery({
    queryKey: ['groupLeaderboard', groupId, period, selectedDate],
    queryFn: () => getGroupLeaderboard(groupId, period, selectedDate),
    enabled: enabled && !!groupId,
    retry: 1,
    refetchInterval: 60 * 1000, // 1분마다 폴링
    refetchOnWindowFocus: false,
  });
}