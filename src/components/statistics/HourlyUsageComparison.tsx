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
import { Activity } from 'lucide-react';
import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
import StateDisplay from '../common/StateDisplay';

interface HourlyUsageComparisonProps {
  userId: string;
  date?: string;
}

// BinSize options
const BIN_SIZE_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hour' },
];

// Time formatting including seconds (for hourly usage) - remove decimals
const formatTimeWithSeconds = (seconds: number): string => {
  const totalSeconds = Math.floor(seconds); // 소수점 제거
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours === 0 && minutes === 0 && secs === 0) return '0s';
  if (hours === 0 && minutes === 0) return `${secs}s`;
  if (hours === 0)
    return secs === 0 ? `${minutes}m` : `${minutes}m ${secs}s`;
  if (minutes === 0)
    return secs === 0 ? `${hours}h` : `${hours}h ${secs}s`;
  return secs === 0
    ? `${hours}h ${minutes}m`
    : `${hours}h ${minutes}m ${secs}s`;
};

// Generate Y-axis ticks based on binSize
const generateYAxisTicks = (maxValue: number, binSize: number): number[] => {
  const ticks: number[] = [0];
  
  if (binSize === 15) {
    // For 15 minutes: 4min, 8min, 12min, 15min
    ticks.push(240, 480, 720, 900); // 4, 8, 12, 15 minutes in seconds
  } else if (binSize === 30) {
    // For 30 minutes: 8min, 16min, 24min, 30min
    ticks.push(480, 960, 1440, 1800); // 8, 16, 24, 30 minutes in seconds
  } else if (binSize === 60) {
    // For 1 hour: 15min, 30min, 45min, 60min intervals
    ticks.push(900, 1800, 2700, 3600); // 15, 30, 45, 60 minutes in seconds
  } else if (binSize === 180) {
    // For 3 hours: 30min, 1h, 1.5h, 2h, 2.5h, 3h
    ticks.push(1800, 3600, 5400, 7200, 9000, 10800);
  } else if (binSize === 360) {
    // For 6 hours: 1h, 2h, 3h, 4h, 5h, 6h
    ticks.push(3600, 7200, 10800, 14400, 18000, 21600);
  } else if (binSize === 720) {
    // For 12 hours: 2h, 4h, 6h, 8h, 10h, 12h
    ticks.push(7200, 14400, 21600, 28800, 36000, 43200);
  } else if (binSize === 1440) {
    // For 24 hours: 4h, 8h, 12h, 16h, 20h, 24h
    ticks.push(14400, 28800, 43200, 57600, 72000, 86400);
  }
  
  // Filter ticks to only include those within the actual data range
  return ticks.filter(tick => tick <= Math.ceil(maxValue));
};

