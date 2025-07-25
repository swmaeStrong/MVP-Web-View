'use client';

import { eachDayOfInterval, endOfMonth, startOfMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Flame, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { getStreakCalendar } from '@/shared/api/get';
import { getKSTDateString } from '@/utils/timezone';

export default function MonthlyStreak() {
  const { getThemeClass, isDarkMode } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // API 데이터 조회 - 현재 날짜로 요청
  const { data: streakData, isLoading, error } = useQuery({
    queryKey: ['streakCalendar', currentMonth.getFullYear(), currentMonth.getMonth()],
    queryFn: () => getStreakCalendar(),
    retry: 1,
  });

  // API 데이터를 활동일 배열로 변환
  const activeDates = useMemo(() => {
    if (!streakData) return [];
    
    return streakData
      .filter(item => item.activityCount > 0)
      .map(item => new Date(item.date));
  }, [streakData]);

  // 스트릭 통계 계산
  const streakStats = useMemo(() => {
    if (!streakData || streakData.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalActiveDays: 0
      };
    }

    const activeDays = streakData
      .filter(item => item.activityCount > 0)
      .map(item => new Date(item.date))
      .sort((a, b) => a.getTime() - b.getTime());

    // 현재 스트릭 계산 (오늘부터 역순으로)
    let currentStreak = 0;
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    
    if (streakData.some(item => item.date === todayStr && item.activityCount > 0)) {
      currentStreak = 1;
      
      for (let i = 1; i <= 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const checkDateStr = checkDate.toISOString().slice(0, 10);
        
        if (streakData.some(item => item.date === checkDateStr && item.activityCount > 0)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // 최장 스트릭 계산
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < activeDays.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = activeDays[i - 1];
        const currentDate = activeDays[i];
        const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      currentStreak,
      longestStreak,
      totalActiveDays: activeDays.length
    };
  }, [streakData]);
  
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
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    const minDate = new Date(2025, 6); // 2025년 7월 (month는 0부터 시작)
    
    if (prev >= minDate) {
      setCurrentMonth(prev);
    }
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth());
    
    if (next <= maxDate) {
      setCurrentMonth(next);
    }
  };




  return (
    <Card className={`h-[400px] ${getThemeClass('component')} ${getThemeClass('border')}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-2 text-sm font-semibold ${getThemeClass('textPrimary')}`}>
            <Flame className="h-4 w-4 text-orange-500" />
            월간 스트릭
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-3 pt-0">
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
                {currentMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
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
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
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
                                  className="bg-gradient-to-br from-orange-400 to-red-500 rounded-md"
                                  style={{
                                    gridColumn: `${streakStart + 1} / span ${currentStreak.length}`,
                                    height: '28px'
                                  }}
                                />
                              );
                            } else {
                              // 단독 활동일
                              backgroundCells.push(<div key={`bg-single-${cellIndex}`} className="w-7 h-7 bg-gradient-to-br from-orange-400 to-red-500 rounded-md" />);
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
                              className="bg-gradient-to-br from-orange-400 to-red-500 rounded-md"
                              style={{
                                gridColumn: `${streakStart + 1} / span ${currentStreak.length}`,
                                height: '28px'
                              }}
                            />
                          );
                        } else if (currentStreak.length === 1) {
                          // 단독 활동일
                          const singleIndex = rowIndex * 7 + streakStart;
                          backgroundCells.push(<div key={`bg-single-${singleIndex}`} className="w-7 h-7 bg-gradient-to-br from-orange-400 to-red-500 rounded-md" />);
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
                          className="bg-gradient-to-br from-orange-400 to-red-500 rounded-md"
                          style={{
                            gridColumn: `${streakStart + 1} / span ${currentStreak.length}`,
                            height: '28px'
                          }}
                        />
                      );
                    } else if (currentStreak.length === 1) {
                      const singleIndex = rowIndex * 7 + streakStart;
                      backgroundCells.push(<div key={`bg-single-end-${singleIndex}`} className="w-7 h-7 bg-gradient-to-br from-orange-400 to-red-500 rounded-md" />);
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
                    const isActive = activeDates.some(activeDay => 
                      activeDay.toDateString() === dateStr
                    );
                    
                    let cellClass = `w-7 h-7 text-xs font-medium flex items-center justify-center transition-all duration-200 relative z-10`;
                    
                    if (isActive) {
                      cellClass += ` text-white font-semibold`;
                    } else {
                      cellClass += ` ${getThemeClass('textSecondary')}`;
                    }
                    
                    return (
                      <div
                        key={date.toISOString()}
                        className={cellClass}
                        title={`${date.getDate()}일${isActive ? ' - 활동일' : ''}`}
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
                <div className="h-2 w-2 rounded bg-gradient-to-br from-orange-400 to-red-500" />
                <span className={getThemeClass('textSecondary')}>활동일</span>
              </div>
            </div>
          </div>

          {/* 우측: 통계 정보 */}
          <div className="flex flex-col justify-center space-y-2">
            <div className={`p-2 rounded-lg text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className={`text-xs ${getThemeClass('textSecondary')} mb-1`}>현재 스트릭</div>
              <div className={`text-lg font-bold ${getThemeClass('textPrimary')} flex items-center justify-center gap-1`}>
                {isLoading ? '-' : streakStats.currentStreak}
                <Flame className="h-3 w-3 text-orange-500" />
              </div>
            </div>
            
            <div className={`p-2 rounded-lg text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className={`text-xs ${getThemeClass('textSecondary')} mb-1`}>최장 스트릭</div>
              <div className={`text-lg font-bold ${getThemeClass('textPrimary')} flex items-center justify-center gap-1`}>
                {isLoading ? '-' : streakStats.longestStreak}
                <TrendingUp className="h-3 w-3 text-green-500" />
              </div>
            </div>
            
            <div className={`p-2 rounded-lg text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className={`text-xs ${getThemeClass('textSecondary')} mb-1`}>활동일</div>
              <div className={`text-lg font-bold ${getThemeClass('textPrimary')}`}>
                {isLoading ? '-' : streakStats.totalActiveDays}일
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}