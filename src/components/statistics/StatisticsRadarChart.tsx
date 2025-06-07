'use client';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shadcn/ui/chart';
import { DailyStatistics } from '@/types/statistics';
import { getCategoryColor } from '@/utils/categories';
import { formatTime } from '@/utils/statisticsUtils';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from 'recharts';

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
      <div className='flex h-[400px] items-center justify-center'>
        <div className='text-center text-gray-500'>
          <div className='mb-3 text-4xl'>📊</div>
          <div className='text-sm'>표시할 카테고리가 없습니다</div>
        </div>
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
      {/* 차트 */}
      <div className='relative h-[400px] w-full'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[400px]'
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className='rounded-xl border border-gray-200 bg-white/95 shadow-xl backdrop-blur-sm'
                  formatter={(value, name) => [
                    <div key={name} className='flex flex-col gap-1'>
                      <div className='flex items-center gap-2'>
                        <div
                          className='h-3 w-3 rounded-full'
                          style={{
                            backgroundColor: getCategoryColor(name as string),
                          }}
                        />
                        <span className='font-medium text-gray-800'>
                          {name}
                        </span>
                      </div>
                      <div className='ml-5 text-sm text-gray-600'>
                        시간:{' '}
                        <span className='font-medium'>
                          {formatTime(value as number)}
                        </span>
                      </div>
                      <div className='ml-5 text-sm text-gray-600'>
                        비율:{' '}
                        <span className='font-medium'>
                          {chartData.find(d => d.category === name)?.percentage}
                          %
                        </span>
                      </div>
                    </div>,
                    '',
                  ]}
                />
              }
            />
            <PolarAngleAxis
              dataKey='category'
              tick={{ fontSize: 12, fill: '#6b7280' }}
              className='text-sm font-medium'
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

      {/* 범례 */}
      <div className='rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4'>
        <h4 className='mb-3 text-sm font-semibold text-gray-700'>
          📊 상위 6개 카테고리
        </h4>
        <div className='grid grid-cols-2 gap-3 lg:grid-cols-3'>
          {top6Categories.map((category, index) => (
            <div
              key={index}
              className='flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md'
            >
              <div className='flex items-center gap-2'>
                <div
                  className='h-3 w-3 rounded-full shadow-sm'
                  style={{ backgroundColor: getCategoryColor(category.name) }}
                />
                <span className='text-lg'>{category.icon}</span>
              </div>
              <div className='min-w-0 flex-1'>
                <div className='truncate text-sm font-medium text-gray-800'>
                  {category.name}
                </div>
                <div className='flex items-center gap-2 text-xs text-gray-500'>
                  <span>{formatTime(category.time)}</span>
                  <span>•</span>
                  <span>{category.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 통계 요약 */}
      <div className='rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50 p-4'>
        <div className='flex items-center justify-between text-sm'>
          <div className='flex items-center gap-2 text-purple-700'>
            <span>⚡</span>
            <span className='font-medium'>총 작업시간</span>
          </div>
          <span className='font-bold text-purple-800'>
            {formatTime(top6Categories.reduce((sum, cat) => sum + cat.time, 0))}
          </span>
        </div>
        <div className='mt-2 flex items-center justify-between text-sm'>
          <div className='flex items-center gap-2 text-blue-700'>
            <span>🎯</span>
            <span className='font-medium'>활성 카테고리</span>
          </div>
          <span className='font-bold text-blue-800'>
            {top6Categories.length}개
          </span>
        </div>
      </div>
    </div>
  );
}
