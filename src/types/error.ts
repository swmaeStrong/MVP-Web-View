// 에러 관련 타입 정의
import { AxiosError } from 'axios';

export type Environment = 'development' | 'staging' | 'production';

// API 에러 응답 타입
export interface ApiErrorResponse {
  code: string;
  message: string;
  isSuccess: false;
  data?: any;
}

// 통합 에러 타입
export interface UnifiedError {
  // 기본 정보
  message: string;
  code?: string;
  statusCode?: number;
  timestamp: string;
  environment: Environment;
  
  // 요청 정보
  url?: string;
  method?: string;
  params?: any;
  data?: any;
  headers?: any;
  
  // 응답 정보
  response?: ApiErrorResponse;
  responseHeaders?: any;
  
  // 사용자 정보
  userId?: string;
  sessionId?: string;
  
  // 추가 컨텍스트
  feature?: string;
  component?: string;
  action?: string;
  
  // 원본 에러
  originalError?: Error | AxiosError;
}

// 에러 로그 엔트리
export interface ErrorLogEntry {
  id: string;
  error: UnifiedError;
  fingerprint: string;
  occurrenceCount: number;
  firstSeen: string;
  lastSeen: string;
  environment: Environment;
}

// 에러 핸들러 설정
export interface ErrorHandlerConfig {
  environment: Environment;
  enableConsoleLog: boolean;
  enableSentryReport: boolean;
  enableLocalStorage: boolean;
  maxLocalStorageEntries: number;
  // 환경별 설정
  developmentConfig?: {
    showErrorDetails: boolean;
    enableDebugInfo: boolean;
  };
  productionConfig?: {
    sanitizeErrorMessages: boolean;
    reportToSentry: boolean;
  };
}