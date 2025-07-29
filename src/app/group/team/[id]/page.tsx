'use client';

import { useTheme } from '@/hooks/useTheme';
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/ui/avatar';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { spacing } from '@/styles/design-system';
import { Edit, Target, Trophy } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState, useCallback, useMemo } from 'react';
import DateNavigation from '@/components/common/DateNavigation';
import { getKSTDateString, getKSTDateStringDaysAgo } from '@/utils/timezone';

export default function TeamDetailPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const params = useParams();
  const teamId = params.id;

  const [todayGoal, setTodayGoal] = useState('Complete React refactoring task');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly'>('daily');
  const [selectedDate, setSelectedDate] = useState(getKSTDateString());

  // 사용 가능한 날짜 배열 생성 (오늘부터 과거 30일, 한국 시간 기준)
  const availableDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      dates.push(getKSTDateStringDaysAgo(i));
    }
    return dates;
  }, []);

  // Mock team data - would come from API
  const teamData = {
    id: teamId,
    name: teamId === '1' ? 'Team Alpha' : teamId === '2' ? 'Team Beta' : 'Team Gamma',
    description: teamId === '1' ? 'Frontend development team focused on React and Next.js applications' : 
                 teamId === '2' ? 'Backend development team specializing in Node.js and Python' : 
                 'Full-stack development team working on modern web applications',
    leader: { name: 'John Doe', avatar: 'JD' },
    leaderboard: [
      { rank: 1, name: 'John Doe', score: 95, hours: 32 },
      { rank: 2, name: 'Sarah Wilson', score: 88, hours: 30 },
      { rank: 3, name: 'Mike Johnson', score: 85, hours: 35 },
      { rank: 4, name: 'Jane Smith', score: 82, hours: 28 },
      { rank: 5, name: 'Tom Brown', score: 78, hours: 25 },
      { rank: 6, name: 'Alice Kim', score: 75, hours: 22 },
    ],
    groundRules: [
      'Daily standup at 9:00 AM',
      'Code reviews within 24 hours',
      'No meetings on Fridays',
      'Use proper commit messages',
      'Test coverage above 80%'
    ]
  };

  const handleGoalSave = () => {
    setIsEditingGoal(false);
    // Save goal logic here
  };

  const handlePreviousDate = useCallback(() => {
    const currentIndex = availableDates.indexOf(selectedDate);
    if (currentIndex < availableDates.length - 1) {
      const newDate = availableDates[currentIndex + 1];
      setSelectedDate(newDate);
    }
  }, [availableDates, selectedDate]);

  const handleNextDate = useCallback(() => {
    const currentIndex = availableDates.indexOf(selectedDate);
    if (currentIndex > 0) {
      const newDate = availableDates[currentIndex - 1];
      setSelectedDate(newDate);
    }
  }, [availableDates, selectedDate]);

  const handleDateChange = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      handlePreviousDate();
    } else {
      handleNextDate();
    }
  }, [handlePreviousDate, handleNextDate]);

  // 이전/다음 버튼 활성화 상태 체크
  const canGoPrevious = useMemo(() => {
    const currentIndex = availableDates.indexOf(selectedDate);
    return currentIndex < availableDates.length - 1; // 과거 날짜가 더 있으면 true
  }, [availableDates, selectedDate]);

  const canGoNext = useMemo(() => {
    const currentIndex = availableDates.indexOf(selectedDate);
    return currentIndex > 0; // 오늘에 가까울수록 true
  }, [availableDates, selectedDate]);

  const formatDate = useCallback((dateString: string) => {
    if (selectedPeriod === 'daily') {
      return dateString; // 이미 YYYY-MM-DD 형식
    } else {
      const date = new Date(dateString);
      const startOfWeek = new Date(date);
      const endOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      const formatDateToString = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      return `${formatDateToString(startOfWeek)} ~ ${formatDateToString(endOfWeek)}`;
    }
  }, [selectedPeriod]);

  return (
    <div className="h-full grid grid-cols-5 gap-6 p-6" style={{ gridTemplateRows: 'auto auto 1fr' }}>
      {/* 좌측 최상단 - 그룹 이름 및 팀장 정보 (3/5) */}
      <Card className={`${getCommonCardClass()} col-span-3 row-span-1`}>
        <CardContent className={spacing.inner.normal}>
          <div className="space-y-4">
            <h1 className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
              {teamData.name}
            </h1>
            
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src="" />
                <AvatarFallback className={`text-sm font-semibold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                  {teamData.leader.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className={`font-medium ${getThemeTextColor('primary')}`}>
                  {teamData.leader.name}
                </p>
                <p className={`text-sm ${getThemeTextColor('secondary')}`}>
                  Team Leader
                </p>
              </div>
            </div>
            
            <div className={`mt-4 p-3 rounded-lg ${getThemeClass('componentSecondary')}`}>
              <p className={`text-sm ${getThemeTextColor('secondary')}`}>
                {teamData.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 우측 상단 - 그라운드 룰 (2/5) */}
      <Card className={`${getCommonCardClass()} col-span-2 row-span-2`}>
        <CardHeader>
          <h3 className={`text-lg font-semibold ${getThemeTextColor('primary')}`}>
            Ground Rules
          </h3>
        </CardHeader>
        <CardContent className={spacing.inner.normal}>
          <div className="space-y-3">
            {teamData.groundRules.map((rule, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <span className={`text-sm ${getThemeTextColor('secondary')}`}>
                  {rule}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Controls - 별도 컴포넌트 */}
      <Card className={`${getCommonCardClass()} col-span-3 row-span-1 flex items-center`}>
        <CardContent className="px-6 w-full">
          <div className="flex items-center justify-between">
            {/* Date Navigation */}
            <div className="flex justify-start">
              <DateNavigation
                currentDate={selectedDate}
                onPrevious={() => handleDateChange('prev')}
                onNext={() => handleDateChange('next')}
                formatDate={formatDate}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
              />
            </div>

            {/* Period Selector */}
            <div className={`flex rounded-md ${getThemeClass('componentSecondary')} p-1`}>
              <button
                onClick={() => setSelectedPeriod('daily')}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  selectedPeriod === 'daily'
                    ? `${getThemeClass('component')} ${getThemeTextColor('primary')} shadow-sm`
                    : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')}`
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setSelectedPeriod('weekly')}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  selectedPeriod === 'weekly'
                    ? `${getThemeClass('component')} ${getThemeTextColor('primary')} shadow-sm`
                    : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')}`
                }`}
              >
                Weekly
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 좌측 하단 - 리더보드 (3/5) */}
      <Card className={`${getCommonCardClass()} col-span-3 row-span-1`}>
        <CardHeader>
          <h3 className={`text-lg font-semibold ${getThemeTextColor('primary')} flex items-center gap-2`}>
            <Trophy className="h-5 w-5" />
            Leaderboard
          </h3>
        </CardHeader>
        <CardContent className={spacing.inner.normal}>
          <div className="grid grid-cols-3 gap-4">
            {teamData.leaderboard.map((member) => (
              <div key={member.rank} className={`p-4 rounded-md ${getThemeClass('componentSecondary')} text-center relative`}>
                {/* 순위 배지 */}
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  member.rank === 1 ? 'bg-yellow-500 text-black' :
                  member.rank === 2 ? 'bg-gray-400 text-white' :
                  member.rank === 3 ? 'bg-orange-600 text-white' :
                  `${getThemeClass('component')} ${getThemeTextColor('secondary')}`
                }`}>
                  {member.rank}
                </div>
                
                {/* 아바타 */}
                <Avatar className="w-16 h-16 mx-auto mb-3">
                  <AvatarImage src="" />
                  <AvatarFallback className={`text-lg font-semibold ${getThemeClass('component')} ${getThemeTextColor('primary')} ring-2 ring-blue-200 dark:ring-blue-800`}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                {/* 정보 */}
                <div>
                  <p className={`text-sm font-medium truncate ${getThemeTextColor('primary')} mb-1`}>
                    {member.name}
                  </p>
                  <p className={`text-xs ${getThemeTextColor('secondary')} mb-1`}>
                    {member.hours}h worked
                  </p>
                  <p className={`text-lg font-bold ${getThemeTextColor('primary')}`}>
                    {member.score}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 우측 하단 - 오늘의 목표 설정 (2/5) */}
      <Card className={`${getCommonCardClass()} col-span-2 row-span-1`}>
        <CardHeader>
          <h3 className={`text-lg font-semibold ${getThemeTextColor('primary')} flex items-center gap-2`}>
            <Target className="h-5 w-5" />
            Today's Goal
          </h3>
        </CardHeader>
        <CardContent className={spacing.inner.normal}>
          <div className="space-y-4">
            {isEditingGoal ? (
              <div className="space-y-3">
                <textarea
                  value={todayGoal}
                  onChange={(e) => setTodayGoal(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} focus:outline-none focus:ring-2 focus:ring-[#3F72AF] resize-none`}
                  rows={3}
                  placeholder="Enter today's team goal..."
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleGoalSave}
                    className={`${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')} hover:${getThemeClass('component')}`}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingGoal(false)}
                    className={`${getThemeClass('component')} ${getThemeClass('border')} ${getThemeTextColor('secondary')}`}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className={`p-4 rounded-lg ${getThemeClass('componentSecondary')} min-h-[80px] flex items-center`}>
                  <p className={`text-lg ${getThemeTextColor('primary')}`}>
                    {todayGoal}
                  </p>
                </div>
                <Button
                  onClick={() => setIsEditingGoal(true)}
                  variant="outline"
                  className={`${getThemeClass('component')} ${getThemeClass('border')} ${getThemeTextColor('secondary')} hover:${getThemeClass('componentSecondary')}`}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Goal
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}