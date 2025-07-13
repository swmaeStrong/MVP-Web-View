/**
 * 무한 스크롤 관련 상수 정의
 */
export const INFINITE_SCROLL_CONFIG = {
  // 페이지당 아이템 수
  ITEMS_PER_PAGE: 10,
  
  // 스크롤 감지 임계값 (px)
  SCROLL_THRESHOLD: 200,
  
  // 윈도우 스크롤 임계값 (px)
  WINDOW_SCROLL_THRESHOLD: 1000,
  
  // 재시도 관련 설정
  MAX_RETRY_COUNT: 1,
  RETRY_DELAY: 2000, // 2초
  
  // 캐시 설정
  STALE_TIME: 5 * 60 * 1000, // 5분
  LEADERBOARD_STALE_TIME: 2 * 60 * 1000, // 2분
  
  // 기본 페이지 설정
  INITIAL_PAGE: 1,
  
  // 시간 관련 상수
  TIME_CONSTANTS: {
    MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000,
  },
} as const;

/**
 * 리더보드 관련 상수
 */
export const LEADERBOARD_CONFIG = {
  // 컨테이너 높이 (통일된 크기)
  CONTAINER_HEIGHT: {
    MOBILE: 550, // px
    DESKTOP: 550, // px
  },
  
  // 스켈레톤 로딩 아이템 수
  SKELETON_ITEM_COUNT: 12, // 15 -> 12
  
  // 스페이싱 (스크롤 가능하도록 조정)
  SPACING: {
    LIST_ITEM_MOBILE: 2, // space-y-2
    LIST_ITEM_DESKTOP: 3, // space-y-3
    LOADING_INDICATOR_MARGIN: 4, // mt-4, mb-4
  },
  
} as const;