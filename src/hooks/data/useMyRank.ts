import { getMyRank } from '@/shared/api/get';
import { useUserStore } from '@/stores/userStore';
import { getKSTDateString } from '@/utils/timezone';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { myRankQueryKey } from '@/config/constants/query-keys';

interface UseMyRankParams {
  category: string;
  type: 'daily' | 'weekly' | 'monthly'; // type 파라미터 추가
  date?: string;
  enabled?: boolean;
  userId?: string; // 외부에서 userId를 받을 수 있도록
}

export const useMyRank = ({
  category,
  type,
  date = getKSTDateString(),
  enabled = true,
  userId: propUserId,
}: UseMyRankParams) => {
  const { currentUser } = useUserStore();

  // props로 받은 userId가 있으면 사용, 없으면 전역 상태 또는 기본값 사용
  const finalUserId = useMemo(() => {
    const userId = propUserId || currentUser?.id || '';
    console.log('🔧 useMyRank - userId 결정:', {
      propUserId,
      currentUserId: currentUser?.id,
      finalUserId: userId,
    });
    return userId;
  }, [propUserId, currentUser?.id]);

  // 현재 상태 로그
  console.log('🔍 useMyRank 호출:', {
    category,
    type,
    finalUserId,
    currentUserId: currentUser?.id,
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
    queryKey: myRankQueryKey(category, type, finalUserId, date),
    queryFn: () => getMyRank(category, finalUserId, type, date),
    enabled: enabled && !!finalUserId,
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
