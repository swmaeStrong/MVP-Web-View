import { useQuery } from '@tanstack/react-query';

import { groupSearchQueryKey } from '@/config/constants/query-keys';
import { searchGroups } from '@/shared/api/get';

export const useSearchGroups = () => {
  return useQuery({
    queryKey: groupSearchQueryKey(),
    queryFn: searchGroups,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: 60 * 1000, // 1분마다 폴링
  });
};