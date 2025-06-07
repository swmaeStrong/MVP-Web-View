import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

interface UseInfiniteScrollOptions<T> {
  queryKey: unknown[];
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<T[]>;
  getNextPageParam?: (lastPage: T[], allPages: T[][]) => number | undefined;
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
}

interface UseInfiniteScrollReturn<T> {
  data: T[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
}

export function useInfiniteScroll<T>({
  queryKey,
  queryFn,
  getNextPageParam = (lastPage, allPages) =>
    lastPage.length > 0 ? allPages.length + 1 : undefined,
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5분
  refetchOnWindowFocus = false,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn,
    getNextPageParam,
    enabled,
    staleTime,
    refetchOnWindowFocus,
    initialPageParam: 1,
    retry: (failureCount, error) => {
      // 무한 스크롤에서는 더 보수적으로 재시도
      console.warn(`무한 스크롤 에러 (${failureCount}번째):`, error);
      return failureCount < 1; // 1번만 재시도
    },
    retryDelay: 2000, // 2초 대기
  });

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 1000 &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isError // 에러가 발생했으면 스크롤 로딩을 중단
    ) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, isError, fetchNextPage]);

  // 스크롤 이벤트 리스너 등록/해제
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // 모든 페이지의 데이터를 하나의 배열로 평탄화
  const flattenedData = data?.pages.flat() ?? [];

  return {
    data: flattenedData,
    isLoading,
    isError,
    error: error as Error | null,
    isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    fetchNextPage,
    refetch,
  };
}
