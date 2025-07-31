import { API } from '../../config/api';
import { parseApi } from '../../utils/api-utils';
import { getKSTDateString } from '../../utils/timezone';

// 구독 플랜 조회

export const getAvailableSubscriptionPlans = () =>
  parseApi<Subscription.AvailableSubscriptionPlansApiResponse[]>(
    API.get('/subscription-plans')
  );

// 유저 구독 내역
export const getUserCurrentSubscription = () =>
  parseApi<Subscription.UserSubscriptionApiResponse>(
    API.get('/users/subscription/current')
  );

export const getUserSubscriptionHistory = () =>
  parseApi<Subscription.UserSubscriptionApiResponse[]>(
    API.get('/users/subscription/history')
  );

// 리더보드 조회
export const getLeaderBoard = (
  category: string,
  type: 'daily' | 'weekly' | 'monthly',
  page: number = 1,
  size: number = 10,
  date: string = getKSTDateString()
) =>
  parseApi<LeaderBoard.LeaderBoardApiResponse[]>(
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
  parseApi<LeaderBoard.LeaderBoardApiResponse>(
    API.get(
      `/leaderboard/${category}/user-info/${type}?userId=${userId}&date=${date}`
    )
  );

// 사용 기록 조회
export const getUsageLog = (
  userId: string,
  date: string = getKSTDateString()
) =>
  parseApi<UsageLog.UsageLogApiResponse[]>(
    API.get(`/usage-log?userId=${userId}&date=${date}`)
  );

// 포모도로 사용 기록 조회
export const getPomodoroUsageLog = (
  userId: string,
  date: string = getKSTDateString()
) =>
  parseApi<UsageLog.UsageLogApiResponse[]>(
    API.get(`/usage-log/pomodoro?userId=${userId}&date=${date}`)
  );

export const getHourlyUsageLog = (
  date: string = getKSTDateString(),
  userId: string,
  binSize: number
) =>
  parseApi<UsageLog.HourlyUsageLogApiResponse[]>(
    API.get(`/usage-log/hour?userId=${userId}&date=${date}&binSize=${binSize}`)
  );

export const getRecentUsageLog = (date: string = getKSTDateString()) =>
  parseApi<UsageLog.RecentUsageLogItem[]>(
    API.get(`/usage-log/recent?date=${date}`)
  );

export const getUserInfo = () =>
  parseApi<User.UserApiResponse>(API.get('/user/my-info'));

export const getTimeline = (userId: string, date: string = getKSTDateString()) =>
  parseApi<UsageLog.TimelineItem[]>(
    API.get(`/usage-log/time-line?userId=${userId}&date=${date}`)
  );

// 스트릭 캘린더 조회
export const getStreakCalendar = (date: string = getKSTDateString()) =>
  parseApi<Statistics.StreakCalendarApiResponse[]>(
    API.get(`/streak/calendar?date=${date}`)
  );

// 스트릭 카운트 조회
export const getStreakCount = () =>
  parseApi<Statistics.StreakCountApiResponse>(
    API.get('/streak/count')
  );

// 세션 데이터 조회
export const getSession = (date: string = getKSTDateString()) =>
  parseApi<Session.SessionApiResponse[]>(
    API.get(`/session?date=${date}`)
  );

// 세션 상세 데이터 조회
export const getSessionDetail = (session: number, date: string = getKSTDateString()) =>
  parseApi<Session.SessionDetailApiResponse[]>(
    API.get(`/usage-log/pomodoro/details?session=${session}&date=${date}`)
  );


// 그룹 조회
export const getMyGroups = () =>
  parseApi<Group.GroupApiResponse[]>(
    API.get(`/group/my`)
  );

// 그룹 상세 조회
export const getGroupDetail = (groupId: number) =>
  parseApi<Group.GroupDetailApiResponse>(
    API.get(`/group/${groupId}`)
  );