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
}
