'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { DailyStatistics, PeriodType } from '@/types/statistics';
import { formatKSTDate } from '@/utils/timezone';
import {
  Activity,
  BarChart3,
  Target,
} from 'lucide-react';
import NoData from '../common/NoData';
import StatisticsBarChart from './StatisticsBarChart';
import StatisticsRadarChart from './StatisticsRadarChart';
import { useTheme } from '@/hooks/useTheme';

interface StatisticsChartProps {
  selectedPeriod: PeriodType;
  data: DailyStatistics | null;
  currentDate: string;
}

export default function StatisticsChart({
  selectedPeriod,
  data,
  currentDate,
}: StatisticsChartProps) {
  const { isDarkMode, getThemeClass } = useTheme();
  const getChartTitle = () => {
    switch (selectedPeriod) {
      case 'daily':
        return 'Top 6 Category Analysis';
      case 'weekly':
        return 'Weekly Work Patterns';
      case 'monthly':
        return 'Monthly Productivity Trends';
      default:
        return 'Work Analysis';
    }
  };

  const getChartIcon = () => {
    return selectedPeriod === 'daily' ? (
      <Target className='h-5 w-5 text-purple-600' />
    ) : (
      <BarChart3 className='h-5 w-5 text-blue-600' />
    );
  };

  return (
    <Card className={`h-full rounded-lg shadow-sm transition-all duration-300 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <CardTitle className={`text-lg font-semibold ${getThemeClass('textPrimary')}`}>
            {getChartTitle()}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className='flex-1 min-h-0 p-2 pt-0'>
          {selectedPeriod === 'daily' && data && data.categories.length > 0 ? (
            <StatisticsRadarChart data={data} />
          ) : selectedPeriod === 'weekly' || selectedPeriod === 'monthly' ? (
            <StatisticsBarChart period={selectedPeriod} />
          ) : (
            <div className='flex h-full items-center justify-center p-4'>
              <NoData
                title='No Activity Data'
                message='No activities recorded for the selected date.'
                icon={Activity}
                showBorder={false}
                size='large'
              />
            </div>
          )}
      </CardContent>
    </Card>
  );
}
