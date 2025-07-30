/**
 * React Query 쿼리키 상수 정의
 * 
 * 쿼리키 명명 규칙:
 * 1. 기본 키는 대문자 스네이크 케이스로 정의
 * 2. 동적 매개변수를 받는 함수는 camelCase로 정의
 * 3. 쿼리키는 배열 형태로 반환하여 React Query의 키 매칭 시스템과 호환
 */

// =============================================================================
// 기본 쿼리키 상수
// =============================================================================

export const QUERY_KEYS = {
  // 리더보드 관련
  LEADERBOARD: 'leaderboard',
  
  // 사용자 관련
  MY_RANK: 'myRank',
  
  // 통계 관련
  USAGE_STATISTICS: 'usage-statistics',
  MULTI_DATE_STATISTICS: 'multi-date-statistics',
  HOURLY_USAGE: 'hourlyUsage',
} as const;

// =============================================================================
// 쿼리키 생성 함수
// =============================================================================

/**
 * 리더보드 쿼리키 생성
 * @param category - 카테고리 (예: 'Development', 'all')
 * @param period - 기간 ('daily' | 'weekly' | 'monthly')
 * @param selectedDateIndex - 선택된 날짜 인덱스
 * @param date - API 호출용 날짜 문자열
 */
export const leaderboardQueryKey = (
  category: string,
  period: 'daily' | 'weekly' | 'monthly',
  selectedDateIndex: number,
  date: string
) => [
  QUERY_KEYS.LEADERBOARD,
  category,
  period,
  selectedDateIndex,
  date,
] as const;

/**
 * 내 순위 쿼리키 생성
 * @param category - 카테고리
 * @param type - 타입 ('daily' | 'weekly' | 'monthly')
 * @param userId - 사용자 ID
 * @param date - 날짜 문자열
 */
export const myRankQueryKey = (
  category: string,
  type: 'daily' | 'weekly' | 'monthly',
  userId: string,
  date: string
) => [
  QUERY_KEYS.MY_RANK,
  category,
  type,
  userId,
  date,
] as const;

/**
 * 사용량 통계 쿼리키 생성
 * @param selectedDate - 선택된 날짜
 * @param userId - 사용자 ID
 */
export const usageStatisticsQueryKey = (
  selectedDate: string,
  userId: string
) => [
  QUERY_KEYS.USAGE_STATISTICS,
  selectedDate,
  userId,
] as const;

/**
 * 다중 날짜 통계 쿼리키 생성
 * @param dates - 날짜 배열
 * @param userId - 사용자 ID
 */
export const multiDateStatisticsQueryKey = (
  dates: string[],
  userId: string
) => [
  QUERY_KEYS.MULTI_DATE_STATISTICS,
  dates,
  userId,
] as const;

/**
 * 시간별 사용량 쿼리키 생성
 * @param date - 날짜
 * @param userId - 사용자 ID
 * @param binSize - 구간 크기
 */
export const hourlyUsageQueryKey = (
  date: string,
  userId: string,
  binSize: number
) => [
  QUERY_KEYS.HOURLY_USAGE,
  date,
  userId,
  binSize,
] as const;

// =============================================================================
// 타입 정의
// =============================================================================

/**
 * 쿼리키 타입 정의
 * 각 쿼리키 함수의 반환 타입을 명시적으로 정의
 */
export type QueryKeyTypes = {
  leaderboard: ReturnType<typeof leaderboardQueryKey>;
  myRank: ReturnType<typeof myRankQueryKey>;
  usageStatistics: ReturnType<typeof usageStatisticsQueryKey>;
  multiDateStatistics: ReturnType<typeof multiDateStatisticsQueryKey>;
  hourlyUsage: ReturnType<typeof hourlyUsageQueryKey>;
};

// =============================================================================
// 쿼리키 무효화 헬퍼
// =============================================================================

/**
 * 특정 도메인의 모든 쿼리를 무효화할 때 사용할 베이스 키들
 */
export const INVALIDATION_KEYS = {
  // 리더보드 관련 모든 쿼리 무효화
  ALL_LEADERBOARD: [QUERY_KEYS.LEADERBOARD],
  
  // 내 순위 관련 모든 쿼리 무효화
  ALL_MY_RANK: [QUERY_KEYS.MY_RANK],
  
  // 통계 관련 모든 쿼리 무효화
  ALL_STATISTICS: [QUERY_KEYS.USAGE_STATISTICS, QUERY_KEYS.MULTI_DATE_STATISTICS],
  
  // 시간별 사용량 관련 모든 쿼리 무효화
  ALL_HOURLY_USAGE: [QUERY_KEYS.HOURLY_USAGE],
} as const;