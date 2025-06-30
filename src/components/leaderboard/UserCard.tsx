'use client';

import { User } from '@/stores/userStore';
import { extendedRankColors, rankColors } from '@/styles';
import Image from 'next/image';
import { getTierStyle } from './tierConfig';
import { useTheme } from '@/hooks/useTheme';
import { componentSizes, componentStates, getPriorityStyle, getRankPriority } from '@/styles/design-system';

type LeaderboardUser = User & {
  score: number;
  rank: number;
  isMe?: boolean;
};

interface UserCardProps {
  user: LeaderboardUser;
  index: number;
  totalUsers: number;
  isCurrentUser: boolean;
}

// Function to convert seconds to hours, minutes format
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
};

// 순위 정보 가져오기
const getRankInfo = (index: number) => {
  const rank = index + 1;
  if (rank <= 10) {
    return rankColors[rank as keyof typeof rankColors];
  } else if (rank <= 20) {
    return extendedRankColors.expert;
  } else if (rank <= 35) {
    return extendedRankColors.challenger;
  } else {
    return extendedRankColors.rookie;
  }
};

export default function UserCard({
  user,
  index,
  totalUsers,
  isCurrentUser,
}: UserCardProps) {
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();
  const rank = index + 1;
  const rankInfo = getRankInfo(index);
  const topRankStyle = getTierStyle(rank, totalUsers);
  
  // 디자인 시스템 적용 - 일관된 스타일
  const priorityStyle = getPriorityStyle(rank);
  const priorityLevel = getRankPriority(rank);
  const cardSize = componentSizes.medium; // 모든 카드 동일한 크기

  return (
    <div
      key={`rank-${rank}-${user.id || user.nickname || index}`}
      data-user-id={user.id}
      className={`group relative flex items-center justify-between rounded-lg border p-3 lg:p-4 shadow-sm ${componentStates.hoverable.transition} ${getThemeClass('border')} ${getThemeClass('component')} ${
        isCurrentUser
          ? `ring-2 ${isDarkMode ? 'ring-purple-400' : 'ring-purple-300'}`
          : ''
      }`}
      style={{}}
    >
      {/* 좌측 - 순위 & 특별 아이콘 & 사용자 정보 */}
      <div className='flex items-center space-x-2 lg:space-x-3'>
        {/* 순위 표시 - 컴팩트 사이즈 */}
        <div
          className={`flex h-7 w-7 lg:h-10 lg:w-10 items-center justify-center rounded-full border text-xs lg:text-sm font-bold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')} ${getThemeClass('border')}`}
        >
          {rank}
        </div>

        {/* 순위 아이콘 - 컴팩트 사이즈 */}
        <div className='flex h-7 w-7 lg:h-10 lg:w-10 items-center justify-center'>
          <Image
            src={topRankStyle?.icon || '/icons/rank/bronze.png'}
            alt={topRankStyle?.title || 'Bronze'}
            width={28}
            height={28}
            className='drop-shadow-lg lg:w-10 lg:h-10'
          />
        </div>

        {/* 사용자 정보 */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center space-x-2'>
            <h3
              className={`text-sm lg:text-base font-bold truncate ${getThemeTextColor('primary')}`}
            >
              {user.nickname}
            </h3>

            {/* 사용자 표시 - 컴팩트 */}
            {isCurrentUser && (
              <span className='rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm'>
                YOU
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right - time info */}
      <div className='text-right flex-shrink-0'>
        <div
          className={`text-sm lg:text-xl font-bold ${
            topRankStyle
              ? getThemeTextColor('primary')
              : getThemeTextColor('primary')
          }`}
        >
          {formatTime(user.score)}
        </div>
        <div className={`text-xs ${getThemeTextColor('secondary')}`}>Activity Time</div>
      </div>
    </div>
  );
}
