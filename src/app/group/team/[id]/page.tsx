'use client';

import DateNavigation from '@/components/common/DateNavigation';
import StateDisplay from '@/components/common/StateDisplay';
import GroundRules from '@/components/group/GroundRules';
import TeamCard from '@/components/group/TeamCard';
import TeamLeaderboard from '@/components/group/TeamLeaderboard';
import TodayGoals from '@/components/group/TodayGoals';
import { useGroupDetail } from '@/hooks/queries/useGroupDetail';
import { useUpdateGroup } from '@/hooks/group/useGroupSettings';
import { useLastGroupTab } from '@/hooks/group/useLastGroupTab';
import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { useCurrentUser } from '@/stores/userStore';
import { getKSTDateString, getKSTDateStringDaysAgo } from '@/utils/timezone';
import { RefreshCw } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

export default function TeamDetailPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const params = useParams();
  const currentUser = useCurrentUser();
  
  // Save current tab as last visited
  useLastGroupTab();
  
  const teamId = Array.isArray(params.id) ? params.id[0] : params.id;
  const groupId = teamId ? parseInt(teamId, 10) : 0;

  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly'>('daily');
  const [selectedDate, setSelectedDate] = useState(getKSTDateString());

  // 그룹 상세 정보 조회
  const { data: groupDetail, isLoading, error, refetch } = useGroupDetail({
    groupId,
    enabled: !!groupId,
  });

  // 현재 사용자가 그룹장인지 확인
  const isGroupOwner = groupDetail && currentUser && groupDetail.owner.userId === currentUser.id;

  // 그룹 정보 업데이트 mutation
  const updateGroupMutation = useUpdateGroup(groupId);

  // 그룹 설명 업데이트
  const handleDescriptionUpdate = async (newDescription: string) => {
    if (!groupDetail) return;
    
    const request: Group.UpdateGroupApiRequest = {
      name: groupDetail.name,
      description: newDescription,
      groundRule: groupDetail.groundRule,
      tags: groupDetail.tags,
      isPublic: groupDetail.isPublic,
    };

    await updateGroupMutation.mutateAsync(request);
  };

  // 그라운드 룰 업데이트
  const handleGroundRuleUpdate = async (newGroundRule: string) => {
    if (!groupDetail) return;
    
    const request: Group.UpdateGroupApiRequest = {
      name: groupDetail.name,
      description: groupDetail.description,
      groundRule: newGroundRule,
      tags: groupDetail.tags,
      isPublic: groupDetail.isPublic,
    };

    await updateGroupMutation.mutateAsync(request);
  };



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
            Loading group information...
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
          title="Failed to load group information"
          message="Please check your network connection or try again later."
          onRetry={() => refetch()}
          retryText="Retry"
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
        isOwner={isGroupOwner ?? false}
        onDescriptionUpdate={isGroupOwner ? handleDescriptionUpdate : undefined}
      />

      {/* 우측 상단 - 그라운드 룰 (2/5) */}
      <GroundRules 
        rules={groupDetail.groundRule || ''}
        isOwner={isGroupOwner ?? false}
        onGroundRuleUpdate={isGroupOwner ? handleGroundRuleUpdate : undefined}
      />

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
      <TodayGoals groupId={groupId} isGroupOwner={isGroupOwner ?? false} />
    </div>
  );
}