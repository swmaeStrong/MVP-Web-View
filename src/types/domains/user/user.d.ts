declare namespace User {
  interface UserApiResponse {
    userId: string;
    nickname: string;
  }

  interface OtherUserApiResponse {
    userId: string;
    nickname: string;
    profileImageUrl: string;
    currentStreak: number;
    maxStreak: number;
    totalSession: number;
  }
}
