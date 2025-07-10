import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { INFINITE_SCROLL_CONFIG } from '@/shared/constants/infinite-scroll';

interface UseInfiniteScrollOptions<T> {
  queryKey: unknown[];
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<T[]>;
  getNextPageParam?: (lastPage: T[], allPages: T[][]) => number | undefined;
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  initialPageParam?: number; // 초기 페이지 번호 추가
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
  staleTime = INFINITE_SCROLL_CONFIG.STALE_TIME,
  refetchOnWindowFocus = false,
  containerRef,
  initialPageParam = INFINITE_SCROLL_CONFIG.INITIAL_PAGE,
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
    initialPageParam,
    retry: (failureCount, error) => {
      // 무한 스크롤에서는 더 보수적으로 재시도
      console.warn(`무한 스크롤 에러 (${failureCount}번째):`, error);
      return failureCount < INFINITE_SCROLL_CONFIG.MAX_RETRY_COUNT;
    },
    retryDelay: INFINITE_SCROLL_CONFIG.RETRY_DELAY,
  });

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || isError) return;

    if (containerRef?.current) {
      // 컨테이너 스크롤
      const container = containerRef.current;
      const threshold = INFINITE_SCROLL_CONFIG.SCROLL_THRESHOLD;
      
      console.log('컨테이너 스크롤 감지:', {
        scrollTop: container.scrollTop,
        clientHeight: container.clientHeight,
        scrollHeight: container.scrollHeight,
        threshold,
        shouldFetch: container.scrollTop + container.clientHeight >= container.scrollHeight - threshold
      });
      
      if (
        container.scrollTop + container.clientHeight >= 
        container.scrollHeight - threshold
      ) {
        console.log('다음 페이지 로드 요청');
        fetchNextPage();
      }
    } else {
      // 윈도우 스크롤 (기존 로직)
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - INFINITE_SCROLL_CONFIG.WINDOW_SCROLL_THRESHOLD
      ) {
        fetchNextPage();
      }
    }
  }, [hasNextPage, isFetchingNextPage, isError, fetchNextPage, containerRef]);

  // 스크롤 이벤트 리스너 등록/해제
  useEffect(() => {
    const container = containerRef?.current;
    
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, containerRef]);

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
