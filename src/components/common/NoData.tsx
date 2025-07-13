'use client';

import { cn } from '@/shadcn/lib/utils';
import { Inbox } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import type { ComponentSize } from '@/hooks/useDesignSystem';
import { cardSystem, componentSizes, componentStates, spacing } from '@/styles/design-system';

interface NoDataProps {
  title?: string;
  message?: string;
  size?: ComponentSize;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  showBorder?: boolean;
}

export default function NoData({
  title = 'No Data Available',
  message = 'No data to display.',
  size = 'medium',
  icon: Icon = Inbox,
  className,
  showBorder = true,
}: NoDataProps) {
  const { getThemeClass } = useTheme();
  // const { getCardStyle } = useDesignSystem(); // 제거됨

  // 디자인 시스템에 맞춘 스타일 적용
  // const cardStyle = getCardStyle(size, 'default'); // 제거됨
  const sizeStyles = componentSizes[size];

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
            sizeStyles.shadow
          ],
          !showBorder && sizeStyles.padding,
          componentStates.default.transition
        )}
      >
        {/* Icon */}
        <div className="mb-6">
          <div
            className={cn(
              'flex items-center justify-center rounded-full',
              getThemeClass('componentSecondary'),
              sizeStyles.padding
            )}
          >
            <Icon 
              className={cn(
                sizeStyles.text === 'text-sm' ? 'h-8 w-8' :
                sizeStyles.text === 'text-base' ? 'h-12 w-12' :
                sizeStyles.text === 'text-lg' ? 'h-16 w-16' : 'h-20 w-20',
                getThemeClass('textSecondary')
              )} 
            />
          </div>
        </div>

        {/* Text */}
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
      </div>
    </div>
  );
}
