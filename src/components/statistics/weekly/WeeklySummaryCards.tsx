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
    // work apps 총 시간 계산
    const totalWorkSeconds = weeklyPomodoroData?.workAppUsage?.reduce(
      (sum, app) => sum + app.duration, 
      0
    ) || 0;

    // distraction apps 총 시간 계산
    const totalDistractionSeconds = weeklyPomodoroData?.distractedAppUsage?.reduce(
      (sum, app) => sum + app.duration, 
      0
    ) || 0;

    // 주간 세션 개수 계산 (activityCount 합계)
    const totalSessions = weeklyStreakData?.reduce(
      (sum, day) => sum + (day.activityCount || 0),
      0
    ) || 0;

    // 평균 점수는 API에서 직접 가져옴
    const averageFocusScore = weeklySessionScore?.avgScore || 0;

    return {
      totalWorkHours: totalWorkSeconds / 3600, // convert to hours
      totalDistractionHours: totalDistractionSeconds / 3600, // convert to hours
      totalSessions,
      averageFocusScore: Math.round(averageFocusScore), // API에서 이미 0-100 범위로 제공됨
    };
  }, [weeklyPomodoroData, weeklyStreakData, weeklySessionScore]);

  const formatHours = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (wholeHours === 0 && minutes === 0) {
      return '0m';
    }
    if (wholeHours === 0) {
      return `${minutes}m`;
    }
    if (minutes === 0) {
      return `${wholeHours}h`;
    }
    return `${wholeHours}h ${minutes}m`;
  };

  const cards = [
    {
      title: 'Weekly Total',
      value: isLoading ? (
        <div className="text-2xl font-bold animate-pulse">--h --m</div>
      ) : (
        <div className="text-2xl font-bold">
          {formatHours(weeklyStats.totalWorkHours)}
        </div>
      ),
      subtitle: isLoading ? 'Loading...' : `Avg ${formatHours(weeklyStats.totalWorkHours / 7)}/day`,
    },
    {
      title: 'Weekly Distractions',
      value: isLoading ? (
        <div className="text-2xl font-bold animate-pulse">--h --m</div>
      ) : (
        <div className="text-2xl font-bold">
          {formatHours(weeklyStats.totalDistractionHours)}
        </div>
      ),
      subtitle: isLoading ? 'Loading...' : `Avg ${formatHours(weeklyStats.totalDistractionHours / 7)}/day`,
    },
    {
      title: 'Weekly Sessions',
      value: isLoading ? (
        <div className="text-2xl font-bold animate-pulse">--</div>
      ) : (
        <div className="text-2xl font-bold">
          {weeklyStats.totalSessions}
        </div>
      ),
      subtitle: isLoading ? 'Loading...' : `Avg ${Math.round(weeklyStats.totalSessions / 7)}/day`,
    },
    {
      title: 'Average Focus Score',
      value: isLoading ? (
        <div className="text-2xl font-bold animate-pulse">--pt</div>
      ) : (
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{weeklyStats.averageFocusScore} points</span>
        </div>
      ),
      subtitle: isLoading ? 'Loading...' : 'Weekly average score',
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