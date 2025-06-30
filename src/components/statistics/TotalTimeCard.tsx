'use client';

import { Card, CardContent } from '@/shadcn/ui/card';
import { useTheme } from '@/hooks/useTheme';
import { cardSystem, componentStates, spacing } from '@/styles/design-system';

interface TotalTimeCardProps {
  totalTime: number; // seconds
}

export default function TotalTimeCard({
  totalTime,
}: TotalTimeCardProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();
  
  // Time formatting
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours === 0) {
      return `${minutes}m`;
    }
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  // Always display total time
  const displayTime = totalTime;
  const displayTitle = 'Total Activity Time';

  return (
    <Card className={`${cardSystem.base} ${cardSystem.variants.elevated} ${componentStates.default.transition} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className={`${cardSystem.content} ${spacing.inner.normal}`}>
        <div className="flex items-center justify-between">
          {/* Left: title display */}
          <div className="flex items-center gap-3">
            <div>
              <h3 className={`text-lg font-semibold ${getThemeTextColor('primary')}`}>
                {displayTitle}
              </h3>
              <p className={`text-sm ${getThemeTextColor('secondary')}`}>
                Today's Total Activity
              </p>
            </div>
          </div>

          {/* Right: time display */}
          <div className="text-right">
            <div className={`text-3xl font-bold ${getThemeTextColor('primary')}`}>
              {formatTime(displayTime)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
