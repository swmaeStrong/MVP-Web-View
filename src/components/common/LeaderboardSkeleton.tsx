'use client';

import { useTheme } from '@/hooks/useTheme';
import { componentSizes, spacing } from '@/styles/design-system';

export function MyRankBannerSkeleton() {
  const { getThemeClass } = useTheme();
  
  return (
    <div className={`mb-3 lg:mb-4 rounded-lg border p-3 lg:p-4 ${getThemeClass('component')} ${getThemeClass('border')} shadow-lg`}>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div>
            <div className='flex items-center space-x-2'>
              <div className={`h-4 w-24 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
              <div className='rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-xs font-bold text-white'>
                YOU
              </div>
            </div>
            <div className='flex items-center space-x-2 mt-0.5'>
              <div className={`h-3 w-16 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
            </div>
          </div>
        </div>
        <div className='text-right'>
          <div className={`h-6 w-12 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
        </div>
      </div>
    </div>
  );
}

export function UserCardSkeleton() {
  const { getThemeClass } = useTheme();
  
  return (
    <div className={`group relative flex items-center justify-between rounded-lg border p-3 lg:p-4 shadow-sm ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <div className='flex items-center space-x-2 lg:space-x-3'>
        <div className={`flex h-7 w-7 lg:h-10 lg:w-10 items-center justify-center rounded-full border ${getThemeClass('componentSecondary')} ${getThemeClass('border')}`}>
          <div className={`h-3 w-3 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
        </div>
        
        <div className='flex-1 min-w-0'>
          <div className='flex items-center space-x-2'>
            <div className={`h-4 w-20 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
          </div>
        </div>
      </div>

      <div className='text-right flex-shrink-0'>
        <div className={`h-5 w-16 animate-pulse rounded ${getThemeClass('componentSecondary')} mb-1`}></div>
        <div className={`h-3 w-20 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
      </div>
    </div>
  );
}

export function LeaderboardListSkeleton({ itemCount = 10 }: { itemCount?: number }) {
  return (
    <div className='mb-6'>
      <div className='space-y-2 lg:space-y-3'>
        {[...Array(itemCount)].map((_, index) => (
          <UserCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function CategoryFilterSkeleton() {
  const { getThemeClass } = useTheme();
  
  return (
    <div className='flex justify-center mb-8'>
      <div className='flex flex-wrap gap-2 lg:gap-3'>
        {[...Array(6)].map((_, index) => (
          <div 
            key={index} 
            className={`h-8 w-16 animate-pulse rounded-lg border ${getThemeClass('border')} ${getThemeClass('component')}`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export function PeriodSelectorSkeleton() {
  const { getThemeClass } = useTheme();
  
  return (
    <div className={`mb-6 rounded-lg border p-4 shadow-sm ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-row gap-3'>
            {[...Array(3)].map((_, index) => (
              <div 
                key={index}
                className={`h-8 w-16 animate-pulse rounded-lg border ${getThemeClass('border')} ${getThemeClass('component')}`}
              ></div>
            ))}
          </div>
          
          <div className='flex gap-2'>
            <div className={`h-8 w-8 animate-pulse rounded-lg border ${getThemeClass('border')} ${getThemeClass('component')}`}></div>
            <div className={`h-8 w-8 animate-pulse rounded-lg border ${getThemeClass('border')} ${getThemeClass('component')}`}></div>
          </div>
        </div>

        <div className='flex justify-center'>
          <div className='inline-block rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 shadow-sm'>
            <div className='h-4 w-32 animate-pulse rounded bg-white/20'></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatsSectionSkeleton() {
  const { getThemeClass } = useTheme();
  
  return (
    <div className={`${componentSizes.large.borderRadius} ${componentSizes.medium.border} ${componentSizes.medium.padding} ${componentSizes.small.shadow} ${getThemeClass('border')} ${getThemeClass('component')} ${spacing.section.normal}`}>
      <div className="space-y-4">
        <div className={`h-6 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="text-center">
              <div className={`h-8 w-16 animate-pulse rounded ${getThemeClass('componentSecondary')} mx-auto mb-2`}></div>
              <div className={`h-4 w-12 animate-pulse rounded ${getThemeClass('componentSecondary')} mx-auto`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}