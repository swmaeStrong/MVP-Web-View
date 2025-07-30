'use client';

import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { Badge } from '@/shadcn/ui/badge';
import { Avatar, AvatarFallback } from '@/shadcn/ui/avatar';
import { Separator } from '@/shadcn/ui/separator';
import { spacing } from '@/styles/design-system';
import { Search, Users, Clock, Filter, TrendingUp, Calendar, Globe, Lock, Hash } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/shadcn/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';

export default function FindTeamPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');
  const [sortBy, setSortBy] = useState<'members' | 'created' | 'name'>('members');

  // Mock data for available teams
  const availableTeams = [
    {
      id: 1,
      name: 'Frontend Developers',
      description: 'React, Next.js, TypeScript enthusiasts',
      members: 12,
      isPublic: true,
      tags: ['React', 'TypeScript', 'Frontend'],
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      name: 'Backend Warriors',
      description: 'Node.js, Python, Database experts',
      members: 8,
      isPublic: true,
      tags: ['Node.js', 'Python', 'Backend'],
      createdAt: '2024-01-20',
    },
    {
      id: 3,
      name: 'DevOps Masters',
      description: 'Docker, Kubernetes, CI/CD specialists',
      members: 6,
      isPublic: false,
      tags: ['Docker', 'Kubernetes', 'DevOps'],
      createdAt: '2024-02-01',
    },
  ];

  const filteredTeams = availableTeams
    .filter(team => {
      const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = filterType === 'all' || 
        (filterType === 'public' && team.isPublic) ||
        (filterType === 'private' && !team.isPublic);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'members':
          return b.members - a.members;
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-4">
        <div className={`text-3xl font-bold ${getThemeTextColor('primary')}`}>
          Find Team
        </div>
        <p className={`text-lg ${getThemeTextColor('secondary')}`}>
          Discover and join teams that match your interests
        </p>
      </div>

      {/* Search and Filter Section */}
      <Card className={getCommonCardClass()}>
        <CardContent className="p-6">
          <div className="grid grid-cols-12 gap-4">
            {/* Search Bar */}
            <div className="col-span-12 lg:col-span-6">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${getThemeTextColor('secondary')}`} />
                <Input
                  type="text"
                  placeholder="Search by name, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 !bg-white !border-gray-200 !text-gray-900 placeholder:!text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:!bg-white dark:!text-gray-900"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="col-span-12 lg:col-span-3">
              <ToggleGroup type="single" value={filterType} onValueChange={(value) => value && setFilterType(value as 'all' | 'public' | 'private')} className="h-11 w-full !bg-white border border-gray-200 rounded-md">
                <ToggleGroupItem value="all" className="flex-1 px-3 !bg-white !text-gray-900 data-[state=on]:!bg-[#3F72AF] data-[state=on]:!text-white hover:!bg-gray-50">
                  All
                </ToggleGroupItem>
                <ToggleGroupItem value="public" className="flex-1 gap-1 px-2 !bg-white !text-gray-900 data-[state=on]:!bg-[#3F72AF] data-[state=on]:!text-white hover:!bg-gray-50">
                  <Globe className="h-3 w-3" />
                  Public
                </ToggleGroupItem>
                <ToggleGroupItem value="private" className="flex-1 gap-1 px-2 !bg-white !text-gray-900 data-[state=on]:!bg-[#3F72AF] data-[state=on]:!text-white hover:!bg-gray-50">
                  <Lock className="h-3 w-3" />
                  Private
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Sort Dropdown */}
            <div className="col-span-12 lg:col-span-3">
              <Select value={sortBy} onValueChange={(value: 'members' | 'created' | 'name') => setSortBy(value)}>
                <SelectTrigger className="h-11 !bg-white !border-gray-200 !text-gray-900 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:!bg-white dark:!border-gray-200 dark:!text-gray-900">
                  <SelectValue placeholder="Sort by..." className="!text-gray-900" />
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
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Card key={team.id} className={`${getCommonCardClass()} hover:ring-2 hover:ring-[#3F72AF]/20 transition-all h-fit`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Team Header */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarFallback className={`text-lg font-bold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                        {team.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`text-lg font-bold ${getThemeTextColor('primary')} truncate`}>
                          {team.name}
                        </div>
                        <Badge variant={team.isPublic ? "default" : "secondary"} className={`gap-1 flex-shrink-0 ${
                          team.isPublic 
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                        }`}>
                          {team.isPublic ? (
                            <>
                              <Globe className="h-3 w-3" />
                              Public
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3" />
                              Private
                            </>
                          )}
                        </Badge>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                            {team.members}
                          </div>
                          <div className={`text-xs ${getThemeTextColor('secondary')}`}>
                            members
                          </div>
                        </div>
                        <div className={`text-xs ${getThemeTextColor('secondary')}`}>
                          •
                        </div>
                        <div className={`text-xs ${getThemeTextColor('secondary')}`}>
                          {new Date(team.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className={`text-sm ${getThemeTextColor('secondary')} leading-relaxed line-clamp-2`}>
                    {team.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {team.tags.map((tag) => (
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
                  
                  {/* Action Button */}
                  <Button
                    className="w-full bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90 transition-colors"
                    size="sm"
                  >
                    {team.isPublic ? 'Join Team' : 'Request to Join'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

      {filteredTeams.length === 0 && (
        <div className="col-span-full">
          <Card className={getCommonCardClass()}>
            <CardContent className={`${spacing.inner.normal} text-center py-12`}>
              <div className={`w-20 h-20 rounded-full ${getThemeClass('componentSecondary')} flex items-center justify-center mx-auto mb-6`}>
                <Search className={`h-10 w-10 ${getThemeTextColor('secondary')}`} />
              </div>
              <div className={`text-xl font-bold mb-3 ${getThemeTextColor('primary')}`}>
                No teams found
              </div>
              <p className={`text-base ${getThemeTextColor('secondary')} mb-6 max-w-md mx-auto`}>
                We couldn't find any teams matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button className="bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90">
                Create New Team
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}