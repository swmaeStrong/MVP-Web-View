'use client';

import DateNavigation from '@/components/common/DateNavigation';
import StateDisplay from '@/components/common/StateDisplay';
import GroundRules from '@/components/group/GroundRules';
import TeamCard from '@/components/group/TeamCard';
import TeamLeaderboard from '@/components/group/TeamLeaderboard';
import TodayGoals from '@/components/group/TodayGoals';
import { useUpdateGroup } from '@/hooks/group/useGroupSettings';
import { useLastGroupTab } from '@/hooks/group/useLastGroupTab';
import { useGroupDetail } from '@/hooks/queries/useGroupDetail';
import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { getGroupLeaderboard } from '@/shared/api/get';
import { useCurrentUser } from '@/stores/userStore';
import { getKSTDateString, getMondayOfWeek } from '@/utils/timezone';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import PageLoader from '../../../../components/common/PageLoader';

export default function GroupDetailPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const params = useParams();
  const currentUser = useCurrentUser();
  
  // Save current tab as last visited
  useLastGroupTab();
  
  const teamId = Array.isArray(params.id) ? params.id[0] : params.id;
  const groupId = teamId ? parseInt(teamId, 10) : 0;

  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly'>('daily');
  
  // 각 모드별로 독립적인 날짜 상태 관리
  const [dateStates, setDateStates] = useState({
    daily: getKSTDateString(),
    weekly: (() => {
      // Weekly 초기값은 현재 주의 월요일
      const today = new Date(getKSTDateString());
      const dayOfWeek = today.getDay();
      const daysFromMonday = (dayOfWeek + 6) % 7;
      const mondayDate = new Date(today);
      mondayDate.setDate(today.getDate() - daysFromMonday);
      return mondayDate.toISOString().split('T')[0];
    })()
  });

  // 현재 선택된 기간의 날짜
  const selectedDate = dateStates[selectedPeriod];

  // Period 변경 시 해당 모드의 저장된 날짜로 전환
  const handlePeriodChange = useCallback((newPeriod: 'daily' | 'weekly') => {
    setSelectedPeriod(newPeriod);
    // 각 모드는 이미 저장된 날짜를 사용하므로 별도 처리 불필요
  }, []);

  // 그룹 상세 정보 조회
  const { data: groupDetail, isLoading, error, refetch } = useGroupDetail({
    groupId,
    enabled: !!groupId,
  });

  // 그룹 리더보드 조회
  const { data: leaderboardData, isLoading: isLeaderboardLoading } = useQuery({
    queryKey: ['groupLeaderboard', groupId, selectedDate],
    queryFn: () => getGroupLeaderboard(groupId, selectedDate),
    enabled: !!groupId,
    retry: 1,
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

  // 최소 날짜 제한 (8월 1일)
  const MIN_DATE = '2025-08-01';
  
  // 리더보드 멤버 데이터
  const leaderboardMembers = leaderboardData?.members || [];

  const handlePreviousDate = useCallback(() => {
    const currentDate = new Date(selectedDate);
    let newDate: Date;
    
    if (selectedPeriod === 'daily') {
      // Daily: 하루씩 이동
      newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      // Weekly: 일주일씩 이동
      newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
    }
    
    const newDateString = newDate.toISOString().split('T')[0];
    
    // 8월 1일 이전으로는 이동 불가
    if (newDateString >= MIN_DATE) {
      // 현재 모드의 날짜만 업데이트
      setDateStates(prev => ({
        ...prev,
        [selectedPeriod]: newDateString
      }));
    }
  }, [selectedDate, selectedPeriod]);

  const handleNextDate = useCallback(() => {
    const currentDate = new Date(selectedDate);
    const today = new Date(getKSTDateString());
    let newDate: Date;
    
    if (selectedPeriod === 'daily') {
      // Daily: 하루씩 이동
      newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 1);
    } else {
      // Weekly: 일주일씩 이동
      newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
    }
    
    // 오늘 이후로는 이동 불가
    if (newDate <= today) {
      const newDateString = newDate.toISOString().split('T')[0];
      // 현재 모드의 날짜만 업데이트
      setDateStates(prev => ({
        ...prev,
        [selectedPeriod]: newDateString
      }));
    }
  }, [selectedDate, selectedPeriod]);

  const handleDateChange = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      handlePreviousDate();
    } else {
      handleNextDate();
    }
  }, [handlePreviousDate, handleNextDate]);

  // 이전/다음 버튼 활성화 상태 체크 (현재 선택된 모드 기준)
  const canGoPrevious = useMemo(() => {
    const currentDate = new Date(dateStates[selectedPeriod]);
    let checkDate: Date;
    
    if (selectedPeriod === 'daily') {
      checkDate = new Date(currentDate);
      checkDate.setDate(currentDate.getDate() - 1);
    } else {
      checkDate = new Date(currentDate);
      checkDate.setDate(currentDate.getDate() - 7);
    }
    
    const checkDateString = checkDate.toISOString().split('T')[0];
    return checkDateString >= MIN_DATE;
  }, [dateStates, selectedPeriod]);

  const canGoNext = useMemo(() => {
    const currentDate = new Date(dateStates[selectedPeriod]);
    const today = new Date(getKSTDateString());
    let checkDate: Date;
    
    if (selectedPeriod === 'daily') {
      checkDate = new Date(currentDate);
      checkDate.setDate(currentDate.getDate() + 1);
    } else {
      checkDate = new Date(currentDate);
      checkDate.setDate(currentDate.getDate() + 7);
    }
    
    return checkDate <= today;
  }, [dateStates, selectedPeriod]);

  const formatDate = useCallback((dateString: string) => {
    if (selectedPeriod === 'daily') {
      return dateString; // 이미 YYYY-MM-DD 형식
    } else {
      const date = new Date(dateString);
      const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, ...
      const daysFromMonday = (dayOfWeek + 6) % 7; // Days elapsed from Monday
      
      // 월요일 찾기
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - daysFromMonday);
      
      // 일요일 찾기 (월요일로부터 6일 후)
      const endOfWeek = new Date(startOfWeek);
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
      <PageLoader message="Loading group information..." />
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
    <div className="h-full grid grid-cols-1 lg:grid-cols-5 p-6 gap-y-6 lg:gap-6" style={{ gridTemplateRows: 'auto auto 1fr' }}>
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
            <div className={`flex justify-center ${selectedPeriod === 'weekly' ? 'pr-12' : ''}`}>
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
                onClick={() => handlePeriodChange('daily')}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  selectedPeriod === 'daily'
                    ? `${getThemeClass('component')} ${getThemeTextColor('primary')}`
                    : `${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')}`
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => handlePeriodChange('weekly')}
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
      <TeamLeaderboard 
        members={leaderboardMembers} 
        isLoading={isLeaderboardLoading}
      />

      {/* 우측 하단 - 오늘의 목표 설정 (2/5) */}
      <TodayGoals 
        groupId={groupId} 
        isGroupOwner={isGroupOwner ?? false} 
        groupMembers={groupDetail ? [groupDetail.owner, ...groupDetail.members] : []}
        selectedPeriod={selectedPeriod}
        date={selectedPeriod === 'weekly' ? getMondayOfWeek(dateStates[selectedPeriod]) : dateStates[selectedPeriod]}
      />
    </div>
  );
}