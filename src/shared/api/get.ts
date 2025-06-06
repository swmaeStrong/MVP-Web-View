import { parseApi } from '../../utils/api-utils';
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
  type: 'daily' | 'weekly' | 'monthly' | 'all'
) =>
  parseApi<LeaderBoard.LeaderBoardResponse[]>(
    API.get(`/leaderboard/${category}/${type}`)
  );

// 사용 기록 조회
export const getUsageLog = () =>
  parseApi<UsageLog.UsageLogResponse[]>(API.get(`/usage-log`));
