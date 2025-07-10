'use client';

import { useLeaderboardInfiniteScroll } from '@/hooks/useLeaderboardInfiniteScroll';
// import { useScrollToMyRank } from '@/hooks/useScrollToMyRank'; // Not needed anymore
import { useTheme } from '@/hooks/useTheme';
import { INFINITE_SCROLL_CONFIG } from '@/shared/constants/infinite-scroll';
import { CATEGORIES, LEADERBOARD_CATEGORIES } from '@/utils/categories';
import { useCallback, useEffect, useRef, useState } from 'react';

// 컴포넌트 임포트
import CategoryFilter from '@/components/leaderboard/CategoryFilter';
import LeaderboardList from '@/components/leaderboard/LeaderboardList';
import MyRankBanner from '@/components/leaderboard/MyRankBanner';
import PeriodSelector from '@/components/leaderboard/PeriodSelector';

// User 타입은 userStore에서 import
import {
  LeaderboardListSkeleton,
  MyRankBannerSkeleton
} from '@/components/common/LeaderboardSkeleton';
import { useCurrentUser } from '@/stores/userStore';
import { useInitUser } from '../../hooks/useInitUser';

// LeaderBoard.LeaderBoardResponse 타입을 직접 사용

// 필요한 유틸리티 함수들 import
import { useMyRank } from '@/hooks/useMyRank';
import { getKSTDate, getKSTDateStringFromDate, getKSTMonthlyDateString, getKSTWeeklyDateString } from '@/utils/timezone';

