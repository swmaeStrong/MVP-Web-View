'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/ui/avatar';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { spacing } from '@/styles/design-system';
import UserProfileTooltip from '@/components/common/UserProfileTooltip';

interface LeaderboardMember {
  rank: number;
  name: string;
  score: number;
  hours: number;
}

interface TeamLeaderboardProps {
  members: LeaderboardMember[];
}

export default function TeamLeaderboard({ members }: TeamLeaderboardProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <Card className={`${getCommonCardClass()} col-span-3 row-span-1`}>
      <CardHeader>
        <div className={`text-lg font-bold ${getThemeTextColor('primary')}`}>
          Leaderboard
        </div>
      </CardHeader>
      <CardContent className={spacing.inner.normal}>
        <div className="grid grid-cols-3 gap-4">
          {members.map((member) => (
            <div key={member.rank} className={`p-4 rounded-md ${getThemeClass('componentSecondary')} ${getThemeClass('border')} border text-center relative`}>
              
              {/* 아바타 */}
              <UserProfileTooltip
                userStats={{
                  nickname: member.name,
                  currentStreak: Math.floor(Math.random() * 30) + 1, // Mock data
                  totalScore: member.score * 15 + Math.floor(Math.random() * 500), // Mock data
                  totalSessions: Math.floor(Math.random() * 40) + 15, // Mock data
                  rank: member.rank,
                  workTime: `${member.hours}h`
                }}
                side="top"
                align="center"
              >
                <div className="relative w-fit mx-auto mb-3 cursor-pointer">
                  <Avatar className="w-16 h-16 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-2 hover:ring-[#3F72AF] transition-all duration-200">
                    <AvatarImage src="" />
                    <AvatarFallback className={`text-lg font-semibold ${getThemeClass('component')} ${getThemeTextColor('primary')}`}>
                      {getAvatarInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`absolute -right-0 -bottom-0 size-4 rounded-full ${
                    member.rank <= 3 
                      ? 'bg-green-500 dark:bg-green-400' 
                      : 'bg-gray-400 dark:bg-gray-500'
                  }`}>
                  </span>
                </div>
              </UserProfileTooltip>
              
              {/* 정보 */}
              <div>
                <p className={`text-sm font-medium truncate ${getThemeTextColor('primary')} mb-1`}>
                  {member.name}
                </p>
                <p className={`text-xs ${getThemeTextColor('secondary')} mb-1`}>
                  {member.hours}h worked
                </p>
                <p className={`text-lg font-bold ${getThemeTextColor('primary')}`}>
                  {member.score}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}