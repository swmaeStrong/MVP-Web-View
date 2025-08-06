'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

interface GroupActionsProps {
  isOwner: boolean;
  groupName?: string;
  onDeleteGroup?: () => void;
  onLeaveGroup?: () => void;
}

export default function GroupActions({ 
  isOwner, 
  groupName, 
  onDeleteGroup, 
  onLeaveGroup 
}: GroupActionsProps) {
  const { getThemeTextColor, getCommonCardClass } = useTheme();

  return (
    <Card className={`${getCommonCardClass()} border-red-200`}>
      <CardHeader>
        <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
          {isOwner ? 'Delete Group' : 'Leave Group'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-sm ${getThemeTextColor('secondary')} mb-4`}>
          {isOwner 
            ? 'Deleting this group will permanently remove all data and cannot be undone.'
            : `Are you sure you want to leave this group? You can rejoin later if the group is public.`
          }
        </p>
        <Button
          variant="destructive"
          onClick={isOwner ? onDeleteGroup : onLeaveGroup}
          className="w-full"
          size="sm"
        >
          {isOwner ? 'Delete Group' : 'Leave Group'}
        </Button>
      </CardContent>
    </Card>
  );
}