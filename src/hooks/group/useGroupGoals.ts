'use client';

import { getGroupGoals } from '@/shared/api/get';
import { useQuery } from '@tanstack/react-query';

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
  });
}