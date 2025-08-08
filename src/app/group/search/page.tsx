'use client';

import { myGroupsQueryKey } from '@/config/constants/query-keys';
import { useLastGroupTab } from '@/hooks/group/useLastGroupTab';
import { useMyGroups } from '@/hooks/queries/useMyGroups';
import { useSearchGroups } from '@/hooks/queries/useSearchGroups';
import { useGroupSearch } from '@/hooks/ui/useGroupSearch';
import { useTheme } from '@/hooks/ui/useTheme';
import { useCurrentUserData } from '@/hooks/user/useCurrentUser';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Dialog, DialogContent, DialogHeader } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Skeleton } from '@/shadcn/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';
import { joinGroup } from '@/shared/api/post';
import { useQueryClient } from '@tanstack/react-query';
import { Globe, Hash, Lock, Search, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function FindTeamPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const router = useRouter();
  const currentUser = useCurrentUserData();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');
  
  // Save current tab as last visited
  useLastGroupTab();
  const [sortBy, setSortBy] = useState<'created' | 'name'>('name');
  const [selectedGroup, setSelectedGroup] = useState<Group.GroupApiResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  // Fetch groups from API
  const { data: groups = [], isLoading } = useSearchGroups();
  const { data: myGroups = [] } = useMyGroups();

  // Use the custom group search hook
  const filteredGroups = useGroupSearch({
    groups,
    searchQuery,
    filterType,
    sortBy,
  });

  // Helper function to check if user is member of a group
  const isGroupMember = (groupId: number) => {
    return myGroups.some(group => group.groupId === groupId);
  };

  const handleViewDetail = (group: Group.GroupApiResponse) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
    setPassword('');
    setJoinError('');
    setIsJoining(false);
  };

  const handleJoinGroup = async (group: Group.GroupApiResponse) => {
    setIsJoining(true);
    setJoinError('');
    
    try {
      // public 그룹이면 password를 null로, private 그룹이면 입력된 password 사용
      const request: Group.JoinGroupApiRequest = {
        password: group.isPublic ? null : password || null
      };
      
      await joinGroup(group.groupId, request);
      
      // 성공 시 내 그룹 목록 다시 불러오기
      await queryClient.invalidateQueries({
        queryKey: myGroupsQueryKey(),
      });
      
      toast.success('Successfully joined the group!');
      handleCloseModal();
      router.push(`/group/${group.groupId}/detail`);
    } catch (error) {
      console.error('Failed to join group:', error);
      setJoinError('Failed to join the group. Please try again.');
      toast.error('Failed to join the group.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="space-y-6 px-6 py-6 max-w-7xl mx-auto">
      {/* Event Banner */}
      {/* <EventBanner /> */}

      {/* Search and Filter Section */}
      <Card className={`${getCommonCardClass()} py-0`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${getThemeTextColor('secondary')}`} />
                <Input
                  type="text"
                  placeholder="Search groups (by name, description, tags, or group leader's nickname)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF]"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <ToggleGroup type="single" value={filterType} onValueChange={(value) => value && setFilterType(value as 'all' | 'public' | 'private')} className="h-10">
              <ToggleGroupItem value="all" className="px-4 h-10 text-sm bg-white border border-gray-200 text-gray-700 data-[state=on]:bg-[#3F72AF] data-[state=on]:text-white data-[state=on]:border-[#3F72AF] hover:bg-gray-50 rounded-l-md">
                All
              </ToggleGroupItem>
              <ToggleGroupItem value="public" className="px-4 h-10 text-sm flex items-center gap-1.5 bg-white border-y border-r border-gray-200 text-gray-700 data-[state=on]:bg-[#3F72AF] data-[state=on]:text-white data-[state=on]:border-[#3F72AF] hover:bg-gray-50">
                <Globe className="h-3.5 w-3.5" />
                Public
              </ToggleGroupItem>
              <ToggleGroupItem value="private" className="px-4 h-10 text-sm flex items-center gap-1.5 bg-white border-y border-r border-gray-200 text-gray-700 data-[state=on]:bg-[#3F72AF] data-[state=on]:text-white data-[state=on]:border-[#3F72AF] hover:bg-gray-50 rounded-r-md">
                <Lock className="h-3.5 w-3.5" />
                Private
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>

      {/* Results Container with Fixed Height */}
      <Card className={`${getCommonCardClass()} h-[780px] overflow-hidden`}>
        <CardContent className="p-4 h-full">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(9)].map((_, index) => (
            <Card key={index} className={`${getCommonCardClass()} h-52`}>
              <CardContent className="p-4 h-full">
                <div className="space-y-2 h-full flex flex-col">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="min-h-[1.5rem]">
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="flex gap-1.5">
                      <Skeleton className="h-5 w-14" />
                      <Skeleton className="h-5 w-14" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-full mt-auto" />
                </div>
              </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGroups.map((group) => (
            <Card key={group.groupId} className={`${getCommonCardClass()} h-52 hover:bg-gray-50 dark:hover:bg-gray-800 group relative`}>
              <CardContent className="px-4 h-full">
                <div className="h-full flex flex-col gap-3">
                  {/* Group Header */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className={`text-xl font-bold ${getThemeTextColor('primary')} truncate flex-1 min-w-0`}>
                        {group.name}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {group.isPublic ? (
                          <Globe className="h-5 w-5 text-green-500" />
                        ) : (
                          <Lock className="h-5 w-5 text-orange-500" />
                        )}
                        {isGroupMember(group.groupId) && (
                          <Badge 
                            variant="outline" 
                            className="text-xs bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 whitespace-nowrap"
                          >
                            Joined
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Owner Info and Member Count */}
                    <div className="flex items-center gap-3">
                      <div className={`text-sm ${getThemeTextColor('secondary')} truncate flex-1`}>
                        Created by @{group.groupOwner.nickname}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Users className={`h-4 w-4 ${getThemeTextColor('secondary')}`} />
                        <span className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                          {group.memberCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tags - max 2 lines */}
                  {group.tags && group.tags.length > 0 && (
                    <div className="flex-shrink-0">
                      <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
                        {group.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className={`gap-1 text-xs ${getThemeClass('border')} ${getThemeTextColor('secondary')} whitespace-nowrap`}
                          >
                            <Hash className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate max-w-16">{tag}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Description - 2 lines max with ellipsis */}
                  <div className="flex-1 min-h-0">
                    {group.description ? (
                      <p className={`text-sm ${getThemeTextColor('secondary')} leading-relaxed overflow-hidden line-clamp-2 whitespace-pre-wrap`}>
                        {group.description}
                      </p>
                    ) : (
                      <p className={`text-sm ${getThemeTextColor('secondary')} italic`}>
                        No description available
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Centered Action Button - appears on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {isGroupMember(group.groupId) ? (
                    <div className="bg-white dark:bg-gray-900 rounded-lg">
                      <Button
                        className="bg-gray-600 text-white cursor-not-allowed shadow-lg hover:bg-gray-600"
                        size="default"
                        disabled
                      >
                        Already Joined
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-lg">
                      <Button
                        className="bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90 transition-colors cursor-pointer shadow-lg"
                        size="default"
                        onClick={() => handleViewDetail(group)}
                      >
                        See in Detail
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && filteredGroups.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full ${getThemeClass('componentSecondary')} flex items-center justify-center mx-auto mb-6`}>
                  <Search className={`h-10 w-10 ${getThemeTextColor('secondary')}`} />
                </div>
                <div className={`text-xl font-bold mb-3 ${getThemeTextColor('primary')}`}>
                  No groups found
                </div>
                <p className={`text-base ${getThemeTextColor('secondary')} mb-6 max-w-md mx-auto`}>
                  {searchQuery.trim() ? 'We couldn\'t find any groups matching your search criteria. Try adjusting your search terms.' : 'No groups available at the moment.'}
                </p>
                <Button 
                  className="bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90"
                  onClick={() => router.push('/group/create')}
                >
                  Create New Group
                </Button>
              </div>
            </div>
          )}
          </div>
        </CardContent>
      </Card>

      {/* Group Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={`max-w-2xl ${getCommonCardClass()}`}>
          {selectedGroup && (
            <>
              <DialogHeader className="pb-4">
                <div className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
                  Group Details
                </div>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Group Header */}
                <Card className={getCommonCardClass()}>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
                          {selectedGroup.name}
                        </div>
                        {selectedGroup.isPublic ? (
                          <Globe className="h-6 w-6 text-green-500 flex-shrink-0" />
                        ) : (
                          <Lock className="h-6 w-6 text-orange-500 flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className={`text-sm ${getThemeTextColor('secondary')}`}>
                        Created by @{selectedGroup.groupOwner.nickname}
                      </div>
                    </div>

                    {/* Group Description */}
                    {selectedGroup.description && (
                      <div className="mb-4">
                        <p className={`text-sm ${getThemeTextColor('secondary')} leading-relaxed whitespace-pre-wrap`}>
                          {selectedGroup.description}
                        </p>
                      </div>
                    )}

                    {/* Group Owner */}
                    <div className="mb-4">
                      <div className={`text-sm font-medium ${getThemeTextColor('primary')} mb-2`}>
                        Group Owner
                      </div>
                      <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                        @{selectedGroup.groupOwner.nickname}
                      </div>
                    </div>

                    {/* Tags */}
                    {selectedGroup.tags && selectedGroup.tags.length > 0 && (
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {selectedGroup.tags.map((tag) => (
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
                {!selectedGroup.isPublic && !isGroupMember(selectedGroup.groupId) && (
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
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF]"
                      onPaste={(e) => {
                        // 복붙 명시적 허용
                        e.stopPropagation();
                        // 기본 동작 유지하여 브라우저가 자동으로 처리하도록 함
                      }}
                      onContextMenu={(e) => {
                        // 우클릭 메뉴 허용 (복사/붙여넣기 등)
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
                    onClick={handleCloseModal}
                    disabled={isJoining}
                  >
                    Cancel
                  </Button>
                  {!isGroupMember(selectedGroup.groupId) ? (
                    <Button
                      className="flex-1 bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90 transition-colors"
                      onClick={() => handleJoinGroup(selectedGroup)}
                      disabled={isJoining || (!selectedGroup.isPublic && !password)}
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}