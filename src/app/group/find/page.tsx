'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Avatar, AvatarFallback } from '@/shadcn/ui/avatar';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Input } from '@/shadcn/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';
import { Dialog, DialogContent, DialogHeader } from '@/shadcn/ui/dialog';
import { spacing } from '@/styles/design-system';
import { Globe, Hash, Lock, Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { searchGroups } from '@/shared/api/get';
import { Skeleton } from '@/shadcn/ui/skeleton';
import { useGroupSearch } from '@/hooks/ui/useGroupSearch';

export default function FindTeamPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'name'>('name');
  const [selectedGroup, setSelectedGroup] = useState<Group.GroupApiResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  // Fetch groups from API
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['groups', 'search'],
    queryFn: searchGroups,
  });

  // Use the custom group search hook
  const filteredGroups = useGroupSearch({
    groups,
    searchQuery,
    filterType,
    sortBy,
  });

  const handleViewDetail = (group: Group.GroupApiResponse) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
    setInviteCode('');
    setJoinError('');
    setIsJoining(false);
  };

  const handleJoinGroup = async (group: Group.GroupApiResponse) => {
    setIsJoining(true);
    try {
      // TODO: Implement actual group join API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      handleCloseModal();
      router.push(`/group/team/${group.groupId}`);
    } catch (error) {
      console.error('Failed to join group:', error);
      setJoinError('그룹 가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="space-y-6 px-6 py-6 max-w-7xl mx-auto">
      {/* Search and Filter Section */}
      <Card className={getCommonCardClass()}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${getThemeTextColor('secondary')}`} />
                <Input
                  type="text"
                  placeholder="Search groups (fuzzy search enabled)..."
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
            <Card key={group.groupId} className={`${getCommonCardClass()} hover:ring-2 hover:ring-[#3F72AF]/20 transition-all h-52`}>
              <CardContent className="p-4 h-full">
                <div className="space-y-2 h-full flex flex-col">
                  {/* Group Header */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback className={`text-lg font-bold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                        {group.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className={`text-lg font-bold ${getThemeTextColor('primary')} truncate`}>
                          {group.name}
                        </div>
                        {group.isPublic ? (
                          <Globe className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <Lock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                        )}
                      </div>
                      
                      {/* Owner Info */}
                      <div className={`text-sm ${getThemeTextColor('secondary')}`}>
                        by @{group.groupOwner.nickname}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Container - grows to fill space */}
                  <div className="flex-1 space-y-2">
                    {/* Description */}
                    <div className="min-h-[1.5rem]">
                      {group.description ? (
                        <p className={`text-sm ${getThemeTextColor('secondary')} leading-snug line-clamp-1`}>
                          {group.description}
                        </p>
                      ) : (
                        <p className={`text-sm ${getThemeTextColor('secondary')} italic`}>
                          No description available
                        </p>
                      )}
                    </div>
                    
                    {/* Tags */}
                    <div>
                      {group.tags && group.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {group.tags.slice(0, 2).map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className={`gap-1 text-xs ${getThemeClass('border')} ${getThemeTextColor('secondary')}`}
                            >
                              <Hash className="h-3 w-3" />
                              {tag}
                            </Badge>
                          ))}
                          {group.tags.length > 2 && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getThemeClass('border')} ${getThemeTextColor('secondary')}`}
                            >
                              +{group.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  
                  {/* Action Button - fixed at bottom */}
                  <Button
                    className="w-full h-8 text-sm bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90 transition-colors mt-auto"
                    size="sm"
                    onClick={() => handleViewDetail(group)}
                  >
                    See in Detail
                  </Button>
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
                  We couldn't find any groups matching your search criteria. Try adjusting your search terms.
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
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className={`text-xl font-bold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                          {selectedGroup.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`text-xl font-bold ${getThemeTextColor('primary')}`}>
                            {selectedGroup.name}
                          </div>
                          {selectedGroup.isPublic ? (
                            <Globe className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <Lock className="h-5 w-5 text-orange-500 flex-shrink-0" />
                          )}
                        </div>
                        
                        <div className={`text-sm ${getThemeTextColor('secondary')}`}>
                          Created by @{selectedGroup.groupOwner.nickname}
                        </div>
                      </div>
                    </div>

                    {/* Group Description */}
                    {selectedGroup.description && (
                      <div className="mb-4">
                        <p className={`text-sm ${getThemeTextColor('secondary')} leading-relaxed`}>
                          {selectedGroup.description}
                        </p>
                      </div>
                    )}

                    {/* Group Owner */}
                    <div className="mb-4">
                      <div className={`text-sm font-medium ${getThemeTextColor('primary')} mb-2`}>
                        Group Owner
                      </div>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={`text-sm font-medium ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                            {selectedGroup.groupOwner.nickname.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                            {selectedGroup.groupOwner.nickname}
                          </div>
                          <div className={`text-xs ${getThemeTextColor('secondary')}`}>
                            ID: {selectedGroup.groupOwner.userId}
                          </div>
                        </div>
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
                  <Button
                    className="flex-1 bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90 transition-colors"
                    onClick={() => handleJoinGroup(selectedGroup)}
                    disabled={isJoining}
                  >
                    {isJoining ? 'Joining...' : 'Join Group'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}