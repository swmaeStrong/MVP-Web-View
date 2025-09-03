'use client';

import { getSession, getSessionDetail } from '@/shared/api/get';
import { useQuery } from '@tanstack/react-query';
import { sessionsQueryKey, sessionDetailQueryKey } from '@/config/constants/query-keys';

/**
 * 세션 목록을 조회하는 훅
 * @param selectedDate - 조회할 날짜
 */
export const useSessions = (selectedDate: string) => {
  return useQuery({
    queryKey: sessionsQueryKey(selectedDate),
    queryFn: () => getSession(selectedDate),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    refetchOnWindowFocus: false,
  });
};

/**
 * 세션 상세 정보를 조회하는 훅
 * @param sessionId - 세션 ID
 * @param selectedDate - 선택된 날짜
 */
export const useSessionDetail = (sessionId: number | undefined, selectedDate: string) => {
  return useQuery({
    queryKey: sessionDetailQueryKey(sessionId, selectedDate),
    queryFn: () => sessionId ? getSessionDetail(sessionId, selectedDate) : Promise.resolve(undefined),
    enabled: Boolean(sessionId),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    refetchOnWindowFocus: false,
  });
};