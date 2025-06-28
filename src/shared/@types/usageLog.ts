declare namespace UsageLog {
  interface UsageLogResponse {
    category: string;
    duration: number;
    color: string;
  }

  interface HourlyUsageLogResponse {
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

  interface TimelineResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    data: TimelineItem[];
  }
}
