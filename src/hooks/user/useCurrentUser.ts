import { useQuery } from '@tanstack/react-query';
import { currentUserQueryKey } from '@/config/constants/query-keys';
import { getUserInfo } from '@/shared/api/get';

/**
 * 현재 사용자 정보를 가져오는 React Query 훅
 * 
 * @returns 현재 사용자 정보와 관련 상태
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey(),
    queryFn: async () => {
      const userInfo = await getUserInfo();
      
      if (!userInfo || !userInfo.userId || !userInfo.nickname) {
        throw new Error('Invalid user info received');
      }
      
      return {
        id: userInfo.userId,
        nickname: userInfo.nickname,
      };
    },
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    gcTime: 1000 * 60 * 30, // 30분간 캐시 유지 (구 cacheTime)
    retry: (failureCount, error) => {
      // 인증 오류는 재시도하지 않음
      if (error?.message?.includes('401') || error?.message?.includes('unauthorized')) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 refetch 비활성화
  });
}

/**
 * 현재 사용자 정보만 반환하는 헬퍼 훅 (기존 Zustand 인터페이스와 호환)
 * 
 * @returns 현재 사용자 정보 또는 null
 */
export function useCurrentUserData() {
  const { data } = useCurrentUser();
  return data || null;
}