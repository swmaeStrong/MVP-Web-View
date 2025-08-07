'use client';

import { RefreshCw } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-900 dark:text-white" />
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          {message}
        </p>
      </div>
    </div>
  );
}