'use client';

import { getHourlyUsageLog } from '@/shared/api/get';
import { useQuery } from '@tanstack/react-query';

export const useHourlyUsage = (
  date: string,
  userId: string,
  binSize: number
) => {
  return useQuery({
    queryKey: ['hourlyUsage', date, userId, binSize],
    queryFn: () => getHourlyUsageLog(date, userId, binSize),
    enabled: !!userId && !!date,
  });
};
