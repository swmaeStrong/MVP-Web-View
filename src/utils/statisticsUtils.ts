import { categoryColors } from '@/styles/colors';
import { DailyStatistics, StatisticsCategory } from '@/types/domains/usage/statistics';

// 카테고리별 고정 색상 맵 - colors.ts와 통합
export const categoryColorMap: { [key: string]: string } = {
  DEVELOPMENT: categoryColors.development.solid,
  LLM: categoryColors.llm.solid,
  Documentation: categoryColors.documentation.solid,
  Design: categoryColors.design.solid,
  Communication: categoryColors.communication.solid,
  YouTube: categoryColors.youtube.solid,
  SNS: categoryColors.sns.solid,
  Uncategorized: categoryColors.uncategorized.solid,
};

// 카테고리별 아이콘 맵 - leaderboard와 통합
export const categoryIconMap: { [key: string]: string } = {
  DEVELOPMENT: '💻',
  LLM: '🤖',
  Documentation: '📚',
  Design: '🎨',
  Communication: '💬',
  YouTube: '📹',
  SNS: '📱',
  Uncategorized: '📋',
};

// 초를 시간으로 변환
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0 && minutes === 0) return '0min';
  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}hr`;
  return `${hours}hr ${minutes}min`;
};

// 초를 소수점 시간으로 변환 (차트용)
export const secondsToHours = (seconds: number): number => {
  return Math.round((seconds / 3600) * 10) / 10; // 소수점 첫째자리까지
};

// UsageLog 데이터를 DailyStatistics로 변환
export const transformUsageLogToDaily = (
  usageData: UsageLog.UsageLogApiResponse[],
  date: string
): DailyStatistics => {
  const totalTime = usageData.reduce((sum, item) => sum + item.duration, 0);

  // 카테고리별 데이터 집계
  const categoryMap = new Map<string, number>();
  usageData.forEach(item => {
    const current = categoryMap.get(item.category) || 0;
    categoryMap.set(item.category, current + item.duration);
  });

  // 카테고리 배열로 변환
  const categories: StatisticsCategory[] = Array.from(
    categoryMap.entries()
  ).map(([name, time]) => ({
    name,
    time,
    percentage: totalTime > 0 ? Math.round((time / totalTime) * 100) : 0,
    color: categoryColorMap[name] || categoryColorMap['Uncategorized'],
    icon: categoryIconMap[name] || categoryIconMap['Uncategorized'],
  }));

  // 시간순으로 정렬
  categories.sort((a, b) => b.time - a.time);

  return {
    date,
    totalTime,
    categories,
  };
};

// 주별, 월별 데이터 생성 함수들은 현재 구현되지 않아 제거됨
// 필요시 향후 구현 예정

import { formatKSTDateWithDay, getKSTDateStringFromDate } from './timezone';

// 날짜 문자열 생성 헬퍼 (한국 시간대 기준)
export const getDateString = (date: Date): string => {
  return getKSTDateStringFromDate(date);
};

// 날짜를 포맷팅 (한국 시간대 기준)
export const getDateLabel = (dateStr: string): string => {
  return formatKSTDateWithDay(dateStr);
};
