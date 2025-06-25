'use client';

import { cn } from '@/shadcn/lib/utils';
import { Inbox } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface NoDataProps {
  title?: string;
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'auto';
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  showBorder?: boolean;
}

export default function NoData({
  title = '데이터가 없습니다',
  message = '표시할 데이터가 없습니다.',
  size = 'auto',
  icon: Icon = Inbox,
  className,
  showBorder = true,
}: NoDataProps) {
  const { isDarkMode, getThemeClass } = useTheme();
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-4',
          icon: 'h-8 w-8',
          iconContainer: 'p-2',
          title: 'text-sm',
          message: 'text-xs',
          spacing: 'space-y-1',
          iconSpacing: 'mb-2',
        };
      case 'md':
        return {
          container: 'p-6',
          icon: 'h-12 w-12',
          iconContainer: 'p-3',
          title: 'text-base',
          message: 'text-sm',
          spacing: 'space-y-2',
          iconSpacing: 'mb-3',
        };
      case 'lg':
        return {
          container: 'p-8',
          icon: 'h-16 w-16',
          iconContainer: 'p-4',
          title: 'text-xl',
          message: 'text-base',
          spacing: 'space-y-3',
          iconSpacing: 'mb-4',
        };
      case 'auto':
        return {
          container: 'p-4 sm:p-6 lg:p-8',
          icon: 'h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16',
          iconContainer: 'p-2 sm:p-3 lg:p-4',
          title: 'text-sm sm:text-base lg:text-xl',
          message: 'text-xs sm:text-sm lg:text-base',
          spacing: 'space-y-1 sm:space-y-2 lg:space-y-3',
          iconSpacing: 'mb-2 sm:mb-3 lg:mb-4',
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
          showBorder && `rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`,
          sizeClasses.container
        )}
      >
        {/* 아이콘 */}
        <div className={sizeClasses.iconSpacing}>
          <div
            className={cn(
              `flex items-center justify-center rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`,
              sizeClasses.iconContainer
            )}
          >
            <Icon className={cn(sizeClasses.icon, isDarkMode ? 'text-gray-500' : 'text-gray-400')} />
          </div>
        </div>

        {/* 텍스트 */}
        <div className={sizeClasses.spacing}>
          <h3
            className={cn(
              sizeClasses.title,
              `font-semibold tracking-tight ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`
            )}
          >
            {title}
          </h3>
          <p className={cn(sizeClasses.message, isDarkMode ? 'text-gray-400' : 'text-gray-500')}>{message}</p>
        </div>
      </div>
    </div>
  );
}
