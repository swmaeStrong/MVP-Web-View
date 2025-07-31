'use client';

import { useQuery } from '@tanstack/react-query';
import { getGroupDetail } from '@/shared/api/get';
import { groupDetailQueryKey } from '@/config/constants/query-keys';

interface UseGroupDetailParams {
  groupId: number;
  enabled?: boolean;
}

export function useGroupDetail({ groupId, enabled = true }: UseGroupDetailParams) {
  return useQuery({
    queryKey: groupDetailQueryKey(groupId),
    queryFn: () => getGroupDetail(groupId),
    enabled: enabled && !!groupId,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    refetchOnWindowFocus: false,
  });
}