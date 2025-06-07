// 통계 관련 타입 정의
export interface StatisticsCategory {
  name: string;
  time: number; // seconds
  percentage: number;
  color: string;
  icon: string;
}

export interface DailyStatistics {
  date: string;
  totalTime: number; // seconds
  categories: StatisticsCategory[];
}

export interface WeeklyStatistics {
  weekName: string;
  totalTime: number; // seconds
  weeklyData: { date: string; categories: { name: string; time: number }[] }[];
  categories: StatisticsCategory[];
}

export interface MonthlyStatistics {
  monthName: string;
  totalTime: number; // seconds
  monthlyData: { date: string; categories: { name: string; time: number }[] }[];
  categories: StatisticsCategory[];
}

export type PeriodType = 'daily' | 'weekly' | 'monthly';
