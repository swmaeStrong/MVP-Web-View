'use client';

import { eachDayOfInterval, endOfMonth, startOfMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { useStreakCalendar, useStreakCount } from '@/hooks/data/useStreak';
import { useTheme } from '@/hooks/ui/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { getKSTDateString } from '@/utils/timezone';

interface MonthlyStreakProps {
  initialMonth?: Date;
  onMonthChange?: (month: Date) => void;
}

export default function MonthlyStreak({ 
  initialMonth = new Date(getKSTDateString()), 
  onMonthChange 
}: MonthlyStreakProps) {
  const { getThemeClass, isDarkMode } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date(getKSTDateString()));

  // initialMonth이 변경되면 currentMonth 업데이트
  React.useEffect(() => {
    setCurrentMonth(initialMonth);
    console.log('🔄 MonthlyStreak 초기화 - 초기 월:', initialMonth);
  }, [initialMonth]);

  // API 데이터 조회 - 현재 날짜로 요청
  const { data: streakData, isLoading: isCalendarLoading, error: calendarError } = useStreakCalendar(currentMonth.getFullYear(), currentMonth.getMonth());

  // 스트릭 카운트 조회
  const { data: streakCountData, isLoading: isCountLoading, error: countError } = useStreakCount();

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
  
  // 같은 행에서의 연속 스트릭 분석
  const getStreakClasses = () => {
    const streakClasses: { [key: string]: string[] } = {};
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const startWeek = start.getDay();
    const days = eachDayOfInterval({ start, end });
    
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
    
    rows.forEach((row, rowIndex) => {
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


  const handlePreviousMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const minDate = new Date(2025, 6); // 2025년 7월 (month는 0부터 시작)
    
    console.log('🔙 MonthlyStreak 이전 월 클릭 - 이동할 월:', prev.getFullYear(), prev.getMonth() + 1);
    
    if (prev >= minDate) {
      setCurrentMonth(prev);
      onMonthChange?.(prev); // 부모에게 월 변경 알림
      console.log('🔙 MonthlyStreak 이전 월로 이동 성공');
    }
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth());
    
    console.log('▶️ MonthlyStreak 다음 월 클릭 - 이동할 월:', next.getFullYear(), next.getMonth() + 1);
    
    if (next <= maxDate) {
      setCurrentMonth(next);
      onMonthChange?.(next); // 부모에게 월 변경 알림
      console.log('▶️ MonthlyStreak 다음 월로 이동 성공');
    }
  };




  return (
    <Card className={`h-[360px] ${getThemeClass('component')} ${getThemeClass('border')}`}>
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
                disabled={(() => {
                  const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
                  const minDate = new Date(2025, 6);
                  return prev < minDate;
                })()}
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
                disabled={(() => {
                  const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
                  const today = new Date();
                  const maxDate = new Date(today.getFullYear(), today.getMonth());
                  return next > maxDate;
                })()}
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
                  const start = startOfMonth(currentMonth);
                  const end = endOfMonth(currentMonth);
                  const startWeek = start.getDay();
                  const days = eachDayOfInterval({ start, end });
                  
                  // 전체 그리드 생성
                  const totalCells: (Date | null)[] = [];
                  for (let i = 0; i < startWeek; i++) {
                    totalCells.push(null);
                  }
                  days.forEach(date => {
                    totalCells.push(date);
                  });
                  
                  // 행별로 처리하여 연속 스트릭 블록 생성
                  const backgroundCells: React.ReactNode[] = [];
                  const rows: (Date | null)[][] = [];
                  for (let i = 0; i < totalCells.length; i += 7) {
                    rows.push(totalCells.slice(i, i + 7));
                  }
                  
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
                                    backgroundColor: 'rgb(68, 199, 67)',
                                    gridColumn: `${streakStart + 1} / span ${currentStreak.length}`,
                                    height: '28px'
                                  }}
                                />
                              );
                            } else {
                              // 단독 활동일
                              backgroundCells.push(<div key={`bg-single-${cellIndex}`} className="w-7 h-7 rounded-md" style={{ backgroundColor: 'rgb(68, 199, 67)' }} />);
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
                                backgroundColor: 'rgb(68, 199, 67)',
                                gridColumn: `${streakStart + 1} / span ${currentStreak.length}`,
                                height: '28px'
                              }}
                            />
                          );
                        } else if (currentStreak.length === 1) {
                          // 단독 활동일
                          const singleIndex = rowIndex * 7 + streakStart;
                          backgroundCells.push(<div key={`bg-single-${singleIndex}`} className="w-7 h-7 rounded-md" style={{ backgroundColor: 'rgb(68, 199, 67)' }} />);
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
                            backgroundColor: 'rgb(68, 199, 67)',
                            gridColumn: `${streakStart + 1} / span ${currentStreak.length}`,
                            height: '28px'
                          }}
                        />
                      );
                    } else if (currentStreak.length === 1) {
                      const singleIndex = rowIndex * 7 + streakStart;
                      backgroundCells.push(<div key={`bg-single-end-${singleIndex}`} className="w-7 h-7 rounded-md" style={{ backgroundColor: 'rgb(68, 199, 67)' }} />);
                    }
                  });
                  
                  return backgroundCells;
                })()}
              </div>

              {/* 전경 날짜 레이어 */}
              <div className="relative grid grid-cols-7 gap-2">
                {(() => {
                  const start = startOfMonth(currentMonth);
                  const end = endOfMonth(currentMonth);
                  const startWeek = start.getDay();
                  const days = eachDayOfInterval({ start, end });
                  const today = new Date();
                  
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
                    const isToday = date.toDateString() === today.toDateString();
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
                        backgroundColor: 'rgb(34, 139, 34)', // 더 진한 초록색
                      };
                    } 
                    
                    return (
                      <div
                        key={date.toISOString()}
                        className={cellClass}
                        style={todayStyle}
                        title={`${date.getDate()}${isActive ? ' - Active Day' : ''}${isToday ? ' (Today)' : ''}`}
                      >
                        {date.getDate()}
                      </div>
                    );
                  });
                  
                  return [...emptyCells, ...dateCells];
                })()}
              </div>
            </div>
            
            {/* 범례 - 캘린더 아래 */}
            <div className="flex items-center justify-center gap-2 text-xs mt-1">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded" style={{ backgroundColor: 'rgb(68, 199, 67)' }} />
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