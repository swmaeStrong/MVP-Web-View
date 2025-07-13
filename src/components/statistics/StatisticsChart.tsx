'use client';

import { useTheme } from '@/hooks/useTheme';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { DailyStatistics, PeriodType } from '@/types/domains/usage/statistics';
import {
  Activity,
  BarChart3,
  Target,
} from 'lucide-react';
import StateDisplay from '../common/StateDisplay';
import StatisticsPieChart from './StatisticsPieChart';

interface StatisticsChartProps {
  selectedPeriod: PeriodType;
  data: DailyStatistics | null;
  currentDate: string;
  isLoading?: boolean;
}

export default function StatisticsChart({
  selectedPeriod,
  data,
  currentDate,
  isLoading = false,
}: StatisticsChartProps) {
  const { isDarkMode, getThemeClass, getThemeTextColor } = useTheme();
  
  if (isLoading) {
    return (
      <Card className={`h-full rounded-lg shadow-sm transition-all duration-300 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardHeader className='pb-2'>
          <div className='flex items-center justify-between'>
            <div className={`h-7 w-48 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
          </div>
        </CardHeader>

        <CardContent className='flex-1 min-h-0 p-2 pt-0'>
          {selectedPeriod === 'daily' ? (
            // Pie chart skeleton
            <div className='h-full flex items-center justify-center'>
              <div className='relative w-full h-full flex items-center justify-center'>
                <div className={`aspect-square w-full h-full min-h-[180px] max-h-[350px] min-w-[180px] max-w-[350px] animate-pulse rounded-full ${getThemeClass('componentSecondary')}`}></div>
              </div>
            </div>
          ) : (
            // Bar chart skeleton
            <div className='space-y-6'>
              <div className='h-[400px] w-full'>
                <div className='h-full flex items-end gap-4 px-4'>
                  {[...Array(selectedPeriod === 'weekly' ? 4 : 3)].map((_, index) => (
                    <div key={index} className='flex-1 flex flex-col items-center gap-2'>
                      <div className={`w-full animate-pulse rounded ${getThemeClass('componentSecondary')}`} style={{ height: `${Math.random() * 200 + 100}px` }}></div>
                      <div className={`h-4 w-16 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Legend skeleton */}
              <div className={`rounded-xl p-4 shadow-sm ${getThemeClass('border')} ${getThemeClass('component')}`}>
                <div className={`mb-3 h-5 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
                <div className='grid grid-cols-2 gap-3 lg:grid-cols-3'>
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className='flex items-center gap-2'>
                      <div className={`h-4 w-4 animate-pulse rounded-full ${getThemeClass('borderLight')}`}></div>
                      <div className={`h-4 w-20 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const getChartTitle = () => {
    switch (selectedPeriod) {
      case 'daily':
        return 'Category Analysis';
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
    <Card className={`h-full flex items-center justify-center rounded-lg shadow-sm transition-all duration-300 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
      {selectedPeriod !== 'daily' && (
        <CardHeader className='pb-2'>
          <div className='flex items-center justify-between'>
            <CardTitle className={`text-lg font-semibold ${getThemeClass('textPrimary')}`}>
              {getChartTitle()}
            </CardTitle>
          </div>
        </CardHeader>
      )}

      <CardContent className='flex flex-1 justify-center items-center h-full p-2 pt-0'>
          {selectedPeriod === 'daily' && data && data.categories.length > 0 ? (
            <StatisticsPieChart data={data} />
          ) : selectedPeriod === 'weekly' || selectedPeriod === 'monthly' ? (
            <>추후 추가 예정</>
          ) : (
            <div className='flex h-full items-center justify-center p-4'>
              <StateDisplay
                type="empty"
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
