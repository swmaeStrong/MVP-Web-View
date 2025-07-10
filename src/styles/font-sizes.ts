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
    PRIMARY: 'text-sm',      // 14px (주요 텍스트 - 13px에 가장 가까운 14px 선택)
    SECONDARY: 'text-xs',    // 12px (보조 텍스트)
    BUTTON: 'text-xs',       // 12px (버튼 텍스트)
    RANK: 'text-sm lg:text-base', // 14px -> 16px (순위 숫자)
  },
} as const;

// 타입 정의
export type FontSize = typeof FONT_SIZES;