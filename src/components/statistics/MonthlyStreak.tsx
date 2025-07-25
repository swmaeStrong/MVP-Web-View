'use client';

import { eachDayOfInterval, endOfMonth, startOfMonth, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Flame, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Calendar } from '@/shadcn/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

export default function MonthlyStreak() {
  const { getThemeClass, isDarkMode } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 목업 데이터 생성
  const generateMockStreakData = (month: Date) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const today = new Date();
    const daysInMonth = eachDayOfInterval({ start, end });
    
    // 랜덤하게 활동일 생성 (70% 확률)
    const activeDays = daysInMonth.filter((day) => {
      // 미래 날짜는 활동 없음
      if (day > today) return false;
      // 70% 확률로 활동
      return Math.random() > 0.3;
    });
    
    // 최장 스트릭 계산
    let longestStreak = 0;
    let currentStreak = 0;
    let lastActiveDay = null;
    
    for (const day of daysInMonth) {
      if (day > today) break;
      
      const isActive = activeDays.some(activeDay => 
        activeDay.toDateString() === day.toDateString()
      );
      
      if (isActive) {
        if (!lastActiveDay || 
            (day.getTime() - lastActiveDay.getTime()) === 86400000) { // 하루 차이
          currentStreak++;
        } else {
          currentStreak = 1;
        }
        lastActiveDay = day;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
        lastActiveDay = null;
      }
    }
    
    // 현재 스트릭 계산 (오늘부터 역으로)
    let realCurrentStreak = 0;
    for (let i = 0; i <= 30; i++) {
      const checkDay = subDays(today, i);
      const isActive = activeDays.some(activeDay => 
        activeDay.toDateString() === checkDay.toDateString()
      );
      
      if (isActive) {
        realCurrentStreak++;
      } else if (i > 0) { // 오늘이 아닌 경우에만 중단
        break;
      }
    }
    
    return {
      activeDates: activeDays,
      currentStreak: realCurrentStreak,
      longestStreak: longestStreak || realCurrentStreak,
      totalActiveDays: activeDays.length
    };
  };

  const mockData = useMemo(() => 
    generateMockStreakData(currentMonth), [currentMonth]);

  const activeDates = mockData.activeDates;


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
          {/* 좌측: 캘린더 */}
          <div className="flex flex-col items-center">
            <style jsx>{`
              .has-activity button {
                background: linear-gradient(to bottom right, #fb923c, #ef4444) !important;
                color: white !important;
                font-weight: 600;
              }
              .today-custom button {
                background-color: ${isDarkMode ? '#374151' : '#e5e7eb'} !important;
                color: ${isDarkMode ? '#fff' : '#111827'} !important;
              }
            `}</style>
            <Calendar
              mode="single"
              month={currentMonth}
              locale={ko}
              showOutsideDays={false}
              className={`rounded-md text-xs ${getThemeClass('border')} w-fit mx-auto`}
              classNames={{
                months: "flex flex-col space-y-2",
                month: "space-y-1 w-fit",
                caption: "hidden",
                nav: "hidden",
                table: "border-collapse space-y-1 w-fit mx-auto",
                head_row: "flex",
                head_cell: `${getThemeClass('textSecondary')} rounded-md w-7 font-normal text-[0.6rem] mx-0.5`,
                row: "flex mt-0.5 gap-1",
                cell: "h-7 w-7 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: `h-7 w-7 p-0 font-normal text-xs aria-selected:opacity-100 ${getThemeClass('textPrimary')}`,
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: `${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} ${getThemeClass('textPrimary')}`,
                day_outside: `opacity-50 ${getThemeClass('textSecondary')}`,
                day_disabled: `${getThemeClass('textSecondary')} opacity-50`,
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
              modifiers={{
                hasActivity: activeDates,
              }}
              modifiersClassNames={{
                hasActivity: 'has-activity',
                today: 'today-custom',
              }}
            />
            
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