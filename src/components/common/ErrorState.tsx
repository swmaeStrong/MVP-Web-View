'use client';

import { cn } from '@/shadcn/lib/utils';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'auto';
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  onRetry?: () => void;
  retryText?: string;
  showBorder?: boolean;
}

export default function ErrorState({
  title = '오류가 발생했습니다',
  message = '문제가 발생했습니다. 다시 시도해주세요.',
  size = 'auto',
  icon: Icon = AlertTriangle,
  className,
  onRetry,
  retryText = '다시 시도',
  showBorder = true,
}: ErrorStateProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-4',
          icon: 'h-8 w-8',
          iconContainer: 'p-2',
          title: 'text-sm',
          message: 'text-xs',
          button: 'h-8 px-3 text-xs',
          buttonIcon: 'h-3 w-3',
          spacing: 'space-y-1',
          iconSpacing: 'mb-2',
          buttonSpacing: 'mt-3',
        };
      case 'md':
        return {
          container: 'p-6',
          icon: 'h-12 w-12',
          iconContainer: 'p-3',
          title: 'text-base',
          message: 'text-sm',
          button: 'h-10 px-4 text-sm',
          buttonIcon: 'h-4 w-4',
          spacing: 'space-y-2',
          iconSpacing: 'mb-3',
          buttonSpacing: 'mt-4',
        };
      case 'lg':
        return {
          container: 'p-8',
          icon: 'h-16 w-16',
          iconContainer: 'p-4',
          title: 'text-xl',
          message: 'text-base',
          button: 'h-11 px-6 text-base',
          buttonIcon: 'h-5 w-5',
          spacing: 'space-y-3',
          iconSpacing: 'mb-4',
          buttonSpacing: 'mt-6',
        };
      case 'auto':
        return {
          container: 'p-4 sm:p-6 lg:p-8',
          icon: 'h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16',
          iconContainer: 'p-2 sm:p-3 lg:p-4',
          title: 'text-sm sm:text-base lg:text-xl',
          message: 'text-xs sm:text-sm lg:text-base',
          button:
            'h-8 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm lg:h-11 lg:px-6 lg:text-base',
          buttonIcon: 'h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5',
          spacing: 'space-y-1 sm:space-y-2 lg:space-y-3',
          iconSpacing: 'mb-2 sm:mb-3 lg:mb-4',
          buttonSpacing: 'mt-3 sm:mt-4 lg:mt-6',
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center',
        className
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-md flex-col items-center text-center',
          showBorder && 'rounded-lg border border-red-200 bg-white shadow-sm',
          sizeClasses.container
        )}
      >
        {/* 아이콘 */}
        <div className={sizeClasses.iconSpacing}>
          <div
            className={cn(
              'flex items-center justify-center rounded-full bg-red-50',
              sizeClasses.iconContainer
            )}
          >
            <Icon className={cn(sizeClasses.icon, 'text-red-500')} />
          </div>
        </div>

        {/* 텍스트 */}
        <div className={sizeClasses.spacing}>
          <h3
            className={cn(
              sizeClasses.title,
              'font-semibold tracking-tight text-gray-800'
            )}
          >
            {title}
          </h3>
          <p className={cn(sizeClasses.message, 'text-gray-500')}>{message}</p>
        </div>

        {/* 재시도 버튼 */}
        {onRetry && (
          <div className={sizeClasses.buttonSpacing}>
            <button
              onClick={onRetry}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-md',
                'bg-red-500 text-white hover:bg-red-600',
                'focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none',
                'disabled:pointer-events-none disabled:opacity-50',
                'transition-colors',
                sizeClasses.button
              )}
            >
              <RefreshCw className={sizeClasses.buttonIcon} />
              {retryText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
