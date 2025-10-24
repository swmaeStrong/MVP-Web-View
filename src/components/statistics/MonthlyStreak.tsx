'use client';

import { eachDayOfInterval, endOfMonth, startOfMonth } from 'date-fns';
import { BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { useStreakCalendar, useStreakCount } from '@/hooks/data/useStreak';
import { useTheme } from '@/hooks/ui/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/ui/tooltip';
import { getKSTDate, getKSTDateString } from '@/utils/timezone';

interface MonthlyStreakProps {
  initialMonth?: Date;
  onMonthChange?: (month: Date) => void;
  changeStreak?: (streak: 'weekly' | 'monthly') => void;
}

export default function MonthlyStreak({ 
  initialMonth, 
  onMonthChange,
  changeStreak
}: MonthlyStreakProps) {
  const { getThemeClass, isDarkMode } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(initialMonth || new Date(getKSTDateString()));

  // initialMonth이 변경되면 currentMonth 업데이트
  React.useEffect(() => {
    if (initialMonth) {
      setCurrentMonth(initialMonth);
      console.log('🔄 MonthlyStreak 초기화 - 초기 월:', initialMonth);
    }
  }, [initialMonth]);

  // API 데이터 조회 - 현재 날짜로 요청
  const { data: streakData } = useStreakCalendar(currentMonth.getFullYear(), currentMonth.getMonth());

  // 스트릭 카운트 조회
  const { data: streakCountData, isLoading: isCountLoading } = useStreakCount();

  // 월별 날짜 계산 공통 로직
  const monthlyCalcData = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const startWeek = start.getDay();
    const days = eachDayOfInterval({ start, end });
    const today = getKSTDate(); // KST 기준 오늘 날짜
    
    return { start, end, startWeek, days, today };
  }, [currentMonth]);

  // API 데이터를 활동일 배열로 변환
  const activeDates = useMemo(() => {
    if (!streakData) return [];
    
    return streakData
      .filter(item => item.activityCount > 0)
      .map(item => new Date(item.date));
  }, [streakData]);

  // 응원 문구 생성
  const encouragementMessage = useMemo(() => {
    if (!streakCountData) return '';
    
    const { currentStreak, maxStreak } = streakCountData;
    
    if (currentStreak === 0) {
      return 'Start your new streak!';
    } else if (currentStreak === maxStreak && currentStreak > 0) {
      return 'Breaking your record!';
    } else if (currentStreak > 0) {
      const remaining = maxStreak - currentStreak;
      return `${remaining} days to your best streak!`;
    }
    
    return '';
  }, [streakCountData]);
  
  // 공통 그리드 데이터 생성
  const gridData = useMemo(() => {
    const { startWeek, days } = monthlyCalcData;
    
    // 전체 그리드 생성 (빈 셀 + 날짜)
    const totalCells: (Date | null)[] = [];
    for (let i = 0; i < startWeek; i++) {
      totalCells.push(null);
    }
    days.forEach(date => {
      totalCells.push(date);
    });
    
    // 행별로 분할하여 처리
    const rows: (Date | null)[][] = [];
    for (let i = 0; i < totalCells.length; i += 7) {
      rows.push(totalCells.slice(i, i + 7));
    }
    
    return { totalCells, rows };
  }, [monthlyCalcData]);

  // 같은 행에서의 연속 스트릭 분석
  const getStreakClasses = () => {
    const streakClasses: { [key: string]: string[] } = {};
    const { rows } = gridData;

    rows.forEach((row) => {
      row.forEach((date, colIndex) => {
        if (!date) return;
        
        const dateStr = date.toDateString();
        const isActive = activeDates.some(activeDay => 
          activeDay.toDateString() === dateStr
        );
        
        if (!isActive) return;
        
        const classes = ['has-activity'];
        
        // 같은 행에서 이전/다음 날짜 확인
        const prevDate: Date | null = colIndex > 0 ? row[colIndex - 1] : null;
        const nextDate: Date | null = colIndex < row.length - 1 ? row[colIndex + 1] : null;
        
        // 같은 행 + 연속 날짜 + 활성일 조건 확인
        const isPrevRowConsecutive = prevDate &&
          activeDates.some(d => d.toDateString() === prevDate.toDateString()) &&
          (date.getTime() - prevDate.getTime()) === 86400000;
          
        const isNextRowConsecutive = nextDate &&
          activeDates.some(d => d.toDateString() === nextDate.toDateString()) &&
          (nextDate.getTime() - date.getTime()) === 86400000;
        
        if (isPrevRowConsecutive && isNextRowConsecutive) {
          classes.push('streak-row-middle');
        } else if (isPrevRowConsecutive && !isNextRowConsecutive) {
          classes.push('streak-row-end');
        } else if (!isPrevRowConsecutive && isNextRowConsecutive) {
          classes.push('streak-row-start');
        } else {
          classes.push('streak-single');
        }
        
        streakClasses[dateStr] = classes;
      });
    });
    
    return streakClasses;
  };
  
  const streakClasses = getStreakClasses();
  console.log('Streak classes:', streakClasses);


  // 네비게이션 제한 계산
  const navigationLimits = useMemo(() => {
    const minDate = new Date(2025, 6); // 2025년 7월
    const maxDate = new Date(monthlyCalcData.today.getFullYear(), monthlyCalcData.today.getMonth());
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    
    return {
      canGoPrevious: prevMonth >= minDate,
      canGoNext: nextMonth <= maxDate,
      prevMonth,
      nextMonth
    };
  }, [currentMonth, monthlyCalcData.today]);

  const handlePreviousMonth = () => {
    if (navigationLimits.canGoPrevious) {
      console.log('🔙 MonthlyStreak 이전 월 클릭 - 이동할 월:', navigationLimits.prevMonth.getFullYear(), navigationLimits.prevMonth.getMonth() + 1);
      setCurrentMonth(navigationLimits.prevMonth);
      onMonthChange?.(navigationLimits.prevMonth);
      console.log('🔙 MonthlyStreak 이전 월로 이동 성공');
    }
  };

  const handleNextMonth = () => {
    if (navigationLimits.canGoNext) {
      console.log('▶️ MonthlyStreak 다음 월 클릭 - 이동할 월:', navigationLimits.nextMonth.getFullYear(), navigationLimits.nextMonth.getMonth() + 1);
      setCurrentMonth(navigationLimits.nextMonth);
      onMonthChange?.(navigationLimits.nextMonth);
      console.log('▶️ MonthlyStreak 다음 월로 이동 성공');
    }
  };

  const handleChangeStreak = () => {
    changeStreak?.('weekly');
  };


  return (
    <Card className={`h-[360px] ${getThemeClass('component')} ${getThemeClass('border')} relative`}>
      {/* 스트릭 변경 버튼 - 우측 상단 고정 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleChangeStreak}
        className={`absolute top-2 right-2 h-7 w-7 p-0 z-10 ${getThemeClass('textSecondary')} hover:${getThemeClass('textPrimary')} transition-colors`}
        title="Switch to Weekly Streak"
      >
        <BarChart3 className="h-4 w-4" />
      </Button>
      
      <CardContent className="flex-1 p-3">
        <div className="grid grid-cols-2 gap-3 w-full h-full items-stretch">
          {/* 좌측: 히트맵 스타일 캘린더 */}
          <div className="flex flex-col items-center space-y-2">
            {/* 월 표시 및 네비게이션 */}
            <div className="flex items-center justify-between w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviousMonth}
                disabled={!navigationLimits.canGoPrevious}
                className={`h-6 w-6 p-0 ${getThemeClass('textPrimary')}`}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              
              <div className={`text-sm font-medium ${getThemeClass('textPrimary')}`}>
                {currentMonth.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextMonth}
                disabled={!navigationLimits.canGoNext}
                className={`h-6 w-6 p-0 ${getThemeClass('textPrimary')}`}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
            
            
            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div
                  key={index}
                  className={`w-7 h-6 text-center text-xs font-medium ${getThemeClass('textSecondary')} flex items-center justify-center`}
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* 날짜 그리드 */}
            <div className="relative">
              {/* 백그라운드 스트릭 레이어 */}
              <div className="absolute inset-0 grid grid-cols-7 gap-2 pointer-events-none">
                {(() => {
                  const { rows } = gridData;
                  const backgroundCells: React.ReactNode[] = [];
                  
                  rows.forEach((row, rowIndex) => {
                    let streakStart = -1;
                    let currentStreak: Date[] = [];
                    
                    row.forEach((date, colIndex) => {
                      const cellIndex = rowIndex * 7 + colIndex;
                      
                      if (!date) {
                        // 빈 셀
                        backgroundCells.push(<div key={`bg-empty-${cellIndex}`} className="w-7 h-7" />);
                        return;
                      }
                      
                      const isActive = activeDates.some(activeDay => 
                        activeDay.toDateString() === date.toDateString()
                      );
                      
                      if (isActive) {
                        if (currentStreak.length === 0) {
                          streakStart = colIndex;
                          currentStreak = [date];
                        } else {
                          // 연속성 확인
                          const lastDate = currentStreak[currentStreak.length - 1];
                          if ((date.getTime() - lastDate.getTime()) === 86400000) {
                            currentStreak.push(date);
                          } else {
                            // 이전 스트릭 완료하고 새 스트릭 시작
                            if (currentStreak.length > 1) {
                              // 연속 스트릭 블록 추가
                              backgroundCells.push(
                                <div
                                  key={`bg-streak-${rowIndex}-${streakStart}`}
                                  className="rounded-md"
                                  style={{
                                    backgroundColor: '#5ed462',
                                    gridColumn: `${streakStart + 1} / span ${currentStreak.length}`,
                                    height: '28px'
                                  }}
                                />
                              );
                            } else {
                              // 단독 활동일
                              backgroundCells.push(<div key={`bg-single-${cellIndex}`} className="w-7 h-7 rounded-md" style={{ backgroundColor: '#5ed462' }} />);
                            }
                            streakStart = colIndex;
                            currentStreak = [date];
                          }
                        }
                      } else {
                        // 스트릭 종료
                        if (currentStreak.length > 1) {
                          // 연속 스트릭 블록 추가
                          backgroundCells.push(
                            <div
                              key={`bg-streak-${rowIndex}-${streakStart}`}
                              className="rounded-md"
                              style={{
                                backgroundColor: '#5ed462',
                                gridColumn: `${streakStart + 1} / span ${currentStreak.length}`,
                                height: '28px'
                              }}
                            />
                          );
                        } else if (currentStreak.length === 1) {
                          // 단독 활동일
                          const singleIndex = rowIndex * 7 + streakStart;
                          backgroundCells.push(<div key={`bg-single-${singleIndex}`} className="w-7 h-7 rounded-md" style={{ backgroundColor: '#5ed462' }} />);
                        }
                        
                        // 비활성일은 투명
                        backgroundCells.push(<div key={`bg-inactive-${cellIndex}`} className="w-7 h-7" />);
                        currentStreak = [];
                        streakStart = -1;
                      }
                    });
                    
                    // 행 끝에서 스트릭 처리
                    if (currentStreak.length > 1) {
                      backgroundCells.push(
                        <div
                          key={`bg-streak-end-${rowIndex}-${streakStart}`}
                          className="rounded-md"
                          style={{
                            backgroundColor: '#5ed462',
                            gridColumn: `${streakStart + 1} / span ${currentStreak.length}`,
                            height: '28px'
                          }}
                        />
                      );
                    } else if (currentStreak.length === 1) {
                      const singleIndex = rowIndex * 7 + streakStart;
                      backgroundCells.push(<div key={`bg-single-end-${singleIndex}`} className="w-7 h-7 rounded-md" style={{ backgroundColor: '#5ed462' }} />);
                    }
                  });
                  
                  return backgroundCells;
                })()}
              </div>

              {/* 전경 날짜 레이어 */}
              <div className="relative grid grid-cols-7 gap-2">
                {(() => {
                  const { startWeek, days } = monthlyCalcData;
                  
                  // 빈 셀 추가
                  const emptyCells = [];
                  for (let i = 0; i < startWeek; i++) {
                    emptyCells.push(
                      <div key={`empty-${i}`} className="w-7 h-7" />
                    );
                  }
                  
                  // 날짜 셀들 - 투명 배경
                  const dateCells = days.map(date => {
                    const dateStr = date.toDateString();
                    // KST 기준으로 오늘 날짜 비교
                    const todayStr = getKSTDateString();
                    const currentDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                    const isToday = currentDateStr === todayStr;
                    const isActive = activeDates.some(activeDay => 
                      activeDay.toDateString() === dateStr
                    );
                    
                    let cellClass = `w-7 h-7 text-xs font-medium flex items-center justify-center transition-all duration-200 relative z-10`;
                    
                    if (isActive) {
                      cellClass += ` text-white font-semibold`;
                    } else {
                      cellClass += ` ${getThemeClass('textSecondary')}`;
                    }
                    
                    // 오늘 날짜 처리
                    let todayStyle = {};
                    if (isToday && isActive) {
                      // 오늘이면서 활동일인 경우 더 진한 초록색으로 강조
                      cellClass = cellClass.replace('text-white', 'text-white rounded-md font-bold');
                      todayStyle = { 
                        backgroundColor: '#4caf50', // 더 진한 초록색
                      };
                    } 
                    
                    return (
                      <Tooltip key={date.toISOString()} delayDuration={0}>
                        <TooltipTrigger asChild>
                          <div
                            className={cellClass}
                            style={todayStyle}
                          >
                            {date.getDate()}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="top" 
                          className={`p-2 ${getThemeClass('component')} ${getThemeClass('border')} shadow-lg`}
                        >
                          <div className="space-y-1">
                            <div className={`text-xs font-semibold ${getThemeClass('textPrimary')}`}>
                              {date.toLocaleDateString('en-US', { 
                                weekday: 'long',
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                            {isActive ? (
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span className="text-xs text-green-600 dark:text-green-400">
                                  Active Day
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                                <span className={`text-xs ${getThemeClass('textSecondary')}`}>
                                  No activity
                                </span>
                              </div>
                            )}
                            {isToday && (
                              <div className="text-xs text-blue-500 font-medium">
                                📍 Today
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  });
                  
                  return [...emptyCells, ...dateCells];
                })()}
              </div>
            </div>
            
            {/* 범례 - 캘린더 아래 */}
            <div className="flex items-center justify-center gap-2 text-xs mt-1">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded" style={{ backgroundColor: '#5ed462' }} />
                <span className={getThemeClass('textSecondary')}>Active</span>
              </div>
            </div>
          </div>

          {/* 우측: 통계 정보 */}
          <div className="flex flex-col justify-center space-y-3">
            <div className={`p-3 rounded-lg text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className={`text-xs ${getThemeClass('textSecondary')} mb-1`}>Current Streak</div>
              <div className={`text-xl font-bold ${getThemeClass('textPrimary')}`}>
                {isCountLoading ? '-' : streakCountData?.currentStreak || 0}
              </div>
            </div>
            
            <div className={`p-3 rounded-lg text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className={`text-xs ${getThemeClass('textSecondary')} mb-1`}>Best Streak</div>
              <div className={`text-xl font-bold ${getThemeClass('textPrimary')}`}>
                {isCountLoading ? '-' : streakCountData?.maxStreak || 0}
              </div>
            </div>
            
            {/* 응원 문구 */}
            {encouragementMessage && (
              <div className={`p-3 rounded-lg text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className={`text-xs font-medium ${getThemeClass('textSecondary')}`}>
                  {encouragementMessage}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}