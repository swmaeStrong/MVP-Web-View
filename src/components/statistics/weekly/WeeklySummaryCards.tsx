'use client';

import { useWeeklyPomodoroDetails } from '@/hooks/data/useWeeklyPomodoroDetails';
import { useWeeklySessionScore } from '@/hooks/data/useWeeklySessionScore';
import { useWeeklyStreak } from '@/hooks/data/useWeeklyStreak';
import { useTheme } from '@/hooks/ui/useTheme';
import React from 'react';

interface WeeklySummaryCardsProps {
  selectedDate: string;
}

export default function WeeklySummaryCards({
  selectedDate,
}: WeeklySummaryCardsProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();

  // API 호출들
  const { data: weeklyPomodoroData, isLoading: isPomodoroLoading } = useWeeklyPomodoroDetails(selectedDate);
  const { data: weeklySessionScore, isLoading: isSessionScoreLoading } = useWeeklySessionScore(selectedDate);
  const { data: weeklyStreakData, isLoading: isStreakLoading } = useWeeklyStreak(selectedDate);

  const isLoading = isPomodoroLoading || isSessionScoreLoading || isStreakLoading;

  // API 데이터에서 통계 계산
  const weeklyStats = React.useMemo(() => {
    // work apps 총 시간 계산 - NaN 방지
    const totalWorkSeconds = weeklyPomodoroData?.workAppUsage?.reduce(
      (sum, app) => {
        const duration = Number(app.duration) || 0;
        return sum + duration;
      }, 
      0
    ) || 0;

    // distraction apps 총 시간 계산 - NaN 방지
    const totalDistractionSeconds = weeklyPomodoroData?.distractedAppUsage?.reduce(
      (sum, app) => {
        const duration = Number(app.duration) || 0;
        return sum + duration;
      }, 
      0
    ) || 0;

    // 주간 세션 개수 계산 (activityCount 합계) - NaN 방지
    const totalSessions = weeklyStreakData?.reduce(
      (sum, day) => {
        const activityCount = Number(day.activityCount) || 0;
        return sum + activityCount;
      },
      0
    ) || 0;

    // 평균 점수는 API에서 직접 가져옴 - NaN 방지
    const rawScore = Number(weeklySessionScore?.avgScore) || 0;
    const averageFocusScore = isNaN(rawScore) ? 0 : rawScore;

    // 시간 계산 시 NaN 방지
    const safeWorkHours = totalWorkSeconds > 0 ? totalWorkSeconds / 3600 : 0;
    const safeDistractionHours = totalDistractionSeconds > 0 ? totalDistractionSeconds / 3600 : 0;

    return {
      totalWorkHours: isNaN(safeWorkHours) ? 0 : safeWorkHours,
      totalDistractionHours: isNaN(safeDistractionHours) ? 0 : safeDistractionHours,
      totalSessions: isNaN(totalSessions) ? 0 : totalSessions,
      averageFocusScore: isNaN(averageFocusScore) ? 0 : Math.round(averageFocusScore),
    };
  }, [weeklyPomodoroData, weeklyStreakData, weeklySessionScore]);

  const formatHours = (hours: number): string => {
    // NaN 또는 유효하지 않은 숫자 체크
    if (isNaN(hours) || !isFinite(hours) || hours < 0) {
      return '0m';
    }
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    // NaN 방지를 위한 추가 체크
    const safeHours = isNaN(wholeHours) ? 0 : wholeHours;
    const safeMinutes = isNaN(minutes) ? 0 : minutes;
    
    if (safeHours === 0 && safeMinutes === 0) {
      return '0m';
    }
    if (safeHours === 0) {
      return `${safeMinutes}m`;
    }
    if (safeMinutes === 0) {
      return `${safeHours}h`;
    }
    return `${safeHours}h ${safeMinutes}m`;
  };

  const cards = [
    {
      title: 'Weekly Total',
      value: isLoading ? (
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      ) : (
        <div className="text-2xl font-bold">
          {formatHours(weeklyStats.totalWorkHours)}
        </div>
      ),
      subtitle: isLoading ? (
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
      ) : (
        `Avg ${formatHours(weeklyStats.totalWorkHours / 7 || 0)}/day`
      ),
    },
    {
      title: 'Weekly Distractions',
      value: isLoading ? (
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      ) : (
        <div className="text-2xl font-bold">
          {formatHours(weeklyStats.totalDistractionHours)}
        </div>
      ),
      subtitle: isLoading ? (
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
      ) : (
        `Avg ${formatHours(weeklyStats.totalDistractionHours / 7 || 0)}/day`
      ),
    },
    {
      title: 'Weekly Sessions',
      value: isLoading ? (
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      ) : (
        <div className="text-2xl font-bold">
          {weeklyStats.totalSessions}
        </div>
      ),
      subtitle: isLoading ? (
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
      ) : (
        `Avg ${Math.round(weeklyStats.totalSessions / 7 || 0)}/day`
      ),
    },
    {
      title: 'Average Focus Score',
      value: isLoading ? (
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      ) : (
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{weeklyStats.averageFocusScore} points</span>
        </div>
      ),
      subtitle: isLoading ? (
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
      ) : (
        'Weekly average score'
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, index) => {
        return (
          <div
            key={index}
            className={`
              ${getThemeClass('component')} 
              border ${getThemeClass('border')}
              rounded-lg p-3
              transition-all duration-200
              hover:shadow-md
              group
              min-h-0
            `}
          >
            <p className={`text-xs font-semibold ${getThemeTextColor('secondary')} mb-2 uppercase tracking-wider`}>
              {card.title}
            </p>
            
            <div className={`min-h-[60px] flex flex-col justify-center ${getThemeTextColor('primary')}`}>
              {card.value}
              {card.subtitle && (
                <p className={`text-xs ${getThemeTextColor('secondary')} mt-1`}>
                  {card.subtitle}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}