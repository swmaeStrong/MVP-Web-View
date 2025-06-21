'use client';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shadcn/ui/chart';
import { PeriodType } from '@/types/statistics';
import { getCategoryColor } from '@/utils/categories';
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

export default function StatisticsBarChart({
  period,
}: StatisticsBarChartProps) {
  const generateDummyData = (): ChartDataItem[] => {
    if (period === 'weekly') {
      return [
        {
          name: '1주차',
          DEVELOPMENT: 25200, // 7시간
          Design: 14400, // 4시간
          Communication: 10800, // 3시간
          YouTube: 7200, // 2시간
          SNS: 3600, // 1시간
          LLM: 5400, // 1.5시간
        },
        {
          name: '2주차',
          DEVELOPMENT: 28800, // 8시간
          Design: 18000, // 5시간
          Communication: 7200, // 2시간
          YouTube: 10800, // 3시간
          SNS: 5400, // 1.5시간
          LLM: 7200, // 2시간
        },
        {
          name: '3주차',
          DEVELOPMENT: 21600, // 6시간
          Design: 16200, // 4.5시간
          Communication: 12600, // 3.5시간
          YouTube: 9000, // 2.5시간
          SNS: 7200, // 2시간
          LLM: 10800, // 3시간
        },
        {
          name: '4주차',
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
          name: '1월',
          DEVELOPMENT: 86400, // 24시간
          Design: 64800, // 18시간
          Communication: 43200, // 12시간
          YouTube: 36000, // 10시간
          SNS: 21600, // 6시간
          LLM: 28800, // 8시간
        },
        {
          name: '2월',
          DEVELOPMENT: 93600, // 26시간
          Design: 72000, // 20시간
          Communication: 36000, // 10시간
          YouTube: 43200, // 12시간
          SNS: 25200, // 7시간
          LLM: 32400, // 9시간
        },
        {
          name: '3월',
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
      color: getCategoryColor(category),
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
            <CartesianGrid strokeDasharray='3 3' className='stroke-gray-200' />
            <XAxis
              dataKey='name'
              className='text-sm font-medium text-gray-600'
              tick={{ fontSize: 12 }}
            />
            <YAxis
              className='text-sm text-gray-600'
              tick={{ fontSize: 12 }}
              tickFormatter={value => `${Math.round(value / 3600)}h`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className='rounded-xl border border-gray-200 bg-white/95 shadow-xl backdrop-blur-sm'
                  formatter={(value, name) => [
                    <div key={name} className='flex items-center gap-2'>
                      <div
                        className='h-3 w-3 rounded-full'
                        style={{
                          backgroundColor: getCategoryColor(name as string),
                        }}
                      />
                      <span className='font-medium text-gray-800'>{name}</span>
                      <span className='ml-auto font-bold text-gray-900'>
                        {formatTime(value as number)}
                      </span>
                    </div>,
                    '',
                  ]}
                  labelFormatter={label => (
                    <div className='mb-2 border-b border-gray-200 pb-2 font-semibold text-gray-800'>
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
                fill={getCategoryColor(category)}
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
      <div className='rounded-xl border border-gray-100 bg-white p-4 shadow-sm'>
        <h4 className='mb-3 text-sm font-semibold text-gray-700'>
          🏷️ 카테고리 범례
        </h4>
        <div className='grid grid-cols-2 gap-3 lg:grid-cols-3'>
          {categories.map(category => (
            <div key={category} className='flex items-center gap-2'>
              <div
                className='h-4 w-4 rounded-full shadow-sm'
                style={{ backgroundColor: getCategoryColor(category) }}
              />
              <span className='text-sm font-medium text-gray-700'>
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 기간별 통계 요약 */}
      <div className='rounded-xl border border-gray-100 bg-white p-4 shadow-sm'>
        <h4 className='mb-3 text-sm font-semibold text-gray-700'>
          📈 {period === 'weekly' ? '주간' : '월간'} 요약
        </h4>
        <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
          <div className='rounded-lg bg-white p-3 shadow-sm'>
            <div className='text-xs text-gray-500'>총 작업시간</div>
            <div className='text-lg font-bold text-purple-600'>
              {formatTime(totalTime)}
            </div>
          </div>
          <div className='rounded-lg bg-white p-3 shadow-sm'>
            <div className='text-xs text-gray-500'>
              {period === 'weekly' ? '주' : '월'}평균
            </div>
            <div className='text-lg font-bold text-blue-600'>
              {formatTime(Math.round(totalTime / chartData.length))}
            </div>
          </div>
          <div className='rounded-lg bg-white p-3 shadow-sm'>
            <div className='text-xs text-gray-500'>최고 기록</div>
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
          <div className='rounded-lg bg-white p-3 shadow-sm'>
            <div className='text-xs text-gray-500'>
              활동 {period === 'weekly' ? '주수' : '개월'}
            </div>
            <div className='text-lg font-bold text-orange-600'>
              {chartData.length}
              {period === 'weekly' ? '주' : '개월'}
            </div>
          </div>
        </div>
      </div>

      {/* 기간별 인사이트 */}
      <div className='rounded-xl border border-blue-100 bg-white p-4 shadow-sm'>
        <div className='mb-2 flex items-center gap-2'>
          <span className='text-lg'>💡</span>
          <h4 className='text-sm font-semibold text-gray-700'>인사이트</h4>
        </div>
        <div className='text-sm text-gray-600'>
          {period === 'weekly' ? (
            <>
              가장 생산적인 주는{' '}
              <strong className='text-blue-700'>
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
              </strong>
              였습니다.
              <strong className='text-purple-700'>DEVELOPMENT</strong>{' '}
              카테고리에 가장 많은 시간을 투자했어요!
            </>
          ) : (
            <>
              가장 활발했던 달은{' '}
              <strong className='text-blue-700'>
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
              </strong>
              였습니다. 꾸준한 학습 패턴을{' '}
              <strong className='text-purple-700'>유지</strong>하고 있어요!
            </>
          )}
        </div>
      </div>
    </div>
  );
}
