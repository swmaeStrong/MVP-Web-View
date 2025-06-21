'use client';

import { useHourlyUsage } from '@/hooks/useHourlyUsage';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '@/shadcn/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/ui/select';
import { getKSTDateString } from '@/utils/timezone';
import { Target } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
import ErrorState from '../common/ErrorState';
import NoData from '../common/NoData';

interface HourlyUsageComparisonProps {
  userId: string;
  date?: string;
}

// BinSize 옵션
const BIN_SIZE_OPTIONS = [
  { value: 15, label: '15분' },
  { value: 30, label: '30분' },
  { value: 60, label: '1시간' },
];

// 초 단위까지 포함한 시간 포맷팅 (시간별 사용량 전용)
const formatTimeWithSeconds = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours === 0 && minutes === 0 && secs === 0) return '0초';
  if (hours === 0 && minutes === 0) return `${secs}초`;
  if (hours === 0)
    return secs === 0 ? `${minutes}분` : `${minutes}분 ${secs}초`;
  if (minutes === 0)
    return secs === 0 ? `${hours}시간` : `${hours}시간 ${secs}초`;
  return secs === 0
    ? `${hours}시간 ${minutes}분`
    : `${hours}시간 ${minutes}분 ${secs}초`;
};

export default function HourlyUsageComparison({
  userId,
  date,
}: HourlyUsageComparisonProps) {
  const [selectedBinSize, setSelectedBinSize] = useState(60);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const currentDate = date || getKSTDateString();

  // 시간별 사용량 데이터 조회
  const {
    data: hourlyData,
    isLoading,
    isError,
    refetch,
  } = useHourlyUsage(currentDate, userId, selectedBinSize);

  // 차트 데이터 가공
  const chartData = useMemo(() => {
    if (!hourlyData) return [];

    // 시간대별로 그룹화
    const hourlyMap = new Map<
      string,
      { total: number; categories: Record<string, number> }
    >();

    hourlyData.forEach(item => {
      const hour = item.hour;
      if (!hourlyMap.has(hour)) {
        hourlyMap.set(hour, { total: 0, categories: {} });
      }

      const hourData = hourlyMap.get(hour)!;
      hourData.total += item.totalDuration;
      hourData.categories[item.category] =
        (hourData.categories[item.category] || 0) + item.totalDuration;
    });

    // 차트용 데이터 변환
    return Array.from(hourlyMap.entries())
      .map(([hour, data]) => ({
        hour,
        hourDisplay: hour.split('T')[1]?.substring(0, 5) || hour, // 시간 부분만 추출 (HH:MM)
        total: data.total,
        category: selectedCategory ? data.categories[selectedCategory] || 0 : 0,
        ...data.categories,
      }))
      .sort((a, b) => a.hour.localeCompare(b.hour));
  }, [hourlyData, selectedCategory]);

  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    const data = payload[0]?.payload;
    const total = data?.total || 0;
    const categoryValue = data?.category || 0;
    const percentage =
      total > 0 ? Math.round((categoryValue / total) * 100) : 0;

    return (
      <div className='z-50 rounded-lg border border-gray-200 bg-white/95 p-3 shadow-xl backdrop-blur-sm'>
        <div className='mb-2 font-medium text-gray-800'>{label}</div>
        {selectedCategory && (
          <div className='space-y-1 text-sm'>
            <div className='font-medium text-purple-600'>
              사용 비율: {percentage}%
            </div>
            <div className='text-gray-700'>
              {selectedCategory} 사용량: {formatTimeWithSeconds(categoryValue)}
            </div>
            <div className='text-gray-700'>
              전체 사용량: {formatTimeWithSeconds(total)}
            </div>
          </div>
        )}
        {!selectedCategory && (
          <div className='text-sm text-gray-700'>
            전체 사용량: {formatTimeWithSeconds(total)}
          </div>
        )}
      </div>
    );
  };

  // 사용 가능한 카테고리 목록
  const availableCategories = useMemo(() => {
    if (!hourlyData) return [];

    const categories = new Set<string>();
    hourlyData.forEach(item => categories.add(item.category));
    return Array.from(categories).sort();
  }, [hourlyData]);

  // 차트 설정
  const chartConfig = useMemo(
    () => ({
      total: {
        label: '전체',
        color: 'hsl(var(--chart-1))',
      },
      category: {
        label: selectedCategory || '선택된 카테고리',
        color: 'hsl(var(--chart-2))',
      },
    }),
    [selectedCategory]
  );

  if (isLoading) {
    return (
      <Card className='rounded-lg border border-gray-100 bg-white shadow-sm'>
        <CardContent className='p-6'>
          <div className='flex h-64 items-center justify-center'>
            <div className='text-center'>
              <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600'></div>
              <p className='text-gray-600'>시간별 데이터를 불러오는 중...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !hourlyData) {
    return (
      <Card className='rounded-lg border border-gray-100 bg-white shadow-sm'>
        <CardContent className='p-6'>
          <ErrorState
            title='시간별 데이터를 불러올 수 없습니다'
            message='네트워크 문제가 발생했습니다. 다시 시도해주세요.'
            onRetry={refetch}
            retryText='새로고침'
            showBorder={false}
            size='sm'
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='w-full'>
      <Card className='rounded-lg border border-gray-100 bg-white shadow-sm'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2 text-lg font-semibold text-gray-800'>
                <Target className='h-5 w-5 text-purple-600' />
                시간별 사용량
              </CardTitle>
              <p className='mt-1 text-sm text-gray-500'>{currentDate}</p>
            </div>
            <div className='flex items-center gap-3'>
              {/* 차트 타입 토글 */}
              <div className='flex items-center rounded-lg bg-gray-100 p-1'>
                <button
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    chartType === 'bar'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setChartType('bar')}
                >
                  📊 막대
                </button>
                <button
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    chartType === 'line'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setChartType('line')}
                >
                  📈 선형
                </button>
              </div>

              {/* 시간 단위 */}
              <div className='flex items-center gap-2'>
                <span className='text-xs text-gray-500'>단위</span>
                <Select
                  value={selectedBinSize.toString()}
                  onValueChange={value => setSelectedBinSize(parseInt(value))}
                >
                  <SelectTrigger className='h-8 w-20 border-gray-200 bg-gray-50/50 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BIN_SIZE_OPTIONS.map(option => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 카테고리 선택 */}
              <div className='flex items-center gap-2'>
                <span className='text-xs text-gray-500'>비교</span>
                <Select
                  value={selectedCategory || 'all'}
                  onValueChange={value =>
                    setSelectedCategory(value === 'all' ? null : value)
                  }
                >
                  <SelectTrigger className='h-8 w-32 border-gray-200 bg-gray-50/50 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>전체</SelectItem>
                    {availableCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className='px-2 pt-0'>
          {chartData.length === 0 ? (
            <div className='h-[350px]'>
              <NoData
                title='시간별 데이터가 없습니다'
                message='선택한 날짜에 활동 기록이 없습니다.'
                showBorder={false}
                size='md'
              />
            </div>
          ) : (
            <ChartContainer config={chartConfig} className='h-[350px] w-full'>
              {chartType === 'bar' ? (
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='hourDisplay'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={value => formatTimeWithSeconds(value)}
                  />
                  <ChartTooltip content={<CustomTooltip />} />
                  <ChartLegend
                    content={
                      <ChartLegendContent className='font-medium text-gray-800' />
                    }
                  />
                  <Bar
                    dataKey='total'
                    name='전체'
                    fill='var(--color-total)'
                    radius={[4, 4, 0, 0]}
                  />
                  {selectedCategory && (
                    <Bar
                      dataKey='category'
                      name={selectedCategory}
                      fill='var(--color-category)'
                      radius={[4, 4, 0, 0]}
                    />
                  )}
                </BarChart>
              ) : (
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='hourDisplay'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={value => formatTimeWithSeconds(value)}
                  />
                  <ChartTooltip content={<CustomTooltip />} />
                  <ChartLegend
                    content={
                      <ChartLegendContent className='font-medium text-gray-800' />
                    }
                  />
                  <Line
                    type='monotone'
                    dataKey='total'
                    name='전체'
                    stroke='var(--color-total)'
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 4, fill: 'var(--color-total)' }}
                  />
                  {selectedCategory && (
                    <Line
                      type='monotone'
                      dataKey='category'
                      name={selectedCategory}
                      stroke='var(--color-category)'
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 4, fill: 'var(--color-category)' }}
                    />
                  )}
                </LineChart>
              )}
            </ChartContainer>
          )}

          {/* 요약 정보 */}
          {selectedCategory && (
            <div className='mt-4 grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-white/50 p-4'>
              <div className='text-center'>
                <div className='text-sm text-gray-600'>전체</div>
                <div className='text-lg font-semibold text-gray-800'>
                  {formatTimeWithSeconds(
                    chartData.reduce((sum, item) => sum + item.total, 0)
                  )}
                </div>
              </div>
              <div className='text-center'>
                <div className='text-sm text-gray-600'>{selectedCategory}</div>
                <div className='text-lg font-semibold text-purple-600'>
                  {formatTimeWithSeconds(
                    chartData.reduce((sum, item) => sum + item.category, 0)
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
