// Global types for Session namespace
declare global {
  namespace Session {
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
  }
}

export {};