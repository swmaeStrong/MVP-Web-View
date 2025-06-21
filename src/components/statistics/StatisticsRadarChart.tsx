'use client';

import { ChartConfig, ChartContainer, ChartTooltip } from '@/shadcn/ui/chart';
import { DailyStatistics } from '@/types/statistics';
import { getCategoryColor } from '@/utils/categories';
import { formatTime } from '@/utils/statisticsUtils';
import { PieChart } from 'lucide-react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from 'recharts';
import NoData from '../common/NoData';

interface StatisticsRadarChartProps {
  data: DailyStatistics;
}

export default function StatisticsRadarChart({
  data,
}: StatisticsRadarChartProps) {
  // Top 6 카테고리만 추출
  const top6Categories = data.categories.slice(0, 6);

  if (top6Categories.length === 0) {
    return (
      <div className='h-[450px]'>
        <NoData
          title='분석할 카테고리가 없습니다'
          message='활동 데이터가 없어 레이더 차트를 표시할 수 없습니다.'
          icon={PieChart}
          showBorder={false}
          size='md'
        />
      </div>
    );
  }

  // 차트 데이터 구성
  const chartData = top6Categories.map(category => ({
    category: category.name,
    time: category.time,
    percentage: category.percentage,
    fullTime: formatTime(category.time),
    fill: getCategoryColor(category.name),
  }));

  // 차트 설정
  const chartConfig = top6Categories.reduce((config, category, index) => {
    config[category.name] = {
      label: category.name,
      color: getCategoryColor(category.name),
    };
    return config;
  }, {} as ChartConfig);

  return (
    <div className='space-y-6'>
      {/* 총 작업시간을 상단으로 이동 */}
      <div className='rounded-xl border border-purple-100 bg-white p-3 shadow-sm'>
        <div className='flex items-center justify-between text-sm'>
          <div className='flex items-center gap-2 text-purple-700'>
            <span>⚡</span>
            <span className='font-medium'>총 작업시간</span>
          </div>
          <span className='font-bold text-purple-800'>
            {formatTime(top6Categories.reduce((sum, cat) => sum + cat.time, 0))}
          </span>
        </div>
      </div>

      {/* 차트 */}
      <div className='relative h-[400px] w-full px-4'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[400px] max-w-[400px]'
        >
          <RadarChart
            data={chartData}
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          >
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0];
                  const categoryName = data.payload.category;
                  const time = data.value;
                  const percentage = data.payload.percentage;

                  return (
                    <div className='rounded-xl border border-gray-200 bg-white p-3 shadow-lg'>
                      <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                          <div
                            className='h-3 w-3 rounded-full'
                            style={{
                              backgroundColor: getCategoryColor(categoryName),
                            }}
                          />
                          <span
                            style={{ fontWeight: 'bold', color: '#000000' }}
                          >
                            {categoryName}
                          </span>
                        </div>
                        <div
                          className='ml-5 text-sm'
                          style={{ color: '#374151' }}
                        >
                          시간:{' '}
                          <span style={{ fontWeight: '600', color: '#111827' }}>
                            {formatTime(time as number)}
                          </span>
                        </div>
                        <div
                          className='ml-5 text-sm'
                          style={{ color: '#374151' }}
                        >
                          비율:{' '}
                          <span style={{ fontWeight: '600', color: '#111827' }}>
                            {percentage ? percentage.toFixed(1) : '0.0'}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <PolarAngleAxis
              dataKey='category'
              tick={{ fontSize: 12, fill: '#111827', fontWeight: 'bold' }}
              className='text-sm font-semibold'
              tickFormatter={value =>
                value.length > 8 ? value.substring(0, 6) + '...' : value
              }
            />
            <PolarGrid className='stroke-gray-200' strokeDasharray='2 2' />
            <PolarRadiusAxis
              angle={90}
              domain={[0, Math.max(...chartData.map(d => d.time))]}
              tick={false}
              axisLine={false}
            />
            <Radar
              dataKey='time'
              stroke='url(#gradientRadar)'
              fill='url(#gradientRadar)'
              fillOpacity={0.1}
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
            />
            <defs>
              <linearGradient
                id='gradientRadar'
                x1='0%'
                y1='0%'
                x2='100%'
                y2='100%'
              >
                <stop offset='0%' stopColor='#8b5cf6' />
                <stop offset='50%' stopColor='#ec4899' />
                <stop offset='100%' stopColor='#3b82f6' />
              </linearGradient>
            </defs>
          </RadarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
