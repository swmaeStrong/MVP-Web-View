'use client';

import { useTheme } from '@/hooks/useTheme';
import { extendedRankColors, rankColors } from '@/styles';
import { componentSizes, componentStates, getPriorityStyle, getRankPriority } from '@/styles/design-system';
import { ProcessedDetail, formatScoreToMinutes, getCategoryDisplayName, processLeaderboardDetails } from '@/utils/leaderboard';
import { Medal } from 'lucide-react';

interface UserCardProps {
  user: LeaderBoard.LeaderBoardResponse & { id?: string; isMe?: boolean };
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
  category,
}: UserCardProps) {
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();
  const rank = index + 1;
  const rankInfo = getRankInfo(index);
  
  // 디자인 시스템 적용 - 일관된 스타일
  const priorityStyle = getPriorityStyle(rank);
  const priorityLevel = getRankPriority(rank);
  const cardSize = componentSizes.medium; // 모든 카드 동일한 크기

  return (
    <div
      key={`rank-${rank}-${user.userId || user.nickname || index}`}
      data-user-id={user.userId}
      className={`group relative flex items-center justify-between rounded-lg border p-3 lg:p-4 shadow-sm ${componentStates.hoverable.transition} ${getThemeClass('border')} ${getThemeClass('component')} ${
        isCurrentUser
          ? `ring-2 ${isDarkMode ? 'ring-purple-400' : 'ring-purple-300'}`
          : ''
      }`}
      style={{}}
    >
      {/* 좌측 - 순위 & 특별 아이콘 & 사용자 정보 */}
      <div className='flex items-center space-x-2 lg:space-x-3'>
        {/* 순위 표시 */}
        <div
          className={`flex h-7 w-7 lg:h-10 lg:w-10 items-center justify-center ${rank <= 3 ? '' : ''}`}
        >
          {rank === 1 ? (
            <Medal className="w-5 h-5 lg:w-7 lg:h-7 text-yellow-500" />
          ) : rank === 2 ? (
            <Medal className="w-5 h-5 lg:w-7 lg:h-7 text-gray-400" />
          ) : rank === 3 ? (
            <Medal className="w-5 h-5 lg:w-7 lg:h-7 text-amber-600" />
          ) : (
            <span className={`text-base lg:text-lg font-bold ${getThemeTextColor('secondary')}`}>{rank}</span>
          )}
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
              <span className={`rounded-full border px-2 py-0.5 text-xs font-bold shadow-sm ${isDarkMode ? 'border-purple-400' : 'border-purple-300'} ${getThemeClass('component')} ${getThemeTextColor('primary')}`}>
                YOU
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right - score info */}
      <div className='flex items-center gap-2 flex-shrink-0'>
        {/* Details for total category - Fixed position */}
        <div className='w-64 lg:w-72 flex items-center justify-start'>
          {category === 'total' && user.details && user.details.length > 0 && (() => {
            const processedDetails = processLeaderboardDetails(user.details);
            
            return (
              <div className='flex items-center gap-3'>
                {/* Stacked progress bar */}
                <div className={`relative h-6 w-20 lg:w-24 rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className='flex h-full'>
                    {processedDetails.map((detail: ProcessedDetail, detailIndex: number) => {
                      // 카테고리 색상 가져오기 - 조화로운 색상 팔레트
                      const getCategoryColors = (category: string) => {
                        switch (category) {
                          case 'others':
                            return { bg: 'bg-gray-400', hover: 'hover:bg-gray-500' };
                          case 'Development':
                            return { bg: 'bg-purple-500', hover: 'hover:bg-purple-600' };
                          case 'Documentation':
                            return { bg: 'bg-indigo-400', hover: 'hover:bg-indigo-500' };
                          case 'LLM':
                            return { bg: 'bg-violet-400', hover: 'hover:bg-violet-500' };
                          case 'Design':
                            return { bg: 'bg-blue-400', hover: 'hover:bg-blue-500' };
                          case 'Communication':
                            return { bg: 'bg-emerald-400', hover: 'hover:bg-emerald-500' };
                          case 'Education':
                            return { bg: 'bg-teal-400', hover: 'hover:bg-teal-500' };
                          case 'Entertainment':
                            return { bg: 'bg-pink-400', hover: 'hover:bg-pink-500' };
                          case 'System & Utilities':
                            return { bg: 'bg-cyan-500', hover: 'hover:bg-cyan-600' };
                          case 'SNS':
                            return { bg: 'bg-amber-400', hover: 'hover:bg-amber-500' };
                          case 'Productivity':
                            return { bg: 'bg-rose-400', hover: 'hover:bg-rose-500' };
                          default:
                            return { bg: 'bg-slate-400', hover: 'hover:bg-slate-500' };
                        }
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
                <div className='flex flex-col gap-0.5 text-xs w-36 lg:w-40'>
                  {processedDetails.slice(0, 2).map((detail: ProcessedDetail, detailIndex: number) => (
                    <div key={detailIndex} className='flex items-center gap-1'>
                      <div className={`w-1.5 h-1.5 rounded flex-shrink-0 ${
                        (() => {
                          switch (detail.category) {
                            case 'others': return 'bg-gray-400';
                            case 'Development': return 'bg-purple-500';
                            case 'Documentation': return 'bg-indigo-400';
                            case 'LLM': return 'bg-violet-400';
                            case 'Design': return 'bg-blue-400';
                            case 'Communication': return 'bg-emerald-400';
                            case 'Education': return 'bg-teal-400';
                            case 'Entertainment': return 'bg-pink-400';
                            case 'System & Utilities': return 'bg-cyan-500';
                            case 'SNS': return 'bg-amber-400';
                            case 'Productivity': return 'bg-rose-400';
                            default: return 'bg-slate-400';
                          }
                        })()
                      }`} />
                      <span className={`text-xs ${getThemeTextColor('secondary')} whitespace-nowrap`}>
                        {getCategoryDisplayName(detail.category)}
                      </span>
                      <span className={`${getThemeTextColor('primary')} font-medium text-xs whitespace-nowrap ml-auto`}>
                        {detail.percentage}%
                      </span>
                    </div>
                  ))}
                  {processedDetails.length > 2 && (
                    <div className='flex items-center gap-1'>
                      <div className='w-1.5 h-1.5 rounded flex-shrink-0 bg-gray-400' />
                      <span className={`${getThemeTextColor('secondary')} text-xs whitespace-nowrap`}>Others</span>
                      <span className={`${getThemeTextColor('primary')} font-medium text-xs whitespace-nowrap ml-auto`}>
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
        <div className='w-20 lg:w-24 text-right'>
          <div
            className={`text-sm lg:text-xl font-bold ${getThemeTextColor('primary')} whitespace-nowrap`}
          >
            {category === 'total' ? formatScoreToMinutes(user.score) : formatTime(user.score)}
          </div>
          <div className={`text-xs ${getThemeTextColor('secondary')} whitespace-nowrap`}>
            {category === 'total' ? 'Total Time' : 'Activity Time'}
          </div>
        </div>
      </div>
    </div>
  );
}
