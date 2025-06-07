'use client';

import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { DailyStatistics, PeriodType } from '@/types/statistics';
import { BarChart3, ChevronLeft, ChevronRight, Target } from 'lucide-react';
import StatisticsBarChart from './StatisticsBarChart';
import StatisticsRadarChart from './StatisticsRadarChart';

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
  const getChartTitle = () => {
    switch (selectedPeriod) {
      case 'daily':
        const date = new Date(currentDate);
        const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
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
    <Card className='relative border-2 bg-gradient-to-br from-purple-50/50 to-blue-50/50 shadow-lg transition-all duration-300 hover:shadow-xl'>
      <div className='absolute inset-0 rounded-lg bg-gradient-to-br from-purple-600/5 to-blue-600/5'></div>

      <CardContent className='relative p-6'>
        {/* 차트 헤더 */}
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            {getChartIcon()}
            <h3 className='text-lg font-bold text-gray-800'>
              {getChartTitle()}
            </h3>
          </div>

          {/* 네비게이션 버튼 */}
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className='h-8 w-8 rounded-lg p-0 transition-all hover:scale-105'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={onNext}
              disabled={!canGoNext}
              className='h-8 w-8 rounded-lg p-0 transition-all hover:scale-105'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* 차트 내용 */}
        <div className='min-h-[400px]'>
          {selectedPeriod === 'daily' && data ? (
            <StatisticsRadarChart data={data} />
          ) : selectedPeriod === 'weekly' || selectedPeriod === 'monthly' ? (
            <StatisticsBarChart period={selectedPeriod} />
          ) : (
            <div className='flex min-h-[400px] items-center justify-center'>
              <div className='space-y-4 text-center text-gray-500'>
                <div className='text-6xl'>📊</div>
                <div>
                  <h4 className='mb-2 text-lg font-semibold'>데이터 없음</h4>
                  <p className='text-sm'>표시할 작업 데이터가 없습니다.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
