'use client';

import { CATEGORIES, LEADERBOARD_CATEGORIES } from '@/utils/categories';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// 컴포넌트 임포트
import CategoryFilter from '@/components/leaderboard/CategoryFilter';
import LeaderboardList from '@/components/leaderboard/LeaderboardList';
import PeriodSelector from '@/components/leaderboard/PeriodSelector';

// 타입 임포트
import { User, useUserStore } from '@/stores/userStore';

// 리더보드 표시용 확장된 User 타입
type LeaderboardUser = User & {
  score: number;
  rank: number;
};

// 영어 이름 풀
const englishNames = [
  'Alex', 'Brian', 'Chris', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack',
  'Kate', 'Luke', 'Maya', 'Nick', 'Olivia', 'Paul', 'Quinn', 'Ryan', 'Sara', 'Tom',
  'Uma', 'Victor', 'Wendy', 'Xavier', 'Yara', 'Zack', 'Anna', 'Ben', 'Chloe', 'Dan',
  'Eva', 'Felix', 'Gina', 'Hugo', 'Ivy', 'Jake', 'Kira', 'Leo', 'Mia', 'Noah',
  'Ava', 'Blake', 'Clara', 'Drew', 'Ella', 'Finn', 'Zoe', 'Ian', 'Jade', 'Kyle',
  'Lily', 'Max', 'Nina', 'Owen', 'Piper', 'Reed', 'Sky', 'Tara', 'Evan', 'Vera',
  'Wade', 'Xara', 'Yale', 'Zara', 'Amy', 'Cole', 'Dex', 'Elle', 'Fox', 'Grey',
  'Hope', 'Ivan', 'Jess', 'Kent', 'Lane', 'Milo', 'Nora', 'Oscar', 'Page', 'Rory',
  'Sage', 'Troy', 'Vale', 'Will', 'Zion', 'Ace', 'Bay', 'Cam', 'Eve', 'Kai',
  'Lee', 'Neo', 'Ray', 'Sam', 'Ty', 'Uma', 'Val', 'Win', 'Zoe', 'Ash', 'Rex', 'Joy'
];

// 기간별로 다른 더미 데이터 생성
const generateDummyUsers = (period: 'daily' | 'weekly' | 'monthly', dateIndex: number = 0): LeaderboardUser[] => {
  // 각 기간별로 다른 시드값 사용 (날짜 인덱스 포함)
  const seed = period === 'daily' ? 1000 + dateIndex : 
               period === 'weekly' ? 2000 + dateIndex : 
               3000 + dateIndex;
  
  // 시드를 기반으로 한 의사 랜덤 함수
  const seededRandom = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  return Array.from({ length: 100 }, (_, index) => {
    // 닉네임 생성 (기간별로 다른 순서)
    const nameIndex = (index + seed) % englishNames.length;
    const baseName = englishNames[nameIndex];
    const nickname = index >= englishNames.length ? `${baseName}${Math.floor(index / englishNames.length) + 1}` : baseName;
    
    // 기간별로 다른 점수 범위 설정
    let baseScore, variance;
    
    switch (period) {
      case 'daily':
        // 일일: 1-8시간 범위, 더 집중적인 사용 패턴
        baseScore = 28800 - (index * 280) + Math.floor(seededRandom(seed + index) * 600);
        variance = 400;
        break;
      case 'weekly':
        // 주간: 5-50시간 범위, 더 넓은 분포
        baseScore = 180000 - (index * 1750) + Math.floor(seededRandom(seed + index) * 1200);
        variance = 800;
        break;
      case 'monthly':
        // 월간: 20-200시간 범위, 가장 넓은 분포
        baseScore = 720000 - (index * 7000) + Math.floor(seededRandom(seed + index) * 2400);
        variance = 1500;
        break;
      default:
        baseScore = 36000 - (index * 350);
        variance = 300;
    }
    
    // 추가 랜덤성 적용
    const randomVariance = Math.floor(seededRandom(seed + index + 1000) * variance);
    const finalScore = baseScore + randomVariance;
    
    // 최소값 설정 (기간별로 다름)
    const minScore = period === 'daily' ? 1800 : // 30분
                     period === 'weekly' ? 7200 : // 2시간  
                     21600; // 6시간
    
    return {
      id: `demo-user-${period}-${dateIndex}-${index + 1}`,
      nickname: nickname,
      score: Math.max(finalScore, minScore),
      rank: index + 1,
    };
  });
};

// 데모용 QueryClient 생성
const demoQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

// 더 이상 MyRank 데이터 설정이 필요하지 않음

function LeaderboardDemoContent() {
  const { currentUser, setCurrentUser } = useUserStore();

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
    CATEGORIES.DEVELOPMENT
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

  // 기간과 날짜 인덱스에 따른 데모 데이터 생성
  const demoUsers = generateDummyUsers(selectedPeriod, selectedDateIndex);
  const categories = LEADERBOARD_CATEGORIES;

  return (
    <div className='min-h-screen p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-6xl space-y-6 sm:space-y-8'>


        {/* 기간 선택 탭 */}
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedDateIndex={selectedDateIndex}
          setSelectedDateIndex={setSelectedDateIndex}
          currentDate={currentDate}
        />

        {/* 카테고리 필터 */}
        <div className='flex justify-center mb-8'>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>


        {/* 리더보드 리스트 */}
        <LeaderboardList
          users={demoUsers}
          isLoading={false}
          isError={false}
          error={null}
          isFetchingNextPage={false}
          refetch={() => {}}
          selectedPeriod={selectedPeriod}
          selectedCategory={selectedCategory}
          selectedDateIndex={selectedDateIndex}
        />
      </div>
    </div>
  );
}

export default function LeaderboardDemoPage() {
  return (
    <QueryClientProvider client={demoQueryClient}>
      <LeaderboardDemoContent />
    </QueryClientProvider>
  );
}