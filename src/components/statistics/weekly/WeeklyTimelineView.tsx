'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/shadcn/ui/chart';
import { getWeeklyPomodoroDetails } from '@/shared/api/get';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

interface WeeklyTimelineViewProps {
  selectedDate: string;
}

const chartConfig = {
  workMinutes: {
    label: "Work Time",
    color: "#3F72AF",
  },
} satisfies ChartConfig;

export default function WeeklyTimelineView({ selectedDate }: WeeklyTimelineViewProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();

  // API 호출
  const { data: weeklyPomodoroData, isLoading, isError } = useQuery({
    queryKey: ['weeklyPomodoroDetails', selectedDate],
    queryFn: () => getWeeklyPomodoroDetails(selectedDate),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // API 데이터를 차트용 데이터로 변환
  const weekData = React.useMemo(() => {
    // 선택된 날짜가 속한 주의 월요일부터 일요일까지 날짜 생성
    const [year, month, day] = selectedDate.split('-').map(Number);
    const currentDate = new Date(year, month - 1, day);
    
    // 해당 주의 월요일 찾기
    const dayOfWeek = currentDate.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(currentDate.getTime() + diff * 24 * 60 * 60 * 1000);
    
    // 7일간의 날짜 배열 생성
    const weekDates = Array(7).fill(null).map((_, index) => {
      const date = new Date(monday.getTime() + index * 24 * 60 * 60 * 1000);
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const monthNum = date.getMonth() + 1;
      const dayNum = date.getDate();
      return {
        date: dateString,
        dateLabel: `${monthNum}/${dayNum}`,
        workSeconds: 0, // 기본값 0
        workMinutes: 0, // 분 단위로도 저장
      };
    });
    
    // API 데이터가 있으면 매핑
    if (weeklyPomodoroData?.dailyResults && weeklyPomodoroData.dailyResults.length > 0) {
      console.log('WeeklyTimelineView - API Response:', weeklyPomodoroData); // 디버깅용
      
      // API 데이터를 날짜별로 맵으로 변환
      const dataMap = new Map(
        weeklyPomodoroData.dailyResults.map(item => [item.date, item.workSeconds || 0])
      );
      
      // weekDates에 실제 데이터 매핑
      weekDates.forEach(dayData => {
        if (dataMap.has(dayData.date)) {
          const workSeconds = dataMap.get(dayData.date) || 0;
          dayData.workSeconds = workSeconds;
          dayData.workMinutes = Math.round(workSeconds / 60);
        }
      });
    }
    
    return weekDates;
  }, [weeklyPomodoroData, selectedDate]);

  const maxWorkMinutes = 8 * 60; // 8시간 = 480분을 최댓값으로 고정
  
  console.log('WeeklyTimelineView - Processed weekData:', weekData); // 디버깅용
  console.log('WeeklyTimelineView - Max work minutes:', maxWorkMinutes); // 디버깅용

  return (
    <div className="w-2/3">
      <Card className={`h-[300px] rounded-lg border-2 transition-all duration-300 ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardContent className="h-full p-3 overflow-y-auto">
          <div className="mb-3">
            <h3 className={`text-sm font-semibold ${getThemeTextColor('primary')}`}>
              Weekly Work Time
            </h3>
            <p className={`text-xs ${getThemeTextColor('secondary')}`}>
              Work minutes distribution across the week
            </p>
          </div>

          {/* 주간 바차트 */}
          {isLoading ? (
            <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          ) : isError ? (
            <div className="flex items-center justify-center h-48">
              <p className={`text-sm ${getThemeTextColor('secondary')}`}>Failed to load data</p>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-48 w-full">
              <BarChart
                data={weekData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis 
                  dataKey="dateLabel" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  domain={[0, maxWorkMinutes]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `${value}m`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [
                        `${value} minutes`,
                        "Work Time"
                      ]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                  }
                />
                <Bar
                  dataKey="workMinutes"
                  fill="var(--color-workMinutes)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}

        {/* 주간 통계 요약 */}
        {!isLoading && !isError && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className={`text-[10px] ${getThemeTextColor('secondary')}`}>Total Work Time</p>
                <p className={`text-sm font-bold ${getThemeTextColor('primary')}`}>
                  {weekData.reduce((sum, d) => sum + d.workMinutes, 0)}m
                </p>
              </div>
              <div>
                <p className={`text-[10px] ${getThemeTextColor('secondary')}`}>Daily Average</p>
                <p className={`text-sm font-bold ${getThemeTextColor('primary')}`}>
                  {Math.round(weekData.reduce((sum, d) => sum + d.workMinutes, 0) / 7)}m
                </p>
              </div>
              <div>
                <p className={`text-[10px] ${getThemeTextColor('secondary')}`}>Most Productive Day</p>
                <p className={`text-sm font-bold ${getThemeTextColor('primary')}`}>
                  {weekData.reduce((max, d) => d.workMinutes > max.workMinutes ? d : max).dateLabel}
                </p>
              </div>
            </div>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}