'use client';

import { getHourlyUsageLog } from '@/shared/api/get';
import { useQuery } from '@tanstack/react-query';
import { hourlyUsageQueryKey } from '@/config/constants/query-keys';

export const useHourlyUsage = (
  date: string,
  userId: string,
  binSize: number
) => {
  return useQuery({
    queryKey: hourlyUsageQueryKey(date, userId, binSize),
    queryFn: () => getHourlyUsageLog(date, userId, binSize),
    enabled: !!userId && !!date,
  });
};
