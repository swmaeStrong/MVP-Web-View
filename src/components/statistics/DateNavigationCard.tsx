'use client';

import DateNavigation from '@/components/common/DateNavigation';
import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent } from '@/shadcn/ui/card';
import { cardSystem, componentStates, spacing } from '@/styles/design-system';

interface TotalTimeCardProps {
  currentDate: string;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export default function TotalTimeCard({
  currentDate,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: TotalTimeCardProps) {
  const { getThemeClass } = useTheme();

  return (
    <Card className={`bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 ${componentStates.default.transition} ${getThemeClass('border')} ${getThemeClass('component')}`}>
      <CardContent className={`${cardSystem.content} ${spacing.inner.normal}`}>
        {/* Date navigation header */}
        <div className="flex items-center justify-center w-full">
          <DateNavigation
            currentDate={currentDate}
            onPrevious={onPrevious}
            onNext={onNext}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            formatDate={(date) => date}
          />
        </div>
      </CardContent>
    </Card>
  );
}
