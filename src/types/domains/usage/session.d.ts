declare namespace Session {
  interface SessionDetailApiResponse {
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
    details: SessionDetailApiResponse[];
  }

  interface SessionDetailApiResponse {
    distractedApp: string;
    duration: number;
    count: number;
  }
}
