import { useQuery } from '@tanstack/react-query';
import { searchGroups } from '@/shared/api/get';

export const useSearchGroups = () => {
  return useQuery({
    queryKey: ['groups', 'search'],
    queryFn: searchGroups,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};