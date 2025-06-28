'use client';

import * as Sentry from '@sentry/nextjs';
import { ErrorBoundary as SentryErrorBoundaryComponent } from '@sentry/nextjs';
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { useDesignSystem } from '@/hooks/useDesignSystem';

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

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const { getCardStyle } = useDesignSystem();
  const cardStyle = getCardStyle('large', 'default');

  const handleReport = () => {
    Sentry.showReportDialog({
      eventId: Sentry.lastEventId(),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className={cardStyle.combined}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            문제가 발생했습니다
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            예상치 못한 오류가 발생했습니다. 불편을 드려 죄송합니다.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
              <summary className="cursor-pointer font-medium text-sm">
                개발자 정보 (개발 모드에서만 표시)
              </summary>
              <pre className="mt-2 text-xs overflow-auto">
                {error.message}
                {'\n\n'}
                {error.stack}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button 
              onClick={resetError}
              variant="default"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              다시 시도
            </Button>
            
            <Button 
              onClick={handleReport}
              variant="outline"
              className="flex items-center gap-2"
            >
              문제 신고
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
            >
              홈으로 돌아가기
            </Button>
          </div>
        </CardContent>
      </Card>
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