// 한국 시간대 (KST, UTC+9) 유틸리티

/**
 * 한국 시간대의 현재 날짜를 가져옵니다.
 */
export const getKSTDate = (): Date => {
  const now = new Date();
  // UTC 시간에 9시간(한국 시간대)을 더함
  const kstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kstTime;
};

/**
 * 한국 시간대 기준으로 날짜 문자열(YYYY-MM-DD)을 생성합니다.
 */
export const getKSTDateString = (): string => {
  const kstDate = getKSTDate();
  return kstDate.toISOString().split('T')[0];
};

/**
 * 주어진 날짜를 한국 시간대 기준으로 변환합니다.
 */
export const convertToKST = (date: Date): Date => {
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  const kstTime = new Date(utcTime + 9 * 60 * 60 * 1000);
  return kstTime;
};

/**
 * 한국 시간대 기준으로 n일 전 날짜 문자열을 생성합니다.
 */
export const getKSTDateStringDaysAgo = (daysAgo: number): string => {
  const kstDate = getKSTDate();
  const targetDate = new Date(
    kstDate.getTime() - daysAgo * 24 * 60 * 60 * 1000
  );
  return targetDate.toISOString().split('T')[0];
};

/**
 * 한국 시간대 기준으로 특정 날짜의 문자열을 생성합니다.
 */
export const getKSTDateStringFromDate = (date: Date): string => {
  const kstDate = convertToKST(date);
  return kstDate.toISOString().split('T')[0];
};

/**
 * 한국 시간대 기준으로 월의 첫째 날(1일) 문자열을 생성합니다.
 * 월간 통계나 리더보드 조회시 사용되며, 반드시 해당 월의 1일로 고정됩니다.
 */
export const getKSTFirstDayOfMonth = (year: number, month: number): string => {
  // month는 0-based (0 = January)
  // 간단하게 문자열로 직접 생성 (YYYY-MM-01 형태)
  const yearStr = year.toString();
  const monthStr = (month + 1).toString().padStart(2, '0'); // 1-based로 변환
  return `${yearStr}-${monthStr}-01`;
};

/**
 * 현재 날짜를 기준으로 n개월 전의 첫째 날(1일) 문자열을 반환합니다.
 * 월간 리더보드나 통계 조회시 사용되며, 항상 해당 월의 1일로 고정됩니다.
 */
export const getKSTMonthlyDateString = (monthsAgo: number): string => {
  const today = getKSTDate();
  const currentYear = today.getUTCFullYear();
  const currentMonth = today.getUTCMonth(); // 0-based

  let targetYear = currentYear;
  let targetMonth = currentMonth - monthsAgo;

  // 음수 월 처리
  while (targetMonth < 0) {
    targetMonth += 12;
    targetYear -= 1;
  }

  const result = getKSTFirstDayOfMonth(targetYear, targetMonth);

  // 디버깅용 로그
  console.log(
    `getKSTMonthlyDateString: monthsAgo=${monthsAgo}, today=${today.toISOString().split('T')[0]}, currentYear=${currentYear}, currentMonth=${currentMonth + 1}, targetYear=${targetYear}, targetMonth=${targetMonth + 1}, result=${result}`
  );

  return result;
};

/**
 * 현재 한국 시간대 기준으로 시간 문자열(HH:MM)을 생성합니다.
 */
export const getKSTTimeString = (): string => {
  const kstDate = getKSTDate();
  const hours = String(kstDate.getUTCHours()).padStart(2, '0');
  const minutes = String(kstDate.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * 한국 시간대 기준으로 포맷된 날짜 문자열을 반환합니다.
 */
export const formatKSTDate = (date: Date): string => {
  const kstDate = convertToKST(date);
  const year = kstDate.getUTCFullYear();
  const month = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kstDate.getUTCDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

/**
 * 한국 시간대 기준으로 요일을 포함한 포맷된 날짜 문자열을 반환합니다.
 */
export const formatKSTDateWithDay = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00Z'); // UTC 기준으로 파싱
  const kstDate = convertToKST(date);
  const today = getKSTDate();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  // 같은 날인지 확인하는 함수 (KST 기준)
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0];
  };

  const year = kstDate.getUTCFullYear();
  const month = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kstDate.getUTCDate()).padStart(2, '0');
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][
    kstDate.getUTCDay()
  ];

  if (isSameDay(kstDate, today)) {
    return `${year}.${month}.${day} (오늘)`;
  } else if (isSameDay(kstDate, yesterday)) {
    return `${year}.${month}.${day} (어제)`;
  } else {
    return `${year}.${month}.${day} (${dayOfWeek})`;
  }
};

/**
 * 현재 날짜를 기준으로 n주 전의 월요일 날짜 문자열을 반환합니다.
 * 주간 리더보드나 통계 조회시 사용되며, 월요일-일요일을 한 주로 계산합니다.
 */
export const getKSTWeeklyDateString = (weeksAgo: number): string => {
  const today = getKSTDate();

  // n주 전의 날짜 계산
  const targetDate = new Date(
    today.getTime() - weeksAgo * 7 * 24 * 60 * 60 * 1000
  );

  // 해당 주의 월요일 찾기
  const dayOfWeek = targetDate.getUTCDay(); // 0=일요일, 1=월요일, ...
  const daysFromMonday = (dayOfWeek + 6) % 7; // 월요일부터의 경과 일수
  const mondayOfWeek = new Date(
    targetDate.getTime() - daysFromMonday * 24 * 60 * 60 * 1000
  );

  return mondayOfWeek.toISOString().split('T')[0];
};
