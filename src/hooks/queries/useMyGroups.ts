'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyGroups } from '@/shared/api/get';

export function useMyGroups() {
  return useQuery({
    queryKey: ['my-groups'],
    queryFn: getMyGroups,
  });
}