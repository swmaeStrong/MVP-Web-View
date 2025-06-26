'use client';

import { cn } from '@/shadcn/lib/utils';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useDesignSystem, type ComponentSize } from '@/hooks/useDesignSystem';
import { cardSystem, buttonSystem, componentSizes, componentStates } from '@/styles/design-system';

interface ErrorStateProps {
  title?: string;
  message?: string;
  size?: ComponentSize;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  onRetry?: () => void;
  retryText?: string;
  showBorder?: boolean;
}

export default function ErrorState({
  title = '오류가 발생했습니다',
  message = '문제가 발생했습니다. 다시 시도해주세요.',
  size = 'medium',
  icon: Icon = AlertTriangle,
  className,
  onRetry,
  retryText = '다시 시도',
  showBorder = true,
}: ErrorStateProps) {
  const { getThemeClass } = useTheme();
  const { getCardStyle, getButtonStyle, spacing } = useDesignSystem();

  // 디자인 시스템에 맞춘 스타일 적용
  const cardStyle = getCardStyle(size, 'default');
  const sizeStyles = componentSizes[size];
  const buttonStyle = getButtonStyle('small', 'secondary');

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
            'border-red-200 dark:border-red-900/50'
          ],
          !showBorder && sizeStyles.padding,
          componentStates.default.transition
        )}
      >
        {/* 아이콘 */}
        <div className={cn(spacing.inner.normal)}>
          <div
            className={cn(
              'flex items-center justify-center rounded-full',
              'bg-red-50 dark:bg-red-900/20',
              sizeStyles.padding
            )}
          >
            <Icon 
              className={cn(
                sizeStyles.text === 'text-sm' ? 'h-8 w-8' :
                sizeStyles.text === 'text-base' ? 'h-12 w-12' :
                sizeStyles.text === 'text-lg' ? 'h-16 w-16' : 'h-20 w-20',
                'text-red-500'
              )} 
            />
          </div>
        </div>

        {/* 텍스트 */}
        <div className={spacing.inner.tight}>
          <h3
            className={cn(
              sizeStyles.text,
              'font-semibold tracking-tight',
              getThemeClass('textPrimary')
            )}
          >
            {title}
          </h3>
          <p className={cn(
            sizeStyles.text === 'text-sm' ? 'text-xs' :
            sizeStyles.text === 'text-base' ? 'text-sm' :
            sizeStyles.text === 'text-lg' ? 'text-base' : 'text-lg',
            getThemeClass('textSecondary')
          )}>
            {message}
          </p>
        </div>

        {/* 재시도 버튼 */}
        {onRetry && (
          <div className="mt-4">
            <button
              onClick={onRetry}
              className={cn(
                buttonSystem.base,
                buttonSystem.variants.destructive,
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
