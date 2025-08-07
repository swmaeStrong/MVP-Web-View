'use client';

import { groupDetailQueryKey } from '@/config/constants/query-keys';
import { getGroupDetail } from '@/shared/api/get';
import { useQuery } from '@tanstack/react-query';

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
    refetchInterval: 60 * 1000, // 1분마다 폴링
  });
}