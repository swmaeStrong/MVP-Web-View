'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { PeriodType, StatisticsCategory } from '@/types/statistics';

// 컴포넌트 임포트
import ActivityList from '@/components/statistics/ActivityList';
import HourlyUsageComparison from '@/components/statistics/HourlyUsageComparison';
import StatisticsChart from '@/components/statistics/StatisticsChart';
import TimelineChart from '@/components/statistics/TimelineChart';
import TotalTimeCard from '@/components/statistics/TotalTimeCard';

// Hook 모킹을 위한 임포트
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

// 데모용 더미 데이터 - 더 다양한 카테고리 (초 단위로 수정)
const generateDummyData = () => ({
  totalTime: 8.5 * 3600, // 8시간 30분을 초로 변환 (30600초)
  categories: [
    { name: 'Development', time: 3.2 * 3600, percentage: 37.6 }, // 3시간 12분을 초로 변환
    { name: 'Design', time: 1.8 * 3600, percentage: 21.2 }, // 1시간 48분을 초로 변환
    { name: 'Communication', time: 1.0 * 3600, percentage: 11.8 }, // 1시간을 초로 변환
    { name: 'Research', time: 0.8 * 3600, percentage: 9.4 }, // 48분을 초로 변환
    { name: 'Productivity', time: 0.7 * 3600, percentage: 8.2 }, // 42분을 초로 변환
    { name: 'Browser', time: 0.5 * 3600, percentage: 5.9 }, // 30분을 초로 변환
    { name: 'Entertainment', time: 0.3 * 3600, percentage: 3.5 }, // 18분을 초로 변환
    { name: 'Social', time: 0.2 * 3600, percentage: 2.4 }, // 12분을 초로 변환
  ] as StatisticsCategory[],
  date: new Date().toISOString().split('T')[0],
});

// 데모용 활동 더미 데이터 - 더 다양한 카테고리
const generateDummyActivities = () => [
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5분 전
    app: 'VS Code',
    title: 'statistics-demo/page.tsx - MVP-Web-View',
    url: 'file:///Users/project/src/app/statistics-demo/page.tsx',
    category: 'Development'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15분 전
    app: 'Chrome',
    title: 'TypeScript Documentation - Types',
    url: 'https://typescriptlang.org/docs/handbook/2/everyday-types.html',
    category: 'Research'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25분 전
    app: 'Notion',
    title: 'Project Planning - Sprint 3',
    url: 'https://notion.so/project-planning',
    category: 'Productivity'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35분 전
    app: 'Figma',
    title: 'UI Kit - Design System',
    url: 'https://figma.com/design/ui-kit-123',
    category: 'Design'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(), // 50분 전
    app: 'Chrome',
    title: 'GitHub - Pull Request Review',
    url: 'https://github.com/company/project/pull/123',
    category: 'Browser'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(), // 1시간 5분 전
    app: 'Slack',
    title: '#development - Code Review Discussion',
    url: 'slack://channel/C123456',
    category: 'Communication'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(), // 1시간 15분 전
    app: 'Terminal',
    title: 'git commit -m "feat: add demo pages"',
    url: 'file:///Users/project',
    category: 'Development'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1시간 30분 전
    app: 'YouTube',
    title: 'React Best Practices 2024',
    url: 'https://youtube.com/watch?v=abc123',
    category: 'Education'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(), // 1시간 50분 전
    app: 'Discord',
    title: 'Developer Community Chat',
    url: 'discord://channel/987654',
    category: 'Social'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 125).toISOString(), // 2시간 5분 전
    app: 'Spotify',
    title: 'Focus Music Playlist',
    url: 'https://spotify.com/playlist/focus-music',
    category: 'Entertainment'
  }
] as UsageLog.RecentUsageLogItem[];

// TimelineChart에서 사용하는 데이터 구조에 맞게 생성 (work, breaks, meetings, others)
const generateDummyTimelineData = () => {
  const today = new Date().toISOString().split('T')[0];
  const activities: Array<{
    mergedCategory: string;
    startedAt: string;
    endedAt: string;
    app: string;
    title: string;
  }> = [];
  
  // 하루 일과 시간표 - TimelineChart와 동일한 카테고리 사용
  const sessions = [
    { start: 9, end: 10.5, category: 'work', app: 'VS Code', title: 'React 컴포넌트 개발' },
    { start: 10.5, end: 10.75, category: 'breaks', app: 'Coffee', title: '커피 브레이크' },
    { start: 11, end: 12, category: 'meetings', app: 'Zoom', title: '팀 스탠드업 미팅' },
    { start: 12, end: 13, category: 'breaks', app: 'Lunch', title: '점심 시간' },
    { start: 14, end: 15.5, category: 'work', app: 'VS Code', title: 'API 연동 작업' },
    { start: 15.5, end: 15.75, category: 'breaks', app: 'Walk', title: '산책' },
    { start: 16, end: 17, category: 'work', app: 'Terminal', title: '배포 및 테스트' },
    { start: 17, end: 17.5, category: 'meetings', app: 'Slack', title: '일일 회고' },
    { start: 17.5, end: 18, category: 'others', app: 'Email', title: '이메일 확인' },
  ];

  sessions.forEach(session => {
    const startTime = new Date(`${today}T${Math.floor(session.start).toString().padStart(2, '0')}:${((session.start % 1) * 60).toString().padStart(2, '0')}:00`);
    const endTime = new Date(`${today}T${Math.floor(session.end).toString().padStart(2, '0')}:${((session.end % 1) * 60).toString().padStart(2, '0')}:00`);
    
    activities.push({
      mergedCategory: session.category,
      startedAt: startTime.toISOString(),
      endedAt: endTime.toISOString(),
      app: session.app,
      title: session.title,
    });
  });

  return activities;
};

