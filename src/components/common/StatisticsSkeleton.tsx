'use client';

import { useTheme } from '@/hooks/useTheme';
import { componentSizes } from '@/styles/design-system';

export function TotalTimeCardSkeleton() {
  const { getThemeClass } = useTheme();
  
  return (
    <div className={`${componentSizes.large.borderRadius} ${componentSizes.medium.border} ${componentSizes.medium.padding} ${componentSizes.small.shadow} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      {/* Date navigation header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`h-7 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
          {/* Goal circles skeleton */}
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`w-12 h-12 animate-pulse rounded-full ${getThemeClass('componentSecondary')}`}></div>
            ))}
          </div>
        </div>
        <div className='flex gap-2'>
          <div className={`h-8 w-8 animate-pulse rounded-lg ${getThemeClass('componentSecondary')}`}></div>
          <div className={`h-8 w-8 animate-pulse rounded-lg ${getThemeClass('componentSecondary')}`}></div>
        </div>
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


export function StatisticsChartSkeleton() {
  const { getThemeClass } = useTheme();
  
  return (
    <div className={`h-full flex items-center justify-center ${componentSizes.large.borderRadius} ${componentSizes.medium.border} ${componentSizes.small.shadow} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <div className="flex flex-1 justify-center items-center h-full p-2 pt-0">
        {/* Pie chart skeleton - horizontal layout */}
        <div className="flex items-center p-4 gap-24">
          {/* Left - Pie Chart skeleton */}
          <div className="flex-shrink-0">
            <div className={`w-[140px] h-[140px] animate-pulse rounded-full ${getThemeClass('componentSecondary')}`}></div>
          </div>
          
          {/* Right - Category Details skeleton */}
          <div className="flex-1">
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-3 h-3 animate-pulse rounded-full ${getThemeClass('componentSecondary')}`}></div>
                  <div className="flex-1 min-w-0">
                    <div className={`h-4 w-20 animate-pulse rounded ${getThemeClass('componentSecondary')} mb-1`}></div>
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-12 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
                      <div className={`h-3 w-8 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export function ActivityListSkeleton() {
  const { getThemeClass } = useTheme();
  
  return (
    <div className={`h-full ${componentSizes.large.borderRadius} ${componentSizes.medium.border} ${componentSizes.medium.padding} ${componentSizes.small.shadow} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <div className="flex flex-col h-full">
        {/* Header with title and filter */}
        <div className="flex items-center justify-between mb-4">
          <div className={`h-6 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
          <div className="flex gap-2">
            <div className={`h-8 w-24 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
            <div className={`h-8 w-8 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
          </div>
        </div>
        
        {/* Activity list items with fixed height */}
        <div className="flex-1 overflow-y-auto space-y-2 max-h-[325px]">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className={`p-3 rounded-lg ${getThemeClass('componentSecondary')}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 animate-pulse rounded ${getThemeClass('border')}`}></div>
                  <div className="space-y-1">
                    <div className={`h-4 w-28 animate-pulse rounded ${getThemeClass('border')}`}></div>
                    <div className={`h-3 w-20 animate-pulse rounded ${getThemeClass('border')}`}></div>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <div className={`h-4 w-14 animate-pulse rounded ${getThemeClass('border')}`}></div>
                  <div className={`h-3 w-10 animate-pulse rounded ${getThemeClass('border')}`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
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