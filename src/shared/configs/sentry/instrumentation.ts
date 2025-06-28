// Next.js Instrumentation file
// 이 파일은 Next.js 15+에서 Sentry 호환성을 위해 필요합니다.

export async function register() {
  // 프로덕션 환경이 아니면 초기화하지 않음
  const environment = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || 'development';
  const isProduction = environment === 'production';
  
  if (!isProduction) {
    console.log('🚫 Sentry 비활성화: 개발 환경에서는 작동하지 않습니다.');
    return;
  }
  
  // 서버사이드에서는 Sentry를 초기화하지 않음 (클라이언트 전용)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 서버사이드에서는 아무것도 하지 않음
    console.log('🔧 서버사이드 Sentry 초기화 건너뜀 (클라이언트 전용 설정)');
    return;
  }
  
  // Edge runtime에서도 아무것도 하지 않음
  if (process.env.NEXT_RUNTIME === 'edge') {
    console.log('🔧 Edge runtime Sentry 초기화 건너뜀 (클라이언트 전용 설정)');
    return;
  }
  
  // 클라이언트 사이드에서는 기존 설정 사용
  if (typeof window !== 'undefined') {
    console.log('🔧 클라이언트 사이드 Sentry는 sentry.client.config.ts에서 초기화됩니다.');
  }
}

// onRequestError는 구현하지 않음 (서버사이드 에러 추적 안함)
export async function onRequestError() {
  // 서버사이드 에러 추적 비활성화
  return;
}