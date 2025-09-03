'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { brandColors } from '@/styles/colors';
import { Globe, Hash, Lock } from 'lucide-react';
import { useState } from 'react';

interface GroupDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group.GroupApiResponse | null;
  isGroupMember: (groupId: number) => boolean;
  onJoinGroup: (group: Group.GroupApiResponse, password: string) => Promise<void>;
  isJoining: boolean;
  joinError: string;
}

export default function GroupDetailModal({
  isOpen,
  onClose,
  group,
  isGroupMember,
  onJoinGroup,
  isJoining,
  joinError
}: GroupDetailModalProps) {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const [password, setPassword] = useState('');

  const handleClose = () => {
    setPassword('');
    onClose();
  };

  const handleJoin = async () => {
    if (!group) return;
    await onJoinGroup(group, password);
  };

  if (!group) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`max-w-2xl ${getCommonCardClass()}`} onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="pb-4">
          <DialogTitle className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
            Group Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Group Header */}
          <Card className={getCommonCardClass()}>
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
                    {group.name}
                  </div>
                  {group.isPublic ? (
                    <Globe className="h-6 w-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <Lock className="h-6 w-6 text-orange-500 flex-shrink-0" />
                  )}
                </div>
                
                <div className={`text-sm ${getThemeTextColor('secondary')}`}>
                  Created by @{group.groupOwner.nickname}
                </div>
              </div>

              {/* Group Description */}
              {group.description && (
                <div className="mb-4">
                  <p className={`text-sm ${getThemeTextColor('secondary')} leading-relaxed whitespace-pre-wrap`}>
                    {group.description}
                  </p>
                </div>
              )}

              {/* Group Owner */}
              <div className="mb-4">
                <div className={`text-sm font-medium ${getThemeTextColor('primary')} mb-2`}>
                  Group Owner
                </div>
                <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                  @{group.groupOwner.nickname}
                </div>
              </div>

              {/* Tags */}
              {group.tags && group.tags.length > 0 && (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag) => (
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
          
          {/* Password Input for Private Groups */}
          {!group.isPublic && !isGroupMember(group.groupId) && (
            <div className="space-y-2">
              <label htmlFor="password" className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                Password required for private group
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter group password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isJoining}
                className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 ${brandColors.accent.ring} ${brandColors.accent.border}"
                onPaste={(e) => {
                  e.stopPropagation();
                }}
                onContextMenu={(e) => {
                  e.stopPropagation();
                }}
                style={{ 
                  WebkitUserSelect: 'text', 
                  userSelect: 'text' 
                }}
                autoComplete="current-password"
              />
            </div>
          )}
          
          {/* Error Message */}
          {joinError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{joinError}</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 bg-white border-gray-200 text-gray-900 hover:bg-gray-50 disabled:opacity-50"
              onClick={handleClose}
              disabled={isJoining}
            >
              Cancel
            </Button>
            {!isGroupMember(group.groupId) ? (
              <Button
                className={`flex-1 ${brandColors.accent.bg} text-white ${brandColors.accent.hover}/90 transition-colors`}
                onClick={handleJoin}
                disabled={isJoining || (!group.isPublic && !password)}
              >
                {isJoining ? 'Joining...' : 'Join Group'}
              </Button>
            ) : (
              <Button
                className="flex-1 bg-gray-400 text-white cursor-not-allowed"
                disabled
              >
                Already Joined
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}