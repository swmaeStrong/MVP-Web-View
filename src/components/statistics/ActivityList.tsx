'use client';

import { useDesignSystem } from '@/hooks/useDesignSystem';
import { useTheme } from '@/hooks/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { getRecentUsageLog } from '@/shared/api/get';
import { cardSystem, componentStates, spacing } from '@/styles/design-system';
import { Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import NoData from '../common/NoData';

interface ActivityListProps {
  activities?: UsageLog.RecentUsageLogItem[];
  date?: string;
}




export default function ActivityList({ activities, date }: ActivityListProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();
  const { getCardStyle } = useDesignSystem();
  
  const [usageData, setUsageData] = useState<UsageLog.RecentUsageLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  
  // 디자인 시스템 스타일 적용
  const cardStyles = getCardStyle('medium', 'hoverable');

  return (
    <Card className={`${cardSystem.base} ${cardSystem.variants.elevated} ${cardSystem.hover.lift} ${componentStates.hoverable.transition} ${getThemeClass('border')} ${getThemeClass('component')} h-full flex flex-col`}>
      <CardContent className={`${cardSystem.content} ${spacing.inner.normal} flex-1 flex flex-col overflow-hidden`}>
        {/* 제목 */}
        <div className="flex items-center justify-between mb-4">
          <h4 className={`text-sm font-semibold ${getThemeTextColor('primary')}`}>
            Recent Activity
          </h4>
          <div className={`text-xs ${getThemeTextColor('secondary')}`}>
            {loading ? 'Loading...' : `${usageData.length} items`}
          </div>
        </div>

        {/* 로딩 상태 */}
        {loading ? (
          <div className={`text-center py-8 ${getThemeTextColor('secondary')}`}>
            <div className="animate-pulse">Loading data...</div>
          </div>
        ) : usageData.length === 0 ? (
          /* 데이터 없음 */
          <div className="flex h-[300px] items-center justify-center">
            <NoData
              title="No Recent Activity"
              message={error || "No recent activity records. Start tracking your usage."}
              icon={Activity}
              showBorder={false}
              size="medium"
            />
          </div>
        ) : (
          /* 스크롤 가능한 활동 목록 */
          <div 
            className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 pr-2 min-h-0 max-h-[525px]"
          >
            {usageData.map((activity, index) => (
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