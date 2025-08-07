'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Avatar, AvatarFallback } from '@/shadcn/ui/avatar';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shadcn/ui/dropdown-menu';
import { Crown, MoreVertical } from 'lucide-react';

interface GroupMemberManagementProps {
  owner: Group.GroupUserInfo;
  members: Group.GroupMemberInfo[];
  currentUserId?: string;
  onTransferOwnership: (member: Group.GroupMemberInfo) => void;
  onBanMember: (member: Group.GroupMemberInfo) => void;
}

export default function GroupMemberManagement({
  owner,
  members,
  currentUserId,
  onTransferOwnership,
  onBanMember
}: GroupMemberManagementProps) {
  const { getThemeTextColor, getCommonCardClass, getThemeClass } = useTheme();

  return (
    <Card className={getCommonCardClass()}>
      <CardHeader>
        <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
          Member Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* 그룹장 */}
          <div className={`flex items-center justify-between p-2 rounded-lg ${
            currentUserId && owner.userId === currentUserId
              ? 'bg-gray-50 dark:bg-gray-800'
              : ''
          }`}>
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className={`text-xs font-semibold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                  {owner.nickname.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                  {owner.nickname}
                </div>
                <div className={`text-xs ${getThemeTextColor('secondary')}`}>
                  Owner
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="h-8 w-8 flex items-center justify-center">
                <Crown className="h-4 w-4 text-amber-500" />
              </div>
            </div>
          </div>
          
          {/* 일반 멤버 */}
          {members.filter(member => member.userId !== owner.userId).map((member) => {
            const isCurrentUser = currentUserId && member.userId === currentUserId;
            
            return (
              <div key={member.userId} className={`flex items-center justify-between p-2 rounded-lg ${
                isCurrentUser
                  ? 'bg-gray-50 dark:bg-gray-800'
                  : ''
              }`}>
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    {member.profileImageUrl ? (
                      <img src={member.profileImageUrl} alt={member.nickname} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <AvatarFallback className={`text-xs font-semibold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                        {member.nickname.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                      {member.nickname}
                    </div>
                    <div className={`text-xs ${getThemeTextColor('secondary')}`}>
                      Member
                    </div>
                  </div>
                </div>
              
                <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-600 hover:text-gray-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onTransferOwnership(member)}
                      >
                        Transfer Ownership
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-700 cursor-pointer"
                        onClick={() => onBanMember(member)}
                      >
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}