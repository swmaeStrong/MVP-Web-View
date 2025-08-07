'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { useCurrentUser } from '@/stores/userStore';
import { UserAvatar } from '@/components/common';

interface MemberListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Group.GroupGoalsApiResponse | null;
  type: 'achieved' | 'notAchieved' | null;
  groupMembers?: Group.GroupUserInfo[];
}

export default function MemberListDialog({ 
  open, 
  onOpenChange, 
  goal, 
  type,
  groupMembers = []
}: MemberListDialogProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const currentUser = useCurrentUser();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
    }
    return `${minutes}m`;
  };

  const getUserNickname = (userId: string) => {
    const member = groupMembers.find(m => m.userId === userId);
    return member?.nickname || userId;
  };

  if (!goal || !type) return null;

  const members = type === 'achieved' 
    ? goal.members.filter(m => m.currentSeconds >= goal.goalSeconds)
    : goal.members.filter(m => m.currentSeconds < goal.goalSeconds);

  // 현재 사용자를 맨 앞으로 정렬
  const sortedMembers = [...members].sort((a, b) => {
    if (a.userId === currentUser?.id) return -1;
    if (b.userId === currentUser?.id) return 1;
    return 0;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-md ${getCommonCardClass()}`}>
        <DialogHeader>
          <DialogTitle className={`text-lg font-bold ${getThemeTextColor('primary')}`}>
            {type === 'achieved' ? 'Members who achieved' : 'Members who have not achieved'} the goal
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {/* 목표 제목 */}
          <div className={`p-3 rounded-lg ${getThemeClass('componentSecondary')}`}>
            <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
              "{goal.category} - {formatTime(goal.goalSeconds)}"
            </div>
          </div>

          {/* 멤버 수 정보 */}
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
              {type === 'achieved' ? 'Achieved Members' : 'Pending Members'}
            </span>
            <span className={`text-xs ${getThemeTextColor('secondary')}`}>
              {members.length} member{members.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* 스크롤 가능한 멤버 리스트 */}
          <div className="max-h-[320px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
            {sortedMembers.map((member, index) => {
              const isCurrentUser = member.userId === currentUser?.id;
              return (
                <div key={member.userId} className={`flex items-center gap-3 p-3 rounded-lg hover:${getThemeClass('componentSecondary')} border ${isCurrentUser ? 'border-gray-400 dark:border-gray-500' : getThemeClass('border')}`}>
                  <UserAvatar
                    nickname={getUserNickname(member.userId)}
                    size="sm"
                    isCurrentUser={isCurrentUser}
                    showBorder={false}
                  />
                  <div className={`text-sm font-medium ${getThemeTextColor('primary')} flex-1`}>
                    {getUserNickname(member.userId)}
                  </div>
                  <div className={`text-xs ${getThemeTextColor('secondary')} mr-3`}>
                    {formatTime(member.currentSeconds)}
                  </div>
                {type === 'achieved' && (
                  <div className="ml-auto">
                    <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full font-medium">
                      ✓ Achieved
                    </span>
                  </div>
                )}
                {type === 'notAchieved' && (
                  <div className="ml-auto">
                    <span className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full font-medium">
                      Not Achieved
                    </span>
                  </div>
                )}
                </div>
              );
            })}
          </div>

          {/* 통계 정보 */}
          <div className={`p-3 rounded-lg ${getThemeClass('componentSecondary')} mt-4 border-t ${getThemeClass('border')}`}>
            <div className="flex justify-between text-xs">
              <span className={getThemeTextColor('secondary')}>
                Total: {goal.members.length} members
              </span>
              <span className={getThemeTextColor('secondary')}>
                Progress: {Math.round((goal.members.filter(m => m.currentSeconds >= goal.goalSeconds).length / goal.members.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}