import { parseApi } from '../../utils/api-utils';
import { getKSTDateString } from '../../utils/timezone';
import { API } from '../configs/api';

// 구독 플랜 조회

export const getAvailableSubscriptionPlans = () =>
  parseApi<Subscription.AvailableSubscriptionPlansResponse[]>(
    API.get('/subscription-plans')
  );

// 유저 구독 내역
export const getUserCurrentSubscription = () =>
  parseApi<Subscription.UserSubscriptionResponse>(
    API.get('/users/subscription/current')
  );

export const getUserSubscriptionHistory = () =>
  parseApi<Subscription.UserSubscriptionResponse[]>(
    API.get('/users/subscription/history')
  );

// 리더보드 조회
export const getLeaderBoard = (
  category: string,
  type: 'daily' | 'weekly' | 'monthly' | 'all',
  page: number = 1,
  size: number = 10,
  date: string = getKSTDateString()
) =>
  parseApi<LeaderBoard.LeaderBoardResponse[]>(
    API.get(
      `/leaderboard/${category}/${type}?page=${page}&size=${size}&date=${date}`
    )
  );

export const getMyRank = (
  category: string,
  userId: string,
  type: 'daily' | 'weekly' | 'monthly',
  date: string = getKSTDateString()
) =>
  parseApi<LeaderBoard.LeaderBoardResponse>(
    API.get(
      `/leaderboard/${category}/user-info/${type}?userId=${userId}&date=${date}`
    )
  );

// 사용 기록 조회
export const getUsageLog = (
  userId: string,
  date: string = getKSTDateString()
) =>
  parseApi<UsageLog.UsageLogResponse[]>(
    API.get(`/usage-log?userId=${userId}&date=${date}`)
  );

export const getHourlyUsageLog = (
  date: string = getKSTDateString(),
  userId: string,
  binSize: number
) =>
  parseApi<UsageLog.HourlyUsageLogResponse[]>(
    API.get(`/usage-log/hour?userId=${userId}&date=${date}&binSize=${binSize}`)
  );

export const getUserInfo = () =>
  parseApi<User.UserResponse>(API.get('/user/my-info'));