export default function HourlyUsageComparison({
  userId,
  date,
}: HourlyUsageComparisonProps) {
  const { isDarkMode, getThemeClass, getThemeColor, getThemeTextColor } = useTheme();
  const [selectedBinSize, setSelectedBinSize] = useState(15);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'line'>('line');

  const currentDate = date || getKSTDateString();

  // Memoize CSS classes to avoid recreating strings on every render
  const cssClasses = useMemo(() => ({
    card: `rounded-lg border-2 shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`,
    cardTitle: `flex items-center gap-2 text-lg font-semibold ${getThemeTextColor('primary')}`,
    labelText: `text-xs ${getThemeTextColor('secondary')}`,
    selectTrigger: `h-8 w-[70px] lg:w-[80px] text-xs border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} hover:${getThemeClass('componentSecondary')}`,
    toggleContainer: `flex items-center rounded-lg p-1 ${getThemeClass('componentSecondary')}`,
    categoryInfo: `mt-4 grid grid-cols-2 gap-2 lg:gap-4 rounded-lg border-2 p-3 lg:p-4 ${getThemeClass('border')} ${getThemeClass('componentSecondary')}`,
    tooltipContainer: `rounded-lg border-2 p-3 shadow-xl backdrop-blur-sm ${getThemeClass('border')} ${getThemeClass('component')}`,
    button: {
      base: 'rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200',
      active: `${getThemeClass('component')} ${getThemeTextColor('accent')} shadow-sm`,
      inactive: `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')}`
    }
  }), [getThemeClass, getThemeTextColor]);

  // Query hourly usage data
  const {
    data: hourlyData,
    isLoading,
    isError,
    refetch,
  } = useHourlyUsage(currentDate, userId, selectedBinSize);

  // Process chart data and validate - optimized
  const { chartData, dataValidation } = useMemo(() => {
    if (!hourlyData || hourlyData.length === 0) {
      return { chartData: [], dataValidation: { isValid: false, reason: 'no-data' } };
    }

    // Use object instead of Map for better performance with small datasets
    const hourlyMap: Record<string, { total: number; categories: Record<string, number> }> = {};

    // Single pass through data
    for (const item of hourlyData) {
      const hour = item.hour;
      if (!hourlyMap[hour]) {
        hourlyMap[hour] = { total: 0, categories: {} };
      }

      const hourData = hourlyMap[hour];
      hourData.total += item.totalDuration;
      hourData.categories[item.category] = (hourData.categories[item.category] || 0) + item.totalDuration;
    }

    // Convert to chart data with single pass
    const processedData = Object.entries(hourlyMap)
      .map(([hour, data]) => {
        const hourDisplay = hour.includes('T') ? hour.split('T')[1].substring(0, 5) : hour;
        const categoryValue = selectedCategory ? (data.categories[selectedCategory] || 0) : 0;
        
        return {
          hour,
          hourDisplay,
          total: data.total,
          category: categoryValue,
          ...data.categories,
        };
      })
      .sort((a, b) => a.hour.localeCompare(b.hour));

    // Quick validation
    const dataPointsCount = processedData.length;
    const validation = dataPointsCount === 0 
      ? { isValid: false, reason: 'no-data' }
      : dataPointsCount < 4 
        ? { isValid: false, reason: 'insufficient-points' }
        : { isValid: true, reason: '' };

    return { chartData: processedData, dataValidation: validation };
  }, [hourlyData, selectedCategory]);

  // Calculate max value for Y-axis
  const maxValue = useMemo(() => {
    if (!chartData || chartData.length === 0) return 3600; // Default to 1 hour
    
    const maxTotal = Math.max(...chartData.map(item => item.total));
    const maxCategory = selectedCategory 
      ? Math.max(...chartData.map(item => item.category))
      : 0;
    
    return Math.max(maxTotal, maxCategory);
  }, [chartData, selectedCategory]);

  // Get Y-axis ticks based on binSize
  const yAxisTicks = useMemo(() => generateYAxisTicks(maxValue, selectedBinSize), [maxValue, selectedBinSize]);

  // Memoized Custom tooltip component
  const CustomTooltip = useCallback(({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    const data = payload[0]?.payload;
    const total = data?.total || 0;
    const categoryValue = data?.category || 0;
    const percentage = total > 0 ? Math.round((categoryValue / total) * 100) : 0;

    // Format time range based on binSize
    const startTime = label;
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + Math.floor((minutes + selectedBinSize) / 60);
    const endMinutes = (minutes + selectedBinSize) % 60;
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    const timeRange = `${startTime} - ${endTime}`;

    return (
      <div className={cssClasses.tooltipContainer}>
        <div className={`mb-2 font-medium ${getThemeTextColor('primary')}`}>{timeRange}</div>
        {selectedCategory && (
          <div className='space-y-1 text-sm'>
            <div className={`font-medium ${getThemeTextColor('accent')}`}>
              Usage Rate: {percentage}%
            </div>
            <div className={getThemeTextColor('secondary')}>
              {selectedCategory} Usage: {formatTimeWithSeconds(categoryValue)}
            </div>
            <div className={getThemeTextColor('secondary')}>
              Total Usage: {formatTimeWithSeconds(total)}
            </div>
          </div>
        )}
        {!selectedCategory && (
          <div className={`text-sm ${getThemeTextColor('secondary')}`}>
            Total Usage: {formatTimeWithSeconds(total)}
          </div>
        )}
      </div>
    );
  }, [selectedBinSize, selectedCategory, cssClasses.tooltipContainer, getThemeTextColor]);

  // Available categories list
  const availableCategories = useMemo(() => {
    if (!hourlyData) return [];

    const categories = new Set<string>();
    hourlyData.forEach(item => categories.add(item.category));
    return Array.from(categories).sort();
  }, [hourlyData]);

  // Adjust default category based on available categories
  useEffect(() => {
    if (availableCategories.length > 0) {
      // Only set default if no category is selected or selected category is not available
      if (!selectedCategory || !availableCategories.includes(selectedCategory)) {
        setSelectedCategory(availableCategories.includes('Development') ? 'Development' : availableCategories[0]);
      }
    }
  }, [availableCategories, selectedCategory]);

  // Chart configuration
  const chartConfig = useMemo(
    () => ({
      total: {
        label: 'Total',
        color: 'hsl(var(--chart-1))',
      },
      category: {
        label: selectedCategory || 'Selected Category',
        color: 'hsl(var(--chart-2))',
      },
    }),
    [selectedCategory]
  );

  if (isLoading) {
    return (
      <Card className={cssClasses.card}>
        <CardHeader className='pb-3'>
          <div className='space-y-3'>
            {/* Header skeleton */}
            <div className='flex items-center justify-between'>
              <div className={`h-7 w-32 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
              
              {/* Controls skeleton */}
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-1 lg:gap-2'>
                  <div className={`h-4 w-8 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                  <div className={`h-8 w-[70px] lg:w-[80px] animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
                </div>
                <div className='flex items-center gap-1 lg:gap-2'>
                  <div className={`h-4 w-16 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                  <div className={`h-8 w-[100px] lg:w-[140px] animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
                </div>
              </div>
            </div>
            
            {/* Chart type toggle skeleton */}
            <div className='flex items-center'>
              <div className={`flex items-center rounded-lg p-1 ${getThemeClass('componentSecondary')}`}>
                <div className={`h-8 w-12 animate-pulse rounded-md mx-1 ${getThemeClass('borderLight')}`}></div>
                <div className={`h-8 w-12 animate-pulse rounded-md mx-1 ${getThemeClass('borderLight')}`}></div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className='px-2 pt-0'>
          {/* Chart skeleton */}
          <div className='h-[300px] lg:h-[350px] w-full'>
            <div className='h-full flex items-end gap-2 px-4'>
              {[...Array(12)].map((_, index) => (
                <div key={index} className='flex-1 flex flex-col items-center gap-1'>
                  <div 
                    className={`w-full animate-pulse rounded ${getThemeClass('componentSecondary')}`} 
                    style={{ 
                      height: `${Math.random() * 150 + 50}px`,
                      animationDelay: `${index * 50}ms`
                    }}
                  ></div>
                  <div className={`h-3 w-8 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary skeleton */}
          <div className={`mt-4 grid grid-cols-2 gap-2 lg:gap-4 rounded-lg border-2 p-3 lg:p-4 ${getThemeClass('border')} ${getThemeClass('componentSecondary')}`}>
            <div className='text-center'>
              <div className={`h-4 w-12 mx-auto mb-1 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
              <div className={`h-6 w-16 mx-auto animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
            </div>
            <div className='text-center'>
              <div className={`h-4 w-20 mx-auto mb-1 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
              <div className={`h-6 w-16 mx-auto animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
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
          <StateDisplay
            type="error"
            title='Unable to load hourly data'
            message='A network error occurred. Please try again.'
            onRetry={refetch}
            retryText='Refresh'
            showBorder={false}
            size='small'
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='w-full'>
      <Card className={cssClasses.card}>
        <CardHeader className='pb-3'>
          <div className='space-y-3'>
            {/* 상단: 제목과 단위/비교 선택 */}
            <div className='flex items-center justify-between'>
              <CardTitle className={cssClasses.cardTitle}>
                Hourly Usage
              </CardTitle>
              
              {/* 단위와 비교 선택 */}
              <div className='flex items-center gap-3'>
              {/* 시간 단위 */}
              <div className='flex items-center gap-1 lg:gap-2'>
                <span className={cssClasses.labelText}>Unit</span>
                <Select
                  value={selectedBinSize.toString()}
                  onValueChange={value => setSelectedBinSize(parseInt(value))}
                >
                  <SelectTrigger className={cssClasses.selectTrigger}>
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
                <span className={cssClasses.labelText}>Compare</span>
                <Select
                  value={selectedCategory || availableCategories[0]}
                  onValueChange={value => setSelectedCategory(value)}
                >
                  <SelectTrigger className={`h-8 w-[100px] lg:w-[140px] text-xs border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} hover:${getThemeClass('componentSecondary')}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
              <div className={cssClasses.toggleContainer}>
              <button
                  className={`${cssClasses.button.base} ${
                    chartType === 'line' ? cssClasses.button.active : cssClasses.button.inactive
                  }`}
                  onClick={() => setChartType('line')}
                >
                  Line
                </button>
                <button
                  className={`${cssClasses.button.base} ${
                    chartType === 'bar' ? cssClasses.button.active : cssClasses.button.inactive
                  }`}
                  onClick={() => setChartType('bar')}
                >
                  Bar
                </button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className='px-2 pt-0'>
          {!dataValidation.isValid ? (
            <div className='flex h-[350px] items-center justify-center p-4'>
              <StateDisplay
                type="empty"
                title={
                  dataValidation.reason === 'no-data' 
                    ? 'No hourly data available'
                    : 'Insufficient time periods'
                }
                message={
                  dataValidation.reason === 'no-data'
                    ? 'No activity records for the selected date.'
                    : 'At least 4 time periods with activity are needed for meaningful hourly pattern analysis.'
                }
                icon={Activity}
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
                    ticks={yAxisTicks}
                    domain={[0, 'dataMax']}
                  />
                  <ChartTooltip 
                    content={<CustomTooltip />} 
                    wrapperStyle={{ zIndex: 99999 }}
                  />
                  <ChartLegend
                    content={
                      <ChartLegendContent className={`font-medium ${getThemeTextColor('primary')}`} />
                    }
                  />
                  <Bar
                    dataKey='total'
                    name='Total'
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
                    ticks={yAxisTicks}
                    domain={[0, 'dataMax']}
                  />
                  <ChartTooltip 
                    content={<CustomTooltip />} 
                    wrapperStyle={{ zIndex: 99999 }}
                  />
                  <ChartLegend
                    content={
                      <ChartLegendContent className={`font-medium ${getThemeTextColor('primary')}`} />
                    }
                  />
                  <Line
                    type='monotone'
                    dataKey='total'
                    name='Total'
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
            <div className={cssClasses.categoryInfo}>
              <div className='text-center'>
                <div className={`text-xs lg:text-sm ${getThemeTextColor('secondary')}`}>Total</div>
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
