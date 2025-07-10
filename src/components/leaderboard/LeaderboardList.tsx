'use client';

import { useCurrentUser, User } from '@/stores/userStore';
import { useRef } from 'react';
import EmptyState from './EmptyState';
import ErrorState from '@/components/common/ErrorState';
import UserCard from './UserCard';
import { useTheme } from '@/hooks/useTheme';
import { componentSizes, componentStates, spacing } from '@/styles/design-system';
import { LeaderboardListSkeleton } from '@/components/common/LeaderboardSkeleton';
import { cn } from '@/shadcn/lib/utils';
import { LEADERBOARD_CONFIG } from '@/shared/constants/infinite-scroll';
import { FONT_SIZES } from '@/styles/font-sizes';

// 리더보드 표시용 확장된 User 타입
type LeaderboardUser = LeaderBoard.LeaderBoardResponse & {
  id?: string;
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
  containerRef?: React.RefObject<HTMLDivElement | null>;
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
  containerRef,
}: LeaderboardListProps) {
  const currentUser = useCurrentUser();
  const { getThemeClass, getThemeTextColor } = useTheme();
  
  // 작은 사이즈 기준으로 통일된 컨테이너 높이
  const containerHeight = LEADERBOARD_CONFIG.CONTAINER_HEIGHT.MOBILE;

  // 현재 유저 하이라이트를 위한 ref
  const currentUserRef = useRef<HTMLDivElement>(null);

  // Loading state
  if (isLoading) {
    return <LeaderboardListSkeleton itemCount={LEADERBOARD_CONFIG.SKELETON_ITEM_COUNT} />;
  }

  // Error state
  if (isError) {
    return (
      <div className='mb-8'>
        <ErrorState
          title="Failed to load leaderboard"
          message={error.message || 'Unable to load ranking data. Please check your connection and try again.'}
          size="medium"
          onRetry={() => refetch()}
          retryText="Try Again"
          showBorder={true}
        />
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
    <div 
      ref={containerRef}
      className={cn(
        "overflow-y-auto rounded-lg border p-4",
        getThemeClass('border'),
        getThemeClass('component'),
        "activity-scroll-hide"
      )}
      style={{ 
        height: `${containerHeight}px` 
      }}
    >
      {/* Leaderboard list */}
      <div className="space-y-2 lg:space-y-3">
        {users.map((user: LeaderboardUser, index: number) => {
          // 현재 유저인지 확인
          const isCurrentUser = currentUser && user.userId === currentUser.id;

          return (
            <UserCard
              key={`rank-${index + 1}-${user.userId || user.nickname || index}`}
              user={user}
              index={index}
              totalUsers={users.length}
              isCurrentUser={!!isCurrentUser}
              category={selectedCategory}
            />
          );
        })}
      </div>

      {/* Infinite scroll loading indicator */}
      {isFetchingNextPage && (
        <div className="flex justify-center mt-4 mb-4">
          <div className={`rounded-lg border-2 p-4 shadow-sm ${getThemeClass('border')} ${getThemeClass('component')}`}>
            <div className='mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600'></div>
            <p className={`${FONT_SIZES.LEADERBOARD.PRIMARY} ${getThemeTextColor('secondary')}`}>
              Loading more competitors...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
