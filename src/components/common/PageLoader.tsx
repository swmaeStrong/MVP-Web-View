'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { RefreshCw } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center ${getThemeClass('background')}`}>
      <div className="flex flex-col items-center gap-4">
        <RefreshCw className={`h-8 w-8 animate-spin ${getThemeTextColor('primary')}`} />
        <p className={`text-lg font-medium ${getThemeTextColor('primary')}`}>
          {message}
        </p>
      </div>
    </div>
  );
}