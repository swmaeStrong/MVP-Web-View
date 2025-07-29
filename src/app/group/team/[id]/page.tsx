'use client';

import { useTheme } from '@/hooks/useTheme';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { spacing } from '@/styles/design-system';
import { Users, Activity, Trophy, Calendar, Settings } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function TeamDetailPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const params = useParams();
  const teamId = params.id;

  // Mock team data - would come from API
  const teamData = {
    id: teamId,
    name: teamId === '1' ? 'Team Alpha' : teamId === '2' ? 'Team Beta' : 'Team Gamma',
    description: 'A productive development team focused on React and TypeScript projects',
    members: [
      { id: 1, name: 'John Doe', role: 'Lead Developer', avatar: 'JD', online: true, weeklyHours: 32 },
      { id: 2, name: 'Jane Smith', role: 'Frontend Developer', avatar: 'JS', online: false, weeklyHours: 28 },
      { id: 3, name: 'Mike Johnson', role: 'Backend Developer', avatar: 'MJ', online: true, weeklyHours: 35 },
      { id: 4, name: 'Sarah Wilson', role: 'UI/UX Designer', avatar: 'SW', online: true, weeklyHours: 30 },
      { id: 5, name: 'Tom Brown', role: 'DevOps Engineer', avatar: 'TB', online: false, weeklyHours: 25 },
    ],
    stats: {
      totalHours: 150,
      averageScore: 85,
      activeSessions: 3,
      weeklyGoal: 200,
    },
    recentActivity: [
      { user: 'John Doe', action: 'completed a coding session', time: '5 minutes ago', score: 92 },
      { user: 'Sarah Wilson', action: 'joined a meeting', time: '15 minutes ago', score: null },
      { user: 'Mike Johnson', action: 'finished debugging task', time: '1 hour ago', score: 88 },
      { user: 'Jane Smith', action: 'updated project documentation', time: '2 hours ago', score: 78 },
    ]
  };

  const progressPercentage = (teamData.stats.totalHours / teamData.stats.weeklyGoal) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${getThemeTextColor('primary')}`}>
            {teamData.name}
          </h1>
          <p className={`text-lg ${getThemeTextColor('secondary')}`}>
            {teamData.description}
          </p>
        </div>
        <Settings className={`h-6 w-6 ${getThemeTextColor('secondary')} cursor-pointer hover:${getThemeTextColor('primary')} transition-colors`} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={getCommonCardClass()}>
          <CardContent className={spacing.inner.normal}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${getThemeTextColor('secondary')}`}>
                  Weekly Hours
                </p>
                <p className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
                  {teamData.stats.totalHours}h
                </p>
                <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2`}>
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
                <p className={`text-xs mt-1 ${getThemeTextColor('secondary')}`}>
                  Goal: {teamData.stats.weeklyGoal}h
                </p>
              </div>
              <Activity className={`h-8 w-8 ${getThemeTextColor('secondary')}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={getCommonCardClass()}>
          <CardContent className={spacing.inner.normal}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${getThemeTextColor('secondary')}`}>
                  Average Score
                </p>
                <p className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
                  {teamData.stats.averageScore}
                </p>
                <p className={`text-xs mt-1 text-green-500`}>
                  +3 from last week
                </p>
              </div>
              <Trophy className={`h-8 w-8 ${getThemeTextColor('secondary')}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={getCommonCardClass()}>
          <CardContent className={spacing.inner.normal}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${getThemeTextColor('secondary')}`}>
                  Active Members
                </p>
                <p className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
                  {teamData.members.filter(m => m.online).length}/{teamData.members.length}
                </p>
                <p className={`text-xs mt-1 ${getThemeTextColor('secondary')}`}>
                  Currently online
                </p>
              </div>
              <Users className={`h-8 w-8 ${getThemeTextColor('secondary')}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={getCommonCardClass()}>
          <CardContent className={spacing.inner.normal}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${getThemeTextColor('secondary')}`}>
                  Active Sessions
                </p>
                <p className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
                  {teamData.stats.activeSessions}
                </p>
                <p className={`text-xs mt-1 ${getThemeTextColor('secondary')}`}>
                  Running now
                </p>
              </div>
              <Calendar className={`h-8 w-8 ${getThemeTextColor('secondary')}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Members */}
        <Card className={getCommonCardClass()}>
          <CardHeader>
            <h3 className={`text-lg font-semibold ${getThemeTextColor('primary')}`}>
              Team Members
            </h3>
          </CardHeader>
          <CardContent className={spacing.inner.normal}>
            <div className="space-y-4">
              {teamData.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full ${getThemeClass('componentSecondary')} flex items-center justify-center`}>
                        <span className={`text-sm font-semibold ${getThemeTextColor('primary')}`}>
                          {member.avatar}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${getThemeClass('component')} ${
                        member.online ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                        {member.name}
                      </p>
                      <p className={`text-xs ${getThemeTextColor('secondary')}`}>
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${getThemeTextColor('primary')}`}>
                      {member.weeklyHours}h
                    </p>
                    <p className={`text-xs ${getThemeTextColor('secondary')}`}>
                      this week
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className={getCommonCardClass()}>
          <CardHeader>
            <h3 className={`text-lg font-semibold ${getThemeTextColor('primary')}`}>
              Recent Activity
            </h3>
          </CardHeader>
          <CardContent className={spacing.inner.normal}>
            <div className="space-y-4">
              {teamData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.score ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className={`text-sm ${getThemeTextColor('primary')}`}>
                      <span className="font-medium">{activity.user}</span> {activity.action}
                      {activity.score && (
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                          activity.score >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          activity.score >= 80 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        }`}>
                          Score: {activity.score}
                        </span>
                      )}
                    </p>
                    <p className={`text-xs ${getThemeTextColor('secondary')}`}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}