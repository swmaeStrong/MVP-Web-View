'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { useOtherUserInfo } from '@/hooks/user/useOtherUserInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shadcn/ui/tooltip';
import { Flame, Timer } from 'lucide-react';
import React, { useState } from 'react';

interface UserStats {
  nickname: string;
  currentStreak: number;
  maxStreak: number;
  totalSessions: number;
  rank?: number;
}

interface UserProfileTooltipProps {
  children: React.ReactNode;
  userId: string;
  userStats?: UserStats; // fallback 데이터
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}

export default function UserProfileTooltip({ 
  children, 
  userId,
  userStats: fallbackStats, 
  side = 'top',
  align = 'center'
}: UserProfileTooltipProps) {
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  // 툴팁이 열릴 때만 API 호출
  const { data: otherUserData, isLoading } = useOtherUserInfo({ 
    userId: isOpen ? userId : null,
    enabled: isOpen && !!userId 
  });
  
  // API 데이터가 있으면 사용, 없으면 fallback 데이터 사용
  const userStats = otherUserData ? {
    nickname: otherUserData.nickname,
    currentStreak: otherUserData.currentStreak,
    maxStreak: otherUserData.maxStreak,
    totalSessions: otherUserData.totalSession,
    rank: fallbackStats?.rank,
  } : fallbackStats;


  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip onOpenChange={setIsOpen}>
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
          {isLoading ? (
            <div className={`p-4 rounded-lg border ${getThemeClass('border')} ${getThemeClass('component')} min-w-[200px]`}>
              <div className="animate-pulse">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${getThemeClass('border')}`} />
                  <div className={`h-4 w-24 rounded ${getThemeClass('border')}`} />
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded ${getThemeClass('border')}`} />
                      <div>
                        <div className={`h-3 w-16 mb-1 rounded ${getThemeClass('border')}`} />
                        <div className={`h-4 w-12 rounded ${getThemeClass('border')}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : userStats ? (
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
            <div className="grid grid-cols-1 gap-3">
              {/* Current Streak */}
              <div className="flex items-center gap-2">
                <Flame className={`w-3.5 h-3.5 text-orange-500`} />
                <div>
                  <div className={`text-xs ${getThemeTextColor('secondary')}`}>Current Streak</div>
                  <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                    {userStats.currentStreak} days
                  </div>
                </div>
              </div>

              {/* Max Streak */}
              <div className="flex items-center gap-2">
                <Flame className={`w-3.5 h-3.5 text-red-500`} />
                <div>
                  <div className={`text-xs ${getThemeTextColor('secondary')}`}>Max Streak</div>
                  <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                    {userStats.maxStreak} days
                  </div>
                </div>
              </div>

              {/* Total Sessions */}
              <div className="flex items-center gap-2">
                <Timer className={`w-3.5 h-3.5 ${getThemeTextColor('secondary')}`} />
                <div>
                  <div className={`text-xs ${getThemeTextColor('secondary')}`}>Total</div>
                  <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                    {userStats.totalSessions} sessions
                  </div>
                </div>
              </div>

              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-lg border ${getThemeClass('border')} ${getThemeClass('component')} min-w-[200px]`}>
              <div className={`text-sm ${getThemeTextColor('secondary')} text-center`}>
                User information unavailable
              </div>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}