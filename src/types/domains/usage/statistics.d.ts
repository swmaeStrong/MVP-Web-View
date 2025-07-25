declare namespace Statistics {
  // 통계 관련 타입 정의
  interface StatisticsCategory {
    name: string;
    time: number; // seconds
    percentage: number;
    color: string;
    icon: string;
  }

  interface DailyStatistics {
    date: string;
    totalTime: number; // seconds
    categories: StatisticsCategory[];
  }

  interface WeeklyStatistics {
    weekName: string;
    totalTime: number; // seconds
    weeklyData: { date: string; categories: { name: string; time: number }[] }[];
    categories: StatisticsCategory[];
  }

  interface MonthlyStatistics {
    monthName: string;
    totalTime: number; // seconds
    monthlyData: { date: string; categories: { name: string; time: number }[] }[];
    categories: StatisticsCategory[];
  }

  type PeriodType = 'daily' | 'weekly' | 'monthly';

  // 스트릭 캘린더 관련 타입 정의
  interface StreakCalendarApiResponse {
    date: string; // YYYY-MM-DD format
    activityCount: number;
  }

  // 스트릭 카운트 관련 타입 정의
  interface StreakCountApiResponse {
    currentStreak: number;
    maxStreak: number;
  }
}
