import { categoryColors } from '@/styles/colors';
import { DailyStatistics, StatisticsCategory } from '@/types/statistics';

// 카테고리별 고정 색상 맵 - colors.ts와 통합
export const categoryColorMap: { [key: string]: string } = {
  DEVELOPMENT: categoryColors.DEVELOPMENT.solid,
  개발: categoryColors.개발.solid,
  LLM: categoryColors.LLM.solid,
  Documentation: categoryColors.Documentation.solid,
  Design: categoryColors.Design.solid,
  디자인: categoryColors.디자인.solid,
  Communication: categoryColors.Communication.solid,
  회의: categoryColors.회의.solid,
  YouTube: categoryColors.YouTube.solid,
  SNS: categoryColors.SNS.solid,
  Uncategorized: categoryColors.Uncategorized.solid,
  기타: categoryColors.기타.solid,
};

// 카테고리별 아이콘 맵 - leaderboard와 통합
export const categoryIconMap: { [key: string]: string } = {
  DEVELOPMENT: '💻',
  개발: '💻',
  LLM: '🤖',
  Documentation: '📚',
  Design: '🎨',
  디자인: '🎨',
  Communication: '💬',
  회의: '💬',
  YouTube: '📹',
  SNS: '📱',
  Uncategorized: '📋',
  기타: '📋',
};

// 초를 시간으로 변환
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0 && minutes === 0) return '0m';
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

// 초를 소수점 시간으로 변환 (차트용)
export const secondsToHours = (seconds: number): number => {
  return Math.round((seconds / 3600) * 10) / 10; // 소수점 첫째자리까지
};

// UsageLog 데이터를 DailyStatistics로 변환
export const transformUsageLogToDaily = (
  usageData: UsageLog.UsageLogResponse[],
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

// 주별 데이터 생성 (일별 데이터들을 모아서)
export const generateWeeklyData = (dailyDataList: DailyStatistics[]) => {
  // 구현할 예정 - 일별 데이터들을 주별로 집계
  return null;
};

// 월별 데이터 생성 (일별 데이터들을 모아서)
export const generateMonthlyData = (dailyDataList: DailyStatistics[]) => {
  // 구현할 예정 - 일별 데이터들을 월별로 집계
  return null;
};

// 날짜 문자열 생성 헬퍼
export const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// 날짜를 포맷팅 (YYYY-MM-DD 형식을 더 읽기 쉬운 형식으로)
export const getDateLabel = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // 같은 날인지 확인하는 함수
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.toDateString() === d2.toDateString();
  };

  if (isSameDay(date, today)) {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} (오늘)`;
  } else if (isSameDay(date, yesterday)) {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} (어제)`;
  } else {
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} (${dayOfWeek})`;
  }
};
