import { getLeaderBoard } from '@/shared/api/get';
import { LEADERBOARD_CATEGORIES } from '@/utils/categories';
import {
  getKSTDate,
  getKSTDateStringFromDate,
  getKSTMonthlyDateString,
  getKSTWeeklyDateString,
} from '@/utils/timezone';
import { useInfiniteScroll } from './useInfiniteScroll';
import { INFINITE_SCROLL_CONFIG } from '@/shared/constants/infinite-scroll';

// User 타입은 userStore에서 import
import { User } from '@/stores/userStore';

type APILeaderBoardResponse = LeaderBoard.LeaderBoardApiResponse;

interface UseLeaderboardInfiniteScrollParams {
  category: string;
  period: 'daily' | 'weekly' | 'monthly';
  selectedDateIndex: number;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export function useLeaderboardInfiniteScroll({
  category,
  period,
  selectedDateIndex,
  containerRef,
}: UseLeaderboardInfiniteScrollParams) {
  const categories = LEADERBOARD_CATEGORIES;

  // 선택된 날짜 인덱스를 기반으로 실제 날짜 계산 (한국 시간대 기준)
  const getDateForAPI = () => {
    const today = getKSTDate();

    if (period === 'daily') {
      // 일간: selectedDateIndex에 따라 과거 날짜로
      const targetDate = new Date(
        today.getTime() - selectedDateIndex * INFINITE_SCROLL_CONFIG.TIME_CONSTANTS.MILLISECONDS_PER_DAY
      );
      return getKSTDateStringFromDate(targetDate);
    } else if (period === 'weekly') {
      // 주간: 월요일-일요일 기준으로 해당 주의 월요일 날짜
      return getKSTWeeklyDateString(selectedDateIndex);
    } else if (period === 'monthly') {
      // 월간의 경우 - 해당 월의 1일로 조회
      return getKSTMonthlyDateString(selectedDateIndex);
    }

    // 기본값으로 오늘 날짜 반환 (이 경우는 발생하지 않아야 함)
    return getKSTDateStringFromDate(today);
  };

  // API 데이터를 확장된 형태로 변환하는 함수 (리더보드 표시용)
  const transformAPIUser = (
    apiUser: APILeaderBoardResponse,
    index: number
  ): LeaderBoard.LeaderBoardApiResponse & { id?: string } => ({
    ...apiUser,
    id: apiUser.userId,
  });

  const queryFn = async ({ pageParam }: { pageParam: number }) => {
    const categoryParam = category === 'all' ? 'all' : category;
    const apiType: 'daily' | 'weekly' | 'monthly' = period;
    const dateParam = getDateForAPI();

    console.log(
      `페칭 - 카테고리: ${categoryParam}, 타입: ${apiType}, 페이지: ${pageParam}, 날짜: ${dateParam}`
    );

    try {
      const response = await getLeaderBoard(
        categoryParam,
        apiType,
        pageParam,
        INFINITE_SCROLL_CONFIG.ITEMS_PER_PAGE,
        dateParam
      );

      console.log(`응답 받음 - 페이지 ${pageParam}:`, response);

      if (response && Array.isArray(response)) {
        return response.map((apiUser, index) =>
          transformAPIUser(apiUser, (pageParam - 1) * INFINITE_SCROLL_CONFIG.ITEMS_PER_PAGE + index)
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
  } = useInfiniteScroll<LeaderBoard.LeaderBoardApiResponse & { id?: string }>({
    queryKey: [
      'leaderboard',
      category,
      period,
      selectedDateIndex,
      getDateForAPI(),
    ],
    queryFn,
    getNextPageParam: (lastPage, allPages) => {
      console.log('getNextPageParam 호출:', {
        lastPageLength: lastPage.length,
        totalPages: allPages.length,
        itemsPerPage: INFINITE_SCROLL_CONFIG.ITEMS_PER_PAGE
      });
      
      // 마지막 페이지에 데이터가 ITEMS_PER_PAGE 미만이면 더 이상 페이지가 없음
      if (lastPage.length < INFINITE_SCROLL_CONFIG.ITEMS_PER_PAGE) {
        console.log(`페이지 끝 도달 - 마지막 페이지 크기: ${lastPage.length}`);
        return undefined;
      }
      
      const nextPage = allPages.length + 1;
      console.log(`다음 페이지: ${nextPage}`);
      return nextPage;
    },
    enabled: true,
    staleTime: INFINITE_SCROLL_CONFIG.LEADERBOARD_STALE_TIME,
    containerRef,
    initialPageParam: INFINITE_SCROLL_CONFIG.INITIAL_PAGE,
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
