'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5분
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              // 특정 에러 코드들에 대해서는 재시도하지 않음
              if (error instanceof Error) {
                // 인증 에러나 권한 에러는 재시도하지 않음
                if (
                  error.message.includes('401') ||
                  error.message.includes('403')
                ) {
                  return false;
                }
                // 404 에러도 재시도하지 않음
                if (error.message.includes('404')) {
                  return false;
                }
              }
              // 최대 2번까지만 재시도
              return failureCount < 2;
            },
            retryDelay: attemptIndex =>
              Math.min(1000 * 2 ** attemptIndex, 30000), // 최대 30초
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
