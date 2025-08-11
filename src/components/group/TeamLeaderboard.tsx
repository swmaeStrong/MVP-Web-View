'use client';

import { UserAvatar } from '@/components/common';
import UserProfileTooltip from '@/components/common/UserProfileTooltip';
import { useTheme } from '@/hooks/ui/useTheme';
import { useCurrentUserData } from '@/hooks/user/useCurrentUser';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { Separator } from '@/shadcn/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/ui/tooltip';
import { spacing } from '@/styles/design-system';
import { Clock, Info, RadioIcon } from 'lucide-react';

interface TeamLeaderboardProps {
  membersLeaderboard: Group.GroupLeaderboardMember[];
  groupMembers?: Group.GroupMemberInfo[];
  isLoading?: boolean;
}

export default function TeamLeaderboard({ membersLeaderboard, groupMembers, isLoading = false }: TeamLeaderboardProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass, isDarkMode } = useTheme();
  const currentUser = useCurrentUserData();

  const formatScore = (score: number) => {
    const hours = Math.floor(score / 3600);
    const minutes = Math.floor((score % 3600) / 60);
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  // 활동 상태 판단 함수
  const getActivityStatus = (member: Group.GroupLeaderboardMember) => {
    // groupMembers에서 해당 멤버의 정보 찾기
    const memberInfo = groupMembers?.find(m => m.userId === member.userId);
    
    // groupMembers 정보가 있으면 우선 사용, 없으면 leaderboard 정보 사용
    const lastActivity = memberInfo?.lastActivityTimestamp;
    const sessionMinutes = memberInfo?.sessionMinutes;
    
    if (!lastActivity) return null;
    
    const now = Date.now() / 1000; // 현재 시간 (초)
    const sessionEndTime = lastActivity + ((sessionMinutes ?? 0) * 60);
    
    // 세션이 진행 중인지 확인 (lastActivityTime + sessionMinutes가 현재 시간보다 미래)
    if (sessionEndTime > now && (sessionMinutes ?? 0) > 0) {
      return {
        type: 'active',
        text: `Working ${sessionMinutes}m session`,
        color: 'text-green-500'
      };
    }
    
    // 세션이 끝났으면 마지막 활동 시간 표시
    const timeDiff = now - lastActivity;
    let timeText = '';
    
    if (timeDiff < 60) {
      timeText = 'Just now';
    } else if (timeDiff < 3600) {
      timeText = `${Math.floor(timeDiff / 60)}m ago`;
    } else if (timeDiff < 86400) {
      timeText = `${Math.floor(timeDiff / 3600)}h ago`;
    } else {
      timeText = `${Math.floor(timeDiff / 86400)}d ago`;
    }
    
    return {
      type: 'inactive',
      text: timeText,
      color: getThemeTextColor('secondary')
    };
  };

  if (isLoading) {
    return (
      <Card className={`${getCommonCardClass()} col-span-3 row-span-1`}>
        <CardHeader>
          <div className={`text-lg font-bold ${getThemeTextColor('primary')} text-center`}>
            Leaderboard
          </div>
          <Separator />
        </CardHeader>
        <CardContent className={`${spacing.inner.normal} overflow-hidden`}>
          <div className="h-full max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <div className="grid grid-cols-3 gap-4 pr-2">
              {[...Array(6)].map((_, index) => (
                <div key={index} className={`p-4 rounded-md ${getThemeClass('componentSecondary')} ${getThemeClass('border')} border text-center relative animate-pulse`}>
                  <div className="relative w-fit mx-auto mb-3">
                    <div className={`w-16 h-16 rounded-full ${getThemeClass('border')}`}></div>
                  </div>
                  <div className="space-y-2">
                    <div className={`h-4 w-20 mx-auto rounded ${getThemeClass('border')}`}></div>
                    <div className={`h-3 w-16 mx-auto rounded ${getThemeClass('border')}`}></div>
                    <div className={`h-6 w-12 mx-auto rounded ${getThemeClass('border')}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${getCommonCardClass()} col-span-3 row-span-1 h-[400px] lg:h-[500px] flex flex-col relative`}>
      {/* Info 버튼 */}
      <div className='absolute top-3 right-3 z-10'>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div 
              className={`group inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 cursor-pointer ${
                isDarkMode 
                  ? `hover:bg-gray-700/50` 
                  : `hover:bg-gray-100`
              }`} 
            >
              <Info className={`h-4 w-4 ${getThemeTextColor('secondary')} group-hover:${getThemeTextColor('primary')} transition-colors`} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" align="center" className={`max-w-xs text-sm leading-relaxed ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className='space-y-3'>
              <div className="leading-relaxed">
                <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Data Updates:</span>
                <br />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Data is updated when members stop their timers</span>
              </div>
              <div className="leading-relaxed">
                <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Tracking Categories:</span>
                <br />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Development, Design, Documentation, Education, Work</span>
                <br />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Time spent in these categories counts towards the leaderboard</span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>

      <CardHeader className="flex-shrink-0">
        <div className={`text-lg font-bold ${getThemeTextColor('primary')} text-center`}>
          Leaderboard
        </div>
        <Separator />
      </CardHeader>
      <CardContent className={`${spacing.inner.normal} flex-1 overflow-hidden`}>
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {membersLeaderboard.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className={`text-center ${getThemeTextColor('secondary')}`}>
                <div className="text-lg mb-2">No members yet</div>
                <div className="text-sm">Members will appear here once they start tracking time</div>
              </div>
            </div>
          ) : (
            <>
              {/* Member count indicator */}
              {membersLeaderboard.length > 6 && (
                <div className={`text-xs ${getThemeTextColor('secondary')} mb-3 text-center`}>
                  Showing {membersLeaderboard.length} member{membersLeaderboard.length !== 1 ? 's' : ''}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-2">
            {membersLeaderboard.map((member) => {
              const isCurrentUser = member.userId === currentUser?.id;
              return (
              <div key={member.userId} className={`p-4 rounded-md ${isCurrentUser ? 'bg-[#3F72AF]/10 dark:bg-[#3F72AF]/15' : 'bg-white dark:bg-white'} ${isCurrentUser ? 'border-[#3F72AF]/30' : getThemeClass('border')} border text-center relative`}>
                
                {/* 아바타 */}
                <UserProfileTooltip
                  userId={member.userId}
                  userStats={{
                    nickname: member.nickname,
                    currentStreak: 0, // fallback data
                    maxStreak: 0, // fallback data
                    totalSessions: 0, // fallback data
                    rank: member.rank,
                  }}
                  side="top"
                  align="center"
                >
                  <div className="relative w-fit mx-auto mb-3 cursor-pointer">
                    <UserAvatar
                      nickname={member.nickname}
                      imageUrl={member.profileImageUrl}
                      size="lg"
                      isCurrentUser={isCurrentUser}
                      showBorder={false}
                      className="ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-2 hover:ring-gray-500 transition-all duration-200"
                    />
                    {/* 랭킹 배지 */}
                    {member.rank <= 3 && (
                      <span className={`absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        member.rank === 1 ? 'bg-yellow-500' :
                        member.rank === 2 ? 'bg-gray-400' :
                        'bg-amber-600'
                      }`}>
                        {member.rank}
                      </span>
                    )}
                    {/* 활동 상태 점 */}
                    {(() => {
                      const status = getActivityStatus(member);
                      
                      // 데이터가 없어도 회색 점 표시
                      const dotColor = status?.type === 'active' ? 'bg-green-500' : 'bg-gray-400';
                      
                      return (
                        <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${dotColor}`} />
                      );
                    })()}
                  </div>
                </UserProfileTooltip>
                
                {/* 정보 */}
                <div>
                  <p className={`text-sm font-medium truncate ${getThemeTextColor('primary')} mb-2`}>
                    {member.nickname}
                  </p>
                  <p className={`text-lg font-bold ${getThemeTextColor('primary')}`}>
                    {formatScore(member.score)}
                  </p>
                  
                  {/* 추가 정보 */}
                  <div className='mt-2 space-y-1'>
                    {(() => {
                      const status = getActivityStatus(member);
                      if (!status) return null;
                      
                      return (
                        <div className='flex items-center justify-center gap-1'>
                          {status.type === 'active' ? (
                            <RadioIcon className={`w-3 h-3 ${status.color}`} />
                          ) : (
                            <Clock className={`w-3 h-3 ${status.color}`} />
                          )}
                          <span className={`text-xs ${status.color} ${status.type === 'active' ? 'font-medium' : ''}`}>
                            {status.text}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
              );
            })}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}