'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shadcn/ui/tooltip';
import { Calendar, Trophy, Zap } from 'lucide-react';
import React from 'react';

interface UserStats {
  nickname: string;
  currentStreak: number;
  maxStreak: number;
  totalPomodoroScore: number;
  totalSessions: number;
  rank?: number;
}

interface UserProfileTooltipProps {
  children: React.ReactNode;
  userStats: UserStats;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}

export default function UserProfileTooltip({ 
  children, 
  userStats, 
  side = 'top',
  align = 'center'
}: UserProfileTooltipProps) {
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();

  const formatScore = (score: number) => {
    if (score >= 10000) {
      return `${(score / 1000).toFixed(1)}k`;
    }
    return score.toLocaleString();
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer">
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className={`p-0 border-0 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg`}
          sideOffset={8}
        >
          <div className={`p-4 rounded-lg border ${getThemeClass('border')} ${getThemeClass('component')} min-w-[200px]`}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full bg-green-500`} />
              <h4 className={`font-semibold ${getThemeTextColor('primary')} text-sm`}>
                {userStats.nickname}
              </h4>
              {userStats.rank && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${getThemeClass('componentSecondary')} ${getThemeTextColor('secondary')}`}>
                  #{userStats.rank}
                </span>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Current Streak */}
              <div className="flex items-center gap-2">
                <Calendar className={`w-3.5 h-3.5 ${getThemeTextColor('secondary')}`} />
                <div>
                  <div className={`text-xs ${getThemeTextColor('secondary')}`}>Current Streak</div>
                  <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                    {userStats.currentStreak} days
                  </div>
                </div>
              </div>

              {/* Max Streak */}
              <div className="flex items-center gap-2">
                <Calendar className={`w-3.5 h-3.5 text-orange-500`} />
                <div>
                  <div className={`text-xs ${getThemeTextColor('secondary')}`}>Max Streak</div>
                  <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                    {userStats.maxStreak} days
                  </div>
                </div>
              </div>

              {/* Total Pomodoro Score */}
              <div className="flex items-center gap-2">
                <Trophy className={`w-3.5 h-3.5 text-red-500`} />
                <div>
                  <div className={`text-xs ${getThemeTextColor('secondary')}`}>Pomodoro Score</div>
                  <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                    {formatScore(userStats.totalPomodoroScore)}
                  </div>
                </div>
              </div>

              {/* Total Sessions */}
              <div className="flex items-center gap-2">
                <Zap className={`w-3.5 h-3.5 ${getThemeTextColor('secondary')}`} />
                <div>
                  <div className={`text-xs ${getThemeTextColor('secondary')}`}>Sessions</div>
                  <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                    {userStats.totalSessions}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}