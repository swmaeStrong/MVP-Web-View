'use client';

import { addWeeks, eachDayOfInterval, endOfWeek, format, startOfWeek, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useStreakCalendar, useStreakCount } from '@/hooks/data/useStreak';
import { useTheme } from '@/hooks/ui/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/ui/tooltip';
import { getKSTDateString } from '@/utils/timezone';

interface WeeklyStreakProps {
  // 이번주만 표시하므로 props 단순화
}

export default function WeeklyStreak() {
  const { getThemeClass, isDarkMode } = useTheme();
  const [currentWeek, setCurrentWeek] = useState(new Date(getKSTDateString())); // 주 네비게이션 가능

  // API 데이터 조회
  const { data: streakData, isLoading: isCalendarLoading } = useStreakCalendar(
    currentWeek.getFullYear(), 
    currentWeek.getMonth()
  );

  // 스트릭 카운트 조회
  const { data: streakCountData, isLoading: isCountLoading } = useStreakCount();

  // 현재 주의 시작일과 종료일 계산
  const weekInfo = useMemo(() => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 }); // 월요일 시작
    const end = endOfWeek(currentWeek, { weekStartsOn: 1 }); // 일요일 끝
    const days = eachDayOfInterval({ start, end });
    const today = new Date();
    
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
      const isActive = activeDates.some(activeDate => 
        activeDate.toDateString() === day.toDateString()
      );
      const isToday = day.toDateString() === weekInfo.today.toDateString();
      const isFuture = day > weekInfo.today;
      
      // 세션 개수 계산 (실제 데이터가 있다면 여기서 처리)
      const sessionCount = isActive ? Math.floor(Math.random() * 5) + 1 : 0; // 임시 데이터
      
      return {
        date: day,
        dayName: dayNames[index],
        dayNumber: day.getDate(),
        month: format(day, 'MMM'),
        isActive,
        isToday,
        isFuture,
        sessionCount,
        formattedDate: format(day, 'yyyy-MM-dd')
      };
    });
  }, [weekInfo, activeDates]);

  // 이번주만 표시하므로 4주간 데이터 제거

  // 네비게이션 함수
  const handlePreviousWeek = () => {
    const prevWeek = subWeeks(currentWeek, 1);
    setCurrentWeek(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = addWeeks(currentWeek, 1);
    const today = new Date();
    if (nextWeek <= today) {
      setCurrentWeek(nextWeek);
    }
  };

  const canGoNext = useMemo(() => {
    const nextWeek = addWeeks(currentWeek, 1);
    return nextWeek <= new Date();
  }, [currentWeek]);

  // 막대 높이 계산 (최대 130px, 세션 개수 기반)
  const getBarHeight = (sessionCount: number) => {
    const maxHeight = 130;
    const maxSessions = 5;
    return Math.min((sessionCount / maxSessions) * maxHeight, maxHeight);
  };

  return (
    <Card className={`h-[360px] flex flex-col rounded-lg shadow-sm transition-all duration-300 hover:shadow-md ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className='flex-1 flex flex-col p-3 overflow-hidden'>
        {/* 차트를 중앙 배치 */}
        <div className={`flex-1 flex flex-col justify-center items-center w-full`}>
          {/* 스트릭을 차트 바로 위에 표시 */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2">
              <Flame className="h-5 w-5 text-red-500" />
              <span className={`text-xl font-bold ${getThemeClass('textPrimary')}`}>
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
              className={`h-8 w-8 p-0 ${getThemeClass('textPrimary')}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* 주간 바 차트 - 고정 폭 컨테이너 */}
            <div className={`flex-shrink-0 w-[280px] flex justify-center`}>
              <div className='w-[260px] h-[220px]'>
                <div className="h-full flex items-end justify-center gap-3 pb-4">
                  {weekData.map((day, index) => (
                    <Tooltip key={index} delayDuration={0}>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center gap-2" style={{ width: '32px' }}>
                          {/* Bar */}
                          <div className="flex items-end" style={{ height: '150px', width: '32px' }}>
                            <div 
                              className={`rounded-t transition-all duration-300 ${
                                day.isActive 
                                  ? day.isToday 
                                    ? 'bg-blue-600' 
                                    : 'bg-green-600'
                                  : day.isFuture 
                                    ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`
                                    : `${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`
                              }`}
                              style={{ 
                                width: '32px',
                                height: day.isActive ? `${getBarHeight(day.sessionCount)}px` : '4px',
                                opacity: day.isFuture ? 0.5 : 1
                              }}
                            />
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
                      <TooltipContent side="top" className="p-3">
                        <div className="space-y-1">
                          <div className="font-semibold">
                            {format(day.date, 'EEEE, MMMM d')}
                          </div>
                          {day.isActive ? (
                            <>
                              <div className="text-sm text-green-600 dark:text-green-400">
                                ✓ Active Day
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {day.sessionCount} sessions
                              </div>
                            </>
                          ) : day.isFuture ? (
                            <div className="text-sm text-gray-500">
                              Future date
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              No activity
                            </div>
                          )}
                          {day.isToday && (
                            <div className="text-sm text-blue-600 font-medium">
                              Today
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
              disabled={!canGoNext}
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