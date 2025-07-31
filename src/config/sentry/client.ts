import * as Sentry from '@sentry/nextjs';

const SENTRY_ENVIRONMENT = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || 'development';
const isDevelopment = SENTRY_ENVIRONMENT === 'development';
const isProduction = SENTRY_ENVIRONMENT === 'production';

// DSN이 설정되어 있는지 확인
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

// 디버그 정보 출력
if (typeof window !== 'undefined') {
  console.log('🔧 Sentry 클라이언트 초기화:', {
    dsn: SENTRY_DSN ? 'DSN 설정됨' : 'DSN 없음',
    environment: SENTRY_ENVIRONMENT,
    debug: process.env.NEXT_PUBLIC_SENTRY_DEBUG,
    serverDebug: process.env.SENTRY_DEBUG,
    isDevelopment,
    isProduction
  });
}

// 프로덕션 환경이 아니거나 DSN이 없으면 초기화하지 않음
if (!isProduction) {
  console.log('🚫 Sentry 비활성화: 개발 환경에서는 작동하지 않습니다.');
} else if (!SENTRY_DSN) {
  console.warn('⚠️ NEXT_PUBLIC_SENTRY_DSN이 설정되지 않았습니다. Sentry를 건너뜁니다.');
} else {
  Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // 환경 설정
  environment: SENTRY_ENVIRONMENT,
  
  // 환경별 샘플 레이트
  tracesSampleRate: isDevelopment ? 0.1 : 1.0,
  
  // 세션 리플레이 설정 (운영 환경에서만 활성화)
  replaysSessionSampleRate: isProduction ? 0.1 : 0,
  replaysOnErrorSampleRate: isProduction ? 1.0 : 0,

  // 디버그 모드 (개발 환경에서만)
  debug: isDevelopment && process.env.NEXT_PUBLIC_SENTRY_DEBUG === 'true',
  
  // 통합 설정
  integrations: [
    ...(isProduction ? [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
        maskAllInputs: true,
      }),
    ] : []),
  ],
  
  // 에러 필터링
  beforeSend(event, hint) {
    // 개발 환경에서는 NEXT_PUBLIC_SENTRY_DEBUG="true"여야 전송됨
    if (isDevelopment && process.env.NEXT_PUBLIC_SENTRY_DEBUG !== 'true') {
      console.log('🚫 Sentry 전송 차단 (개발 환경):', event.message || event.exception);
      return null;
    }

    // 환경별 태그 추가
    event.tags = {
      ...event.tags,
      environment: SENTRY_ENVIRONMENT,
      runtime: 'client',
    };

    // 특정 에러 무시
    const error = hint.originalException;
    if (error && error instanceof Error) {
      // 네트워크 관련 에러 중 일부 무시
      if (error.message?.includes('Network request failed') && !isProduction) {
        return null;
      }
      
      // 취소된 요청 무시
      if (error.message?.includes('canceled')) {
        return null;
      }
    }

    // 운영 환경에서 민감한 정보 제거
    if (isProduction) {
      // URL에서 쿼리 파라미터 제거
      if (event.request?.url) {
        const url = new URL(event.request.url);
        url.search = '';
        event.request.url = url.toString();
      }
      
      // 쿠키 정보 제거
      if (event.request?.cookies) {
        delete event.request.cookies;
      }
      
      // 사용자 이메일 마스킹
      if (event.user?.email) {
        const [name, domain] = event.user.email.split('@');
        event.user.email = `${name.substring(0, 3)}***@${domain}`;
      }
    }

    return event;
  },
  
  // 브레드크럼 설정
  beforeBreadcrumb(breadcrumb) {
    // 개발 환경에서는 콘솔 브레드크럼 제외
    if (isDevelopment && breadcrumb.category === 'console') {
      return null;
    }
    
    // 민감한 정보가 포함된 브레드크럼 필터링
    if (breadcrumb.message?.includes('password') || 
        breadcrumb.message?.includes('token')) {
      return null;
    }
    
    return breadcrumb;
  },
  
  // 추가 옵션
  maxBreadcrumbs: isDevelopment ? 50 : 100,
  attachStacktrace: true,
  
  // 성능 모니터링 옵션
  profilesSampleRate: isProduction ? 0.1 : 0,
  
  // 릴리즈 정보
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  });
}

// 전역 Sentry 객체 확인
if (typeof window !== 'undefined') {
  // 초기화 완료 후 테스트
  setTimeout(() => {
    console.log('🎯 Sentry 초기화 완료:', {
      sentryAvailable: !!(window as any).Sentry,
      hubActive: !!(window as any).__SENTRY__?.hub,
      dsn: SENTRY_DSN ? '설정됨' : '없음'
    });
  }, 1000);
}