'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';

interface WeeklyTimelineViewProps {
  selectedDate: string;
}

export default function WeeklyTimelineView({ selectedDate }: WeeklyTimelineViewProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();

  // 요일별 모의 데이터
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekData = [
    { day: 'Mon', hours: 8.5, sessions: 12 },
    { day: 'Tue', hours: 7.2, sessions: 10 },
    { day: 'Wed', hours: 9.1, sessions: 15 },
    { day: 'Thu', hours: 6.8, sessions: 9 },
    { day: 'Fri', hours: 8.3, sessions: 13 },
    { day: 'Sat', hours: 4.5, sessions: 6 },
    { day: 'Sun', hours: 3.2, sessions: 4 },
  ];

  const maxHours = Math.max(...weekData.map(d => d.hours));

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

        {/* 주간 바 차트 */}
        <div className="space-y-2">
          {weekData.map((data, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className={`text-xs font-medium w-10 ${getThemeTextColor('secondary')}`}>
                {data.day}
              </span>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-[#3F72AF] transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${(data.hours / maxHours) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-semibold w-12 text-right ${getThemeTextColor('primary')}`}>
                  {data.hours}h
                </span>
                <span className={`text-[10px] ${getThemeTextColor('secondary')} w-16 text-right`}>
                  {data.sessions} sess
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 주간 통계 요약 */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className={`text-[10px] ${getThemeTextColor('secondary')}`}>Total Hours</p>
              <p className={`text-sm font-bold ${getThemeTextColor('primary')}`}>
                {weekData.reduce((sum, d) => sum + d.hours, 0).toFixed(1)}h
              </p>
            </div>
            <div>
              <p className={`text-[10px] ${getThemeTextColor('secondary')}`}>Daily Average</p>
              <p className={`text-sm font-bold ${getThemeTextColor('primary')}`}>
                {(weekData.reduce((sum, d) => sum + d.hours, 0) / 7).toFixed(1)}h
              </p>
            </div>
            <div>
              <p className={`text-[10px] ${getThemeTextColor('secondary')}`}>Total Sessions</p>
              <p className={`text-sm font-bold ${getThemeTextColor('primary')}`}>
                {weekData.reduce((sum, d) => sum + d.sessions, 0)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}