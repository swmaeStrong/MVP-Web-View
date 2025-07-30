'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { componentSizes, spacing } from '@/styles/design-system';

export function MyRankBannerSkeleton() {
  const { getThemeClass } = useTheme();
  
  return (
    <>
      <div className={`mb-3 lg:mb-4 rounded-lg border p-3 lg:p-4 ${getThemeClass('component')} ${getThemeClass('border')} shadow-sm`}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div>
              <div className='flex items-center space-x-2'>
                <div className={`h-4 lg:h-5 w-24 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
              </div>
              <div className='flex items-center space-x-2 mt-0.5'>
                <div className={`h-3 w-20 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
              </div>
            </div>
          </div>
          <div className='flex items-center'>
            <div className={`h-6 lg:h-7 w-12 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
          </div>
        </div>
      </div>
      
      {/* 구분선 스켈레톤 추가 */}
      <div className='mb-2 lg:mb-3'>
        <div className={`h-px w-full ${getThemeClass('border')}`}></div>
      </div>
    </>
  );
}

export function UserCardSkeleton() {
  const { getThemeClass } = useTheme();
  
  return (
    <div className={`group relative flex items-center justify-between rounded-lg border p-3 lg:p-4 shadow-sm ${getThemeClass('border')} ${getThemeClass('component')}`}>
      {/* 좌측 - 순위 & 사용자 정보 */}
      <div className='flex items-center space-x-2 lg:space-x-3'>
        {/* 순위 표시 */}
        <div className={`flex h-7 w-7 lg:h-10 lg:w-10 items-center justify-center`}>
          <div className={`h-4 lg:h-5 w-4 lg:w-5 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
        </div>
        
        {/* 사용자 정보 */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center space-x-2'>
            <div className={`h-4 lg:h-5 w-24 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
          </div>
        </div>
      </div>

      {/* 우측 - 점수 정보 (total category 경우 더 넓은 공간) */}
      <div className='flex items-center gap-2 flex-shrink-0'>
        {/* Total category 상세 정보 영역 */}
        <div className='w-64 lg:w-72 flex items-center justify-start'>
          <div className='flex items-center gap-3'>
            {/* Progress bar skeleton */}
            <div className={`relative h-6 w-20 lg:w-24 rounded-lg overflow-hidden ${getThemeClass('componentSecondary')}`}>
              <div className={`h-full w-full animate-pulse ${getThemeClass('borderLight')}`}></div>
            </div>
            
            {/* Details skeleton */}
            <div className='flex flex-col gap-0.5 w-36 lg:w-40'>
              <div className={`h-3 w-24 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
              <div className={`h-3 w-20 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
            </div>
          </div>
        </div>
        
        {/* 점수 표시 */}
        <div className='w-20 lg:w-24 text-right'>
          <div className={`h-5 lg:h-6 w-16 lg:w-20 animate-pulse rounded ${getThemeClass('componentSecondary')} mb-1 ml-auto`}></div>
          <div className={`h-3 w-16 lg:w-20 animate-pulse rounded ${getThemeClass('componentSecondary')} ml-auto`}></div>
        </div>
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
  const { getThemeClass, isDarkMode } = useTheme();
  
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
          <div className={`inline-block rounded-lg px-4 py-2 border ${getThemeClass('border')} ${getThemeClass('component')}`}>
            <div className={`h-4 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
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