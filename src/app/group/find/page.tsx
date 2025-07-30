'use client';

import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { spacing } from '@/styles/design-system';
import { Search, Users, Clock } from 'lucide-react';
import { useState } from 'react';

export default function FindTeamPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredTeams = availableTeams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${getThemeTextColor('primary')}`}>
          Find Team
        </h1>
        <p className={`text-lg ${getThemeTextColor('secondary')}`}>
          Discover and join teams that match your interests
        </p>
      </div>

      {/* Search Bar */}
      <Card className={getCommonCardClass()}>
        <CardContent className={spacing.inner.normal}>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${getThemeTextColor('secondary')}`} />
            <input
              type="text"
              placeholder="Search teams by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-md border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} placeholder:${getThemeTextColor('secondary')} focus:outline-none focus:ring-2 focus:ring-[#3F72AF]`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <h2 className={`text-xl font-semibold ${getThemeTextColor('primary')}`}>
          Available Teams ({filteredTeams.length})
        </h2>
        
        <div className="grid gap-4">
          {filteredTeams.map((team) => (
            <Card key={team.id} className={getCommonCardClass()}>
              <CardContent className={spacing.inner.normal}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-semibold ${getThemeTextColor('primary')}`}>
                        {team.name}
                      </h3>
                      <div className={`px-2 py-1 rounded text-xs ${
                        team.isPublic 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {team.isPublic ? 'Public' : 'Private'}
                      </div>
                    </div>
                    
                    <p className={`text-sm ${getThemeTextColor('secondary')} mb-3`}>
                      {team.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className={`h-4 w-4 ${getThemeTextColor('secondary')}`} />
                        <span className={`text-sm ${getThemeTextColor('secondary')}`}>
                          {team.members} members
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className={`h-4 w-4 ${getThemeTextColor('secondary')}`} />
                        <span className={`text-sm ${getThemeTextColor('secondary')}`}>
                          Created {new Date(team.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {team.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 rounded text-xs ${getThemeClass('componentSecondary')} ${getThemeTextColor('secondary')}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <Button
                      className={`${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')} hover:${getThemeClass('component')} transition-colors`}
                    >
                      {team.isPublic ? 'Join Team' : 'Request to Join'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTeams.length === 0 && (
          <Card className={getCommonCardClass()}>
            <CardContent className={`${spacing.inner.normal} text-center`}>
              <Search className={`h-12 w-12 mx-auto mb-4 ${getThemeTextColor('secondary')}`} />
              <h3 className={`text-lg font-semibold mb-2 ${getThemeTextColor('primary')}`}>
                No teams found
              </h3>
              <p className={`${getThemeTextColor('secondary')}`}>
                Try adjusting your search criteria or create a new team
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}