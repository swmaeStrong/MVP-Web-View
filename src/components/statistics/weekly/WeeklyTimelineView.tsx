'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { getWeeklyStreak } from '@/shared/api/get';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface WeeklyTimelineViewProps {
  selectedDate: string;
}

export default function WeeklyTimelineView({ selectedDate }: WeeklyTimelineViewProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();

  // API 호출
  const { data: streakData, isLoading, isError } = useQuery({
    queryKey: ['weeklyStreak', selectedDate],
    queryFn: () => getWeeklyStreak(selectedDate),
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
        activityCount: 0, // 기본값 0
      };
    });
    
    // API 데이터가 있으면 매핑
    if (streakData && streakData.length > 0) {
      console.log('WeeklyTimelineView - API Response:', streakData); // 디버깅용
      
      // API 데이터를 날짜별로 맵으로 변환
      const dataMap = new Map(
        streakData.map(item => [item.date, item.activityCount || 0])
      );
      
      // weekDates에 실제 데이터 매핑
      weekDates.forEach(dayData => {
        if (dataMap.has(dayData.date)) {
          dayData.activityCount = dataMap.get(dayData.date) || 0;
        }
      });
    }
    
    return weekDates;
  }, [streakData, selectedDate]);

  const maxActivity = Math.max(...weekData.map(d => d.activityCount), 1); // 최소값 1로 설정하여 0으로 나누는 것 방지
  
  console.log('WeeklyTimelineView - Processed weekData:', weekData); // 디버깅용
  console.log('WeeklyTimelineView - Max activity:', maxActivity); // 디버깅용

  return (
    <Card className={`h-[300px] rounded-lg border-2 transition-all duration-300 ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className="h-full p-3 overflow-y-auto">
        <div className="mb-3">
          <h3 className={`text-sm font-semibold ${getThemeTextColor('primary')}`}>
            Weekly Overview
          </h3>
          <p className={`text-xs ${getThemeTextColor('secondary')}`}>
            Work hours distribution across the week
          </p>
        </div>

        {/* 주간 꺾은선 그래프 */}
        {isLoading ? (
          <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        ) : isError ? (
          <div className="flex items-center justify-center h-40">
            <p className={`text-sm ${getThemeTextColor('secondary')}`}>Failed to load data</p>
          </div>
        ) : (
          <div className="relative h-40">
            {/* Y축 그리드 라인 */}
            <div className="absolute inset-0">
              {[0, 25, 50, 75, 100].map((percent) => (
                <div
                  key={percent}
                  className="absolute w-full border-t border-gray-200 dark:border-gray-700"
                  style={{ bottom: `${percent}%` }}
                >
                  <span className={`absolute -left-8 -top-2 text-[10px] ${getThemeTextColor('secondary')}`}>
                    {Math.round((maxActivity * percent) / 100)}
                  </span>
                </div>
              ))}
            </div>

            {/* SVG 꺾은선 그래프 */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* 그래프 영역 채우기 */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3F72AF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3F72AF" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              
              {/* 영역 */}
              <path
                d={`
                  M ${weekData.map((data, index) => {
                    const x = (index / (weekData.length - 1)) * 100;
                    const y = 100 - ((data.activityCount / maxActivity) * 100 || 0);
                    return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ')}
                  L 100,100 L 0,100 Z
                `}
                fill="url(#gradient)"
              />
              
              {/* 꺾은선 */}
              <path
                d={weekData.map((data, index) => {
                  const x = (index / (weekData.length - 1)) * 100;
                  const y = 100 - ((data.activityCount / maxActivity) * 100 || 0);
                  return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#3F72AF"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              
              {/* 데이터 포인트 */}
              {weekData.map((data, index) => {
                const x = (index / (weekData.length - 1)) * 100;
                const y = 100 - ((data.activityCount / maxActivity) * 100 || 0);
                return (
                  <g key={index}>
                    <circle
                      cx={x}
                      cy={y}
                      r="1.5"
                      fill="#3F72AF"
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="3"
                      fill="#3F72AF"
                      fillOpacity="0.3"
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                );
              })}
            </svg>

            {/* X축 레이블 (날짜) */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between">
              {weekData.map((data, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span className={`text-[10px] ${getThemeTextColor('secondary')}`}>
                    {data.dateLabel}
                  </span>
                  <span className={`text-[10px] font-semibold ${getThemeTextColor('primary')}`}>
                    {data.activityCount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 주간 통계 요약 */}
        {!isLoading && !isError && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className={`text-[10px] ${getThemeTextColor('secondary')}`}>Total Activities</p>
                <p className={`text-sm font-bold ${getThemeTextColor('primary')}`}>
                  {weekData.reduce((sum, d) => sum + d.activityCount, 0)}
                </p>
              </div>
              <div>
                <p className={`text-[10px] ${getThemeTextColor('secondary')}`}>Daily Average</p>
                <p className={`text-sm font-bold ${getThemeTextColor('primary')}`}>
                  {Math.round(weekData.reduce((sum, d) => sum + d.activityCount, 0) / 7)}
                </p>
              </div>
              <div>
                <p className={`text-[10px] ${getThemeTextColor('secondary')}`}>Most Active Day</p>
                <p className={`text-sm font-bold ${getThemeTextColor('primary')}`}>
                  {weekData.reduce((max, d) => d.activityCount > max.activityCount ? d : max).dateLabel}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}