'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyGroups } from '@/shared/api/get';
import { myGroupsQueryKey } from '@/config/constants/query-keys';

export function useMyGroups() {
  return useQuery({
    queryKey: myGroupsQueryKey(),
    queryFn: getMyGroups,
  });
}