'use client';

import { otherUserInfoQueryKey } from '@/config/constants/query-keys';
import { getOtherUserInfo } from '@/shared/api/get';
import { useQuery } from '@tanstack/react-query';

interface UseOtherUserInfoOptions {
  userId: string | null;
  enabled?: boolean;
}

export function useOtherUserInfo({ userId, enabled = true }: UseOtherUserInfoOptions) {
  return useQuery({
    queryKey: otherUserInfoQueryKey(userId || ''),
    queryFn: () => getOtherUserInfo(userId!),
    enabled: enabled && !!userId,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5분 캐시
    refetchInterval: 60 * 1000, // 1분마다 폴링
    refetchOnWindowFocus: false,
  });
}