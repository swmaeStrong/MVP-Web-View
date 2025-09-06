'use client';

import { useTheme } from '@/hooks/ui/useTheme';

interface StatisticsSummaryCardsProps {
  totalWorkHours?: number;
  topCategories?: { name: string; hours: number }[];
  avgFocusScore?: number;
  distractionCount?: number;
}

export default function StatisticsSummaryCards({
  totalWorkHours = 0,
  topCategories = [],
  avgFocusScore = 0,
  distractionCount = 0,
}: StatisticsSummaryCardsProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();

  const formatHours = (hours: number): string => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  // 메인 컬러 사용
  const getMainColor = () => {
    return 'bg-[#3F72AF]'; // 메인 브랜드 컬러 사용
  };

  const cards = [
    {
      title: 'Work Hours',
      value: formatHours(totalWorkHours),
    },
    {
      title: 'Top Categories',
      value: topCategories.length > 0 ? (
        <div className="space-y-1.5">
          {topCategories.slice(0, 3).map((cat, idx) => {
            const percentage = totalWorkHours > 0 ? (cat.hours / totalWorkHours) * 100 : 0;
            return (
              <div key={idx} className="flex items-center gap-1.5">
                <span className={`${getThemeTextColor('secondary')} text-xs font-medium w-20 lg:w-24 flex-shrink-0 text-left overflow-hidden text-ellipsis whitespace-nowrap`}>
                  {cat.name}
                </span>
                <div className="flex-1 mx-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 lg:h-3 overflow-hidden min-w-[30px]">
                  <div
                    className={`h-full ${getMainColor()} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <span className={`${getThemeTextColor('primary')} text-xs font-semibold flex-shrink-0 w-10 lg:w-12 text-right`}>
                  {formatHours(cat.hours)}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <span className="text-sm text-gray-400">No data</span>
      ),
    },
    {
      title: 'Focus Score',
      value: (
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{avgFocusScore.toFixed(0)}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">%</span>
        </div>
      ),
    },
    {
      title: 'Distractions',
      value: (
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{distractionCount}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">times</span>
        </div>
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
            
            <div className={`${index === 1 ? 'min-h-[60px] flex flex-col justify-center' : 'text-2xl font-bold'} ${getThemeTextColor('primary')}`}>
              {card.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}