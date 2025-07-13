'use client';

import { useTheme } from '@/hooks/useTheme';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/shadcn/ui/chart';
import { DailyStatistics } from '@/types/domains/usage/statistics';
import { formatTime } from '@/utils/statisticsUtils';
import { Activity } from 'lucide-react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from 'recharts';
import NoData from '../common/NoData';
import { getCategoryColor } from '@/utils/categories';

interface StatisticsRadarChartProps {
  data: DailyStatistics;
}

export default function StatisticsRadarChart({
  data,
}: StatisticsRadarChartProps) {
  const { isDarkMode, getThemeClass, getThemeColor, getThemeTextColor, getThemeTextColorValue } = useTheme();
  // Extract only top 6 categories and assign colors using centralized config
  const top6Categories = data.categories.slice(0, 6).map((category, index) => ({
    ...category,
    color: getCategoryColor(index), // 중앙화된 색상 설정 사용
  }));

  // Data validation
  const totalTime = data.totalTime || 0;
  const hasValidData = top6Categories.length > 0 && totalTime > 0;
  const hasMinimumData = top6Categories.length >= 4; // Need at least 4 categories

  if (!hasValidData) {
    return (
      <div className='flex h-full items-center justify-center p-4'>
        <NoData
          title='No categories to analyze'
          message='Cannot display radar chart due to lack of activity data.'
          icon={Activity}
          showBorder={false}
          size='medium'
        />
      </div>
    );
  }

  if (!hasMinimumData) {
    return (
      <div className='flex h-full items-center justify-center p-4'>
        <NoData
          title='Insufficient categories'
          message='At least 4 categories are needed for meaningful radar chart analysis.'
          icon={Activity}
          showBorder={false}
          size='medium'
        />
      </div>
    );
  }

  // Construct chart data
  const chartData = top6Categories.map(category => ({
    category: category.name,
    time: category.time,
    percentage: category.percentage,
    fullTime: formatTime(category.time),
    fill: category.color, // Use assigned color
  }));

  // Chart configuration
  const chartConfig = top6Categories.reduce((config, category, index) => {
    config[category.name] = {
      label: category.name,
      color: category.color, // Use assigned color
    };
    return config;
  }, {} as ChartConfig);

  return (
    <div className='h-full flex items-center justify-center'>
      {/* Chart - responsive improvements */}
      <div className='relative w-full h-full flex items-center justify-center'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square w-full h-full min-h-[180px] max-h-[350px] min-w-[180px] max-w-[350px]'
        >
          <RadarChart
            data={chartData}
            margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
          >
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0];
                  const categoryName = data.payload.category;
                  const time = data.value;
                  const percentage = data.payload.percentage;

                  return (
                    <div className={`rounded-xl border-2 p-3 shadow-lg ${getThemeClass('border')} ${getThemeClass('component')}`}>
                      <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                          <div
                            className='h-3 w-3 rounded-full'
                            style={{
                              backgroundColor:
                                top6Categories.find(
                                  cat => cat.name === categoryName
                                )?.color || getCategoryColor(0),
                            }}
                          />
                          <span className={`font-bold ${getThemeTextColor('primary')}`}>
                            {categoryName}
                          </span>
                        </div>
                        <div className={`ml-5 text-sm ${getThemeTextColor('secondary')}`}>
                          Time:{' '}
                          <span className={`font-semibold ${getThemeTextColor('primary')}`}>
                            {data.payload.fullTime}
                          </span>
                        </div>
                        <div className={`ml-5 text-sm ${getThemeTextColor('secondary')}`}>
                          Rate:{' '}
                          <span className={`font-semibold ${getThemeTextColor('primary')}`}>
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
              tick={{
                fontSize: 14,
                fill: getThemeTextColorValue('primary'),
                fontWeight: 'normal',
                textAnchor: 'middle',
                stroke: isDarkMode ? '#ffffff' : '#000000',
                strokeWidth: 0.5,
              }}
              className={`text-sm lg:text-base font-normal ${getThemeTextColor('primary')}`}
              tickFormatter={value => {
                // Truncate for better readability
                if (value.length > 8) {
                  return value.substring(0, 6) + '...';
                }
                return value;
              }}
              axisLineType='polygon'
            />
            <PolarGrid stroke={getThemeColor('border')} strokeDasharray='2 2' />
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
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 1, r: 3 }}
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
