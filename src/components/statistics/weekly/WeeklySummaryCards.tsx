'use client';

import { useTheme } from '@/hooks/ui/useTheme';

interface WeeklySummaryCardsProps {
  selectedDate: string;
}

export default function WeeklySummaryCards({
  selectedDate,
}: WeeklySummaryCardsProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();

  // Weekly 통계 데이터 (모의)
  const weeklyStats = {
    totalHours: 47.6,
    totalDistractions: 134,
    totalSessions: 69,
    averageFocusScore: 78,
  };

  const formatHours = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  const cards = [
    {
      title: 'Weekly Total',
      value: (
        <div className="text-2xl font-bold">
          {formatHours(weeklyStats.totalHours)}
        </div>
      ),
      subtitle: `Avg ${formatHours(weeklyStats.totalHours / 7)}/day`,
    },
    {
      title: 'Weekly Distractions',
      value: (
        <div className="text-2xl font-bold">
          {weeklyStats.totalDistractions}
        </div>
      ),
      subtitle: `Avg ${Math.round(weeklyStats.totalDistractions / 7)}/day`,
    },
    {
      title: 'Weekly Sessions',
      value: (
        <div className="text-2xl font-bold">
          {weeklyStats.totalSessions}
        </div>
      ),
      subtitle: `Avg ${Math.round(weeklyStats.totalSessions / 7)}/day`,
    },
    {
      title: 'Average Focus Score',
      value: (
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{weeklyStats.averageFocusScore}%</span>
        </div>
      ),
      subtitle: 'Weekly average',
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