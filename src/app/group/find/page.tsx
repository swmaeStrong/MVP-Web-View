'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Avatar, AvatarFallback } from '@/shadcn/ui/avatar';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Input } from '@/shadcn/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';
import { Dialog, DialogContent, DialogHeader } from '@/shadcn/ui/dialog';
import { spacing } from '@/styles/design-system';
import { Calendar, Globe, Hash, Lock, Search, TrendingUp, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { searchGroups } from '@/shared/api/get';
import { Skeleton } from '@/shadcn/ui/skeleton';

export default function FindTeamPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');
  const [sortBy, setSortBy] = useState<'members' | 'created' | 'name'>('members');
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

  const filteredGroups = groups
    .filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (group.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (group.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) || false);
      
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
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
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="w-full">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${getThemeTextColor('secondary')}`} />
                <Input
                  type="text"
                  placeholder="Search groups by name, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:bg-gray-50 dark:border-gray-300 dark:text-gray-900"
                />
              </div>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Filter Buttons */}
              <div className="flex-1">
                <ToggleGroup type="single" value={filterType} onValueChange={(value) => value && setFilterType(value as 'all' | 'public' | 'private')} className="h-11 w-full bg-white border border-gray-200 rounded-md dark:bg-gray-50 dark:border-gray-300">
                  <ToggleGroupItem value="all" className="flex-1 px-3 bg-white text-gray-900 data-[state=on]:!bg-[#3F72AF] data-[state=on]:!text-white hover:bg-gray-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-100">
                    All
                  </ToggleGroupItem>
                  <ToggleGroupItem value="public" className="flex-1 gap-1 px-2 bg-white text-gray-900 data-[state=on]:!bg-[#3F72AF] data-[state=on]:!text-white hover:bg-gray-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-100">
                    <Globe className="h-3 w-3" />
                    Public
                  </ToggleGroupItem>
                  <ToggleGroupItem value="private" className="flex-1 gap-1 px-2 bg-white text-gray-900 data-[state=on]:!bg-[#3F72AF] data-[state=on]:!text-white hover:bg-gray-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-100">
                    <Lock className="h-3 w-3" />
                    Private
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Sort Dropdown */}
              <div className="sm:w-64">
                <Select value={sortBy} onValueChange={(value: 'members' | 'created' | 'name') => setSortBy(value)}>
                  <SelectTrigger className="h-11 bg-white border-gray-200 text-gray-900 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:bg-gray-50 dark:border-gray-300 dark:text-gray-900">
                    <SelectValue placeholder="Sort by..." className="text-gray-900" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="members">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Most Members
                      </div>
                    </SelectItem>
                    <SelectItem value="created">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Recently Created
                      </div>
                    </SelectItem>
                    <SelectItem value="name">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Name (A-Z)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className={getCommonCardClass()}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-12 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card key={group.groupId} className={`${getCommonCardClass()} hover:ring-2 hover:ring-[#3F72AF]/20 transition-all h-fit`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Group Header */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarFallback className={`text-lg font-bold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                        {group.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className={`text-lg font-bold ${getThemeTextColor('primary')} truncate`}>
                        {group.name}
                      </div>
                      
                      {/* Owner Info */}
                      <div className={`text-sm ${getThemeTextColor('secondary')}`}>
                        by @{group.groupOwner.nickname}
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  {group.description && (
                    <p className={`text-sm ${getThemeTextColor('secondary')} leading-relaxed line-clamp-2`}>
                      {group.description}
                    </p>
                  )}
                  
                  {/* Tags */}
                  {group.tags && group.tags.length > 0 && (
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
                  )}
                  
                  {/* Action Button */}
                  <Button
                    className="w-full bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90 transition-colors"
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
        <div className="col-span-full">
          <Card className={getCommonCardClass()}>
            <CardContent className={`${spacing.inner.normal} text-center py-12`}>
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
            </CardContent>
          </Card>
        </div>
      )}

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
                        <div className={`text-xl font-bold ${getThemeTextColor('primary')} mb-1`}>
                          {selectedGroup.name}
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
                    className="flex-1 bg-white border-gray-200 text-gray-900 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-50 dark:border-gray-300 dark:text-gray-900 dark:hover:bg-gray-100"
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