'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { useTranslation } from '@/providers/LanguageProvider';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

interface GroupActionsProps {
  isOwner: boolean;
  onDeleteGroup?: () => void;
  onLeaveGroup?: () => void;
}

export default function GroupActions({
  isOwner,
  onDeleteGroup,
  onLeaveGroup
}: GroupActionsProps) {
  const { getThemeTextColor, getCommonCardClass } = useTheme();
  const { t } = useTranslation();

  return (
    <Card className={`${getCommonCardClass()} border-red-200`}>
      <CardHeader>
        <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
          {isOwner ? t('group.deleteGroup') : t('group.leaveGroup')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-sm ${getThemeTextColor('secondary')} mb-4`}>
          {isOwner
            ? t('group.deleteGroupWarningText')
            : t('group.leaveGroupConfirmText')
          }
        </p>
        <Button
          variant="destructive"
          onClick={isOwner ? onDeleteGroup : onLeaveGroup}
          className="w-full"
          size="sm"
        >
          {isOwner ? t('group.deleteGroup') : t('group.leaveGroup')}
        </Button>
      </CardContent>
    </Card>
  );
}