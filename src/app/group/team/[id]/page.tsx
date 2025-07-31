'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { spacing } from '@/styles/design-system';
import { useParams } from 'next/navigation';
import { useState, useCallback, useMemo } from 'react';
import DateNavigation from '@/components/common/DateNavigation';
import TeamCard from '@/components/group/TeamCard';
import GroundRules from '@/components/group/GroundRules';
import TeamLeaderboard from '@/components/group/TeamLeaderboard';
import TodayGoals from '@/components/group/TodayGoals';
import { getKSTDateString, getKSTDateStringDaysAgo } from '@/utils/timezone';
import { useGroupDetail } from '@/hooks/queries/useGroupDetail';
import StateDisplay from '@/components/common/StateDisplay';
import { RefreshCw } from 'lucide-react';

export default function TeamDetailPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const params = useParams();
  const teamId = Array.isArray(params.id) ? params.id[0] : params.id;
  const groupId = teamId ? parseInt(teamId, 10) : 0;

  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly'>('daily');
  const [selectedDate, setSelectedDate] = useState(getKSTDateString());

  // 그룹 상세 정보 조회
  const { data: groupDetail, isLoading, error, refetch } = useGroupDetail({
    groupId,
    enabled: !!groupId,
  });

  // 사용 가능한 날짜 배열 생성 (오늘부터 과거 30일, 한국 시간 기준)
  const availableDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      dates.push(getKSTDateStringDaysAgo(i));
    }
    return dates;
  }, []);

  // Mock data for leaderboard and goals (will be replaced with actual API calls later)
  const mockLeaderboard = [
    { rank: 1, name: 'John Doe', score: 95, hours: 32 },
    { rank: 2, name: 'Sarah Wilson', score: 88, hours: 30 },
    { rank: 3, name: 'Mike Johnson', score: 85, hours: 35 },
    { rank: 4, name: 'Jane Smith', score: 82, hours: 28 },
    { rank: 5, name: 'Tom Brown', score: 78, hours: 25 },
    { rank: 6, name: 'Alice Kim', score: 75, hours: 22 },
  ];

  const mockTodayGoals = [
    {
      id: 1,
      title: 'Complete React refactoring task',
      achieved: ['John Doe', 'Sarah Wilson'],
      notAchieved: ['Mike Johnson', 'Jane Smith', 'Tom Brown', 'Alice Kim']
    },
    {
      id: 2,
      title: 'Review team code submissions', 
      achieved: ['John Doe', 'Mike Johnson', 'Jane Smith'],
      notAchieved: ['Sarah Wilson', 'Tom Brown', 'Alice Kim']
    },
    {
      id: 3,
      title: 'Update project documentation',
      achieved: ['Sarah Wilson', 'Tom Brown'],
      notAchieved: ['John Doe', 'Mike Johnson', 'Jane Smith', 'Alice Kim']
    }
  ];


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

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <p className={`text-lg ${getThemeTextColor('primary')}`}>
            그룹 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !groupDetail) {
    return (
      <div className="h-full flex items-center justify-center">
        <StateDisplay 
          type="error" 
          title="그룹 정보를 불러오지 못했습니다"
          message="네트워크 상태를 확인하거나 잠시 후 다시 시도해 주세요."
          onRetry={() => refetch()}
          retryText="다시 시도"
        />
      </div>
    );
  }

  return (
    <div className="h-full grid grid-cols-5 gap-6 p-6" style={{ gridTemplateRows: 'auto auto 1fr' }}>
      {/* 좌측 최상단 - 그룹 이름 및 팀장 정보 (3/5) */}
      <TeamCard 
        teamName={groupDetail.name}
        description={groupDetail.description}
        leader={{ 
          name: groupDetail.owner.nickname, 
          avatar: groupDetail.owner.nickname.charAt(0) 
        }}
        tags={groupDetail.tags}
      />

      {/* 우측 상단 - 그라운드 룰 (2/5) */}
      <GroundRules rules={groupDetail.groundRule ? [groupDetail.groundRule] : []} />

      {/* Navigation Controls - 별도 컴포넌트 */}
      <Card className={`${getCommonCardClass()} col-span-3 row-span-1 flex items-center`}>
        <CardContent className="px-6 w-full">
          <div className="flex items-center justify-center relative w-full">
            {/* Date Navigation - 중앙 정렬 */}
            <div className="flex justify-center">
              <DateNavigation
                currentDate={selectedDate}
                onPrevious={() => handleDateChange('prev')}
                onNext={() => handleDateChange('next')}
                formatDate={formatDate}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
              />
            </div>

            {/* Period Selector - 우측 절대 위치 */}
            <div className={`absolute right-0 flex rounded-md ${getThemeClass('componentSecondary')} p-1`}>
              <button
                onClick={() => setSelectedPeriod('daily')}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  selectedPeriod === 'daily'
                    ? `${getThemeClass('component')} ${getThemeTextColor('primary')}`
                    : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')}`
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setSelectedPeriod('weekly')}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  selectedPeriod === 'weekly'
                    ? `${getThemeClass('component')} ${getThemeTextColor('primary')}`
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
      <TeamLeaderboard members={mockLeaderboard} />

      {/* 우측 하단 - 오늘의 목표 설정 (2/5) */}
      <TodayGoals goals={mockTodayGoals} />
    </div>
  );
}