// HourlyUsageComparison에서 사용하는 데이터 구조에 맞게 생성 - 1시간 단위에 최적화
const generateDummyHourlyData = () => {
  const today = new Date().toISOString().split('T')[0];
  const hourlyData: Array<{
    hour: string;
    category: string;
    totalDuration: number;
  }> = [];
  
  // 하루 종일 시간별 사용량 데이터 생성 (9시-18시)
  const workingHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const categories = ['work', 'meetings', 'breaks', 'others', 'Communication', 'Documentation'];
  
  workingHours.forEach(hour => {
    // 각 시간대별로 카테고리 데이터를 생성하되, 총합이 1시간을 넘지 않도록 관리
    const hourCategories: Array<{
      category: string;
      duration: number;
    }> = [];
    let remainingTime = 3600; // 1시간 = 3600초
    
    // 주요 카테고리 우선 할당
    categories.forEach((category, index) => {
      let duration = 0;
      
      // 시간대별 주요 카테고리 패턴
      if (hour === 9 || hour === 14 || hour === 16) {
        // 집중 시간대 - work 카테고리가 많음
        if (category === 'work') {
          duration = Math.min(Math.floor(Math.random() * 1200) + 1800, remainingTime); // 30분~50분
        } else if (category === 'breaks') {
          duration = Math.min(Math.floor(Math.random() * 300) + 300, remainingTime); // 5분~10분
        } else {
          duration = Math.min(Math.floor(Math.random() * 600) + 180, remainingTime); // 3분~13분
        }
      } else if (hour === 11 || hour === 15) {
        // 미팅 시간대
        if (category === 'meetings') {
          duration = Math.min(Math.floor(Math.random() * 1200) + 1500, remainingTime); // 25분~45분
        } else if (category === 'work') {
          duration = Math.min(Math.floor(Math.random() * 600) + 600, remainingTime); // 10분~20분
        } else {
          duration = Math.min(Math.floor(Math.random() * 300) + 180, remainingTime); // 3분~8분
        }
      } else if (hour === 12 || hour === 18) {
        // 점심/퇴근 시간대 - breaks와 others가 많음
        if (category === 'breaks') {
          duration = Math.min(Math.floor(Math.random() * 900) + 2100, remainingTime); // 35분~50분
        } else if (category === 'others') {
          duration = Math.min(Math.floor(Math.random() * 600) + 600, remainingTime); // 10분~20분
        } else {
          duration = Math.min(Math.floor(Math.random() * 300) + 180, remainingTime); // 3분~8분
        }
      } else {
        // 일반 시간대
        if (category === 'work') {
          duration = Math.min(Math.floor(Math.random() * 900) + 1200, remainingTime); // 20분~35분
        } else {
          duration = Math.min(Math.floor(Math.random() * 600) + 300, remainingTime); // 5분~15분
        }
      }
      
      // 남은 시간이 충분하고, 의미있는 시간(3분 이상)인 경우만 추가
      if (duration >= 180 && remainingTime >= duration) {
        hourCategories.push({
          category: category,
          duration: duration
        });
        remainingTime -= duration;
      }
      
      // 남은 시간이 5분 미만이면 중단
      if (remainingTime < 300) {
        return;
      }
    });
    
    // 생성된 카테고리 데이터를 hourlyData에 추가
    hourCategories.forEach(item => {
      hourlyData.push({
        hour: `${today}T${hour.toString().padStart(2, '0')}:00:00`,
        category: item.category,
        totalDuration: item.duration,
      });
    });
  });
  
  return hourlyData;
};

// 데모용 QueryClient 생성 - 더미 데이터 사전 설정
const demoQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

