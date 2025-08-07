'use client';

import { getGroupLeaderboard } from '@/shared/api/get';
import { useQuery } from '@tanstack/react-query';

interface UseGroupLeaderboardOptions {
  groupId: number;
  selectedDate: string;
  enabled?: boolean;
}

export function useGroupLeaderboard({ 
  groupId, 
  selectedDate, 
  enabled = true 
}: UseGroupLeaderboardOptions) {
  return useQuery({
    queryKey: ['groupLeaderboard', groupId, selectedDate],
    queryFn: () => getGroupLeaderboard(groupId, selectedDate),
    enabled: enabled && !!groupId,
    retry: 1,
    refetchInterval: 60 * 1000, // 1분마다 폴링
    refetchOnWindowFocus: false,
  });
}