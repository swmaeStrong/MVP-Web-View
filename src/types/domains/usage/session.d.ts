declare namespace Session {
  interface SessionDetail {
    category: string;
    categoryDetail: string;
    timestamp: number;
    duration: number;
  }

  interface SessionApiResponse {
    title: string;
    session: number;
    sessionDate: string; // YYYY-MM-DD format
    sessionMinutes: number;
    timestamp: number;
    duration: number;
    score: number;
    details: SessionDetail[];
  }

  interface AppUsageDetail {
    app: string;
    duration: number;
    count: number;
  }

  interface SessionDetailApiResponse {
    distractedAppUsage: AppUsageDetail[];
    workAppUsage: AppUsageDetail[];
  }

  interface WeeklySessionScoreApiResponse {
    avgScore: number;
  }
}

// 컴포넌트에서 사용하는 처리된 세션 데이터
export interface SessionData {
  id: number;
  title: string;
  startTime: string;
  duration: number;
  score: number;
  timestamp: number;
  scoreColor: string;
  scoreLabel: string;
  sessionNumber: string;
}
