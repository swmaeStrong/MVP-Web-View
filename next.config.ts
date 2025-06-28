import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
};

// 환경별 Sentry 설정
const environment = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || 'development';
const isProduction = environment === 'production';

// 프로덕션 환경에서만 Sentry 적용
let config: NextConfig;

if (isProduction) {
  console.log('🔧 Sentry 설정 적용 - 프로덕션 환경');
  
  config = withSentryConfig(nextConfig, {
    // Sentry 빌드 플러그인 설정
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    
    // 소스맵 업로드 설정
    silent: true,
    widenClientFileUpload: true,
    
    // 터널링 설정 (선택사항)
    tunnelRoute: '/monitoring',
    
    // 소스맵 설정
    sourcemaps: {
      deleteSourcemapsAfterUpload: true,
    },
    
    // 자동 번들 분석 비활성화
    disableLogger: true,
  });
} else {
  console.log('🚫 Sentry 설정 제외 - 개발 환경');
  config = nextConfig;
}

export default config;
