'use client';

import { useCurrentUser, User } from '@/stores/userStore';
import { useRef } from 'react';
import EmptyState from './EmptyState';
import UserCard from './UserCard';
import { tierAnimationStyles } from './tierConfig';

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

  // 현재 유저 하이라이트를 위한 ref
  const currentUserRef = useRef<HTMLDivElement>(null);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className='mb-8 flex justify-center'>
        <div className='rounded-lg border border-gray-100 bg-white p-8 text-center shadow-sm'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600'></div>
          <p className='text-gray-600'>리더보드 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className='mb-8 flex justify-center'>
        <div className='rounded-lg border border-gray-100 bg-white p-8 text-center shadow-sm'>
          <p className='mb-4 font-medium text-red-600'>
            ❌ {error.message || '데이터를 불러오는 중 오류가 발생했습니다.'}
          </p>
          <p className='mb-4 text-sm text-gray-500'>
            서버 요청이 중단되었습니다. 잠시 후 다시 시도해주세요.
          </p>
          <button
            onClick={() => refetch()}
            className='rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700'
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 빈 데이터 상태
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
      <style>{tierAnimationStyles}</style>

      {/* 리더보드 목록 */}
      <div className='mb-8'>
        <div className='space-y-3'>
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

      {/* 무한 스크롤 로딩 표시 */}
      {isFetchingNextPage && (
        <div className='flex justify-center'>
          <div className='rounded-lg border border-gray-100 bg-gradient-to-br from-purple-50/50 to-blue-50/50 p-4 shadow-sm'>
            <div className='mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600'></div>
            <p className='text-sm text-gray-600'>
              더 많은 경쟁자들을 불러오는 중...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
