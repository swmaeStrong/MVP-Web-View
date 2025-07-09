'use client';

import { useDesignSystem } from '@/hooks/useDesignSystem';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { getRecentUsageLog } from '@/shared/api/get';
import { cardSystem, componentStates, spacing } from '@/styles/design-system';
import { Activity, RotateCcw, Filter } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/shadcn/lib/utils';
import NoData from '../common/NoData';

interface ActivityListProps {
  activities?: UsageLog.RecentUsageLogItem[];
  date?: string;
}




export default function ActivityList({ activities, date }: ActivityListProps) {
  const { getThemeClass, getThemeTextColor, isDarkMode } = useTheme();
  const { getCardStyle } = useDesignSystem();
  
  const [usageData, setUsageData] = useState<UsageLog.RecentUsageLogItem[]>([]);
  const [loading, setLoading] = useState(!activities); // props가 없으면 초기에 로딩 상태
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  // 디자인 시스템 스타일 적용
  const cardStyles = getCardStyle('medium', 'hoverable');

  return (
    <Card className={`${cardSystem.base} ${cardSystem.variants.elevated} ${cardSystem.hover.lift} ${componentStates.hoverable.transition} ${getThemeClass('border')} ${getThemeClass('component')} h-full flex flex-col`}>
      <CardContent className={`${cardSystem.content} ${spacing.inner.normal} flex-1 flex flex-col overflow-hidden`}>
        {/* 제목 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
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
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {[...Array(8)].map((_, index) => (
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
          <div className="flex h-[300px] items-center justify-center">
            <NoData
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
          /* 스크롤 가능한 활동 목록 */
          <div 
            className={cn(
              "flex-1 overflow-y-auto overflow-x-hidden space-y-2 pr-2 min-h-0 max-h-[525px]",
              "activity-scroll-hide"
            )}
          >
            {filteredData.map((activity, index) => (
            <div
              key={index}
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
        )}
      </CardContent>
    </Card>
  );
} 