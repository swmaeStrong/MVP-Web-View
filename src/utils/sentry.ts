import * as Sentry from '@sentry/nextjs';

export interface SentryUser {
  id?: string;
  email?: string;
  username?: string;
}

export interface SentryContext {
  [key: string]: any;
}

/**
 * 사용자 정보를 Sentry에 설정
 */
export const setSentryUser = (user: SentryUser) => {
  Sentry.setUser(user);
};

/**
 * Sentry 사용자 정보 제거
 */
export const clearSentryUser = () => {
  Sentry.setUser(null);
};

/**
 * 커스텀 태그 설정
 */
export const setSentryTag = (key: string, value: string) => {
  Sentry.setTag(key, value);
};

/**
 * 커스텀 컨텍스트 설정
 */
export const setSentryContext = (key: string, context: SentryContext) => {
  Sentry.setContext(key, context);
};

/**
 * 에러를 Sentry에 수동으로 전송
 */
export const captureError = (
  error: Error,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, any>;
    level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  }
) => {
  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }
    
    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    
    if (context?.level) {
      scope.setLevel(context.level);
    }
    
    Sentry.captureException(error);
  });
};

/**
 * 메시지를 Sentry에 전송 (에러가 아닌 정보성 메시지)
 */
export const captureMessage = (
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, any>;
  }
) => {
  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }
    
    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    
    Sentry.captureMessage(message, level);
  });
};

/**
 * API 에러를 위한 특별한 처리 함수
 */
export const captureApiError = (
  error: Error,
  apiContext: {
    endpoint: string;
    method: string;
    statusCode?: number;
    requestId?: string;
    userId?: string;
  }
) => {
  captureError(error, {
    tags: {
      errorType: 'api',
      endpoint: apiContext.endpoint,
      method: apiContext.method,
      statusCode: apiContext.statusCode?.toString() || 'unknown',
    },
    extra: {
      requestId: apiContext.requestId,
      userId: apiContext.userId,
      timestamp: new Date().toISOString(),
    },
    level: 'error',
  });
};

/**
 * 성능 추적을 위한 트랜잭션 시작
 */
export const startSentryTransaction = (name: string, operation: string) => {
  return Sentry.startSpan({
    name,
    op: operation,
  }, () => {
    // 스팬 내에서 실행할 코드를 반환하는 함수
  });
};

/**
 * 브레드크럼 추가 (사용자 행동 추적)
 */
export const addBreadcrumb = (
  message: string,
  category: string,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
  data?: Record<string, any>
) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
};

/**
 * 사용자 피드백 다이얼로그 표시
 */
export const showUserFeedbackDialog = () => {
  Sentry.showReportDialog({
    eventId: Sentry.lastEventId(),
  });
};

/**
 * 현재 환경이 Sentry를 사용할 수 있는지 확인
 */
export const isSentryEnabled = () => {
  return Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);
};

/**
 * 개발 환경에서만 에러 로깅
 */
export const devLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('[DEV ERROR]:', message, data);
  }
};