// 데모용 더미 데이터를 QueryClient에 미리 설정
const setupDemoData = (selectedDate: string) => {
  const demoHourlyData = generateDummyHourlyData();
  const demoUserId = 'demo-user-123';
  
  console.log('🔧 Setting up demo hourly data:', demoHourlyData.length, 'items');
  console.log('📊 Sample data:', demoHourlyData.slice(0, 3));
  console.log('📅 Selected date:', selectedDate);
  
  // useHourlyUsage 쿼리키와 동일하게 설정
  [15, 30, 60].forEach(binSize => {
    const queryKey = ['hourlyUsage', selectedDate, demoUserId, binSize];
    demoQueryClient.setQueryData(queryKey, demoHourlyData);
    console.log(`✅ Set data for binSize ${binSize}:`, queryKey);
  });
  
  // 다른 날짜들도 설정 (날짜 변경 시 대응)
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    [15, 30, 60].forEach(binSize => {
      const queryKey = ['hourlyUsage', dateStr, demoUserId, binSize];
      demoQueryClient.setQueryData(queryKey, demoHourlyData);
    });
  }
};

function StatisticsDemoContent() {
  const [selectedPeriod] = useState<PeriodType>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCategory, setSelectedCategory] = useState<StatisticsCategory | null>(null);
  const { getThemeClass } = useTheme();

  // 데모 데이터
  const [demoData] = useState(generateDummyData());
  const [demoTimelineData] = useState(generateDummyTimelineData());
  const [demoActivities] = useState(generateDummyActivities());
  const [demoUserId] = useState('demo-user-123');

  // 데모 데이터 초기화 - 컴포넌트 마운트 시와 날짜 변경 시
  useEffect(() => {
    setupDemoData(selectedDate);
    
    // 추가적으로 약간의 지연 후 다시 설정 (React Query 초기화 완료 후)
    const timer = setTimeout(() => {
      setupDemoData(selectedDate);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [selectedDate]);

  // 초기 마운트 시 데이터 설정 보장
  useEffect(() => {
    const timer = setTimeout(() => {
      setupDemoData(selectedDate);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  // 날짜 네비게이션 핸들러
  const handlePreviousDate = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const handleNextDate = () => {
    const currentDate = new Date(selectedDate);
    const today = new Date();
    if (currentDate < today) {
      currentDate.setDate(currentDate.getDate() + 1);
      setSelectedDate(currentDate.toISOString().split('T')[0]);
    }
  };

  const canGoNext = new Date(selectedDate) < new Date();
  const canGoPrevious = true; // 과거로는 항상 갈 수 있다고 가정

  return (
    <div className={`min-h-screen p-3 sm:p-4 lg:p-6 ${getThemeClass('background')}`}>
      <div className='mx-auto max-w-6xl space-y-4 sm:space-y-6'>

        {/* 메인 콘텐츠 */}
        <div className='grid gap-4 sm:gap-6 lg:grid-cols-2 min-h-[500px]'>
          {/* 왼쪽: 총 작업시간 & 상위 카테고리 */}
          <div className='flex flex-col space-y-3'>
            {/* 작업시간 카드 - 컴팩트하게 */}
            <div className='flex-shrink-0'>
              <TotalTimeCard
                totalTime={demoData.totalTime}
              />
            </div>

            {/* Activity 목록 - 실제 컴포넌트 사용 */}
            <div className='flex-1'>
              <ActivityList activities={demoActivities} date={selectedDate} />
            </div>
          </div>

          {/* 오른쪽: 차트 */}
          <StatisticsChart
            selectedPeriod={selectedPeriod}
            data={demoData}
            onPrevious={handlePreviousDate}
            onNext={handleNextDate}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            currentDate={selectedDate}
          />
        </div>

        {/* 타임라인 차트 - 전체 너비 사용 */}
        <div className='col-span-1 lg:col-span-2'>
          <TimelineChart 
            timelineData={demoTimelineData}
            isLoading={false}
          />
        </div>

        {/* 시간별 사용량 비교 차트 - 실제 컴포넌트 사용 (데이터 부족으로 NoData 표시) */}
        <div className='col-span-1 lg:col-span-2'>
          <HourlyUsageComparison
            userId={demoUserId}
            date={selectedDate}
          />
        </div>
      </div>
    </div>
  );
}


export default function StatisticsDemoPage() {
  return (
    <>
      <style jsx global>{`
        /* Timeline 컴포넌트의 테두리 색상 오버라이드 */
        .dark [style*="border: 2px solid"] {
          border-color: rgb(75, 85, 99) !important; /* 다크모드 border 색상 */
        }
        .light [style*="border: 2px solid"] {
          border-color: rgb(229, 231, 235) !important; /* 라이트모드 border 색상 */
        }
      `}</style>
      <QueryClientProvider client={demoQueryClient}>
        <StatisticsDemoContent />
      </QueryClientProvider>
    </>
  );
}