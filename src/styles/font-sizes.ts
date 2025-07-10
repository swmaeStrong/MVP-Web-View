/**
 * 통합 폰트 사이즈 상수 정의
 * 리더보드 및 전체 애플리케이션에서 사용
 */
export const FONT_SIZES = {
  // 기본 폰트 사이즈 (13px 기준)
  XS: 'text-xs',           // 12px
  SM: 'text-sm',           // 14px  
  BASE: 'text-base',       // 16px
  
  // 리더보드 전용 반응형 폰트
  LEADERBOARD: {
    PRIMARY: 'text-[15px]',      // 14px (주요 텍스트 - 13px에 가장 가까운 14px 선택)
    SECONDARY: 'text-[12px]',    // 12px (보조 텍스트)
    BUTTON: 'text-[11px]',       // 12px (버튼 텍스트)
    RANK: 'text-[15px]', // 14px -> 16px (순위 숫자)
    HEADER: 'text-[18px]',      // 24px (헤더 제목, 작은 사이즈 기준으로 통일)
    STATS_LARGE: 'text-[24px]', // 36px (통계 대형 숫자)
    STATS_MEDIUM: 'text-[18px]', // 18px (통계 중간 텍스트)
    STATS_SMALL: 'text-[12px]',  // 12px (통계 소형 텍스트)
  },
} as const;

// 타입 정의
export type FontSize = typeof FONT_SIZES;