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

// Streak 조회
export const getWeeklyStreak = (date: string = getKSTDateString()) =>
  parseApi<Streak.WeeklyStreakApiResponse[]>(
    API.get(`/streak/weekly?date=${date}`)
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

// 타 유저 정보 조회
export const getOtherUserInfo = (userId: string) =>
  parseApi<User.OtherUserApiResponse>(API.get(`/user?userId=${userId}`));

export const getTimeline = (userId: string, date: string = getKSTDateString()) =>
  parseApi<UsageLog.TimelineItem[]>(
    API.get(`/usage-log/time-line?userId=${userId}&date=${date}`)
  );

// 스트릭 캘린더 조회 - 월별 데이터 페칭
export const getStreakCalendar = (date: string) => {
  const apiUrl = `/streak/calendar?date=${date}`;
  return parseApi<Statistics.StreakCalendarApiResponse[]>(
    API.get(apiUrl)
  );
};

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
  parseApi<Session.SessionDetailApiResponse>(
    API.get(`/usage-log/pomodoro/details?session=${session}&date=${date}`)
  );

// 일별 전체 세션 상세 데이터 조회
export const getPomodoroDetails = (date: string = getKSTDateString()) =>
  parseApi<Session.SessionDetailApiResponse>(
    API.get(`/usage-log/pomodoro/details?date=${date}`)
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

// 그룹 목표 조회
export const getGroupGoals = (groupId: number, date: string = getKSTDateString()) =>
  parseApi<Group.GroupGoalsApiResponse[]>(
    API.get(`/group/${groupId}/goal?date=${date}`)
  );

// 그룹 이름 유효성 검사
export const validateGroupName = (name: string) =>
  parseApi<boolean>(
    API.get(`/group/name/check?name=${name}`)
  );

// 그룹 검색
export const searchGroups = () =>
  parseApi<Group.GroupApiResponse[]>(
    API.get('/group/search')
  );

// 그룹 초대 코드로 그룹 정보 조회
export const getGroupByInviteCode = (inviteCode: string) =>
  parseApi<Group.GroupApiResponse>(
    API.get(`/group/invite?code=${inviteCode}`)
  );

// 그룹 리더보드 조회
export const getGroupLeaderboard = (
  groupId: number, 
  period: 'DAILY' | 'WEEKLY',
  date: string = getKSTDateString()
) =>
  parseApi<Group.GroupLeaderboardApiResponse>(
    API.get(`/group/${groupId}/leaderboard?period=${period}&date=${date}`)
  );

// 주간 포모도로 상세 데이터 조회
export const getWeeklyPomodoroDetails = (date: string = getKSTDateString()) =>
  parseApi<UsageLog.WeeklyPomodoroDetailsApiResponse>(
    API.get(`/usage-log/pomodoro/details/weekly?date=${date}`)
  );

// 주간 세션 평균 점수 조회
export const getWeeklySessionScore = (date: string = getKSTDateString()) =>
  parseApi<{ avgScore: number }>(
    API.get(`/session/weekly?date=${date}`)
  );