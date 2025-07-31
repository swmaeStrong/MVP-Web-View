import { AxiosError } from 'axios';
import * as Sentry from '@sentry/nextjs';
import { 
  Environment, 
  UnifiedError, 
  ErrorLogEntry, 
  ErrorHandlerConfig,
  ApiErrorResponse 
} from '@/types/common/error';
import { captureError, addBreadcrumb, setSentryContext } from './sentry';
import { v4 as uuidv4 } from 'uuid';

// 환경 변수에서 현재 환경 가져오기
const getCurrentEnvironment = (): Environment => {
  const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV;
  switch (env) {
    case 'production':
      return 'production';
    case 'staging':
      return 'staging';
    default:
      return 'development';
  }
};

// 기본 설정
const defaultConfig: ErrorHandlerConfig = {
  environment: getCurrentEnvironment(),
  enableConsoleLog: process.env.NODE_ENV === 'development',
  enableSentryReport: process.env.NODE_ENV === 'production',
  enableLocalStorage: true,
  maxLocalStorageEntries: 100,
  developmentConfig: {
    showErrorDetails: true,
    enableDebugInfo: true,
  },
  productionConfig: {
    sanitizeErrorMessages: true,
    reportToSentry: true,
  },
};

class ErrorHandler {
  private config: ErrorHandlerConfig;
  private errorStorage: Map<string, ErrorLogEntry>;
  private storageKey = 'app_error_logs';

  constructor(config: Partial<ErrorHandlerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.errorStorage = new Map();
    this.loadErrorsFromLocalStorage();
  }

  /**
   * AxiosError를 UnifiedError로 변환
   */
  private transformAxiosError(error: AxiosError, context?: Partial<UnifiedError>): UnifiedError {
    const response = error.response?.data as ApiErrorResponse;
    
    return {
      message: response?.message || error.message || '알 수 없는 오류가 발생했습니다.',
      code: response?.code || error.code,
      statusCode: error.response?.status,
      timestamp: new Date().toISOString(),
      environment: this.config.environment,
      
      // 요청 정보
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      params: error.config?.params,
      data: error.config?.data,
      headers: this.sanitizeHeaders(error.config?.headers),
      
      // 응답 정보
      response: response,
      responseHeaders: this.sanitizeHeaders(error.response?.headers),
      
      // 컨텍스트 정보
      ...context,
      
      // 원본 에러
      originalError: error,
    };
  }

  /**
   * 일반 Error를 UnifiedError로 변환
   */
  private transformGenericError(error: Error, context?: Partial<UnifiedError>): UnifiedError {
    return {
      message: error.message || '알 수 없는 오류가 발생했습니다.',
      timestamp: new Date().toISOString(),
      environment: this.config.environment,
      ...context,
      originalError: error,
    };
  }

