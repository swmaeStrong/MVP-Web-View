'use client';

import { cn } from '@/shadcn/lib/utils';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = '오류가 발생했습니다',
  message = '문제가 발생했습니다. 다시 시도해주세요.',
  size = 'md',
  className,
  onRetry,
}: ErrorStateProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-6',
          icon: 'h-10 w-10',
          iconContainer: 'p-2',
          title: 'text-sm',
          message: 'text-xs',
          button: 'h-8 px-3 text-xs',
          buttonIcon: 'h-3 w-3',
        };
      case 'lg':
        return {
          container: 'p-10',
          icon: 'h-16 w-16',
          iconContainer: 'p-4',
          title: 'text-xl',
          message: 'text-sm',
          button: 'h-11 px-8 text-sm',
          buttonIcon: 'h-4 w-4',
        };
      default: // md
        return {
          container: 'p-8',
          icon: 'h-12 w-12',
          iconContainer: 'p-3',
          title: 'text-base',
          message: 'text-sm',
          button: 'h-10 px-4 text-sm',
          buttonIcon: 'h-4 w-4',
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center bg-white',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-col items-center text-center',
          'border-border rounded-lg border-2 border-gray-200',
          'shadow-sm transition-colors',
          sizeClasses.container
        )}
      >
        {/* 아이콘 */}
        <div className='mb-4'>
          <div
            className={cn(
              'flex items-center justify-center rounded-full',
              'bg-destructive/10',
              sizeClasses.iconContainer
            )}
          >
            <AlertTriangle
              className={cn(sizeClasses.icon, 'text-destructive')}
            />
          </div>
        </div>

        {/* 텍스트 */}
        <div className='space-y-2'>
          <h3
            className={cn(
              sizeClasses.title,
              'text-foreground font-semibold tracking-tight text-gray-800'
            )}
          >
            {title}
          </h3>
          <p className={cn(sizeClasses.message, 'text-muted-foreground')}>
            {message}
          </p>
        </div>

        {/* 재시도 버튼 */}
        {onRetry && (
          <div className='mt-6'>
            <button
              onClick={onRetry}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-md',
                'bg-destructive text-destructive-foreground',
                'hover:bg-destructive/90',
                'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                'disabled:pointer-events-none disabled:opacity-50',
                'transition-colors',
                sizeClasses.button
              )}
            >
              <RefreshCw className={sizeClasses.buttonIcon} />
              다시 시도
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
