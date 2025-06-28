'use client';

import { useTheme } from '@/hooks/useTheme';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/shadcn/ui/chart';
import { DailyStatistics } from '@/types/statistics';
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

interface StatisticsRadarChartProps {
  data: DailyStatistics;
}

export default function StatisticsRadarChart({
  data,
}: StatisticsRadarChartProps) {
  const { isDarkMode, getThemeClass, getThemeColor, getThemeTextColor, getThemeTextColorValue } = useTheme();
  // 6개의 고정 색상 정의
  const categoryColors = [
    '#8b5cf6', // 보라
    '#06b6d4', // 청록
    '#10b981', // 초록
    '#f59e0b', // 노랑
    '#ef4444', // 빨강
    '#ec4899', // 핑크
  ];

  // Top 6 카테고리만 추출하고 색상 할당
  const top6Categories = data.categories.slice(0, 6).map((category, index) => ({
    ...category,
    color: categoryColors[index] || categoryColors[0], // 색상 오버라이드
  }));

  // 데이터 유효성 검사
  const totalTime = data.totalTime || 0;
  const hasValidData = top6Categories.length > 0 && totalTime > 0;
  const hasMinimumData = top6Categories.length >= 4; // 최소 4개 카테고리 필요

  if (!hasValidData) {
    return (
      <div className='flex h-full items-center justify-center p-4'>
        <NoData
          title='분석할 카테고리가 없습니다'
          message='활동 데이터가 없어 레이더 차트를 표시할 수 없습니다.'
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
          title='카테고리가 부족합니다'
          message='의미있는 레이더 차트 분석을 위해서는 최소 4개 이상의 카테고리가 필요합니다.'
          icon={Activity}
          showBorder={false}
          size='medium'
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
    fill: category.color, // 할당된 색상 사용
  }));

  // 차트 설정
  const chartConfig = top6Categories.reduce((config, category, index) => {
    config[category.name] = {
      label: category.name,
      color: category.color, // 할당된 색상 사용
    };
    return config;
  }, {} as ChartConfig);

  return (
    <div className='h-full flex items-center justify-center'>
      {/* 차트 - 반응형 개선 */}
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
                                )?.color || categoryColors[0],
                            }}
                          />
                          <span className={`font-bold ${getThemeTextColor('primary')}`}>
                            {categoryName}
                          </span>
                        </div>
                        <div className={`ml-5 text-sm ${getThemeTextColor('secondary')}`}>
                          시간:{' '}
                          <span className={`font-semibold ${getThemeTextColor('primary')}`}>
                            {formatTime(time as number)}
                          </span>
                        </div>
                        <div className={`ml-5 text-sm ${getThemeTextColor('secondary')}`}>
                          비율:{' '}
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
                fontSize: 10,
                fill: getThemeTextColorValue('primary'),
                fontWeight: 'bold',
                textAnchor: 'middle',
              }}
              className={`text-xs lg:text-sm font-semibold ${getThemeTextColor('primary')}`}
              tickFormatter={value => {
                // 작은 화면에서 더 짧게 자르기
                if (value.length > 6) {
                  return value.substring(0, 4) + '...';
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
