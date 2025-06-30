'use client';

import { useTheme } from '@/hooks/useTheme';
import { componentSizes, spacing } from '@/styles/design-system';

export function TotalTimeCardSkeleton() {
  const { getThemeClass } = useTheme();
  
  return (
    <div className={`${componentSizes.large.borderRadius} ${componentSizes.medium.border} ${componentSizes.medium.padding} ${componentSizes.small.shadow} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <div className="space-y-4">
        <div className={`h-6 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
        <div className={`h-12 w-48 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
        <div className={`h-4 w-24 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
      </div>
    </div>
  );
}

export function CategoryListSkeleton() {
  const { getThemeClass } = useTheme();
  
  return (
    <div className={`${componentSizes.large.borderRadius} ${componentSizes.medium.border} ${componentSizes.medium.padding} ${componentSizes.small.shadow} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <div className="space-y-4">
        <div className={`h-6 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`h-4 w-4 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
                <div className={`h-4 w-24 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
              </div>
              <div className={`h-4 w-16 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ActivityListSkeleton() {
  const { getThemeClass } = useTheme();
  
  return (
    <div className={`${componentSizes.large.borderRadius} ${componentSizes.medium.border} ${componentSizes.medium.padding} ${componentSizes.small.shadow} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <div className="space-y-4">
        <div className={`h-6 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className={`h-8 w-8 animate-pulse rounded-full ${getThemeClass('componentSecondary')}`}></div>
                <div>
                  <div className={`h-4 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')} mb-1`}></div>
                  <div className={`h-3 w-20 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
                </div>
              </div>
              <div className={`h-4 w-16 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StatisticsChartSkeleton() {
  const { getThemeClass } = useTheme();
  
  return (
    <div className={`${componentSizes.large.borderRadius} ${componentSizes.medium.border} ${componentSizes.medium.padding} ${componentSizes.small.shadow} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className={`h-6 w-40 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
          <div className="flex space-x-2">
            <div className={`h-8 w-16 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
            <div className={`h-8 w-16 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
          </div>
        </div>
        <div className={`h-64 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
      </div>
    </div>
  );
}

export function TimelineChartSkeleton() {
  const { getThemeClass } = useTheme();
  
  return (
    <div className={`${componentSizes.large.borderRadius} ${componentSizes.medium.border} ${componentSizes.medium.padding} ${componentSizes.small.shadow} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <div className="space-y-4">
        <div className={`h-6 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
        <div className={`h-80 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
      </div>
    </div>
  );
}

export function HourlyUsageComparisonSkeleton() {
  const { getThemeClass } = useTheme();
  
  return (
    <div className={`${componentSizes.large.borderRadius} ${componentSizes.medium.border} ${componentSizes.medium.padding} ${componentSizes.small.shadow} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <div className="space-y-4">
        <div className={`h-6 w-48 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`h-64 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
          <div className={`h-64 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
        </div>
      </div>
    </div>
  );
}