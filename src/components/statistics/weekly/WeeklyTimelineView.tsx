'use client';

import { useDailyPomodoroDetails } from '@/hooks/data/useDailyPomodoroDetails';
import { useWeeklyPomodoroDetails } from '@/hooks/data/useWeeklyPomodoroDetails';
import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/shadcn/ui/chart';
import { getKSTDateString } from '@/utils/timezone';
import React from 'react';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

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
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();
  
  // 선택된 일별 날짜 상태 - 초기값으로 오늘 날짜 설정
  const [selectedDayDate, setSelectedDayDate] = React.useState<string | null>(null);
  
  // 선택된 카테고리 상태 추가
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  
  // 컴포넌트 마운트 시 오늘 날짜로 초기화
  React.useEffect(() => {
    const today = getKSTDateString();
    // 현재 주에 오늘이 포함되어 있는지 확인
    const [year, month, day] = selectedDate.split('-').map(Number);
    const currentDate = new Date(year, month - 1, day);
    const dayOfWeek = currentDate.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(currentDate.getTime() + diff * 24 * 60 * 60 * 1000);
    
    // 이번 주의 모든 날짜 생성
    const weekDates = Array(7).fill(null).map((_, index) => {
      const date = new Date(monday.getTime() + index * 24 * 60 * 60 * 1000);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    });
    
    // 오늘이 이번 주에 포함되어 있으면 오늘을 선택
    if (weekDates.includes(today)) {
      setSelectedDayDate(today);
    }
  }, [selectedDate]);

  // API 호출
  const { data: weeklyPomodoroData, isLoading, isError } = useWeeklyPomodoroDetails(selectedDate);
  const { data: dailyPomodoroData, isLoading: isDailyLoading } = useDailyPomodoroDetails(selectedDayDate || '');

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
        workHours: 0, // 시간 단위로도 저장
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
          // 최소 0.2시간(12분) 보장하여 바가 보이도록 함
          dayData.workHours = workSeconds > 0 ? Math.max(workSeconds / 3600, 0.2) : 0;
        }
      });
    }
    
    return weekDates;
  }, [weeklyPomodoroData, selectedDate]);

  const maxWorkHours = 6; // 6시간을 최댓값으로 고정
  
  // 바 클릭 핸들러
  const handleBarClick = React.useCallback((data: any) => {
    if (data && data.date) {
      setSelectedDayDate(data.date);
      setSelectedCategory(null); // 날짜 변경시 카테고리 선택 초기화
    }
  }, []);

  // 파이차트 세그먼트 클릭 핸들러
  const handlePieClick = React.useCallback((entry: any) => {
    if (entry && entry.category) {
      setSelectedCategory(prev => prev === entry.category ? null : entry.category);
    }
  }, []);

  // 시간 포맷 함수
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  // 카테고리 색상 매핑 함수 (SwiftUI 색상 시스템 사용)
  const getCategoryColor = (category: string): string => {
    const normalizedCategory = category.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // 카테고리별 SwiftUI 색상 매핑
    const colorMap: Record<string, string> = {
      work: '#007AFF',
      development: '#007AFF',
      productivity: '#4B008299',
      documentation: '#007AF2',
      meetings: '#4B0082',
      marketing: '#00A8C7',
      llm: '#00A8C7CC',
      education: '#007AFA80',
      afk: '#8E8E93',
      uncategorized: '#8E8E93',
      unknown: '#8E8E93',
      entertainment: '#FF3B30',
      sns: '#FF9500',
      game: '#FFCC00',
      'videoediting': '#FF2D55',
      design: '#00C7AF',
      'systemutilities': '#AF52DE',
      'filemanagement': '#34C759',
      'ecommerceshopping': '#00C7AFCC',
      finance: '#A2845E',
    };

    // 정확한 매칭 시도
    let color = colorMap[normalizedCategory];
    
    // 부분 매칭 시도
    if (!color) {
      for (const [key, value] of Object.entries(colorMap)) {
        if (normalizedCategory.includes(key) || key.includes(normalizedCategory)) {
          color = value;
          break;
        }
      }
    }
    
    // 기본 SwiftUI 강조 색상
    return color || '#007AFF';
  };
  
  console.log('WeeklyTimelineView - Processed weekData:', weekData); // 디버깅용
  console.log('WeeklyTimelineView - Max work hours:', maxWorkHours); // 디버깅용

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4">
      {/* 바차트 영역 */}
      <Card className={`w-full lg:w-2/3 h-[300px] p-0 rounded-lg border-2 transition-all duration-300 ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardContent className="h-full p-3">
          {isLoading ? (
            <div className="h-full bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          ) : isError ? (
            <div className="flex items-center justify-center h-full">
              <p className={`text-sm ${getThemeTextColor('secondary')}`}>Failed to load data</p>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart
                data={weekData}
                margin={{
                  top: 25,
                  right: 25,
                  left: 25,
                  bottom: 25,
                }}
                onClick={(data) => {
                  if (data && data.activePayload && data.activePayload[0]) {
                    handleBarClick(data.activePayload[0].payload);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <XAxis 
                  dataKey="dateLabel" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 500 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  domain={[0, maxWorkHours]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 500 }}
                  tickFormatter={(value) => `${value}h`}
                  className="text-gray-600 dark:text-gray-400"
                  width={40}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        const hours = Math.floor(value as number);
                        const minutes = Math.round((value as number - hours) * 60);
                        const timeString = hours > 0 
                          ? (minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`)
                          : `${minutes}m`;
                        return [timeString, "Work Time"];
                      }}
                      labelFormatter={(label) => `${label}`}
                      className="bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
                    />
                  }
                />
                <Bar
                  dataKey="workHours"
                  fill="var(--color-workMinutes)"
                  radius={[4, 4, 0, 0]}
                  onClick={handleBarClick}
                  style={{ cursor: 'pointer' }}
                >
                  {weekData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={selectedDayDate === entry.date ? "#3F72AF" : "rgba(63, 114, 175, 0.5)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* 파이차트 패널 */}
      <Card className={`w-full lg:w-1/3 h-[300px] py-0 rounded-lg border-2 transition-all duration-300 ${getThemeClass('border')} ${getThemeClass('component')}`}>
        <CardContent className="h-full p-3 flex flex-col">
          <div className="mb-2">
            <p className={`text-md font-semibold ${getThemeTextColor('secondary')} uppercase tracking-wider`}>
              {isLoading ? (
                <span className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse inline-block"></span>
              ) : (
                selectedDayDate || 'Select a Day'
              )}
            </p>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full flex">
                {/* 파이차트 스켈레톤 */}
                <div className="w-1/2 h-48 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                </div>
                {/* 범례 스켈레톤 */}
                <div className="w-1/2 h-48 flex flex-col justify-center pl-2">
                  <div className="space-y-2">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
                        <div className="flex-1">
                          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
                          <div className="h-2 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : selectedDayDate ? (
            <>
              {isDailyLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full flex">
                    {/* 파이차트 스켈레톤 */}
                    <div className="w-1/2 h-48 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    </div>
                    {/* 범례 스켈레톤 */}
                    <div className="w-1/2 h-48 flex flex-col justify-center pl-2">
                      <div className="space-y-2">
                        {[...Array(5)].map((_, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
                            <div className="flex-1">
                              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
                              <div className="h-2 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : dailyPomodoroData && Array.isArray(dailyPomodoroData) && dailyPomodoroData.length > 0 ? (
                <div className="h-full flex items-center">
                  <div className="w-full flex">
                    {/* 파이차트 */}
                    <div 
                      className="w-1/2 h-48 select-none"
                      style={{
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none',
                        WebkitTapHighlightColor: 'transparent'
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dailyPomodoroData
                              .sort((a, b) => (b.duration || 0) - (a.duration || 0))
                              .slice(0, 5)
                            }
                            dataKey="duration"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            innerRadius={20}
                            fill="#8884d8"
                            onClick={(entry) => handlePieClick(entry)}
                            style={{ 
                              cursor: 'pointer',
                              outline: 'none',
                              userSelect: 'none',
                              WebkitTapHighlightColor: 'transparent'
                            }}
                          >
                            {dailyPomodoroData
                              .sort((a, b) => (b.duration || 0) - (a.duration || 0))
                              .slice(0, 5)
                              .map((entry, index) => {
                                // SwiftUI 색상 시스템 사용
                                const baseColor = getCategoryColor(entry.category || 'default');
                                const isSelected = selectedCategory === entry.category;
                                
                                // 선택된 카테고리는 밝게, 선택되지 않은 카테고리는 어둡게
                                let color = baseColor;
                                
                                if (selectedCategory && !isSelected) {
                                  // 다른 카테고리가 선택된 경우 현재 카테고리를 어둡게
                                  const hex = baseColor.replace('#', '');
                                  if (hex.length === 6) {
                                    const r = parseInt(hex.slice(0, 2), 16);
                                    const g = parseInt(hex.slice(2, 4), 16);
                                    const b = parseInt(hex.slice(4, 6), 16);
                                    color = `rgba(${r}, ${g}, ${b}, 0.3)`;
                                  }
                                } else if (isSelected) {
                                  // 선택된 카테고리는 더 밝게
                                  color = baseColor;
                                } else if (index > 0) {
                                  // 기본 투명도 조정 (선택된 카테고리가 없을 때)
                                  const hex = baseColor.replace('#', '');
                                  let opacity = 1 - (index * 0.15);
                                  opacity = Math.max(opacity, 0.4);
                                  
                                  if (hex.length === 6) {
                                    const r = parseInt(hex.slice(0, 2), 16);
                                    const g = parseInt(hex.slice(2, 4), 16);
                                    const b = parseInt(hex.slice(4, 6), 16);
                                    color = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                                  }
                                }
                                
                                return (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={color}
                                    stroke={isSelected ? baseColor : 'none'}
                                    strokeWidth={isSelected ? 3 : 0}
                                    style={{ 
                                      cursor: 'pointer',
                                      outline: 'none',
                                      userSelect: 'none',
                                      WebkitTapHighlightColor: 'transparent'
                                    }}
                                  />
                                );
                              })
                            }
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* 범례/설명 */}
                    <div className="w-1/2 h-48 flex flex-col justify-center pl-2">
                      <div className="space-y-2">
                        {dailyPomodoroData
                          .sort((a, b) => (b.duration || 0) - (a.duration || 0))
                          .slice(0, 5)
                          .map((item, index) => {
                            // SwiftUI 색상 시스템 사용
                            const baseColor = getCategoryColor(item.category || 'default');
                            const isSelected = selectedCategory === item.category;
                            
                            // 선택된 카테고리와 동일한 색상 로직 적용
                            let color = baseColor;
                            
                            if (selectedCategory && !isSelected) {
                              // 다른 카테고리가 선택된 경우 현재 카테고리를 어둡게
                              const hex = baseColor.replace('#', '');
                              if (hex.length === 6) {
                                const r = parseInt(hex.slice(0, 2), 16);
                                const g = parseInt(hex.slice(2, 4), 16);
                                const b = parseInt(hex.slice(4, 6), 16);
                                color = `rgba(${r}, ${g}, ${b}, 0.3)`;
                              }
                            } else if (isSelected) {
                              // 선택된 카테고리는 더 밝게
                              color = baseColor;
                            } else if (index > 0) {
                              // 기본 투명도 조정 (선택된 카테고리가 없을 때)
                              const hex = baseColor.replace('#', '');
                              let opacity = 1 - (index * 0.15);
                              opacity = Math.max(opacity, 0.4);
                              
                              if (hex.length === 6) {
                                const r = parseInt(hex.slice(0, 2), 16);
                                const g = parseInt(hex.slice(2, 4), 16);
                                const b = parseInt(hex.slice(4, 6), 16);
                                color = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                              }
                            }
                            
                            return (
                              <div 
                                key={index} 
                                className={`flex items-center gap-2 cursor-pointer p-1 rounded transition-all duration-200 select-none ${
                                  isSelected ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                                }`}
                                onClick={() => handlePieClick(item)}
                                style={{
                                  outline: 'none',
                                  userSelect: 'none',
                                  WebkitTapHighlightColor: 'transparent',
                                  WebkitUserSelect: 'none',
                                  MozUserSelect: 'none',
                                  msUserSelect: 'none'
                                }}
                              >
                                <div 
                                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                    isSelected ? 'ring-2 ring-offset-1 ring-gray-400' : ''
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm truncate ${
                                    isSelected ? getThemeTextColor('primary') + ' font-semibold' : getThemeTextColor('primary')
                                  }`}>
                                    {item.category}
                                  </p>
                                  <p className={`text-xs ${getThemeTextColor('secondary')}`}>
                                    {formatTime(item.duration || 0)}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        }
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <p className={`text-sm ${getThemeTextColor('secondary')}`}>No data available</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className={`text-sm ${getThemeTextColor('secondary')}`}>Click on a bar to see daily details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}