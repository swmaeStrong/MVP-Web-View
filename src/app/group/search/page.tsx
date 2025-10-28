'use client';

import { Globe, Hash, Lock, Search, Users } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import GroupDetailModal from '@/components/group/search/GroupDetailModal';
import GroupInviteModal from '@/components/group/search/GroupInviteModal';
import { useJoinGroup } from '@/hooks/group/useJoinGroup';
import { useJoinGroupByInvite } from '@/hooks/group/useJoinGroupByInvite';
import { useLastGroupTab } from '@/hooks/group/useLastGroupTab';
import { useNavigation } from '@/hooks/navigation/useNavigation';
import { useMyGroups } from '@/hooks/queries/useMyGroups';
import { useSearchGroups } from '@/hooks/queries/useSearchGroups';
import { useGroupSearch } from '@/hooks/ui/useGroupSearch';
import { useTheme } from '@/hooks/ui/useTheme';
import { useTranslation } from '@/providers/LanguageProvider';
import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Input } from '@/shadcn/ui/input';
import { Skeleton } from '@/shadcn/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';
import { getGroupByInviteCode } from '@/shared/api/get';
import { brandColors } from '@/styles/colors';

export default function FindTeamPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const { t, locale } = useTranslation();
  const { navigateWithParams } = useNavigation();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');

  // Save current tab as last visited
  useLastGroupTab();
  const [sortBy] = useState<'created' | 'name'>('name');

  // Read inviteCode query parameter and fetch group information
  useEffect(() => {
    const inviteCode = searchParams.get('inviteCode');
    if (inviteCode) {
      console.log('Invite Code from URL:', inviteCode);
      fetchInviteGroupInfo(inviteCode);
    }
  }, [searchParams]);

  const fetchInviteGroupInfo = async (inviteCode: string) => {
    setIsLoadingInvite(true);
    setInviteError('');
    setCurrentInviteCode(inviteCode);
    
    try {
      const groupInfo = await getGroupByInviteCode(inviteCode);
      setInviteGroup(groupInfo);
      setIsInviteModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch invite group info:', error);
      setInviteError(t('group.incorrectPassword'));
      setIsInviteModalOpen(true); // Show modal even on error to display error message
    } finally {
      setIsLoadingInvite(false);
    }
  };
  const [selectedGroup, setSelectedGroup] = useState<Group.GroupApiResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [joinError, setJoinError] = useState('');
  
  // Invite group states
  const [inviteGroup, setInviteGroup] = useState<Group.GroupApiResponse | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isLoadingInvite, setIsLoadingInvite] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [currentInviteCode, setCurrentInviteCode] = useState<string | null>(null);

  // Hooks for joining groups
  const joinGroupMutation = useJoinGroup({
    onSuccess: (group) => {
      handleCloseModal();
      navigateWithParams(`/group/${group.groupId}/detail`);
    },
    onError: () => {
      setJoinError(t('common.serverError'));
    }
  });

  const joinGroupByInviteMutation = useJoinGroupByInvite({
    onSuccess: () => {
      handleCloseInviteModal();
      if (inviteGroup) {
        navigateWithParams(`/group/${inviteGroup.groupId}/detail`);
      }
    },
    onError: () => {
      setInviteError(t('common.serverError'));
    }
  });

  // Fetch groups from API
  const { data: groups = [], isLoading } = useSearchGroups();
  const { data: myGroups = [] } = useMyGroups();

  // Use the custom group search hook with locale filtering
  const filteredGroups = useGroupSearch({
    groups,
    searchQuery,
    filterType,
    sortBy,
    locale,
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
    setJoinError('');
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    setInviteGroup(null);
    setInviteError('');
    setCurrentInviteCode(null);
    
    // Remove inviteCode from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('inviteCode');
    // URL에서 inviteCode 제거 (현재 쿼리 파라미터 유지)
    window.history.replaceState({}, '', url.pathname + url.search);
  };

  const handleJoinInviteGroup = async (inviteCode: string) => {
    setInviteError('');
    joinGroupByInviteMutation.mutate(inviteCode);
  };

  const handleJoinGroup = async (group: Group.GroupApiResponse, password: string) => {
    setJoinError('');
    joinGroupMutation.mutate({ group, password });
  };

  return (
    <div className="space-y-6 px-6 py-6 max-w-7xl mx-auto">
      {/* Event Banner */}
{/*      {/* <EventBanner /> */}

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
                  placeholder={t('group.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <ToggleGroup type="single" value={filterType} onValueChange={(value) => value && setFilterType(value as 'all' | 'public' | 'private')} className="h-10">
              <ToggleGroupItem value="all" className="px-4 h-10 text-sm bg-white border border-gray-200 text-gray-700 data-[state=on]:bg-[var(--main-color)] data-[state=on]:text-white data-[state=on]:border-[var(--main-color)] hover:bg-gray-50 rounded-l-md">
                {t('common.all')}
              </ToggleGroupItem>
              <ToggleGroupItem value="public" className="px-4 h-10 text-sm flex items-center gap-1.5 bg-white border-y border-r border-gray-200 text-gray-700 data-[state=on]:bg-[var(--main-color)] data-[state=on]:text-white data-[state=on]:border-[var(--main-color)] hover:bg-gray-50">
                <Globe className="h-3.5 w-3.5" />
                {t('group.public')}
              </ToggleGroupItem>
              <ToggleGroupItem value="private" className="px-4 h-10 text-sm flex items-center gap-1.5 bg-white border-y border-r border-gray-200 text-gray-700 data-[state=on]:bg-[var(--main-color)] data-[state=on]:text-white data-[state=on]:border-[var(--main-color)] hover:bg-gray-50 rounded-r-md">
                <Lock className="h-3.5 w-3.5" />
                {t('group.private')}
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
            <Card 
              key={group.groupId} 
              className={`${getCommonCardClass()} h-52 hover:bg-gray-50 dark:hover:bg-gray-800 group relative cursor-pointer transition-all duration-200 hover:shadow-lg`}
              onClick={() => {
                if (isGroupMember(group.groupId)) {
                  navigateWithParams(`/group/${group.groupId}/detail`);
                } else {
                  handleViewDetail(group);
                }
              }}
            >
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
                            {t('group.member')}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Owner Info and Member Count */}
                    <div className="flex items-center gap-3">
                      <div className={`text-sm ${getThemeTextColor('secondary')} truncate flex-1`}>
                        {t('group.owner')}: @{group.groupOwner.nickname}
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
                        {t('group.groupDescriptionPlaceholder')}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Centered Action Button - appears on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  {isGroupMember(group.groupId) ? (
                    <div className="bg-white dark:bg-gray-900 rounded-lg">
                      <Button
                        className="bg-green-600 text-white hover:bg-green-700 shadow-lg transition-colors"
                        size="default"
                      >
                        {t('group.alreadyJoinedGroup')}
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-lg">
                      <Button
                        className={`${brandColors.accent.bg} text-white ${brandColors.accent.hover}/90 transition-colors cursor-pointer shadow-lg`}
                        size="default"
                      >
                        {t('group.viewDetailInfo')}
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
                  {t('group.noGroupsFound')}
                </div>
                <p className={`text-base ${getThemeTextColor('secondary')} mb-6 max-w-md mx-auto`}>
                  {searchQuery.trim() ? t('group.noGroupsFound') : t('group.noDataAvailable')}
                </p>
                <Button 
                  className={`${brandColors.accent.bg} text-white ${brandColors.accent.hover}/90`}
                  onClick={() => navigateWithParams('/group/create')}
                >
                  {t('group.create')}
                </Button>
              </div>
            </div>
          )}
          </div>
        </CardContent>
      </Card>

      {/* Group Detail Modal */}
      <GroupDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        group={selectedGroup}
        isGroupMember={isGroupMember}
        onJoinGroup={handleJoinGroup}
        isJoining={joinGroupMutation.isPending}
        joinError={joinError}
      />

      {/* Group Invite Modal */}
      <GroupInviteModal
        isOpen={isInviteModalOpen}
        onClose={handleCloseInviteModal}
        inviteGroup={inviteGroup}
        isLoadingInvite={isLoadingInvite}
        inviteError={inviteError}
        isGroupMember={isGroupMember}
        onJoinInviteGroup={handleJoinInviteGroup}
        isJoining={joinGroupByInviteMutation.isPending}
        inviteCode={currentInviteCode}
      />
    </div>
  );
}