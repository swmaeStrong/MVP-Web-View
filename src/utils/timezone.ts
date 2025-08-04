// Korean Standard Time (KST, UTC+9) utilities

/**
 * Get current date in Korean Standard Time (KST).
 */
export const getKSTDate = (): Date => {
  const now = new Date();
  // Add 9 hours (Korean timezone) to UTC time
  const kstTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kstTime;
};

/**
 * Generate date string (YYYY-MM-DD) based on Korean Standard Time.
 */
export const getKSTDateString = (): string => {
  const kstDate = getKSTDate();
  return kstDate.toISOString().split('T')[0];
};

/**
 * Convert given date to Korean Standard Time.
 */
export const convertToKST = (date: Date): Date => {
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  const kstTime = new Date(utcTime + 9 * 60 * 60 * 1000);
  return kstTime;
};

/**
 * Generate date string for n days ago based on Korean Standard Time.
 */
export const getKSTDateStringDaysAgo = (daysAgo: number): string => {
  const kstDate = getKSTDate();
  const targetDate = new Date(
    kstDate.getTime() - daysAgo * 24 * 60 * 60 * 1000
  );
  return targetDate.toISOString().split('T')[0];
};

/**
 * Generate date string for a specific date based on Korean Standard Time.
 */
export const getKSTDateStringFromDate = (date: Date): string => {
  const kstDate = convertToKST(date);
  return kstDate.toISOString().split('T')[0];
};

/**
 * Generate first day of month string (1st) based on Korean Standard Time.
 * Used for monthly statistics or leaderboard queries, always fixed to the 1st of the month.
 */
export const getKSTFirstDayOfMonth = (year: number, month: number): string => {
  // month는 0-based (0 = January)
  // 간단하게 문자열로 직접 생성 (YYYY-MM-01 형태)
  const yearStr = year.toString();
  const monthStr = (month + 1).toString().padStart(2, '0'); // Convert to 1-based
  return `${yearStr}-${monthStr}-01`;
};

/**
 * Return first day (1st) string of n months ago based on current date.
 * Used for monthly leaderboard or statistics queries, always fixed to the 1st of the month.
 */
export const getKSTMonthlyDateString = (monthsAgo: number): string => {
  const today = getKSTDate();
  const currentYear = today.getUTCFullYear();
  const currentMonth = today.getUTCMonth(); // 0-based

  let targetYear = currentYear;
  let targetMonth = currentMonth - monthsAgo;

  // Handle negative months
  while (targetMonth < 0) {
    targetMonth += 12;
    targetYear -= 1;
  }

  const result = getKSTFirstDayOfMonth(targetYear, targetMonth);

  // Debug log
  console.log(
    `getKSTMonthlyDateString: monthsAgo=${monthsAgo}, today=${today.toISOString().split('T')[0]}, currentYear=${currentYear}, currentMonth=${currentMonth + 1}, targetYear=${targetYear}, targetMonth=${targetMonth + 1}, result=${result}`
  );

  return result;
};

/**
 * Generate time string (HH:MM) based on current Korean Standard Time.
 */
export const getKSTTimeString = (): string => {
  const kstDate = getKSTDate();
  const hours = String(kstDate.getUTCHours()).padStart(2, '0');
  const minutes = String(kstDate.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Return formatted date string based on Korean Standard Time.
 */
export const formatKSTDate = (date: Date): string => {
  const kstDate = convertToKST(date);
  const year = kstDate.getUTCFullYear();
  const month = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kstDate.getUTCDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

/**
 * Return formatted date string with day of week based on Korean Standard Time.
 */
export const formatKSTDateWithDay = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00Z'); // Parse as UTC
  const kstDate = convertToKST(date);
  const today = getKSTDate();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  // Function to check if it's the same day (KST based)
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0];
  };

  const year = kstDate.getUTCFullYear();
  const month = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kstDate.getUTCDate()).padStart(2, '0');
  const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
    kstDate.getUTCDay()
  ];

  if (isSameDay(kstDate, today)) {
    return `${year}.${month}.${day} (Today)`;
  } else if (isSameDay(kstDate, yesterday)) {
    return `${year}.${month}.${day} (Yesterday)`;
  } else {
    return `${year}.${month}.${day} (${dayOfWeek})`;
  }
};

/**
 * Return Monday date string of n weeks ago based on current date.
 * Used for weekly leaderboard or statistics queries, calculating Monday-Sunday as one week.
 */
export const getKSTWeeklyDateString = (weeksAgo: number): string => {
  const today = getKSTDate();

  // Calculate date n weeks ago
  const targetDate = new Date(
    today.getTime() - weeksAgo * 7 * 24 * 60 * 60 * 1000
  );

  // Find Monday of that week
  const dayOfWeek = targetDate.getUTCDay(); // 0=Sunday, 1=Monday, ...
  const daysFromMonday = (dayOfWeek + 6) % 7; // Days elapsed from Monday
  const mondayOfWeek = new Date(
    targetDate.getTime() - daysFromMonday * 24 * 60 * 60 * 1000
  );

  return mondayOfWeek.toISOString().split('T')[0];
};

/**
 * Return Monday date string of the week containing the given date.
 * Used for converting any date to its corresponding Monday (start of week).
 */
export const getMondayOfWeek = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00Z'); // Parse as UTC
  const dayOfWeek = date.getUTCDay(); // 0=Sunday, 1=Monday, ...
  const daysFromMonday = (dayOfWeek + 6) % 7; // Days elapsed from Monday
  const mondayOfWeek = new Date(date.getTime() - daysFromMonday * 24 * 60 * 60 * 1000);
  
  return mondayOfWeek.toISOString().split('T')[0];
};
