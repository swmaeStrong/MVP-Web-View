// 더미 데이터 (개발용)
interface Category {
  name: string;
  time: number;
  percentage: number;
  color: string;
  icon: string;
}

interface DailyData {
  totalTime: number;
  categories: Category[];
}

interface WeeklyData {
  weekName: string;
  totalTime: number;
  weeklyData: { date: string; categories: { name: string; time: number }[] }[];
  categories: Category[];
}

interface MonthlyData {
  monthName: string;
  totalTime: number;
  monthlyData: { date: string; categories: { name: string; time: number }[] }[];
  categories: Category[];
}

export const dummyStatisticsData = {
  daily: {
    '2024-01-15': {
      totalTime: 8.5,
      categories: [
        {
          name: '개발',
          time: 4.5,
          percentage: 53,
          color: 'from-purple-500 to-purple-600',
          icon: '💻',
        },
        {
          name: '디자인',
          time: 2.0,
          percentage: 24,
          color: 'from-blue-500 to-blue-600',
          icon: '🎨',
        },
        {
          name: '회의',
          time: 1.5,
          percentage: 18,
          color: 'from-green-500 to-green-600',
          icon: '🤝',
        },
        {
          name: '기타',
          time: 0.5,
          percentage: 5,
          color: 'from-gray-500 to-gray-600',
          icon: '📋',
        },
      ],
    },
    // ... 나머지 더미 데이터들
  } as Record<string, DailyData>,
  weekly: [
    // ... 주별 더미 데이터
  ] as WeeklyData[],
  monthly: [
    // ... 월별 더미 데이터
  ] as MonthlyData[],
};

export type { Category, DailyData, MonthlyData, WeeklyData };
