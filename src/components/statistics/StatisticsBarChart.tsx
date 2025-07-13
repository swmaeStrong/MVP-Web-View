'use client';

import { memo } from 'react';
import { useTheme } from '@/hooks/useTheme';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shadcn/ui/chart';
import { PeriodType } from '@/types/domains/usage/statistics';
import { formatTime } from '@/utils/statisticsUtils';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface StatisticsBarChartProps {
  period: PeriodType;
  data?: any;
}

interface ChartDataItem {
  name: string;
  DEVELOPMENT: number;
  Design: number;
  Communication: number;
  YouTube: number;
  SNS: number;
  LLM: number;
}

const StatisticsBarChart = memo(function StatisticsBarChart({
  period,
}: StatisticsBarChartProps) {
  const { isDarkMode, getThemeClass, getThemeColor } = useTheme();
  const generateDummyData = (): ChartDataItem[] => {
    if (period === 'weekly') {
      return [
        {
          name: 'Week 1',
          DEVELOPMENT: 25200, // 7시간
          Design: 14400, // 4시간
          Communication: 10800, // 3시간
          YouTube: 7200, // 2시간
          SNS: 3600, // 1시간
          LLM: 5400, // 1.5시간
        },
        {
          name: 'Week 2',
          DEVELOPMENT: 28800, // 8시간
          Design: 18000, // 5시간
          Communication: 7200, // 2시간
          YouTube: 10800, // 3시간
          SNS: 5400, // 1.5시간
          LLM: 7200, // 2시간
        },
        {
          name: 'Week 3',
          DEVELOPMENT: 21600, // 6시간
          Design: 16200, // 4.5시간
          Communication: 12600, // 3.5시간
          YouTube: 9000, // 2.5시간
          SNS: 7200, // 2시간
          LLM: 10800, // 3시간
        },
        {
          name: 'Week 4',
          DEVELOPMENT: 32400, // 9시간
          Design: 12600, // 3.5시간
          Communication: 14400, // 4시간
          YouTube: 5400, // 1.5시간
          SNS: 9000, // 2.5시간
          LLM: 3600, // 1시간
        },
      ];
    } else {
      return [
        {
          name: 'January',
          DEVELOPMENT: 86400, // 24시간
          Design: 64800, // 18시간
          Communication: 43200, // 12시간
          YouTube: 36000, // 10시간
          SNS: 21600, // 6시간
          LLM: 28800, // 8시간
        },
        {
          name: 'February',
          DEVELOPMENT: 93600, // 26시간
          Design: 72000, // 20시간
          Communication: 36000, // 10시간
          YouTube: 43200, // 12시간
          SNS: 25200, // 7시간
          LLM: 32400, // 9시간
        },
        {
          name: 'March',
          DEVELOPMENT: 79200, // 22시간
          Design: 57600, // 16시간
          Communication: 50400, // 14시간
          YouTube: 28800, // 8시간
          SNS: 18000, // 5시간
          LLM: 36000, // 10시간
        },
      ];
    }
  };

  const chartData = generateDummyData();
  const categories: (keyof Omit<ChartDataItem, 'name'>)[] = [
    'DEVELOPMENT',
    'Design',
    'Communication',
    'YouTube',
    'SNS',
    'LLM',
  ];

  // 차트 설정 - 각 카테고리별로 색상 지정
  const chartConfig: ChartConfig = categories.reduce((config, category) => {
    config[category] = {
      label: category,
    };
    return config;
  }, {} as ChartConfig);

  // 총 시간 계산
  const getTotalTime = () => {
    return chartData.reduce((total, item) => {
      return (
        total + categories.reduce((sum, category) => sum + item[category], 0)
      );
    }, 0);
  };

  const totalTime = getTotalTime();

  return (
    <div className='space-y-6'>
      <div className='h-[400px] w-full'>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke={getThemeColor('border')} />
            <XAxis
              dataKey='name'
              className={`text-sm font-medium ${getThemeClass('textSecondary')}`}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              className={`text-sm ${getThemeClass('textSecondary')}`}
              tick={{ fontSize: 12 }}
              tickFormatter={value => `${Math.round(value / 3600)}h`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className={`rounded-xl shadow-xl backdrop-blur-sm ${getThemeClass('border')} ${getThemeClass('component')}`}
                  formatter={(value, name) => [
                    <div key={name} className='flex items-center gap-2'>
                      <div
                        className='h-3 w-3 rounded-full'
                      />
                      <span className={`font-medium ${getThemeClass('textPrimary')}`}>{name}</span>
                      <span className={`ml-auto font-bold ${getThemeClass('textPrimary')}`}>
                        {formatTime(value as number)}
                      </span>
                    </div>,
                    '',
                  ]}
                  labelFormatter={label => (
                    <div className={`mb-2 border-b pb-2 font-semibold ${getThemeClass('border')} ${getThemeClass('textPrimary')}`}>
                      📅 {label}
                    </div>
                  )}
                />
              }
            />
            {/* 각 카테고리별로 스택된 바 생성 */}
            {categories.map(category => (
              <Bar
                key={category}
                dataKey={category}
                stackId='stack'
                radius={
                  category === categories[categories.length - 1]
                    ? [4, 4, 0, 0]
                    : [0, 0, 0, 0]
                }
                className='transition-all duration-300 hover:opacity-80'
              />
            ))}
          </BarChart>
        </ChartContainer>
      </div>

      {/* 카테고리 범례 */}
      <div className={`rounded-xl p-4 shadow-sm ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <h4 className={`mb-3 text-sm font-semibold ${getThemeClass('textPrimary')}`}>
          🏷️ Category Legend
        </h4>
        <div className='grid grid-cols-2 gap-3 lg:grid-cols-3'>
          {categories.map(category => (
            <div key={category} className='flex items-center gap-2'>
              <div
                className='h-4 w-4 rounded-full shadow-sm'
              />
              <span className={`text-sm font-medium ${getThemeClass('textPrimary')}`}>
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 기간별 통계 요약 */}
      <div className={`rounded-xl p-4 shadow-sm ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <h4 className={`mb-3 text-sm font-semibold ${getThemeClass('textPrimary')}`}>
          📈 {period === 'weekly' ? 'Weekly' : 'Monthly'} Summary
        </h4>
        <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
          <div className={`rounded-lg p-3 shadow-sm ${getThemeClass('component')}`}>
          </div>
          <div className={`rounded-lg p-3 shadow-sm ${getThemeClass('component')}`}>
            <div className={`text-xs ${getThemeClass('textSecondary')}`}>
              {period === 'weekly' ? 'Weekly' : 'Monthly'} Average
            </div>
            <div className='text-lg font-bold text-blue-600'>
              {formatTime(Math.round(totalTime / chartData.length))}
            </div>
          </div>
          <div className={`rounded-lg p-3 shadow-sm ${getThemeClass('component')}`}>
            <div className={`text-xs ${getThemeClass('textSecondary')}`}>Best Record</div>
            <div className='text-lg font-bold text-green-600'>
              {formatTime(
                Math.max(
                  ...chartData.map(item =>
                    categories.reduce((sum, cat) => sum + item[cat], 0)
                  )
                )
              )}
            </div>
          </div>
          <div className={`rounded-lg p-3 shadow-sm ${getThemeClass('component')}`}>
            <div className={`text-xs ${getThemeClass('textSecondary')}`}>
              Active {period === 'weekly' ? 'Weeks' : 'Months'}
            </div>
            <div className='text-lg font-bold text-orange-600'>
              {chartData.length}
              {period === 'weekly' ? 'weeks' : 'months'}
            </div>
          </div>
        </div>
      </div>

      {/* 기간별 인사이트 */}
      <div className={`rounded-xl p-4 shadow-sm ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <div className='mb-2 flex items-center gap-2'>
          <span className='text-lg'>💡</span>
          <h4 className={`text-sm font-semibold ${getThemeClass('textPrimary')}`}>Insights</h4>
        </div>
        <div className={`text-sm ${getThemeClass('textSecondary')}`}>
          {period === 'weekly' ? (
            <>
              Your most productive week was{' '}
              <strong className={getThemeClass('textAccent')}>
                {
                  chartData.reduce(
                    (max, item, index) => {
                      const total = categories.reduce(
                        (sum, cat) => sum + item[cat],
                        0
                      );
                      const maxTotal = categories.reduce(
                        (sum, cat) => sum + max.item[cat],
                        0
                      );
                      return total > maxTotal ? { item, index } : max;
                    },
                    { item: chartData[0], index: 0 }
                  ).item.name
                }
              </strong>.
              You invested the most time in the{' '}
              <strong className={getThemeClass('textAccent')}>DEVELOPMENT</strong>{' '}
              category!
            </>
          ) : (
            <>
              Your most active month was{' '}
              <strong className={getThemeClass('textAccent')}>
                {
                  chartData.reduce(
                    (max, item, index) => {
                      const total = categories.reduce(
                        (sum, cat) => sum + item[cat],
                        0
                      );
                      const maxTotal = categories.reduce(
                        (sum, cat) => sum + max.item[cat],
                        0
                      );
                      return total > maxTotal ? { item, index } : max;
                    },
                    { item: chartData[0], index: 0 }
                  ).item.name
                }
              </strong>.
              You're{' '}
              <strong className={getThemeClass('textAccent')}>maintaining</strong> a consistent learning pattern!
            </>
          )}
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // 메모이제이션: period만 비교
  return prevProps.period === nextProps.period;
});

export default StatisticsBarChart;