  /**
   * 헤더에서 민감한 정보 제거
   */
  private sanitizeHeaders(headers?: any): any {
    if (!headers) return undefined;
    
    const sanitized = { ...headers };
    const sensitiveKeys = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
    
    sensitiveKeys.forEach(key => {
      if (sanitized[key]) {
        sanitized[key] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  /**
   * 에러 핑거프린트 생성
   */
  private generateFingerprint(error: UnifiedError): string {
    const parts = [
      error.code || '',
      error.statusCode || '',
      error.url || '',
      error.method || '',
      error.message.substring(0, 50),
    ];
    
    return parts.filter(Boolean).join('-');
  }

  /**
   * 로컬 스토리지에 에러 저장
   */
  private saveToLocalStorage(entry: ErrorLogEntry): void {
    if (!this.config.enableLocalStorage) return;
    
    try {
      const errors = Array.from(this.errorStorage.values())
        .filter(e => e.environment === this.config.environment)
        .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())
        .slice(0, this.config.maxLocalStorageEntries);
      
      localStorage.setItem(
        `${this.storageKey}_${this.config.environment}`,
        JSON.stringify(errors)
      );
    } catch (e) {
      console.warn('Failed to save error to localStorage:', e);
    }
  }

  /**
   * 로컬 스토리지에서 에러 로드
   */
  private loadErrorsFromLocalStorage(): void {
    if (!this.config.enableLocalStorage) return;
    
    try {
      const stored = localStorage.getItem(`${this.storageKey}_${this.config.environment}`);
      if (stored) {
        const errors: ErrorLogEntry[] = JSON.parse(stored);
        errors.forEach(error => {
          this.errorStorage.set(error.fingerprint, error);
        });
      }
    } catch (e) {
      console.warn('Failed to load errors from localStorage:', e);
    }
  }

  /**
   * 개발 환경에서 에러 상세 정보 콘솔 출력
   */
  private logDevelopmentError(error: UnifiedError): void {
    if (this.config.environment !== 'development' || !this.config.developmentConfig?.showErrorDetails) {
      return;
    }

    console.group(`🚨 [${error.statusCode || 'ERROR'}] ${error.message}`);
    console.log('📍 Environment:', error.environment);
    console.log('🕐 Timestamp:', error.timestamp);
    
    if (error.url) {
      console.log('🌐 URL:', error.url);
      console.log('📤 Method:', error.method);
    }
    
    if (error.response) {
      console.log('📥 Response:', error.response);
    }
    
    if (this.config.developmentConfig?.enableDebugInfo) {
      console.log('🔍 Full Error:', error);
      if (error.originalError) {
        console.log('🔗 Original Error:', error.originalError);
      }
    }
    
    console.trace('Stack Trace');
    console.groupEnd();
  }

  /**
   * Sentry에 에러 보고
   */
  private reportToSentry(error: UnifiedError): void {
    // 개발 환경에서는 Sentry 보고 안함
    if (this.config.environment === 'development') {
      return;
    }

    // 운영 환경 설정 확인
    if (this.config.environment === 'production' && !this.config.productionConfig?.reportToSentry) {
      return;
    }

    // Sentry 컨텍스트 설정
    setSentryContext('error_details', {
      environment: error.environment,
      url: error.url,
      method: error.method,
      statusCode: error.statusCode,
      code: error.code,
      userId: error.userId,
      feature: error.feature,
      component: error.component,
      action: error.action,
    });

    // 브레드크럼 추가
    addBreadcrumb(
      `API Error: ${error.method} ${error.url}`,
      'http',
      'error',
      {
        statusCode: error.statusCode,
        message: error.message,
        code: error.code,
      }
    );

    // Sentry에 에러 전송
    const sentryError = new Error(error.message);
    sentryError.name = `ApiError_${error.statusCode || 'Unknown'}`;
    
    captureError(sentryError, {
      tags: {
        environment: error.environment,
        statusCode: error.statusCode?.toString() || 'unknown',
        errorCode: error.code || 'unknown',
        feature: error.feature || 'unknown',
      },
      level: error.statusCode && error.statusCode >= 500 ? 'error' : 'warning',
    });
  }

  /**
   * 에러 처리 메인 함수
   */
  public handleError(
    error: Error | AxiosError,
    context?: Partial<UnifiedError>
  ): UnifiedError {
    let unifiedError: UnifiedError;

    // AxiosError인지 확인
    if ((error as AxiosError).isAxiosError) {
      unifiedError = this.transformAxiosError(error as AxiosError, context);
    } else {
      unifiedError = this.transformGenericError(error, context);
    }

    // 에러 로그 엔트리 생성 또는 업데이트
    const fingerprint = this.generateFingerprint(unifiedError);
    const existingEntry = this.errorStorage.get(fingerprint);

    if (existingEntry) {
      existingEntry.occurrenceCount++;
      existingEntry.lastSeen = new Date().toISOString();
      existingEntry.error = unifiedError;
    } else {
      const newEntry: ErrorLogEntry = {
        id: uuidv4(),
        error: unifiedError,
        fingerprint,
        occurrenceCount: 1,
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        environment: this.config.environment,
      };
      this.errorStorage.set(fingerprint, newEntry);
      this.saveToLocalStorage(newEntry);
    }

    // 환경별 처리
    if (this.config.environment === 'development') {
      this.logDevelopmentError(unifiedError);
    } else {
      // 운영 환경에서 민감한 정보 제거
      if (this.config.productionConfig?.sanitizeErrorMessages) {
        unifiedError.headers = undefined;
        unifiedError.data = undefined;
      }
      
      // 콘솔 로그 (간단히)
      if (this.config.enableConsoleLog) {
        console.error(`[${unifiedError.statusCode}] ${unifiedError.message}`);
      }
    }

    // Sentry 보고
    if (this.config.enableSentryReport) {
      this.reportToSentry(unifiedError);
    }

    return unifiedError;
  }

  /**
   * 에러 로그 조회
   */
  public getErrorLogs(environment?: Environment): ErrorLogEntry[] {
    const errors = Array.from(this.errorStorage.values());
    
    if (environment) {
      return errors.filter(e => e.environment === environment);
    }
    
    return errors;
  }

  /**
   * 에러 로그 초기화
   */
  public clearErrorLogs(environment?: Environment): void {
    if (environment) {
      Array.from(this.errorStorage.entries()).forEach(([key, entry]) => {
        if (entry.environment === environment) {
          this.errorStorage.delete(key);
        }
      });
      localStorage.removeItem(`${this.storageKey}_${environment}`);
    } else {
      this.errorStorage.clear();
      ['development', 'staging', 'production'].forEach(env => {
        localStorage.removeItem(`${this.storageKey}_${env}`);
      });
    }
  }

  /**
   * 특정 에러 상세 조회
   */
  public getErrorDetails(fingerprint: string): ErrorLogEntry | undefined {
    return this.errorStorage.get(fingerprint);
  }

  /**
   * 설정 업데이트
   */
  public updateConfig(config: Partial<ErrorHandlerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// 싱글톤 인스턴스
export const errorHandler = new ErrorHandler();

// 편의 함수들
export const handleApiError = (
  error: Error | AxiosError,
  context?: Partial<UnifiedError>
): UnifiedError => {
  return errorHandler.handleError(error, context);
};

export const getErrorLogs = (environment?: Environment) => {
  return errorHandler.getErrorLogs(environment);
};

export const clearErrorLogs = (environment?: Environment) => {
  errorHandler.clearErrorLogs(environment);
};