'use client';

import { RefreshCw } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw
          className="h-8 w-8 animate-spin text-[var(--main-color)]"
        />
        <p className="text-lg font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}