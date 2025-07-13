declare namespace LeaderBoard {
  interface DetailItem {
    category: string;
    score: number;
  }

  interface LeaderBoardApiResponse {
    userId: string;
    nickname: string;
    score: number;
    rank: number;
    details?: DetailItem[];
  }
}
