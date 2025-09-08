declare namespace UsageLog {
  interface UsageLogApiResponse {
    category: string;
    duration: number;
    color: string;
  }

  interface HourlyUsageLogApiResponse {
    hour: string;
    category: string;
    color: string;
    totalDuration: number;
  }

  interface RecentUsageLogItem {
    timestamp: string;
    category: string;
    app: string;
    title: string;
    url: string;
  }

  interface TimelineItem {
    mergedCategory: string;
    startedAt: string;
    endedAt: string;
    app: string;
    title: string;
  }

  interface TimelineApiResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    data: TimelineItem[];
  }

  interface AppUsageItem {
    app: string;
    duration: number;
    count: number;
  }

  interface PomodoroDetailsApiResponse {
    totalSeconds: number;
    distractedAppUsage: AppUsageItem[];
    workAppUsage: AppUsageItem[];
  }
}
