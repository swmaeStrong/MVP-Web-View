'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { useTranslation } from '@/providers/LanguageProvider';
import { Badge } from '@/shadcn/ui/badge';
import { Globe, Lock } from 'lucide-react';
import GroupInviteButton from './GroupInviteButton';

interface GroupHeaderProps {
  groupName: string;
  isPublic: boolean;
  password?: string | null;
}

export default function GroupHeader({ groupName, isPublic, password }: GroupHeaderProps) {
  const { getThemeTextColor } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
          {groupName}
        </h1>
        <Badge 
          variant={isPublic ? "default" : "secondary"} 
          className={`text-xs flex items-center gap-1 ${
            isPublic 
              ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' 
              : 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200'
          }`}
        >
          {isPublic ? (
            <>
              <Globe className="h-3 w-3" />
              {t('group.public')}
            </>
          ) : (
            <>
              <Lock className="h-3 w-3" />
              {t('group.private')}
            </>
          )}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <GroupInviteButton password={password} isPublic={isPublic} />
      </div>
    </div>
  );
}