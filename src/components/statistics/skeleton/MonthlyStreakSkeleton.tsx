'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { Skeleton } from '@/shadcn/ui/skeleton';

export default function MonthlyStreakSkeleton() {
  const { getThemeClass } = useTheme();

  return (
    <Card className={`${getThemeClass('component')} ${getThemeClass('border')}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 통계 정보 스켈레톤 */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-lg">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>

          {/* 캘린더 스켈레톤 */}
          <div className="flex justify-center">
            <div className="space-y-4">
              <Skeleton className="h-8 w-40 mx-auto" />
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => (
                  <Skeleton key={i} className="h-9 w-9 rounded-md" />
                ))}
              </div>
            </div>
          </div>

          {/* 범례 스켈레톤 */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}