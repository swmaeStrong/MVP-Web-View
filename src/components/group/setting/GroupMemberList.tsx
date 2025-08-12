'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Avatar, AvatarFallback } from '@/shadcn/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Crown, Users } from 'lucide-react';
import { useMemo } from 'react';

interface GroupMemberListProps {
  owner: Group.GroupUserInfo;
  members: Group.GroupMemberInfo[];
  currentUserId?: string;
  description?: string;
  groundRule?: string;
  tags?: string[];
}

export default function GroupMemberList({
  owner,
  members,
  currentUserId,
  description,
  groundRule,
  tags
}: GroupMemberListProps) {
  const { getThemeTextColor, getCommonCardClass, getThemeClass } = useTheme();

  // 오너를 제외한 일반 멤버들
  const regularMembers = useMemo(() => 
    members.filter(member => member.userId !== owner.userId), 
    [members, owner.userId]
  );

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* 그룹 정보 */}
      <Card className={getCommonCardClass()}>
        <CardHeader>
          <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
            Group Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {description && (
            <div>
              <div className={`text-sm font-medium ${getThemeTextColor('secondary')} mb-1`}>
                Description
              </div>
              <p className={`text-sm ${getThemeTextColor('primary')}`}>
                {description}
              </p>
            </div>
          )}
          
          {groundRule && (
            <div>
              <div className={`text-sm font-medium ${getThemeTextColor('secondary')} mb-2`}>
                Ground Rules
              </div>
              <div className="space-y-1">
                {groundRule.split('\n').filter(rule => rule.trim().length > 0).map((rule, index) => (
                  <div key={index} className={`flex items-start gap-2 text-sm ${getThemeTextColor('primary')}`}>
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>{rule.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tags && tags.length > 0 && (
            <div>
              <div className={`text-sm font-medium ${getThemeTextColor('secondary')} mb-2`}>
                Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span 
                    key={tag} 
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getThemeClass('componentSecondary')}`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 멤버 목록 */}
      <Card className={`${getCommonCardClass()}`}>
        <CardHeader>
          <CardTitle className={`text-lg ${getThemeTextColor('primary')}`}>
            Group Members ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {/* 그룹장 */}
            <div className={`flex items-center justify-between p-3 rounded-lg ${
              currentUserId && owner.userId === currentUserId
                ? 'bg-gray-50 dark:bg-gray-800'
                : ''
            }`}>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className={`text-sm font-semibold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                    {owner.nickname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                    {owner.nickname}
                  </div>
                  <div className={`text-xs ${getThemeTextColor('secondary')}`}>
                    Group Owner
                  </div>
                </div>
              </div>
              <Crown className="h-5 w-5 text-amber-500" />
            </div>
            
            {/* 일반 멤버 */}
            {regularMembers.map((member) => {
              const isCurrentUser = currentUserId && member.userId === currentUserId;
              
              return (
                <div key={member.userId} className={`flex items-center justify-between p-3 rounded-lg ${
                  isCurrentUser
                    ? 'bg-gray-50 dark:bg-gray-800'
                    : ''
                }`}>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      {member.profileImageUrl ? (
                        <img src={member.profileImageUrl} alt={member.nickname} className="w-full h-full object-cover" />
                      ) : (
                        <AvatarFallback className={`text-sm font-semibold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
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
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}