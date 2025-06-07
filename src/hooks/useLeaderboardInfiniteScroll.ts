import { getLeaderBoard } from '@/shared/api/get';
import { useInfiniteScroll } from './useInfiniteScroll';

interface User {
  id: number;
  name: string;
  hours: number;
  avatar: string;
  isMe: boolean;
  category: string;
  trend: 'up' | 'down' | 'same';
  streak: number;
  todayGain: number;
  level: number;
}

type APILeaderBoardResponse = LeaderBoard.LeaderBoardResponse;

interface UseLeaderboardInfiniteScrollParams {
  category: string;
  period: 'daily' | 'weekly' | 'monthly';
  selectedDateIndex: number;
}

export function useLeaderboardInfiniteScroll({
  category,
  period,
  selectedDateIndex,
}: UseLeaderboardInfiniteScrollParams) {
  const categories = [
    'DEVELOPMENT',
    'LLM',
    'Documentation',
    'Design',
    'Communication',
    'YouTube',
    'SNS',
    'Uncategorized',
  ];

  // 선택된 날짜 인덱스를 기반으로 실제 날짜 계산
  const getDateForAPI = () => {
    const today = new Date();

    if (period === 'daily') {
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() - selectedDateIndex);
      return targetDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
    } else if (period === 'weekly') {
      const targetDate = new Date(today);
      // 주간의 경우 해당 주의 시작일 (월요일)을 계산
      targetDate.setDate(
        targetDate.getDate() - selectedDateIndex * 7 - targetDate.getDay() + 1
      );
      return targetDate.toISOString().split('T')[0];
    } else if (period === 'monthly') {
      const targetDate = new Date(today);
      // 월간의 경우 해당 월의 첫째 날을 계산
      targetDate.setMonth(targetDate.getMonth() - selectedDateIndex);
      targetDate.setDate(1);
      return targetDate.toISOString().split('T')[0];
    }

    // 'all'인 경우 오늘 날짜 반환
    return today.toISOString().split('T')[0];
  };

  // API 데이터를 User 형태로 변환하는 함수
  const transformAPIUser = (
    apiUser: APILeaderBoardResponse,
    index: number
  ): User => ({
    id: parseInt(apiUser.userId),
    name: apiUser.nickname,
    hours: apiUser.score,
    avatar: String.fromCharCode(65 + (index % 26)), // A~Z 순환
    isMe: false, // API에서 현재 사용자 정보를 제공하면 수정
    category:
      category === 'all'
        ? categories[Math.floor(Math.random() * (categories.length - 1)) + 1]
        : category, // 카테고리는 요청 파라미터에서 결정
    trend: 'same' as const, // API에서 트렌드 정보를 제공하면 수정
    streak: Math.floor(Math.random() * 30) + 1, // API에서 연속 일수를 제공하면 수정
    todayGain: Math.floor(Math.random() * 8) + 1, // API에서 오늘 증가량을 제공하면 수정
    level: Math.floor(apiUser.score / 10) + 1, // 점수 기반으로 레벨 계산
  });

  const queryFn = async ({ pageParam }: { pageParam: number }) => {
    const categoryParam = category === 'all' ? 'all' : category;
    const apiType =
      period === 'daily'
        ? 'daily'
        : period === 'weekly'
          ? 'weekly'
          : period === 'monthly'
            ? 'monthly'
            : 'all';
    const dateParam = getDateForAPI();

    console.log(
      `페칭 - 카테고리: ${categoryParam}, 타입: ${apiType}, 페이지: ${pageParam}, 날짜: ${dateParam}`
    );

    try {
      const response = await getLeaderBoard(
        categoryParam,
        apiType,
        pageParam,
        10,
        dateParam
      );

      console.log(`응답 받음 - 페이지 ${pageParam}:`, response);

      if (response && Array.isArray(response)) {
        return response.map((apiUser, index) =>
          transformAPIUser(apiUser, (pageParam - 1) * 10 + index)
        );
      }

      return [];
    } catch (error) {
      console.error(`리더보드 API 에러 - 페이지 ${pageParam}:`, error);
      throw error; // React Query가 에러를 처리하도록 다시 던짐
    }
  };

  const {
    data: users,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteScroll<User>({
    queryKey: [
      'leaderboard',
      category,
      period,
      selectedDateIndex,
      getDateForAPI(),
    ],
    queryFn,
    getNextPageParam: (lastPage, allPages) => {
      // 마지막 페이지에 데이터가 10개 미만이면 더 이상 페이지가 없음
      if (lastPage.length < 10) {
        console.log(`페이지 끝 도달 - 마지막 페이지 크기: ${lastPage.length}`);
        return undefined;
      }
      return allPages.length + 1;
    },
    enabled: true,
    staleTime: 2 * 60 * 1000, // 2분
  });

  return {
    users,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  };
}
