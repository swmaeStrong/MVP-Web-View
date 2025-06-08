import { getMyRank } from '@/shared/api/get';
import { useUserStore } from '@/stores/userStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

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
  const { currentUser, setCurrentUser } = useUserStore();

  // 임시로 하드코딩된 userId 사용 (실제 구현에서는 인증 시스템에서 가져와야 함)
  const userId = currentUser?.id || 'a';

  const {
    data: myRank,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['myRank', category, userId, date],
    queryFn: () => getMyRank(category, userId, date),
    enabled: enabled && !!userId,
    staleTime: 30000, // 30초간 캐시 유지
    refetchInterval: 60000, // 1분마다 자동 갱신
  });

  // API 응답을 User 스토어 형태로 변환
  const transformedUser = myRank
    ? {
        id: myRank.userId,
        nickname: myRank.nickname,
      }
    : null;

  // 현재 유저 정보가 없을 때 API 응답으로 설정
  useEffect(() => {
    if (transformedUser && !currentUser) {
      setCurrentUser(transformedUser);
    }
  }, [transformedUser, currentUser]); // setCurrentUser는 안정적이므로 의존성에서 제거

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
