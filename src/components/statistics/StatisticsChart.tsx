'use client';

import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { DailyStatistics, PeriodType } from '@/types/statistics';
import { formatKSTDate } from '@/utils/timezone';
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  PieChart,
  Target,
} from 'lucide-react';
import NoData from '../common/NoData';
import StatisticsBarChart from './StatisticsBarChart';
import StatisticsRadarChart from './StatisticsRadarChart';
import { useTheme } from '@/hooks/useTheme';

interface StatisticsChartProps {
  selectedPeriod: PeriodType;
  data: DailyStatistics | null;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  currentDate: string;
}

export default function StatisticsChart({
  selectedPeriod,
  data,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  currentDate,
}: StatisticsChartProps) {
  const { isDarkMode, getThemeClass } = useTheme();
  const getChartTitle = () => {
    switch (selectedPeriod) {
      case 'daily':
        const date = new Date(currentDate + 'T00:00:00Z'); // UTC 기준으로 파싱
        const formattedDate = formatKSTDate(date);
        return `${formattedDate} Top 6 카테고리 분석`;
      case 'weekly':
        return '주별 작업 패턴';
      case 'monthly':
        return '월별 생산성 트렌드';
      default:
        return '작업 분석';
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
          <div>
            <CardTitle className={`text-lg font-semibold ${getThemeClass('textPrimary')}`}>
              {getChartTitle()}
            </CardTitle>
          </div>

          {/* 네비게이션 버튼 */}
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className={`h-8 w-8 rounded-lg p-0 transition-all duration-200 hover:scale-105 border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeClass('textPrimary')} hover:border-purple-300 hover:bg-purple-50 dark:hover:border-purple-600 dark:hover:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-current disabled:hover:bg-current`}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={onNext}
              disabled={!canGoNext}
              className={`h-8 w-8 rounded-lg p-0 transition-all duration-200 hover:scale-105 border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeClass('textPrimary')} hover:border-purple-300 hover:bg-purple-50 dark:hover:border-purple-600 dark:hover:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:border-current disabled:hover:bg-current`}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
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
                title='활동 데이터가 없습니다'
                message='선택한 날짜에 기록된 활동이 없습니다.'
                icon={PieChart}
                showBorder={false}
                size='large'
              />
            </div>
          )}
      </CardContent>
    </Card>
  );
}
