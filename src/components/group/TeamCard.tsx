'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/ui/avatar';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { spacing } from '@/styles/design-system';

interface TeamCardProps {
  teamName: string;
  description: string;
  leader: {
    name: string;
    avatar: string;
  };
  tags?: string[];
}

export default function TeamCard({ teamName, description, leader, tags = [] }: TeamCardProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();

  return (
    <Card className={`${getCommonCardClass()} col-span-3 row-span-1`}>
      <CardContent className={spacing.inner.normal}>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
              {teamName}
            </div>
            {tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {tags.map((tag, index) => (
                  <span 
                    key={index}
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getThemeClass('componentSecondary')} ${getThemeTextColor('secondary')}`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="" />
              <AvatarFallback className={`text-sm font-semibold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                {leader.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className={`font-medium ${getThemeTextColor('primary')}`}>
                {leader.name}
              </p>
              <p className={`text-sm ${getThemeTextColor('secondary')}`}>
                Team Leader
              </p>
            </div>
          </div>
          
          <div className={`mt-4 p-3 rounded-lg ${getThemeClass('componentSecondary')}`}>
            <p className={`text-sm ${getThemeTextColor('secondary')}`}>
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}