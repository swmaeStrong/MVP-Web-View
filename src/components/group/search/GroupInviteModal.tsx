'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Skeleton } from '@/shadcn/ui/skeleton';
import { brandColors } from '@/styles/colors';
import { Globe, Hash, Lock, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GroupInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteGroup: Group.GroupApiResponse | null;
  isLoadingInvite: boolean;
  inviteError: string;
  isGroupMember: (groupId: number) => boolean;
  onJoinInviteGroup: (inviteCode: string) => Promise<void>;
  isJoining: boolean;
  inviteCode: string | null;
}

export default function GroupInviteModal({
  isOpen,
  onClose,
  inviteGroup,
  isLoadingInvite,
  inviteError,
  isGroupMember,
  onJoinInviteGroup,
  isJoining,
  inviteCode
}: GroupInviteModalProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const router = useRouter();

  const handleJoin = async () => {
    if (!inviteCode) return;
    await onJoinInviteGroup(inviteCode);
  };

  const handleGoToGroup = () => {
    if (!inviteGroup) return;
    onClose();
    router.push(`/group/${inviteGroup.groupId}/detail`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl ${getCommonCardClass()}`} onOpenAutoFocus={(e) => e.preventDefault()}>
        {isLoadingInvite ? (
          <>
            <DialogHeader className="pb-4">
              <DialogTitle className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
                Loading Invitation...
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Card className={getCommonCardClass()}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : inviteError ? (
          <>
            <DialogHeader className="pb-4">
              <DialogTitle className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
                Invitation Error
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400">{inviteError}</p>
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
                >
                  Close
                </Button>
              </div>
            </div>
          </>
        ) : inviteGroup ? (
          <>
            <DialogHeader className="pb-4">
              <DialogTitle className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
                You're Invited to Join
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Group Header */}
              <Card className={getCommonCardClass()}>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
                        {inviteGroup.name}
                      </div>
                      {inviteGroup.isPublic ? (
                        <Globe className="h-6 w-6 text-green-500 flex-shrink-0" />
                      ) : (
                        <Lock className="h-6 w-6 text-orange-500 flex-shrink-0" />
                      )}
                      {isGroupMember(inviteGroup.groupId) && (
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                        >
                          Already Joined
                        </Badge>
                      )}
                    </div>
                    
                    <div className={`text-sm ${getThemeTextColor('secondary')}`}>
                      Created by @{inviteGroup.groupOwner.nickname}
                    </div>
                  </div>

                  {/* Group Description */}
                  {inviteGroup.description && (
                    <div className="mb-4">
                      <p className={`text-sm ${getThemeTextColor('secondary')} leading-relaxed whitespace-pre-wrap line-clamp-3`}>
                        {inviteGroup.description}
                      </p>
                    </div>
                  )}

                  {/* Group Owner */}
                  <div className="mb-4">
                    <div className={`text-sm font-medium ${getThemeTextColor('primary')} mb-2`}>
                      Group Owner
                    </div>
                    <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                      @{inviteGroup.groupOwner.nickname}
                    </div>
                  </div>

                  {/* Tags */}
                  {inviteGroup.tags && inviteGroup.tags.length > 0 && (
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {inviteGroup.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className={`gap-1 text-xs ${getThemeClass('border')} ${getThemeTextColor('secondary')}`}
                          >
                            <Hash className="h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Error Message */}
              {inviteError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">{inviteError}</p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-white border-gray-200 text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                  onClick={onClose}
                  disabled={isJoining}
                >
                  Cancel
                </Button>
                {!isGroupMember(inviteGroup.groupId) ? (
                  <Button
                    className={`flex-1 ${brandColors.accent.bg} text-white ${brandColors.accent.hover}/90 transition-colors`}
                    onClick={handleJoin}
                    disabled={isJoining}
                  >
                    {isJoining ? 'Joining...' : 'Join Group'}
                  </Button>
                ) : (
                  <Button
                    className={`flex-1 bg-green-600 text-white hover:bg-green-700 transition-colors`}
                    onClick={handleGoToGroup}
                    disabled={isJoining}
                  >
                    Go to Group
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}