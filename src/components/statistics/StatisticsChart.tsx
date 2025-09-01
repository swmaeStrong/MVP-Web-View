'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
// 이제 namespace 사용으로 인해 직접 import 불가능
import {
  Activity
} from 'lucide-react';
import { useUsageStatistics } from '../../hooks/data/useStatistics';
import { useCurrentUserData } from '../../hooks/user/useCurrentUser';
import StateDisplay from '../common/StateDisplay';
import StatisticsPieChart from './StatisticsPieChart';
interface StatisticsChartProps {
  currentDate: string;
}


export default function StatisticsChart({
  currentDate,
}: StatisticsChartProps) {
  const currentUser = useCurrentUserData();
  const {
    data: dailyData,
    isLoading,
    isError,
    error,
    refetch,
  } = useUsageStatistics(currentDate, currentUser?.id || '');



  const { getThemeClass } = useTheme();
  if (isLoading) {
    return (
      <Card className={`h-[360px] flex flex-col rounded-lg shadow-sm transition-all duration-300 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardContent className='h-full flex flex-col justify-center items-center p-3 overflow-hidden'>
            <div className='flex justify-center w-full'>
              <div className='flex items-center gap-6'>
                {/* Pie Chart Skeleton - Same size as actual chart */}
                <div className='flex-shrink-0 w-[200px] flex justify-center'>
                  <div className='aspect-square w-[180px] h-[180px] flex items-center justify-center'>
                    <div className={`w-[170px] h-[170px] animate-pulse rounded-full ${getThemeClass('componentSecondary')}`}>
                      {/* Donut chart effect - inner circle */}
                      <div className='relative w-full h-full flex items-center justify-center'>
                        <div className={`absolute w-[120px] h-[120px] rounded-full ${getThemeClass('component')}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Category Details Skeleton - Same size as actual details */}
                <div className='w-[200px] flex flex-col gap-2'>
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className='flex items-center gap-2'>
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 animate-pulse ${getThemeClass('borderLight')}`}></div>
                      <div className='flex flex-col min-w-0 flex-1'>
                        <div className={`h-3 w-24 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                        <div className={`h-3 w-16 mt-1 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`h-[360px] flex flex-col rounded-lg shadow-sm transition-all duration-300 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className='h-full flex flex-col justify-center items-center p-3 overflow-hidden'>
        {dailyData && dailyData.categories && dailyData.categories.length > 0 ? (
          <StatisticsPieChart data={dailyData} />
        ) : (
          <div className='flex justify-center items-center w-full h-full'>
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
