'use client';

import { cn } from '@/shadcn/lib/utils';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';
import { useTheme } from '@/hooks/ui/useTheme';
import type { ComponentSize } from '@/hooks/ui/useDesignSystem';
import { cardSystem, buttonSystem, componentSizes, componentStates, spacing } from '@/styles/design-system';

type StateType = 'error' | 'empty';

interface StateDisplayProps {
  type: StateType;
  title?: string;
  message?: string;
  size?: ComponentSize;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  onRetry?: () => void;
  retryText?: string;
  showBorder?: boolean;
}

const defaultConfig: Record<StateType, {
  title: string;
  message: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
}> = {
  error: {
    title: 'Error Occurred',
    message: 'Something went wrong. Please try again.',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50 dark:bg-red-900/20',
  },
  empty: {
    title: 'No Data Available',
    message: 'No data to display.',
    icon: Inbox,
    iconColor: 'text-gray-500',
    iconBg: 'bg-gray-50 dark:bg-gray-900/20',
  },
};

export default function StateDisplay({
  type,
  title,
  message,
  size = 'medium',
  icon: CustomIcon,
  className,
  onRetry,
  retryText = 'Try Again',
  showBorder = true,
}: StateDisplayProps) {
  const { getThemeClass } = useTheme();
  
  const config = defaultConfig[type];
  const Icon = CustomIcon || config.icon;
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;
  
  const sizeStyles = componentSizes[size];
  const isError = type === 'error';

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
          showBorder && [
            cardSystem.base,
            cardSystem.variants.default,
            getThemeClass('component'),
            sizeStyles.borderRadius,
            sizeStyles.padding,
            sizeStyles.shadow,
            isError && 'border-red-200 dark:border-red-900/50'
          ],
          !showBorder && sizeStyles.padding,
          componentStates.default.transition
        )}
      >
        {/* Icon */}
        <div className={cn(isError ? "space-y-4" : "mb-6")}>
          <div
            className={cn(
              'flex items-center justify-center rounded-full',
              CustomIcon ? getThemeClass('componentSecondary') : config.iconBg,
              sizeStyles.padding
            )}
          >
            <Icon 
              className={cn(
                sizeStyles.text === 'text-sm' ? 'h-8 w-8' :
                sizeStyles.text === 'text-base' ? 'h-12 w-12' :
                sizeStyles.text === 'text-lg' ? 'h-16 w-16' : 'h-20 w-20',
                CustomIcon ? getThemeClass('textSecondary') : config.iconColor
              )} 
            />
          </div>
        </div>

        {/* Text */}
        <div className={cn(isError ? "space-y-2" : spacing.inner.tight)}>
          <h3
            className={cn(
              sizeStyles.text,
              'font-semibold tracking-tight',
              getThemeClass('textPrimary')
            )}
          >
            {displayTitle}
          </h3>
          <p className={cn(
            sizeStyles.text === 'text-sm' ? 'text-xs' :
            sizeStyles.text === 'text-base' ? 'text-sm' :
            sizeStyles.text === 'text-lg' ? 'text-base' : 'text-lg',
            getThemeClass('textSecondary')
          )}>
            {displayMessage}
          </p>
        </div>

        {/* Retry button - shown only when needed */}
        {onRetry && (
          <div className="mt-4">
            <button
              onClick={onRetry}
              className={cn(
                buttonSystem.base,
                isError ? buttonSystem.variants.destructive : buttonSystem.variants.default,
                buttonSystem.sizes.sm,
                componentStates.clickable.transition,
                componentStates.clickable.cursor
              )}
            >
              <RefreshCw className="h-4 w-4" />
              {retryText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}