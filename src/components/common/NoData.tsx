'use client';

import { cn } from '@/shadcn/lib/utils';
import { Inbox } from 'lucide-react';

interface NoDataProps {
  title?: string;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function NoData({
  title = '데이터가 없습니다',
  message = '표시할 데이터가 없습니다.',
  size = 'md',
  className,
}: NoDataProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-6',
          icon: 'h-10 w-10',
          iconContainer: 'p-2',
          title: 'text-sm',
          message: 'text-xs',
        };
      case 'lg':
        return {
          container: 'p-10',
          icon: 'h-16 w-16',
          iconContainer: 'p-4',
          title: 'text-xl',
          message: 'text-sm',
        };
      default: // md
        return {
          container: 'p-8',
          icon: 'h-12 w-12',
          iconContainer: 'p-3',
          title: 'text-base',
          message: 'text-sm',
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
              'bg-gray-200',
              sizeClasses.iconContainer
            )}
          >
            <Inbox className={cn(sizeClasses.icon, 'text-muted-foreground')} />
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
      </div>
    </div>
  );
}
