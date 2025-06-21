'use client';

import { User } from '@/stores/userStore';
import { extendedRankColors, rankColors } from '@/styles';
import Image from 'next/image';
import { getTierStyle } from './tierConfig';

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

// 초 단위를 시간, 분 형식으로 변환하는 함수
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}분`;
  } else if (minutes === 0) {
    return `${hours}시간`;
  } else {
    return `${hours}시간 ${minutes}분`;
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
  const rank = index + 1;
  const rankInfo = getRankInfo(index);
  const topRankStyle = getTierStyle(rank, totalUsers);

  return (
    <div
      key={`rank-${rank}-${user.id || user.nickname || index}`}
      data-user-id={user.id}
      className={`group relative flex items-center justify-between rounded-xl border p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
        topRankStyle
          ? `${topRankStyle.borderClass} ring-opacity-30`
          : 'border-gray-100 bg-white hover:border-purple-100'
      } ${
        isCurrentUser
          ? topRankStyle
            ? 'ring-2 ring-purple-200'
            : 'border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50 ring-1 ring-purple-200'
          : topRankStyle
            ? ''
            : 'bg-white'
      }`}
      style={
        topRankStyle
          ? {
              animation: topRankStyle.glowAnimation,
            }
          : {}
      }
    >
      {/* 좌측 - 순위 & 특별 아이콘 & 사용자 정보 */}
      <div className='flex items-center space-x-4'>
        {/* 순위 표시 */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm font-bold transition-transform duration-200 group-hover:scale-110 ${
            topRankStyle
              ? `${topRankStyle.rankBg} ${topRankStyle.rankText} border-white shadow-lg`
              : `${rankInfo.bgColor} ${rankInfo.textColor} ${rankInfo.borderColor}`
          }`}
        >
          {rank}
        </div>

        {/* 순위 아이콘 */}
        <div className='flex h-12 w-12 items-center justify-center'>
          <Image
            src={topRankStyle.icon}
            alt={topRankStyle.title}
            width={48}
            height={48}
            className='drop-shadow-lg transition-transform duration-200 group-hover:scale-110'
          />
        </div>

        {/* 사용자 정보 */}
        <div className='flex-1'>
          <div className='flex items-center space-x-3'>
            <h3
              className={`text-lg font-bold transition-colors duration-200 ${
                topRankStyle
                  ? topRankStyle.nameColor
                  : 'text-gray-800 group-hover:text-purple-700'
              }`}
            >
              {user.nickname}
            </h3>

            {/* 사용자 표시 */}
            {isCurrentUser && (
              <span className='animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs font-bold text-white shadow-sm'>
                YOU
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 우측 - 시간 정보 */}
      <div className='text-right'>
        <div
          className={`text-2xl font-bold transition-colors duration-200 ${
            topRankStyle
              ? 'text-gray-900'
              : 'text-gray-900 group-hover:text-purple-700'
          }`}
        >
          {formatTime(user.score)}
        </div>
        <div className='text-xs text-gray-500'>활동시간</div>
      </div>
    </div>
  );
}