export default function Leaderboard() {
  // Hook 순서를 항상 동일하게 유지
  const currentUser = useCurrentUser();
  const { initializeUser } = useInitUser();
  // scrollToMyRank is now defined locally instead of using the hook
  const { getThemeClass, getThemeTextColor } = useTheme();

  // Handle user initialization with useEffect
  useEffect(() => {
    if (!currentUser) {
      console.log('🔄 사용자 정보가 없어 초기화 시도...');
      initializeUser().catch(error => {
        console.error('❌ 사용자 초기화 실패:', error);
      });
    }
  }, [currentUser, initializeUser]);

  const [selectedPeriod, setSelectedPeriod] = useState<
    'daily' | 'weekly' | 'monthly'
  >('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  // 각 기간별로 독립적인 날짜 인덱스 관리
  const [dateIndices, setDateIndices] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>(
    CATEGORIES.TOTAL
  );

  // 현재 선택된 기간의 날짜 인덱스
  const selectedDateIndex = dateIndices[selectedPeriod];

  // 날짜 인덱스 설정 함수
  const setSelectedDateIndex = (index: number) => {
    setDateIndices(prev => ({
      ...prev,
      [selectedPeriod]: index,
    }));
  };

  // 리더보드 컨테이너 ref
  const leaderboardContainerRef = useRef<HTMLDivElement>(null);
  
  // MyRank 정보를 먼저 가져오기 위한 import
  const { myRank, rank } = useMyRank({
    category: selectedCategory,
    type: selectedPeriod,
    date: (() => {
      const today = getKSTDate();
      if (selectedPeriod === 'daily') {
        const targetDate = new Date(
          today.getTime() - selectedDateIndex * 24 * 60 * 60 * 1000
        );
        return getKSTDateStringFromDate(targetDate);
      } else if (selectedPeriod === 'weekly') {
        return getKSTWeeklyDateString(selectedDateIndex);
      } else if (selectedPeriod === 'monthly') {
        return getKSTMonthlyDateString(selectedDateIndex);
      }
      return getKSTDateStringFromDate(today);
    })(),
    userId: currentUser?.id,
  });
  
  // 페이지 로딩 상태 관리
  const [isLoadingToMyRank, setIsLoadingToMyRank] = useState(false);

  // 무한 스크롤 훅 사용
  const {
    users,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useLeaderboardInfiniteScroll({
    category: selectedCategory,
    period: selectedPeriod,
    selectedDateIndex,
    containerRef: leaderboardContainerRef,
  });
  
  // 내 랭크로 스크롤하는 함수 (데이터 완전 로드 후 스크롤)
  const scrollToMyRank = useCallback(async () => {
    if (!rank || !currentUser) return;
    
    setIsLoadingToMyRank(true);
    
    try {
      const currentLoadedUsers = users.length;
      
      // 내 페이지까지 필요한 추가 페이지 계산
      const myPage = Math.ceil(rank / INFINITE_SCROLL_CONFIG.ITEMS_PER_PAGE);
      const currentPages = Math.ceil(currentLoadedUsers / INFINITE_SCROLL_CONFIG.ITEMS_PER_PAGE);
      console.log('currentPages', currentPages);
      // 중앙 정렬을 위해 항상 다음 페이지까지 로드
      const targetPages = Math.max(myPage + 1, currentPages + 1); // 내 페이지 + 1 또는 현재+1 중 큰 값
      const pagesToLoad = targetPages - currentPages;
      console.log('pagesToLoad', pagesToLoad);
      console.log('페이지 로딩 정보:', {
        rank,
        myPage,
        currentPages,
        targetPages,
        pagesToLoad,
        currentLoadedUsers
      });
      
      // 필요한 데이터가 있으면 완전히 로드
      if (pagesToLoad > 0 && hasNextPage) {
        console.log(`${pagesToLoad}페이지 순차 로딩 시작...`);
        
        // 필요한 페이지를 순차적으로 로드 (fetchNextPage는 다음 페이지 하나씩만 가져옴)
        for (let i = 0; i < pagesToLoad && hasNextPage; i++) {
          console.log(`페이지 ${i + 1}/${pagesToLoad} 로딩 중...`);
          await fetchNextPage();
        }
        
        console.log('모든 페이지 로딩 완료');
        
        // 데이터 로딩 완료 후 DOM 업데이트 대기
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // 모든 데이터 로딩이 완료된 후 스크롤 실행
      console.log('스크롤 시작...');
      
      const userElement = document.querySelector(`[data-user-id="${currentUser.id}"]`);
      
      if (userElement) {
        // 스크롤 실행과 동시에 로딩 상태 해제
        setIsLoadingToMyRank(false);
        
        userElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
        
        // 하이라이트 효과
        userElement.classList.add('animate-pulse');
        setTimeout(() => userElement.classList.remove('animate-pulse'), 2000);
        
        console.log('스크롤 완료');
      } else {
        console.log('유저 요소를 찾을 수 없음:', {
          userId: currentUser.id,
          loadedUsers: users.length,
          rank,
          expectedInPage: `${myPage}페이지`
        });
        setIsLoadingToMyRank(false);
      }
      
    } catch (error) {
      console.error('스크롤 중 오류:', error);
      setIsLoadingToMyRank(false);
    }
  }, [rank, currentUser, users.length, hasNextPage, fetchNextPage]);

  const categories = LEADERBOARD_CATEGORIES;

  // 전체 로딩 상태 - PeriodSelector와 CategoryFilter는 항상 표시
  const isInitialLoading = isLoading && users.length === 0;

  return (
    <div className={`min-h-screen p-4 lg:p-8 ${getThemeClass('background')}`}>
      <div className='mx-auto max-w-6xl space-y-6 lg:space-y-8'>

        {/* 기간 선택 탭 */}
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedDateIndex={selectedDateIndex}
          setSelectedDateIndex={setSelectedDateIndex}
          currentDate={currentDate}
        />

        {/* 카테고리 필터 */}
        <div className='mb-6 space-y-3'>
          <div className='flex justify-center'>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        </div>

        {/* 내 순위 배너 - 로딩 중일 때 스켈레톤 표시 */}
        {isInitialLoading ? (
          <MyRankBannerSkeleton />
        ) : (
          <MyRankBanner
            category={selectedCategory}
            period={selectedPeriod}
            selectedDateIndex={selectedDateIndex}
            onScrollToMyRank={scrollToMyRank}
            totalUsers={users.length} // 전체 사용자 수 전달
            userId={currentUser?.id} // 고정된 userId 전달로 중복 호출 방지
            isLoadingToMyRank={isLoadingToMyRank} // 로딩 상태 전달
          />
        )}

        {/* 리더보드 리스트 - 로딩 중일 때 스켈레톤 표시 */}
        {isInitialLoading ? (
          <LeaderboardListSkeleton itemCount={15} />
        ) : (
          <LeaderboardList
            users={users}
            isLoading={isLoading}
            isError={isError}
            error={error}
            isFetchingNextPage={isFetchingNextPage}
            refetch={refetch}
            selectedPeriod={selectedPeriod}
            selectedCategory={selectedCategory}
            selectedDateIndex={selectedDateIndex}
            containerRef={leaderboardContainerRef}
          />
        )}
      </div>
    </div>
  );
}
