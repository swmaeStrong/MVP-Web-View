'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyGroups } from '@/shared/api/get';
import { myGroupsQueryKey } from '@/config/constants/query-keys';

export function useMyGroups() {
  return useQuery({
    queryKey: myGroupsQueryKey(),
    queryFn: getMyGroups,
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh로 간주
    gcTime: 10 * 60 * 1000,   // 10분간 캐시 유지
  });
}