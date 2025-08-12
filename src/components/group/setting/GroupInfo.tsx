'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

interface GroupInfoProps {
  totalMembers: number;
  createdAt: string;
}

export default function GroupInfo({ totalMembers, createdAt }: GroupInfoProps) {
  const { getThemeTextColor, getCommonCardClass } = useTheme();

  const getActiveDays = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const today = new Date();
    
    if (createdDate.getFullYear() === today.getFullYear()) {
      return Math.ceil((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return '365+';
  };

  return (
    <Card className={getCommonCardClass()}>
      <CardHeader>
        <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
          Group Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className={`text-sm ${getThemeTextColor('secondary')}`}>Total Members</span>
            <span className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
              {totalMembers}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${getThemeTextColor('secondary')}`}>Created</span>
            <span className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
              {new Date(createdAt).toLocaleDateString('ko-KR')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${getThemeTextColor('secondary')}`}>Active Days</span>
            <span className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
              {getActiveDays(createdAt)} days
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}