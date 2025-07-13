'use client';

import { useTheme } from '@/hooks/useTheme';
import { categoryColors } from '@/styles';
import { componentSizes, componentStates, getPriorityStyle, getRankPriority } from '@/styles/design-system';
import { FONT_SIZES } from '@/styles/font-sizes';
import { ProcessedDetail, formatScoreToMinutes, getCategoryDisplayName, processLeaderboardDetails } from '@/utils/leaderboard';
import { Medal } from 'lucide-react';

interface UserCardProps {
  user: LeaderBoard.LeaderBoardApiResponse & { id?: string; isMe?: boolean };
  index: number;
  totalUsers: number;
  isCurrentUser: boolean;
  category: string;
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


export default function UserCard({
  user,
  index,
  totalUsers,
  isCurrentUser,
  category,
}: UserCardProps) {
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();
  const rank = user.rank; // API에서 받은 실제 rank 값 사용
  
  // 디자인 시스템 적용 - 일관된 스타일
  const priorityStyle = getPriorityStyle(rank);
  const priorityLevel = getRankPriority(rank);
  const cardSize = componentSizes.medium; // 모든 카드 동일한 크기

  return (
    <div
      key={`rank-${rank}-${user.userId || user.nickname || index}`}
      data-user-id={user.userId}
      className={`group relative flex items-center justify-between rounded-lg border p-3 shadow-sm ${componentStates.hoverable.transition} ${getThemeClass('border')} ${getThemeClass('component')} ${
        isCurrentUser
          ? `ring-2 ${isDarkMode ? 'ring-purple-400' : 'ring-purple-300'}`
          : ''
      }`}
      style={{}}
    >
      {/* 좌측 - 순위 & 특별 아이콘 & 사용자 정보 */}
      <div className='flex items-center space-x-2'>
        {/* 순위 표시 */}
        <div
          className={`flex h-6 w-6 items-center justify-center ${rank <= 3 ? '' : ''}`}
        >
          {rank === 1 ? (
            <Medal className="w-4 h-4 text-yellow-500" />
          ) : rank === 2 ? (
            <Medal className="w-4 h-4 text-gray-400" />
          ) : rank === 3 ? (
            <Medal className="w-4 h-4 text-amber-600" />
          ) : (
            <span className={`${FONT_SIZES.LEADERBOARD.RANK} font-bold ${getThemeTextColor('secondary')}`}>{rank}</span>
          )}
        </div>


        {/* 사용자 정보 */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center space-x-2'>
            <h3
              className={`${FONT_SIZES.LEADERBOARD.PRIMARY} font-bold truncate ${getThemeTextColor('primary')}`}
            >
              {user.nickname}
            </h3>

            {/* 사용자 표시 - 컴팩트 */}
            {isCurrentUser && (
              <span className={`rounded-full border px-1.5 py-0.5 ${FONT_SIZES.LEADERBOARD.BUTTON} font-bold shadow-sm ${isDarkMode ? 'border-purple-400' : 'border-purple-300'} ${getThemeClass('component')} ${getThemeTextColor('primary')}`}>
                YOU
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right - score info */}
      <div className='flex items-center gap-4 flex-shrink-0'>
        {/* Details for total category - Fixed position */}
        <div className='lg:w-56 flex items-center justify-start'>
          {category === 'work' && user.details && user.details.length > 0 && (() => {
            const processedDetails = processLeaderboardDetails(user.details);
            
            return (
              <div className='flex items-center gap-4'>
                {/* Stacked progress bar */}
                <div className={`relative h-4 w-20 rounded-md overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className='flex h-full'>
                    {processedDetails.map((detail: ProcessedDetail, detailIndex: number) => {
                      // 카테고리 색상 가져오기 - styles/colors.ts에서 정의된 공통 색상 사용
                      const getCategoryColors = (category: string) => {
                        return categoryColors[category as keyof typeof categoryColors] || categoryColors.default;
                      };
                      
                      const colors = getCategoryColors(detail.category);
                      const categoryColor = colors.bg;
                      const hoverColor = colors.hover;
                        
                      return (
                        <div
                          key={detailIndex}
                          className={`relative group transition-all duration-200 ${categoryColor} ${hoverColor}`}
                          style={{ width: `${detail.percentage}%` }}
                        >
                          {/* Tooltip on hover */}
                          <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10`}>
                            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-900'} text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap`}>
                              <div className='font-medium'>
                                {getCategoryDisplayName(detail.category)}
                              </div>
                              <div className='text-gray-300'>
                                {formatScoreToMinutes(detail.score)} ({detail.percentage}%)
                              </div>
                            </div>
                            {/* Tooltip arrow */}
                            <div className={`absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 ${isDarkMode ? 'border-gray-800' : 'border-gray-900'} border-l-transparent border-r-transparent`}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Details breakdown */}
                <div className='flex flex-col gap-1.5 text-xs w-32'>
                  {processedDetails.slice(0, 2).map((detail: ProcessedDetail, detailIndex: number) => (
                    <div key={detailIndex} className='flex items-center gap-2'>
                      <div className={`w-2 h-2 rounded flex-shrink-0 ${
                        (categoryColors[detail.category as keyof typeof categoryColors] || categoryColors.default).dot
                      }`} />
                      <span className={`${FONT_SIZES.LEADERBOARD.SECONDARY} ${getThemeTextColor('secondary')} whitespace-nowrap truncate`}>
                        {getCategoryDisplayName(detail.category)}
                      </span>
                      <span className={`${getThemeTextColor('primary')} font-medium ${FONT_SIZES.LEADERBOARD.SECONDARY} whitespace-nowrap ml-auto`}>
                        {detail.percentage}%
                      </span>
                    </div>
                  ))}
                  {processedDetails.length > 2 && (
                    <div className='flex items-center gap-2'>
                      <div className={`w-2 h-2 rounded flex-shrink-0 ${categoryColors.others.dot}`} />
                      <span className={`${getThemeTextColor('secondary')} ${FONT_SIZES.LEADERBOARD.SECONDARY} whitespace-nowrap`}>Others</span>
                      <span className={`${getThemeTextColor('primary')} font-medium ${FONT_SIZES.LEADERBOARD.SECONDARY} whitespace-nowrap ml-auto`}>
                        {processedDetails.find(d => d.category === 'others')?.percentage || 0}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
        
        {/* Score display - Fixed width */}
        <div className='w-16 text-right'>
          <div
            className={`${FONT_SIZES.LEADERBOARD.RANK} font-bold ${getThemeTextColor('primary')} whitespace-nowrap`}
          >
            {category === 'work' ? formatScoreToMinutes(user.score) : formatTime(user.score)}
          </div>
          <div className={`${FONT_SIZES.LEADERBOARD.SECONDARY} ${getThemeTextColor('secondary')} whitespace-nowrap`}>
            {category === 'work' ? 'Work Time' : 'Activity Time'}
          </div>
        </div>
      </div>
    </div>
  );
}
