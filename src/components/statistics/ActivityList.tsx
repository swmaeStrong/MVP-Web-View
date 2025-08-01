'use client';

// import { useDesignSystem } from '@/hooks/ui/useDesignSystem'; // 제거됨 - 사용되지 않음
import { useTheme } from '@/hooks/ui/useTheme';
import { cn } from '@/shadcn/lib/utils';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { getRecentUsageLog } from '@/shared/api/get';
import { cardSystem, componentStates, spacing } from '@/styles/design-system';
import { Activity, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import StateDisplay from '../common/StateDisplay';

interface ActivityListProps {
  activities?: UsageLog.RecentUsageLogItem[];
  date?: string;
}




export default function ActivityList({ activities, date }: ActivityListProps) {
  const { getThemeClass, getThemeTextColor, isDarkMode, getHoverableCardClass } = useTheme();
  // const { getCardStyle } = useDesignSystem(); // 제거됨 - 직접 클래스 사용
  
  const [usageData, setUsageData] = useState<UsageLog.RecentUsageLogItem[]>([]);
  const [loading, setLoading] = useState(!activities); // props가 없으면 초기에 로딩 상태
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 가상화를 위한 상태
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const ITEM_HEIGHT = 56; // h-14 = 56px
  const CONTAINER_HEIGHT = 315; // max-h-[315px]
  const VISIBLE_ITEMS = Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT) + 2; // 버퍼 포함

  // 새로고침 함수
  const handleRefresh = async () => {
    if (activities) {
      // props로 전달된 데이터가 있으면 새로고침 불가
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await getRecentUsageLog(date);
      setUsageData(data || []);
    } catch (err) {
      console.error('Failed to fetch usage log:', err);
      setError('Unable to load activity data.');
      setUsageData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch API data
  useEffect(() => {
    if (activities) {
      // props로 전달된 데이터가 있으면 그것을 사용
      setUsageData(activities);
      setLoading(false); // props 데이터가 있으면 로딩 완료
      setError(null); // 에러 상태도 클리어
      return;
    }

    // props가 없으면 API에서 데이터 fetch
    const fetchUsageLog = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getRecentUsageLog(date);
        setUsageData(data || []);
      } catch (err) {
        console.error('Failed to fetch usage log:', err);
        setError('Unable to load activity data.');
        setUsageData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageLog();
  }, [activities, date]);

  // 시간 포맷 함수 (ISO string을 시간으로 변환)
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      });
    } catch {
      return timestamp;
    }
  };
  
  // 고유한 카테고리 목록 추출 (우선순위 기반 정렬)
  const uniqueCategories = useMemo(() => {
    const categories = usageData.map(item => item.category);
    const uniqueSet = [...new Set(categories)];
    
    // 주요 작업 카테고리 우선순위 정의
    const priorityOrder = [
      'Development',
      'Design', 
      'Research',
      'Productivity',
      'Communication',
      'Browser',
      'Education',
      'Entertainment',
      'Social'
    ];
    
    // 우선순위 기반으로 정렬
    const prioritized = priorityOrder.filter(category => uniqueSet.includes(category));
    const others = uniqueSet.filter(category => !priorityOrder.includes(category)).sort();
    
    return [...prioritized, ...others];
  }, [usageData]);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    if (selectedCategory === 'all') {
      return usageData;
    }
    return usageData.filter(item => item.category === selectedCategory);
  }, [usageData, selectedCategory]);

  // 가상화를 위한 계산
  const virtualizedData = useMemo(() => {
    const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
    const endIndex = Math.min(startIndex + VISIBLE_ITEMS, filteredData.length);
    
    return {
      items: filteredData.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      totalHeight: filteredData.length * ITEM_HEIGHT,
      offsetY: startIndex * ITEM_HEIGHT
    };
  }, [filteredData, scrollTop, ITEM_HEIGHT, VISIBLE_ITEMS]);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // 디자인 시스템 스타일 적용 - 단순화됨
  // const cardStyles = getCardStyle('medium', 'hoverable'); // 제거됨

  return (
    <Card className={`${getHoverableCardClass()} h-full flex flex-col`}>
      <CardContent className={`${cardSystem.content} ${spacing.inner.normal} flex-1 flex flex-col overflow-hidden`}>
        {/* 제목 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 ">
            <h4 className={`text-sm font-semibold ${getThemeTextColor('primary')}`}>
              Recent Activity
            </h4>
            {/* 카테고리 필터 */}
            {uniqueCategories.length > 0 && (
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className={`w-32 h-7 text-xs ${getThemeClass('component')} ${getThemeClass('border')}`}>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className={`${getThemeClass('component')} ${getThemeClass('border')}`}>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className={`text-xs ${getThemeTextColor('secondary')}`}>
              {loading ? 'Loading...' : `${filteredData.length} items`}
            </div>
            {!activities && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className={`h-6 w-6 p-0 ${getThemeClass('component')} hover:${getThemeClass('componentSecondary')}`}
                title="Refresh activity list"
              >
                <RotateCcw className={`h-3 w-3 ${loading ? 'animate-spin' : ''} ${getThemeTextColor('secondary')}`} />
              </Button>
            )}
          </div>
        </div>

        {/* 로딩 상태 */}
        {loading ? (
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 h-[315px]">
            {[...Array(5)].map((_, index) => (
              <div 
                key={index} 
                className={`group rounded-lg border p-2 h-14 ${getThemeClass('border')} ${getThemeClass('component')}`}
                style={{ 
                  display: 'grid',
                  gridTemplateColumns: '4rem 3.5rem 1fr 5.5rem',
                  gap: '0.5rem',
                  alignItems: 'center',
                  width: '100%',
                  overflow: 'hidden',
                  minWidth: 0
                }}
              >
                {/* 시간 skeleton */}
                <div className={`h-3 w-12 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
                {/* 앱 이름 skeleton */}
                <div className="min-w-0 max-w-full overflow-hidden">
                  <div className={`h-3 w-10 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
                </div>
                {/* 제목/URL skeleton */}
                <div className="min-w-0 overflow-hidden h-10 flex items-center">
                  <div className={`h-3 w-3/4 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
                </div>
                {/* 카테고리 skeleton */}
                <div className="min-w-0 max-w-full">
                  <div className={`h-5 w-full max-w-[5rem] mx-auto animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          /* 데이터 없음 */
          <div className="flex h-[315px] items-center justify-center">
            <StateDisplay
              type="empty"
              title={selectedCategory === 'all' ? "No Recent Activity" : `No ${selectedCategory} Activity`}
              message={error || (selectedCategory === 'all' 
                ? "No recent activity records. Start tracking your usage."
                : `No recent activity found for the ${selectedCategory} category.`
              )}
              icon={Activity}
              showBorder={false}
              size="medium"
            />
          </div>
        ) : (
          /* 가상화된 스크롤 활동 목록 */
          <div 
            ref={containerRef}
            className={cn(
              "flex-1 overflow-y-auto overflow-x-hidden pr-2 max-h-[315px]",
              "activity-scroll-hide"
            )}
            style={{ height: CONTAINER_HEIGHT }}
            onScroll={handleScroll}
          >
            {/* 가상 컨테이너 - 전체 높이를 유지 */}
            <div style={{ height: virtualizedData.totalHeight, position: 'relative' }}>
              {/* 실제 렌더링되는 아이템들 */}
              <div 
                style={{ 
                  transform: `translateY(${virtualizedData.offsetY}px)`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px' // space-y-2
                }}
              >
                {virtualizedData.items.map((activity, index) => (
            <div
              key={virtualizedData.startIndex + index}
              className={`group rounded-lg border p-2 h-14 ${componentStates.hoverable.transition} ${componentStates.hoverable.cursor} ${getThemeClass('border')} ${getThemeClass('component')} hover:shadow-md hover:${getThemeClass('borderLight')}`}
              style={{ 
                display: 'grid',
                gridTemplateColumns: '4rem 3.5rem 1fr 5.5rem',
                gap: '0.5rem',
                alignItems: 'center',
                width: '100%',
                overflow: 'hidden',
                minWidth: 0
              }}
            >
              {/* 시간 */}
              <div className={`text-xs font-mono ${getThemeTextColor('secondary')}`}>
                {formatTime(activity.timestamp)}
              </div>

              {/* 앱 이름 */}
              <div className="min-w-0 max-w-full overflow-hidden">
                <span className={`text-xs font-medium transition-colors truncate block ${getThemeTextColor('primary')} group-hover:${getThemeTextColor('accent')}`} title={activity.app}>
                  {activity.app}
                </span>
              </div>

              {/* 제목/URL - 고정 높이 */}
              <div className="min-w-0 overflow-hidden h-10 flex flex-col justify-center">
                {activity.url ? (
                  <>
                    <div className={`text-xs transition-colors truncate leading-tight ${getThemeTextColor('primary')} group-hover:${getThemeTextColor('accent')}`} title={activity.title}>
                      {activity.title}
                    </div>
                    <div className={`text-xs truncate leading-tight ${getThemeTextColor('secondary')}`} title={activity.url}>
                      {activity.url}
                    </div>
                  </>
                ) : (
                  <div className={`text-xs transition-colors truncate leading-tight ${getThemeTextColor('primary')} group-hover:${getThemeTextColor('accent')}`} title={activity.title}>
                    {activity.title}
                  </div>
                )}
              </div>

              {/* 카테고리 배지 */}
              <div className="min-w-0 max-w-full">
                <div className={`inline-flex items-center rounded-md border px-1.5 py-1 text-xs font-medium ${getThemeClass('border')} ${getThemeTextColor('primary')} w-full justify-center overflow-hidden`} title={activity.category}>
                  <span className="truncate">{activity.category}</span>
                </div>
              </div>
            </div>
            ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 