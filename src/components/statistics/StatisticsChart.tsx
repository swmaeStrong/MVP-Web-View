'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
// 이제 namespace 사용으로 인해 직접 import 불가능
import {
  Activity
} from 'lucide-react';
import StateDisplay from '../common/StateDisplay';
import StatisticsPieChart from './StatisticsPieChart';

interface StatisticsChartProps {
  data: Statistics.DailyStatistics | null;
  currentDate: string;
  isLoading?: boolean;
}


export default function StatisticsChart({
  data,
  currentDate,
  isLoading = false,
}: StatisticsChartProps) {
  const { getThemeClass } = useTheme();
  if (isLoading) {
    return (
      <Card className={`h-[400px] flex flex-col rounded-lg shadow-sm transition-all duration-300 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardHeader className='pb-2'>
          <div className='flex items-center justify-between'>
            <div className={`h-6 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
          </div>
        </CardHeader>

        <CardContent className='flex-1 flex flex-col justify-center items-center p-3 pt-0 overflow-hidden'>
            <div className='h-full flex items-center justify-center'>
              <div className='relative w-full h-full flex items-center justify-center'>
                <div className={`aspect-square w-full h-full min-h-[180px] max-h-[350px] min-w-[180px] max-w-[350px] animate-pulse rounded-full ${getThemeClass('componentSecondary')}`}></div>
              </div>
            </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`h-[360px] flex flex-col rounded-lg shadow-sm transition-all duration-300 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className='flex-1 flex flex-col justify-center items-center p-3 overflow-hidden'>
        {data && data.categories && data.categories.length > 0 ? (
          // TODO: 실제 차트 컴포넌트 렌더링
          <StatisticsPieChart data={data} />
        ) : (
          <StateDisplay
            type="empty"
            title='No Activity Data'
            message='No activities recorded for the selected date.'
            icon={Activity}
            showBorder={false}
            size='large'
          />
        )}
      </CardContent>
    </Card>
  );
}
