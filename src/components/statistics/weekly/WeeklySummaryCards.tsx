'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { useWeeklyPomodoroDetails } from '@/hooks/data/useWeeklyPomodoroDetails';
import React from 'react';

interface WeeklySummaryCardsProps {
  selectedDate: string;
}

export default function WeeklySummaryCards({
  selectedDate,
}: WeeklySummaryCardsProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();

  // API 호출 - 다른 weekly 컴포넌트들과 같은 쿼리 사용
  const { data: weeklyPomodoroData, isLoading } = useWeeklyPomodoroDetails(selectedDate);

  // API 데이터에서 통계 계산
  const weeklyStats = React.useMemo(() => {
    if (!weeklyPomodoroData) {
      return {
        totalWorkHours: 0,
        totalDistractionHours: 0,
        totalSessions: 0,
        averageFocusScore: 0,
      };
    }

    // work apps 총 시간 계산
    const totalWorkSeconds = weeklyPomodoroData.workAppUsage?.reduce(
      (sum, app) => sum + app.duration, 
      0
    ) || 0;

    // distraction apps 총 시간 계산
    const totalDistractionSeconds = weeklyPomodoroData.distractedAppUsage?.reduce(
      (sum, app) => sum + app.duration, 
      0
    ) || 0;

    return {
      totalWorkHours: totalWorkSeconds / 3600, // convert to hours
      totalDistractionHours: totalDistractionSeconds / 3600, // convert to hours
      totalSessions: weeklyPomodoroData.dailyResults?.length || 0,
      averageFocusScore: totalWorkSeconds > 0 
        ? Math.round((totalWorkSeconds / (totalWorkSeconds + totalDistractionSeconds)) * 100)
        : 0,
    };
  }, [weeklyPomodoroData]);

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
        <div className="text-2xl font-bold animate-pulse">--%</div>
      ) : (
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{weeklyStats.averageFocusScore}%</span>
        </div>
      ),
      subtitle: isLoading ? 'Loading...' : 'Work vs distraction ratio',
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