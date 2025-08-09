'use client';

import { addWeeks, eachDayOfInterval, endOfWeek, format, startOfWeek, subWeeks } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Flame, MapPin, Sprout, Star } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { useStreakCalendar, useStreakCount } from '@/hooks/data/useStreak';
import { useTheme } from '@/hooks/ui/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/ui/tooltip';
import { getKSTDate, getKSTDateString } from '@/utils/timezone';

interface WeeklyStreakProps {
  initialMonth?: Date;
  onMonthChange?: (month: Date) => void;
  changeStreak?: (streak: 'weekly' | 'monthly') => void;
}

export default function WeeklyStreak({ 
  initialMonth, 
  onMonthChange,
  changeStreak
}: WeeklyStreakProps) {
  const { getThemeClass, isDarkMode } = useTheme();
  const [currentWeek, setCurrentWeek] = useState(initialMonth || new Date(getKSTDateString())); // 주 네비게이션 가능

  // initialMonth가 변경되면 currentWeek 업데이트
  React.useEffect(() => {
    if (initialMonth) {
      setCurrentWeek(initialMonth);
    }
  }, [initialMonth]);

  // 주가 속한 월들을 계산 (주가 두 달에 걸칠 수 있음)
  const monthsToFetch = useMemo(() => {
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
    
    const months = new Set<string>();
    months.add(`${weekStart.getFullYear()}-${weekStart.getMonth()}`);
    months.add(`${weekEnd.getFullYear()}-${weekEnd.getMonth()}`);
    
    return Array.from(months).map(monthStr => {
      const [year, month] = monthStr.split('-').map(Number);
      return { year, month };
    });
  }, [currentWeek]);

  // API 데이터 조회 - 주가 걸친 모든 월의 데이터 조회
  const { data: streakDataMonth1, isLoading: isLoadingMonth1 } = useStreakCalendar(
    monthsToFetch[0].year, 
    monthsToFetch[0].month
  );
  
  const { data: streakDataMonth2, isLoading: isLoadingMonth2 } = useStreakCalendar(
    monthsToFetch[1]?.year || monthsToFetch[0].year, 
    monthsToFetch[1]?.month || monthsToFetch[0].month
  );
  
  // 두 달의 데이터를 합침
  const streakData = useMemo(() => {
    if (!streakDataMonth1 && !streakDataMonth2) return null;
    
    const data1 = streakDataMonth1 || [];
    const data2 = streakDataMonth2 || [];
    
    // 두 달에 걸친 경우 데이터 합치기
    if (monthsToFetch.length === 2) {
      return [...data1, ...data2];
    }
    return data1;
  }, [streakDataMonth1, streakDataMonth2, monthsToFetch]);
  
  const isCalendarLoading = isLoadingMonth1 || isLoadingMonth2;

  // 스트릭 카운트 조회
  const { data: streakCountData, isLoading: isCountLoading } = useStreakCount();

  // 현재 주의 시작일과 종료일 계산
  const weekInfo = useMemo(() => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 }); // 월요일 시작
    const end = endOfWeek(currentWeek, { weekStartsOn: 1 }); // 일요일 끝
    const days = eachDayOfInterval({ start, end });
    const today = getKSTDate(); // KST 기준 오늘 날짜
    
    return { start, end, days, today };
  }, [currentWeek]);

  // API 데이터를 활동일 배열로 변환
  const activeDates = useMemo(() => {
    if (!streakData) return [];
    
    return streakData
      .filter(item => item.activityCount > 0)
      .map(item => new Date(item.date));
  }, [streakData]);

  // 주간 데이터 생성
  const weekData = useMemo(() => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return weekInfo.days.map((day, index) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      
      // API 데이터에서 해당 날짜의 데이터 찾기
      const dayData = streakData?.find(item => item.date === dayStr);
      const sessionCount = dayData?.activityCount || 0;
      const isActive = sessionCount > 0;
      
      const isToday = day.toDateString() === weekInfo.today.toDateString();
      const isFuture = day > weekInfo.today;
      
      return {
        date: day,
        dayName: dayNames[index],
        dayNumber: day.getDate(),
        month: format(day, 'MMM'),
        isActive,
        isToday,
        isFuture,
        sessionCount,
        formattedDate: dayStr
      };
    });
  }, [weekInfo, streakData]);

  // 이번주만 표시하므로 4주간 데이터 제거

  // 네비게이션 함수
  const handlePreviousWeek = () => {
    if (navigationLimits.canGoPrevious) {
      const prevWeek = subWeeks(currentWeek, 1);
      setCurrentWeek(prevWeek);
      // 주가 다른 월로 이동했을 때 부모에 알림
      const prevWeekMonth = startOfWeek(prevWeek, { weekStartsOn: 1 });
      onMonthChange?.(prevWeekMonth);
    }
  };
  
  const handleChangeStreak = () => {
    changeStreak?.('monthly');
  };

  const handleNextWeek = () => {
    if (navigationLimits.canGoNext) {
      const nextWeek = addWeeks(currentWeek, 1);
      setCurrentWeek(nextWeek);
      // 주가 다른 월로 이동했을 때 부모에 알림
      const nextWeekMonth = startOfWeek(nextWeek, { weekStartsOn: 1 });
      onMonthChange?.(nextWeekMonth);
    }
  };

  // 네비게이션 제한 계산 (2025년 7월부터 현재까지만)
  const navigationLimits = useMemo(() => {
    const minDate = new Date(2025, 6, 1); // 2025년 7월 1일
    const today = getKSTDate(); // KST 기준 오늘 날짜
    const nextWeek = addWeeks(currentWeek, 1);
    const prevWeek = subWeeks(currentWeek, 1);
    
    // 이전 주의 시작일이 최소 날짜 이후인지 확인
    const prevWeekStart = startOfWeek(prevWeek, { weekStartsOn: 1 });
    const canGoPrevious = prevWeekStart >= minDate;
    
    // 다음 주가 오늘 이전인지 확인
    const canGoNext = nextWeek <= today;
    
    return {
      canGoPrevious,
      canGoNext,
      minDate,
      today
    };
  }, [currentWeek]);

  // 주간 최대 세션 수 계산
  const maxWeeklySessionCount = useMemo(() => {
    return Math.max(...weekData.map(day => day.sessionCount), 1); // 최소 1로 설정하여 0으로 나누기 방지
  }, [weekData]);

  // 막대 높이 계산 (주간 최대값 기준으로 상대적 높이)
  const getBarHeight = (sessionCount: number) => {
    const maxHeight = 160;
    const minHeight = 12; // 최소 높이 보장
    
    if (sessionCount === 0) return 0;
    
    // 주간 최대값 기준으로 비례 계산하되, 최소 높이 보장
    const ratio = sessionCount / maxWeeklySessionCount;
    const calculatedHeight = ratio * maxHeight;
    
    return Math.max(Math.floor(calculatedHeight), minHeight);
  };
  
  // 세션 개수에 따른 색상 결정
  const getBarColor = (sessionCount: number, isToday: boolean, isFuture: boolean) => {
    if (isFuture) return isDarkMode ? 'bg-gray-700' : 'bg-gray-100';
    if (sessionCount === 0) return isDarkMode ? 'bg-gray-600' : 'bg-gray-200';
    
    // 오늘은 특별한 색상 (파란색 계열 유지하되 세션 수에 따라 강도 조정)
    if (isToday) {
      if (sessionCount >= 20) return 'bg-gradient-to-t from-blue-600 to-cyan-500';
      if (sessionCount >= 10) return 'bg-blue-600';
      return 'bg-blue-500';
    }
    
    // 세션 개수에 따른 색상 단계
    if (sessionCount >= 20) {
      return 'bg-gradient-to-t from-orange-500 to-red-500'; // 20+ 세션: 오렌지-빨강 그라데이션 (열정/에너지)
    } else if (sessionCount >= 10) {
      return 'bg-amber-500'; // 10-19 세션: 앰버색 (성취감)
    } else {
      return 'bg-[#5ed462]'; // 1-9 세션: SessionDetail과 같은 초록색
    }
  };

  return (
    <Card className={`h-[360px] flex flex-col rounded-lg shadow-sm transition-all duration-300 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')} relative`}>
      {/* 스트릭 변경 버튼 - 우측 상단 고정 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleChangeStreak}
        className={`absolute top-2 right-2 h-7 w-7 p-0 z-10 ${getThemeClass('textSecondary')} hover:${getThemeClass('textPrimary')} transition-colors`}
        title="Switch to Monthly Streak"
      >
        <Calendar className="h-4 w-4" />
      </Button>
      
      <CardContent className='flex-1 flex flex-col p-3 overflow-hidden'>
        {/* 차트를 중앙 배치 */}
        <div className={`flex-1 flex flex-col justify-center items-center w-full`}>
          {/* 스트릭을 차트 바로 위에 표시 */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2">
              <Flame className="h-5 w-5 text-red-500" />
              <span className={`text-lg font-medium ${getThemeClass('textPrimary')}`}>
                {isCountLoading ? '-' : streakCountData?.currentStreak || 0} days streak
              </span>
            </div>
          </div>

          <div className={`flex items-center gap-6`}>
            {/* 이전 주 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousWeek}
              disabled={!navigationLimits.canGoPrevious}
              className={`h-8 w-8 p-0 ${getThemeClass('textPrimary')}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* 주간 바 차트 - 고정 폭 컨테이너 */}
            <div className={`flex-shrink-0 w-[280px] flex justify-center`}>
              <div className='w-[260px] h-[240px]'>
                <div className="h-full flex items-end justify-center gap-3 pb-4">
                  {weekData.map((day, index) => (
                    <Tooltip key={index} delayDuration={0}>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center gap-2" style={{ width: '32px' }}>
                          {/* Bar */}
                          <div className="flex items-end relative" style={{ height: '180px', width: '32px' }}>
                            <div 
                              className={`rounded-t transition-all duration-300 ${getBarColor(day.sessionCount, day.isToday, day.isFuture)}`}
                              style={{ 
                                width: '32px',
                                height: day.isActive ? `${getBarHeight(day.sessionCount)}px` : '4px',
                                opacity: day.isFuture ? 0.5 : 1
                              }}
                            >
                              {/* 10세션 이상일 때 별 표시 */}
                              {day.sessionCount >= 10 && day.sessionCount < 20 && (
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                </div>
                              )}
                              {/* 20세션 이상일 때 불꽃 표시 */}
                              {day.sessionCount >= 20 && (
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                  <Flame className="h-3 w-3 text-red-400 fill-red-400" />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Day Label */}
                          <div className="text-center">
                            <div className={`text-sm font-medium ${
                              day.isToday 
                                ? 'text-blue-600' 
                                : getThemeClass('textSecondary')
                            }`}>
                              {day.dayName}
                            </div>
                            <div className={`text-xs ${getThemeClass('textSecondary')}`}>
                              {day.dayNumber}
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top" 
                        className={`p-3 ${getThemeClass('component')} ${getThemeClass('border')} shadow-lg`}
                      >
                        <div className="space-y-2">
                          <div className={`font-semibold ${getThemeClass('textPrimary')}`}>
                            {format(day.date, 'EEEE, MMMM d, yyyy')}
                          </div>
                          
                          {day.isActive ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  day.sessionCount >= 20 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                                  day.sessionCount >= 10 ? 'bg-amber-500' : 'bg-[#5ed462]'
                                }`} />
                                <span className={`text-sm font-medium flex items-center gap-1 ${
                                  day.sessionCount >= 20 ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600' :
                                  day.sessionCount >= 10 ? 'text-amber-600 dark:text-amber-400' :
                                  'text-green-600 dark:text-green-400'
                                }`}>
                                  {day.sessionCount >= 20 ? (
                                    <>
                                      <Flame className="h-3 w-3 text-red-500" />
                                      Incredible Day!
                                    </>
                                  ) : day.sessionCount >= 10 ? (
                                    <>
                                      <Star className="h-3 w-3 text-yellow-500" />
                                      Great Day!
                                    </>
                                  ) : (
                                    <>
                                      <Sprout className="h-3 w-3" style={{ color: '#5ed462' }} />
                                      Active Day
                                    </>
                                  )}
                                </span>
                              </div>
                              <div className={`text-sm ${getThemeClass('textSecondary')} pl-4`}>
                                {day.sessionCount} {day.sessionCount === 1 ? 'session' : 'sessions'}
                                {day.sessionCount >= 20 && ' - Outstanding productivity!'}
                                {day.sessionCount >= 10 && day.sessionCount < 20 && ' - Keep it up!'}
                              </div>
                            </div>
                          ) : day.isFuture ? (
                            <div className={`text-sm ${getThemeClass('textSecondary')} italic`}>
                              Future date
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                              <span className={`text-sm ${getThemeClass('textSecondary')}`}>
                                No activity
                              </span>
                            </div>
                          )}
                          
                          {day.isToday && (
                            <div className="pt-1 border-t border-opacity-20">
                              <div className="text-sm text-blue-500 font-semibold flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> Today
                              </div>
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>

            {/* 다음 주 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextWeek}
              disabled={!navigationLimits.canGoNext}
              className={`h-8 w-8 p-0 ${getThemeClass('textPrimary')}`}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>


      </CardContent>
    </Card>
  );
}