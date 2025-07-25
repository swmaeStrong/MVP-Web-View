'use client';

import { eachDayOfInterval, endOfMonth, startOfMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Flame, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

export default function MonthlyStreak() {
  const { getThemeClass, isDarkMode } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 고정된 목업 데이터 생성 - 뷰 확인용
  const generateMockStreakData = (month: Date) => {
    const year = month.getFullYear();
    const monthNum = month.getMonth();
    const today = new Date();
    
    // 고정된 활동일 패턴 생성
    const activeDays: Date[] = [
      // 월초 3일 스트릭
      new Date(year, monthNum, 3),
      new Date(year, monthNum, 4),
      new Date(year, monthNum, 5),
      
      // 단독 활동일
      new Date(year, monthNum, 8),
      
      // 중순 5일 스트릭
      new Date(year, monthNum, 12),
      new Date(year, monthNum, 13),
      new Date(year, monthNum, 14),
      new Date(year, monthNum, 15),
      new Date(year, monthNum, 16),
      
      // 단독 활동일
      new Date(year, monthNum, 19),
      
      // 월말 현재 진행 중인 4일 스트릭
      new Date(year, monthNum, 22),
      new Date(year, monthNum, 23),
      new Date(year, monthNum, 24),
      new Date(year, monthNum, 25),
      
      // 추가 활동일들 (항상 표시되도록)
      new Date(year, monthNum, 1),
      new Date(year, monthNum, 2),
      new Date(year, monthNum, 10),
      new Date(year, monthNum, 28),
    ];
    
    // 스트릭 통계 계산
    let longestStreak = 5; // 중순 5일 스트릭이 최장
    let currentStreakCount = 0;
    
    // 현재 스트릭 계산 (오늘부터 역순으로)
    const todayStr = today.toDateString();
    
    // 오늘이 활동일인지 확인
    if (activeDays.some(date => date.toDateString() === todayStr)) {
      currentStreakCount = 1;
      
      // 연속된 이전 날짜들 확인
      for (let i = 1; i <= 10; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        
        if (activeDays.some(date => date.toDateString() === checkDate.toDateString())) {
          currentStreakCount++;
        } else {
          break;
        }
      }
    }
    
    return {
      activeDates: activeDays,
      currentStreak: currentStreakCount,
      longestStreak: longestStreak,
      totalActiveDays: activeDays.length
    };
  };

  const mockData = useMemo(() => {
    const data = generateMockStreakData(currentMonth);
    console.log('Mock data generated:', data);
    console.log('Active dates:', data.activeDates.map(d => d.toDateString()));
    return data;
  }, [currentMonth]);

  const activeDates = mockData.activeDates;
  
  // 연속된 스트릭 분석하여 클래스 할당
  const getStreakClasses = () => {
    const streakClasses: { [key: string]: string[] } = {};
    
    activeDates.forEach((date, index) => {
      const dateStr = date.toDateString();
      const classes = ['has-activity'];
      
      // 이전 날짜 확인
      const prevDate = index > 0 ? activeDates[index - 1] : null;
      const nextDate = index < activeDates.length - 1 ? activeDates[index + 1] : null;
      
      const isPrevConsecutive = prevDate && 
        (date.getTime() - prevDate.getTime()) === 86400000; // 하루 차이
      const isNextConsecutive = nextDate && 
        (nextDate.getTime() - date.getTime()) === 86400000; // 하루 차이
      
      if (isPrevConsecutive && isNextConsecutive) {
        classes.push('streak-middle');
      } else if (isPrevConsecutive && !isNextConsecutive) {
        classes.push('streak-end');
      } else if (!isPrevConsecutive && isNextConsecutive) {
        classes.push('streak-start');
      } else {
        // 단독 활동일
        classes.push('streak-single');
      }
      
      streakClasses[dateStr] = classes;
    });
    
    return streakClasses;
  };
  
  const streakClasses = getStreakClasses();
  console.log('Streak classes:', streakClasses);


  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };



  return (
    <Card className={`h-[400px] ${getThemeClass('component')} ${getThemeClass('border')}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-2 text-sm font-semibold ${getThemeClass('textPrimary')}`}>
            <Flame className="h-4 w-4 text-orange-500" />
            월간 스트릭
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousMonth}
              className={`h-6 w-6 p-0 ${getThemeClass('textPrimary')}`}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className={`h-6 px-2 text-xs ${getThemeClass('textPrimary')} ${getThemeClass('border')}`}
            >
              오늘
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className={`h-6 w-6 p-0 ${getThemeClass('textPrimary')}`}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-3 pt-0">
        <div className="grid grid-cols-2 gap-3 w-full h-full items-start">
          {/* 좌측: 히트맵 스타일 캘린더 */}
          <div className="flex flex-col items-center space-y-2">
            {/* 월 표시 */}
            <div className={`text-sm font-medium ${getThemeClass('textPrimary')}`}>
              {currentMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
            </div>
            
            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-1">
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 text-center text-xs font-medium ${getThemeClass('textSecondary')} flex items-center justify-center`}
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const start = startOfMonth(currentMonth);
                const end = endOfMonth(currentMonth);
                const startWeek = start.getDay(); // 첫 날의 요일 (0=일요일)
                const days = eachDayOfInterval({ start, end });
                const today = new Date();
                
                // 빈 셀 추가 (월 시작 전)
                const emptyCells = [];
                for (let i = 0; i < startWeek; i++) {
                  emptyCells.push(
                    <div key={`empty-${i}`} className="w-6 h-6" />
                  );
                }
                
                // 날짜 셀들
                const dateCells = days.map(date => {
                  const dateStr = date.toDateString();
                  const isToday = date.toDateString() === today.toDateString();
                  const isActive = activeDates.some(activeDay => 
                    activeDay.toDateString() === dateStr
                  );
                  const streakClass = streakClasses[dateStr];
                  
                  let cellClass = `w-6 h-6 text-xs font-medium flex items-center justify-center transition-all duration-200 ${getThemeClass('border')}`;
                  
                  if (isActive) {
                    // 스트릭 타입에 따른 스타일링
                    if (streakClass?.includes('streak-start')) {
                      cellClass += ` bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-l-md border-r-0`;
                    } else if (streakClass?.includes('streak-middle')) {
                      cellClass += ` bg-gradient-to-br from-orange-400 to-red-500 text-white border-r-0 border-l-0`;
                    } else if (streakClass?.includes('streak-end')) {
                      cellClass += ` bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-r-md border-l-0`;
                    } else {
                      // 단독 활동일
                      cellClass += ` bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-md`;
                    }
                  } else {
                    cellClass += ` ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} ${getThemeClass('textSecondary')} rounded-md`;
                  }
                  
                  if (isToday) {
                    cellClass += ` ring-2 ring-offset-1 ${isDarkMode ? 'ring-indigo-400 ring-offset-gray-900' : 'ring-indigo-500 ring-offset-white'}`;
                  }
                  
                  return (
                    <div
                      key={date.toISOString()}
                      className={cellClass}
                      title={`${date.getDate()}일${isActive ? ' - 활동일' : ''}${isToday ? ' (오늘)' : ''}`}
                    >
                      {date.getDate()}
                    </div>
                  );
                });
                
                return [...emptyCells, ...dateCells];
              })()}
            </div>
            
            {/* 범례 - 캘린더 아래 */}
            <div className="flex items-center justify-center gap-2 text-xs mt-1">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded bg-gradient-to-br from-orange-400 to-red-500" />
                <span className={getThemeClass('textSecondary')}>활동일</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <span className={getThemeClass('textSecondary')}>오늘</span>
              </div>
            </div>
          </div>

          {/* 우측: 통계 정보 */}
          <div className="flex flex-col space-y-2">
            <div className={`p-2 rounded-lg text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className={`text-xs ${getThemeClass('textSecondary')} mb-1`}>현재 스트릭</div>
              <div className={`text-lg font-bold ${getThemeClass('textPrimary')} flex items-center justify-center gap-1`}>
                {mockData.currentStreak}
                <Flame className="h-3 w-3 text-orange-500" />
              </div>
            </div>
            
            <div className={`p-2 rounded-lg text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className={`text-xs ${getThemeClass('textSecondary')} mb-1`}>최장 스트릭</div>
              <div className={`text-lg font-bold ${getThemeClass('textPrimary')} flex items-center justify-center gap-1`}>
                {mockData.longestStreak}
                <TrendingUp className="h-3 w-3 text-green-500" />
              </div>
            </div>
            
            <div className={`p-2 rounded-lg text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className={`text-xs ${getThemeClass('textSecondary')} mb-1`}>활동일</div>
              <div className={`text-lg font-bold ${getThemeClass('textPrimary')}`}>
                {mockData.totalActiveDays}일
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}