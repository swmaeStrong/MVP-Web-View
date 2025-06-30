'use client';

import { useCurrentUser, User } from '@/stores/userStore';
import { useRef } from 'react';
import EmptyState from './EmptyState';
import UserCard from './UserCard';
import { useTheme } from '@/hooks/useTheme';
import { componentSizes, componentStates, spacing } from '@/styles/design-system';

// 리더보드 표시용 확장된 User 타입
type LeaderboardUser = User & {
  score: number;
  rank: number;
  isMe?: boolean;
};

interface LeaderboardListProps {
  users: LeaderboardUser[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  isFetchingNextPage: boolean;
  refetch: () => void;
  selectedPeriod: 'daily' | 'weekly' | 'monthly';
  selectedCategory: string;
  selectedDateIndex: number;
}

export default function LeaderboardList({
  users,
  isLoading,
  isError,
  error,
  isFetchingNextPage,
  refetch,
  selectedPeriod,
  selectedCategory,
  selectedDateIndex,
}: LeaderboardListProps) {
  const currentUser = useCurrentUser();
  const { getThemeClass, getThemeTextColor } = useTheme();

  // 현재 유저 하이라이트를 위한 ref
  const currentUserRef = useRef<HTMLDivElement>(null);

  // Loading state
  if (isLoading) {
    return (
      <div className='mb-8 flex justify-center'>
        <div className={`${componentSizes.medium.borderRadius} ${componentSizes.medium.border} ${componentSizes.xlarge.padding} text-center ${componentSizes.small.shadow} ${getThemeClass('border')} ${getThemeClass('component')}`}>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600'></div>
          <p className={getThemeTextColor('secondary')}>Loading leaderboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className='mb-8 flex justify-center'>
        <div className={`${componentSizes.medium.borderRadius} ${componentSizes.medium.border} ${componentSizes.xlarge.padding} text-center ${componentSizes.small.shadow} ${getThemeClass('border')} ${getThemeClass('component')}`}>
          <p className='mb-4 font-medium text-red-600'>
            ❌ {error.message || 'An error occurred while loading data.'}
          </p>
          <p className={`mb-4 text-sm ${getThemeTextColor('secondary')}`}>
            Server request was interrupted. Please try again later.
          </p>
          <button
            onClick={() => refetch()}
            className='rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty data state
  if (!users || users.length === 0) {
    return (
      <EmptyState
        selectedPeriod={selectedPeriod}
        selectedCategory={selectedCategory}
        selectedDateIndex={selectedDateIndex}
        refetch={refetch}
      />
    );
  }

  return (
    <>

      {/* Leaderboard list */}
      <div className='mb-6'>
        <div className='space-y-2 lg:space-y-3'>
          {users.map((user: LeaderboardUser, index: number) => {
            // 현재 유저인지 확인
            const isCurrentUser = currentUser && user.id === currentUser.id;

            return (
              <UserCard
                key={`rank-${index + 1}-${user.id || user.nickname || index}`}
                user={user}
                index={index}
                totalUsers={users.length}
                isCurrentUser={!!isCurrentUser}
              />
            );
          })}
        </div>
      </div>

      {/* Infinite scroll loading indicator */}
      {isFetchingNextPage && (
        <div className='flex justify-center'>
          <div className={`rounded-lg border-2 p-4 shadow-sm ${getThemeClass('border')} ${getThemeClass('component')}`}>
            <div className='mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600'></div>
            <p className={`text-sm ${getThemeTextColor('secondary')}`}>
              Loading more competitors...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
