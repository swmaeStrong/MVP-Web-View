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
    averageDaily: 6.8,
    productiveDays: 5,
    totalSessions: 69,
    averageFocusScore: 78,
    weeklyGoalProgress: 85,
    mostProductiveDay: 'Wednesday',
    leastProductiveDay: 'Sunday',
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
      subtitle: `Avg ${formatHours(weeklyStats.averageDaily)}/day`,
    },
    {
      title: 'Productive Days',
      value: (
        <div className="text-2xl font-bold">
          {weeklyStats.productiveDays}/7
        </div>
      ),
      subtitle: `${Math.round((weeklyStats.productiveDays / 7) * 100)}% of week`,
    },
    {
      title: 'Weekly Goal',
      value: (
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{weeklyStats.weeklyGoalProgress}%</span>
        </div>
      ),
      subtitle: 'Target: 40 hours',
    },
    {
      title: 'Best Day',
      value: (
        <div className="text-2xl font-bold">
          {weeklyStats.mostProductiveDay}
        </div>
      ),
      subtitle: '9.1h worked',
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