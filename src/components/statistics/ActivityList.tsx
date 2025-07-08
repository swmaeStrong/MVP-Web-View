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
  const [loading, setLoading] = useState(false);
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
      return;
    }

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
              <div key={index} className={`group rounded-lg border p-3 ${getThemeClass('border')} ${getThemeClass('component')}`}>
                <div className="grid grid-cols-[5rem_4rem_1fr_5rem] gap-3 items-center">
                  {/* 시간 skeleton */}
                  <div className={`h-4 w-16 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
                  {/* 앱 이름 skeleton */}
                  <div className={`h-4 w-12 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
                  {/* 제목 skeleton */}
                  <div className="space-y-1">
                    <div className={`h-4 w-full animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
                    <div className={`h-3 w-3/4 animate-pulse rounded ${getThemeClass('borderLight')}`}></div>
                  </div>
                  {/* 카테고리 skeleton */}
                  <div className={`h-6 w-16 animate-pulse rounded ${getThemeClass('componentSecondary')}`}></div>
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
              className={`group rounded-lg border p-3 ${componentStates.hoverable.transition} ${componentStates.hoverable.cursor} ${getThemeClass('border')} ${getThemeClass('component')} hover:shadow-md hover:${getThemeClass('borderLight')}`}
              style={{ 
                display: 'grid',
                gridTemplateColumns: '5rem 4rem 1fr 5rem',
                gap: '0.75rem',
                alignItems: 'center',
                width: '100%',
                overflow: 'hidden'
              }}
            >
              {/* 시간 */}
              <div className={`text-xs font-mono ${getThemeTextColor('secondary')}`}>
                {formatTime(activity.timestamp)}
              </div>

              {/* 앱 이름 */}
              <div className="min-w-0">
                <span className={`text-sm font-medium transition-colors truncate block ${getThemeTextColor('primary')} group-hover:${getThemeTextColor('accent')}`} title={activity.app}>
                  {activity.app}
                </span>
              </div>

              {/* 제목/URL - 가장 많은 공간 차지 */}
              <div className="min-w-0 overflow-hidden">
                <div className={`text-sm transition-colors truncate ${getThemeTextColor('primary')} group-hover:${getThemeTextColor('accent')}`} title={activity.title}>
                  {activity.title}
                </div>
                {activity.url && (
                  <div className={`text-xs mt-1 truncate ${getThemeTextColor('secondary')}`} title={activity.url}>
                    {activity.url}
                  </div>
                )}
              </div>

              {/* 카테고리 배지 */}
              <div className="min-w-0">
                <div className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${getThemeClass('border')} ${getThemeTextColor('primary')} truncate w-full`} title={activity.category}>
                  {activity.category}
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