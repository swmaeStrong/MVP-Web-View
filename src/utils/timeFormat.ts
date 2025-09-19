import { SupportedLocale } from '@/config/i18n';

/**
 * Format time duration with internationalization support
 */
export const formatTimeWithI18n = (
  seconds: number,
  locale: SupportedLocale,
  options: {
    showSeconds?: boolean;
    shortFormat?: boolean;
  } = {}
): string => {
  const { showSeconds = false, shortFormat = true } = options;

  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
    return shortFormat ? '0m' : (locale === 'ko' ? '0분' : '0 minutes');
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (shortFormat) {
    // Short format: 1h 30m, 45m, 30s
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else if (showSeconds) {
      return `${remainingSeconds}s`;
    } else {
      return '0m';
    }
  } else {
    // Long format with proper pluralization
    const parts: string[] = [];

    if (hours > 0) {
      if (locale === 'ko') {
        parts.push(`${hours}시간`);
      } else {
        parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
      }
    }

    if (minutes > 0) {
      if (locale === 'ko') {
        parts.push(`${minutes}분`);
      } else {
        parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
      }
    }

    if (showSeconds && remainingSeconds > 0) {
      if (locale === 'ko') {
        parts.push(`${remainingSeconds}초`);
      } else {
        parts.push(`${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}`);
      }
    }

    if (parts.length === 0) {
      return locale === 'ko' ? '0분' : '0 minutes';
    }

    return parts.join(' ');
  }
};

/**
 * Format hours with proper units
 */
export const formatHoursWithI18n = (
  hours: number,
  locale: SupportedLocale,
  shortFormat = true
): string => {
  if (isNaN(hours) || !isFinite(hours) || hours < 0) {
    return shortFormat ? '0m' : (locale === 'ko' ? '0분' : '0 minutes');
  }

  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (shortFormat) {
    if (wholeHours === 0 && minutes === 0) {
      return '0m';
    }
    if (wholeHours === 0) {
      return `${minutes}m`;
    }
    if (minutes === 0) {
      return `${wholeHours}h`;
    }
    return `${wholeHours}h ${minutes}m`;
  } else {
    const parts: string[] = [];

    if (wholeHours > 0) {
      if (locale === 'ko') {
        parts.push(`${wholeHours}시간`);
      } else {
        parts.push(`${wholeHours} hour${wholeHours > 1 ? 's' : ''}`);
      }
    }

    if (minutes > 0) {
      if (locale === 'ko') {
        parts.push(`${minutes}분`);
      } else {
        parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
      }
    }

    if (parts.length === 0) {
      return locale === 'ko' ? '0분' : '0 minutes';
    }

    return parts.join(' ');
  }
};

/**
 * Format session count with proper pluralization
 */
export const formatSessionCountWithI18n = (
  count: number,
  locale: SupportedLocale
): string => {
  if (locale === 'ko') {
    return `${count}개`;
  } else {
    return `${count} session${count !== 1 ? 's' : ''}`;
  }
};