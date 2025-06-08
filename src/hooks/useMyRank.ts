import { getMyRank } from '@/shared/api/get';
import { useUserStore } from '@/stores/userStore';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface UseMyRankParams {
  category: string;
  date?: string;
  enabled?: boolean;
}

export const useMyRank = ({
  category,
  date = new Date().toISOString().split('T')[0],
  enabled = true,
}: UseMyRankParams) => {
  const { currentUser } = useUserStore();

  // userId를 안정화 - 한 번 결정되면 변경되지 않도록
  const stableUserId = useMemo(() => {
    return currentUser?.id || 'a';
  }, [currentUser?.id]);

  // 디버깅용 로그
  console.log('useMyRank called with:', {
    category,
    userId: stableUserId,
    date,
    enabled,
  });

  const {
    data: myRank,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['myRank', category, stableUserId, date],
    queryFn: () => getMyRank(category, stableUserId, date),
    enabled: enabled && !!stableUserId,
    staleTime: 30000, // 30초간 캐시 유지
    refetchInterval: 60000, // 1분마다 자동 갱신
    // 중복 호출 방지
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // API 응답을 User 스토어 형태로 변환 (상태 업데이트 제거)
  const transformedUser = myRank
    ? {
        id: myRank.userId,
        nickname: myRank.nickname,
      }
    : null;

  return {
    myRank,
    transformedUser,
    rank: myRank?.rank || null,
    score: myRank?.score || null,
    isLoading,
    isError,
    error,
    refetch,
  };
};
