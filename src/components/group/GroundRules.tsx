'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { Separator } from '@/shadcn/ui/separator';
import { spacing } from '@/styles/design-system';

interface GroundRulesProps {
  rules: string[];
}

export default function GroundRules({ rules }: GroundRulesProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();

  return (
    <Card className={`${getCommonCardClass()} col-span-2 row-span-2`}>
      <CardHeader className="text-center">
        <div className={`text-lg font-bold ${getThemeTextColor('primary')}`}>
          Ground Rules
        </div>
      </CardHeader>
      <CardContent className={spacing.inner.normal}>
        <Separator className="mb-4" />
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div key={index} className={`flex items-start gap-3 p-3 rounded-md ${getThemeClass('componentSecondary')}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getThemeClass('component')} ${getThemeTextColor('secondary')}`}>
                {index + 1}
              </div>
              <span className={`text-sm ${getThemeTextColor('primary')} leading-relaxed`}>
                {rule}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}