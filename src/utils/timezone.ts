// User's local timezone utilities
// Automatically detects and uses the user's browser timezone

/**
 * Get the user's current timezone offset in hours from UTC
 */
const getUserTimezoneOffset = (): number => {
  // getTimezoneOffset returns minutes, negative for timezones ahead of UTC
  // For example, KST (UTC+9) returns -540
  return -new Date().getTimezoneOffset() / 60;
};

/**
 * Get current date in user's local timezone.
 */
export const getLocalDate = (): Date => {
  return new Date();
};

/**
 * Get current date in Korean Standard Time (KST).
 * Legacy function kept for backward compatibility.
 */
export const getKSTDate = (): Date => {
  return getLocalDate();
};

/**
 * Generate date string (YYYY-MM-DD) based on user's local timezone.
 */
export const getLocalDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Generate date string (YYYY-MM-DD) based on Korean Standard Time.
 * Legacy function kept for backward compatibility.
 */
export const getKSTDateString = (): string => {
  return getLocalDateString();
};

/**
 * Convert given date to user's local timezone.
 * This is mainly for display purposes as JavaScript Date already handles timezones.
 */
export const convertToLocal = (date: Date): Date => {
  return new Date(date);
};

/**
 * Convert given date to Korean Standard Time.
 * Legacy function kept for backward compatibility.
 */
export const convertToKST = (date: Date): Date => {
  return convertToLocal(date);
};

/**
 * Generate date string for n days ago based on user's local timezone.
 */
export const getLocalDateStringDaysAgo = (daysAgo: number): string => {
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setDate(targetDate.getDate() - daysAgo);
  
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Generate date string for n days ago based on Korean Standard Time.
 * Legacy function kept for backward compatibility.
 */
export const getKSTDateStringDaysAgo = (daysAgo: number): string => {
  return getLocalDateStringDaysAgo(daysAgo);
};

/**
 * Generate date string for a specific date based on user's local timezone.
 */
export const getLocalDateStringFromDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Generate date string for a specific date based on Korean Standard Time.
 * Legacy function kept for backward compatibility.
 */
export const getKSTDateStringFromDate = (date: Date): string => {
  return getLocalDateStringFromDate(date);
};

/**
 * Generate first day of month string (1st) based on user's local timezone.
 * Used for monthly statistics or leaderboard queries, always fixed to the 1st of the month.
 */
export const getLocalFirstDayOfMonth = (year: number, month: number): string => {
  // month는 0-based (0 = January)
  const yearStr = year.toString();
  const monthStr = (month + 1).toString().padStart(2, '0'); // Convert to 1-based
  return `${yearStr}-${monthStr}-01`;
};

/**
 * Generate first day of month string (1st) based on Korean Standard Time.
 * Legacy function kept for backward compatibility.
 */
export const getKSTFirstDayOfMonth = (year: number, month: number): string => {
  return getLocalFirstDayOfMonth(year, month);
};

/**
 * Return first day (1st) string of n months ago based on current date.
 * Used for monthly leaderboard or statistics queries, always fixed to the 1st of the month.
 */
export const getLocalMonthlyDateString = (monthsAgo: number): string => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-based

  let targetYear = currentYear;
  let targetMonth = currentMonth - monthsAgo;

  // Handle negative months
  while (targetMonth < 0) {
    targetMonth += 12;
    targetYear -= 1;
  }

  const result = getLocalFirstDayOfMonth(targetYear, targetMonth);

  // Debug log
  console.log(
    `getLocalMonthlyDateString: monthsAgo=${monthsAgo}, today=${getLocalDateString()}, currentYear=${currentYear}, currentMonth=${currentMonth + 1}, targetYear=${targetYear}, targetMonth=${targetMonth + 1}, result=${result}`
  );

  return result;
};

/**
 * Return first day (1st) string of n months ago based on Korean Standard Time.
 * Legacy function kept for backward compatibility.
 */
export const getKSTMonthlyDateString = (monthsAgo: number): string => {
  return getLocalMonthlyDateString(monthsAgo);
};

/**
 * Generate time string (HH:MM) based on user's local timezone.
 */
export const getLocalTimeString = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Generate time string (HH:MM) based on Korean Standard Time.
 * Legacy function kept for backward compatibility.
 */
export const getKSTTimeString = (): string => {
  return getLocalTimeString();
};

/**
 * Return formatted date string based on user's local timezone.
 */
export const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

/**
 * Return formatted date string based on Korean Standard Time.
 * Legacy function kept for backward compatibility.
 */
export const formatKSTDate = (date: Date): string => {
  return formatLocalDate(date);
};

/**
 * Return formatted date string with day of week based on user's local timezone.
 */
export const formatLocalDateWithDay = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00'); // Parse as local date
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Function to check if it's the same day (local timezone based)
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
    date.getDay()
  ];

  if (isSameDay(date, today)) {
    return `${year}.${month}.${day} (Today)`;
  } else if (isSameDay(date, yesterday)) {
    return `${year}.${month}.${day} (Yesterday)`;
  } else {
    return `${year}.${month}.${day} (${dayOfWeek})`;
  }
};

/**
 * Return formatted date string with day of week based on Korean Standard Time.
 * Legacy function kept for backward compatibility.
 */
export const formatKSTDateWithDay = (dateStr: string): string => {
  return formatLocalDateWithDay(dateStr);
};

/**
 * Return Monday date string of n weeks ago based on current date.
 * Used for weekly leaderboard or statistics queries, calculating Monday-Sunday as one week.
 */
export const getLocalWeeklyDateString = (weeksAgo: number): string => {
  const today = new Date();
  
  // Calculate date n weeks ago
  const targetDate = new Date(today);
  targetDate.setDate(targetDate.getDate() - (weeksAgo * 7));
  
  // Find Monday of that week
  const dayOfWeek = targetDate.getDay(); // 0=Sunday, 1=Monday, ...
  const daysFromMonday = (dayOfWeek + 6) % 7; // Days elapsed from Monday
  targetDate.setDate(targetDate.getDate() - daysFromMonday);
  
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Return Monday date string of n weeks ago based on Korean Standard Time.
 * Legacy function kept for backward compatibility.
 */
export const getKSTWeeklyDateString = (weeksAgo: number): string => {
  return getLocalWeeklyDateString(weeksAgo);
};

/**
 * Return Monday date string of the week containing the given date.
 * Used for converting any date to its corresponding Monday (start of week).
 */
export const getMondayOfWeek = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00'); // Parse as local date
  const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, ...
  const daysFromMonday = (dayOfWeek + 6) % 7; // Days elapsed from Monday
  const mondayOfWeek = new Date(date);
  mondayOfWeek.setDate(mondayOfWeek.getDate() - daysFromMonday);
  
  const year = mondayOfWeek.getFullYear();
  const month = String(mondayOfWeek.getMonth() + 1).padStart(2, '0');
  const day = String(mondayOfWeek.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get user's timezone information for display
 */
export const getUserTimezoneInfo = (): { offset: number; name: string } => {
  const offset = getUserTimezoneOffset();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  return {
    offset,
    name: timezone
  };
};