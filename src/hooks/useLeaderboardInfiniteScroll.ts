import { getLeaderBoard } from '@/shared/api/get';
import { LEADERBOARD_CATEGORIES } from '@/utils/categories';
import { useInfiniteScroll } from './useInfiniteScroll';

// User 타입은 userStore에서 import
import { User } from '@/stores/userStore';

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
  const categories = LEADERBOARD_CATEGORIES;

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
      // 월간의 경우 - 문자열로 직접 계산하여 Date 객체의 문제를 완전히 회피
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1; // 1-based month (1=January, 12=December)

      // 대상 월과 년도 계산
      let targetYear = currentYear;
      let targetMonth = currentMonth - selectedDateIndex;

      // 음수 월 처리
      while (targetMonth <= 0) {
        targetMonth += 12;
        targetYear -= 1;
      }

      // 문자열로 직접 생성 (Date 객체 사용하지 않음)
      const yearStr = targetYear.toString();
      const monthStr = targetMonth.toString().padStart(2, '0');
      const result = `${yearStr}-${monthStr}-01`;

      console.log('월간 계산:', {
        today: today.toISOString().split('T')[0],
        selectedDateIndex,
        currentYear,
        currentMonth,
        targetYear,
        targetMonth,
        result,
      });

      return result;
    }

    // 'all'인 경우 오늘 날짜 반환
    return today.toISOString().split('T')[0];
  };

  // API 데이터를 확장된 형태로 변환하는 함수 (리더보드 표시용)
  const transformAPIUser = (
    apiUser: APILeaderBoardResponse,
    index: number
  ): User & { score: number; rank: number } => ({
    id: apiUser.userId,
    nickname: apiUser.nickname,
    score: apiUser.score,
    rank: apiUser.rank,
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
