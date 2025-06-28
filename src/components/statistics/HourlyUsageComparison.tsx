'use client';

import { useHourlyUsage } from '@/hooks/useHourlyUsage';
import { useTheme } from '@/hooks/useTheme';
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

// 초 단위까지 포함한 시간 포맷팅 (시간별 사용량 전용) - 소수점 제거
const formatTimeWithSeconds = (seconds: number): string => {
  const totalSeconds = Math.floor(seconds); // 소수점 제거
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

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
  const { isDarkMode, getThemeClass, getThemeColor, getThemeTextColor } = useTheme();
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

  // 차트 데이터 가공 및 유효성 검사
  const { chartData, dataValidation } = useMemo(() => {
    if (!hourlyData) return { chartData: [], dataValidation: { isValid: false, reason: 'no-data' } };

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
    const processedData = Array.from(hourlyMap.entries())
      .map(([hour, data]) => ({
        hour,
        hourDisplay: hour.split('T')[1]?.substring(0, 5) || hour, // 시간 부분만 추출 (HH:MM)
        total: data.total,
        category: selectedCategory ? data.categories[selectedCategory] || 0 : 0,
        ...data.categories,
      }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    // 데이터 유효성 검사
    const dataPointsCount = processedData.length;
    const hasMinimumDataPoints = dataPointsCount >= 4; // 최소 4개 이상의 시간대 필요

    let validation = { isValid: true, reason: '' };
    
    if (dataPointsCount === 0) {
      validation = { isValid: false, reason: 'no-data' };
    } else if (!hasMinimumDataPoints) {
      validation = { isValid: false, reason: 'insufficient-points' };
    }

    return { chartData: processedData, dataValidation: validation };
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
      <div className={`z-50 rounded-lg border-2 p-3 shadow-xl backdrop-blur-sm ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <div className={`mb-2 font-medium ${getThemeTextColor('primary')}`}>{label}</div>
        {selectedCategory && (
          <div className='space-y-1 text-sm'>
            <div className={`font-medium ${getThemeTextColor('accent')}`}>
              사용 비율: {percentage}%
            </div>
            <div className={getThemeTextColor('secondary')}>
              {selectedCategory} 사용량: {formatTimeWithSeconds(categoryValue)}
            </div>
            <div className={getThemeTextColor('secondary')}>
              전체 사용량: {formatTimeWithSeconds(total)}
            </div>
          </div>
        )}
        {!selectedCategory && (
          <div className={`text-sm ${getThemeTextColor('secondary')}`}>
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
      <Card className={`rounded-lg border-2 shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardContent className='p-6'>
          <div className='flex h-64 items-center justify-center'>
            <div className='text-center'>
              <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600'></div>
              <p className={getThemeTextColor('secondary')}>시간별 데이터를 불러오는 중...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !hourlyData) {
    return (
      <Card className={`rounded-lg border-2 shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardContent className='p-6'>
          <ErrorState
            title='시간별 데이터를 불러올 수 없습니다'
            message='네트워크 문제가 발생했습니다. 다시 시도해주세요.'
            onRetry={refetch}
            retryText='새로고침'
            showBorder={false}
            size='small'
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='w-full'>
      <Card className={`rounded-lg border-2 shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardHeader className='pb-3'>
          <div className='space-y-3'>
            {/* 상단: 제목과 단위/비교 선택 */}
            <div className='flex items-center justify-between'>
              <CardTitle className={`flex items-center gap-2 text-lg font-semibold ${getThemeTextColor('primary')}`}>
                시간별 사용량
              </CardTitle>
              
              {/* 단위와 비교 선택 */}
              <div className='flex items-center gap-3'>
              {/* 시간 단위 */}
              <div className='flex items-center gap-1 lg:gap-2'>
                <span className={`text-xs ${getThemeTextColor('secondary')}`}>단위</span>
                <Select
                  value={selectedBinSize.toString()}
                  onValueChange={value => setSelectedBinSize(parseInt(value))}
                >
                  <SelectTrigger className={`h-8 w-[70px] lg:w-[80px] text-xs border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} hover:${getThemeClass('componentSecondary')}`}>
                    <SelectValue placeholder="선택" />
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
              <div className='flex items-center gap-1 lg:gap-2'>
                <span className={`text-xs ${getThemeTextColor('secondary')}`}>비교</span>
                <Select
                  value={selectedCategory || 'all'}
                  onValueChange={value =>
                    setSelectedCategory(value === 'all' ? null : value)
                  }
                >
                  <SelectTrigger className={`h-8 w-[100px] lg:w-[140px] text-xs border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} hover:${getThemeClass('componentSecondary')}`}>
                    <SelectValue placeholder="전체" />
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
            
            {/* 하단: 차트 타입 토글 */}
            <div className='flex items-center'>
              <div className={`flex items-center rounded-lg p-1 ${getThemeClass('componentSecondary')}`}>
                <button
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    chartType === 'bar'
                      ? `${getThemeClass('component')} ${getThemeTextColor('accent')} shadow-sm`
                      : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')}`
                  }`}
                  onClick={() => setChartType('bar')}
                >
                  📊 막대
                </button>
                <button
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    chartType === 'line'
                      ? `${getThemeClass('component')} ${getThemeTextColor('accent')} shadow-sm`
                      : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')}`
                  }`}
                  onClick={() => setChartType('line')}
                >
                  📈 선형
                </button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className='px-2 pt-0'>
          {!dataValidation.isValid ? (
            <div className='flex h-[350px] items-center justify-center p-4'>
              <NoData
                title={
                  dataValidation.reason === 'no-data' 
                    ? '시간별 데이터가 없습니다'
                    : '시간대가 부족합니다'
                }
                message={
                  dataValidation.reason === 'no-data'
                    ? '선택한 날짜에 활동 기록이 없습니다.'
                    : '의미있는 시간별 패턴 분석을 위해서는 최소 4개 이상의 시간대에 활동이 필요합니다.'
                }
                showBorder={false}
                size='medium'
              />
            </div>
          ) : (
            <ChartContainer config={chartConfig} className='h-[300px] lg:h-[350px] w-full'>
              {chartType === 'bar' ? (
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray='3 3' stroke={getThemeColor('border')} />
                  <XAxis
                    dataKey='hourDisplay'
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    height={40}
                  />
                  <YAxis
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={value => formatTimeWithSeconds(value)}
                    width={45}
                  />
                  <ChartTooltip content={<CustomTooltip />} />
                  <ChartLegend
                    content={
                      <ChartLegendContent className={`font-medium ${getThemeTextColor('primary')}`} />
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
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray='3 3' stroke={getThemeColor('border')} />
                  <XAxis
                    dataKey='hourDisplay'
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    height={40}
                  />
                  <YAxis
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={value => formatTimeWithSeconds(value)}
                    width={45}
                  />
                  <ChartTooltip content={<CustomTooltip />} />
                  <ChartLegend
                    content={
                      <ChartLegendContent className={`font-medium ${getThemeTextColor('primary')}`} />
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
            <div className={`mt-4 grid grid-cols-2 gap-2 lg:gap-4 rounded-lg border-2 p-3 lg:p-4 ${getThemeClass('border')} ${getThemeClass('componentSecondary')}`}>
              <div className='text-center'>
                <div className={`text-xs lg:text-sm ${getThemeTextColor('secondary')}`}>전체</div>
                <div className={`text-sm lg:text-lg font-semibold ${getThemeTextColor('primary')}`}>
                  {formatTimeWithSeconds(
                    chartData.reduce((sum, item) => sum + item.total, 0)
                  )}
                </div>
              </div>
              <div className='text-center'>
                <div className={`text-xs lg:text-sm ${getThemeTextColor('secondary')}`}>{selectedCategory}</div>
                <div className={`text-sm lg:text-lg font-semibold ${getThemeTextColor('accent')}`}>
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
