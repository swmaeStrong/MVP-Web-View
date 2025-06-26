'use client';

import { useTheme } from '@/hooks/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { useDesignSystem } from '@/hooks/useDesignSystem';
import { cardSystem, componentStates, spacing } from '@/styles/design-system';

interface ActivityItem {
  app: string;
  title: string;
  url?: string;
  timestamp: string;
  category: string;
}

interface ActivityListProps {
  activities?: ActivityItem[];
}

// 더미 데이터 (임시)
const dummyActivities: ActivityItem[] = [
  {
    app: 'Chrome',
    title: 'https://twitter.com/home',
    url: 'https://twitter.com/home',
    timestamp: '18:04:33',
    category: 'SNS'
  },
  {
    app: 'Superhuman',
    title: 'Inbox - unread',
    timestamp: '18:01:15',
    category: 'Communication'
  },
  {
    app: 'Airtable',
    title: 'Tasks',
    timestamp: '18:01:10',
    category: 'LLM'
  },
  {
    app: 'Slack',
    title: 'General',
    timestamp: '18:00:03',
    category: 'Communication'
  },
  {
    app: 'Superhuman',
    title: 'Inbox - unread',
    timestamp: '17:57:29',
    category: 'Communication'
  },
  {
    app: 'Chrome',
    title: 'https://rize.io/settings/notific...',
    url: 'https://rize.io/settings/notifications',
    timestamp: '17:56:14',
    category: 'DEVELOPMENT'
  },
  {
    app: 'Chrome',
    title: 'https://rize.io/settings',
    url: 'https://rize.io/settings',
    timestamp: '17:53:01',
    category: 'DEVELOPMENT'
  },
  {
    app: 'Slack',
    title: 'Product Team',
    timestamp: '17:53:12',
    category: 'Communication'
  },
  {
    app: 'Sketch',
    title: 'Rize (Master)',
    timestamp: '17:49:58',
    category: 'Design'
  },
  {
    app: 'WebStorm',
    title: 'product.js',
    timestamp: '17:49:40',
    category: 'DEVELOPMENT'
  }
];



export default function ActivityList({ activities = dummyActivities }: ActivityListProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();
  const { getCardStyle } = useDesignSystem();
  
  // 디자인 시스템 스타일 적용
  const cardStyles = getCardStyle('medium', 'hoverable');

  return (
    <Card className={`${cardSystem.base} ${cardSystem.variants.elevated} ${cardSystem.hover.lift} ${componentStates.hoverable.transition} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className={`${cardSystem.content} ${spacing.inner.normal}`}>
        {/* 제목 */}
        <div className="flex items-center justify-between mb-4">
          <h4 className={`text-sm font-semibold ${getThemeTextColor('primary')}`}>
            최근 활동
          </h4>
          <div className={`text-xs ${getThemeTextColor('secondary')}`}>
            {activities.length}개 항목
          </div>
        </div>

        {/* 스크롤 가능한 활동 목록 */}
        <div 
          className="max-h-[400px] overflow-y-auto space-y-2 pr-2"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
          }}
        >
          {activities.map((activity, index) => (
            <div
              key={index}
              className={`group flex items-center gap-3 rounded-lg border p-3 ${componentStates.hoverable.transition} ${componentStates.hoverable.cursor} ${getThemeClass('border')} ${getThemeClass('component')} hover:shadow-md hover:${getThemeClass('borderLight')}`}
            >
              {/* 시간 */}
              <div className={`flex-shrink-0 w-16 text-xs font-mono ${getThemeTextColor('secondary')}`}>
                {activity.timestamp}
              </div>

              {/* 앱 이름 */}
              <div className="flex-shrink-0 w-20">
                <span className={`text-sm font-medium transition-colors truncate ${getThemeTextColor('primary')} group-hover:${getThemeTextColor('accent')}`}>
                  {activity.app}
                </span>
              </div>

              {/* 제목/URL - 가장 많은 공간 차지 */}
              <div className="flex-1 min-w-0">
                <div className={`text-sm truncate transition-colors ${getThemeTextColor('primary')} group-hover:${getThemeTextColor('accent')}`} title={activity.title}>
                  {activity.title}
                </div>
                {activity.url && (
                  <div className={`text-xs truncate mt-1 ${getThemeTextColor('secondary')}`} title={activity.url}>
                    {activity.url}
                  </div>
                )}
              </div>

              {/* 카테고리 배지 */}
              <div className="flex-shrink-0">
                <div className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${getThemeClass('border')} ${getThemeTextColor('primary')}`}>
                  {activity.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 