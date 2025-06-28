'use client';

import * as Sentry from '@sentry/nextjs';
import { ErrorBoundary as SentryErrorBoundaryComponent } from '@sentry/nextjs';
import React from 'react';
import ErrorState from '@/components/common/ErrorState';

interface SentryProviderProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showDialog?: boolean;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  // 개발 모드에서만 상세 에러 정보 표시
  const errorMessage = process.env.NODE_ENV === 'development' 
    ? `예상치 못한 오류가 발생했습니다.\n\n오류 메시지: ${error.message}`
    : '예상치 못한 오류가 발생했습니다. 불편을 드려 죄송합니다.';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4">
        <ErrorState
          title="문제가 발생했습니다"
          message={errorMessage}
          size="large"
          showBorder={true}
        />
        
        {process.env.NODE_ENV === 'development' && (
          <details className="max-w-2xl w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
            <summary className="cursor-pointer font-medium text-sm mb-2">
              스택 트레이스 (개발 모드)
            </summary>
            <pre className="text-xs overflow-auto whitespace-pre-wrap">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export const SentryProvider: React.FC<SentryProviderProps> = ({
  children,
  fallback: CustomFallback,
  onError,
  showDialog = false,
}) => {
  const handleError = (error: unknown, componentStack: string, eventId: string) => {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    // Sentry에 에러 정보 전송
    Sentry.withScope((scope) => {
      scope.setTag('errorBoundary', true);
      scope.setContext('errorInfo', {
        componentStack,
        eventId,
      });
      Sentry.captureException(errorObj);
    });

    // 커스텀 에러 핸들러 실행
    if (onError) {
      onError(errorObj, { componentStack } as React.ErrorInfo);
    }

    // 사용자에게 에러 리포트 다이얼로그 표시 (선택사항)
    if (showDialog) {
      setTimeout(() => {
        Sentry.showReportDialog({
          eventId: Sentry.lastEventId(),
        });
      }, 100);
    }
  };

  const FallbackComponent = CustomFallback || DefaultErrorFallback;

  return (
    <SentryErrorBoundaryComponent
      fallback={({ error, resetError }) => (
        <FallbackComponent 
          error={error instanceof Error ? error : new Error(String(error))} 
          resetError={resetError} 
        />
      )}
      onError={handleError}
    >
      {children}
    </SentryErrorBoundaryComponent>
  );
};

export default SentryProvider;