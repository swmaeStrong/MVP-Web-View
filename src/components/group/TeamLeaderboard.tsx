'use client';

import UserProfileTooltip from '@/components/common/UserProfileTooltip';
import { UserAvatar } from '@/components/common';
import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { Separator } from '@/shadcn/ui/separator';
import { spacing } from '@/styles/design-system';
import { useCurrentUserData } from '@/hooks/user/useCurrentUser';

interface TeamLeaderboardProps {
  members: Group.GroupLeaderboardMember[];
  isLoading?: boolean;
}

export default function TeamLeaderboard({ members, isLoading = false }: TeamLeaderboardProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const currentUser = useCurrentUserData();

  const formatScore = (score: number) => {
    const hours = Math.floor(score / 3600);
    const minutes = Math.floor((score % 3600) / 60);
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
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
    <Card className={`${getCommonCardClass()} col-span-3 row-span-1 h-[500px] flex flex-col`}>
      <CardHeader className="flex-shrink-0">
        <div className={`text-lg font-bold ${getThemeTextColor('primary')} text-center`}>
          Leaderboard
        </div>
        <Separator />
      </CardHeader>
      <CardContent className={`${spacing.inner.normal} flex-1 overflow-hidden`}>
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-2">
            {members.map((member) => {
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
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}