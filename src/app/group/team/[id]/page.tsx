'use client';

import { useTheme } from '@/hooks/useTheme';
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/ui/avatar';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { spacing } from '@/styles/design-system';
import { Trophy, Target, Edit } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function TeamDetailPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const params = useParams();
  const teamId = params.id;

  const [todayGoal, setTodayGoal] = useState('Complete React refactoring task');
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  // Mock team data - would come from API
  const teamData = {
    id: teamId,
    name: teamId === '1' ? 'Team Alpha' : teamId === '2' ? 'Team Beta' : 'Team Gamma',
    leader: { name: 'John Doe', avatar: 'JD' },
    leaderboard: [
      { rank: 1, name: 'John Doe', score: 95, hours: 32 },
      { rank: 2, name: 'Sarah Wilson', score: 88, hours: 30 },
      { rank: 3, name: 'Mike Johnson', score: 85, hours: 35 },
      { rank: 4, name: 'Jane Smith', score: 82, hours: 28 },
      { rank: 5, name: 'Tom Brown', score: 78, hours: 25 },
      { rank: 6, name: 'Alice Kim', score: 75, hours: 22 },
    ],
    groundRules: [
      'Daily standup at 9:00 AM',
      'Code reviews within 24 hours',
      'No meetings on Fridays',
      'Use proper commit messages',
      'Test coverage above 80%'
    ]
  };

  const handleGoalSave = () => {
    setIsEditingGoal(false);
    // Save goal logic here
  };

  return (
    <div className="h-full grid grid-cols-5 gap-6 p-6" style={{ gridTemplateRows: '1fr 2fr' }}>
      {/* 좌측 최상단 - 그룹 이름 및 팀장 정보 (3/5) */}
      <Card className={`${getCommonCardClass()} col-span-3 row-span-1`}>
        <CardContent className={spacing.inner.normal}>
          <div className="text-center space-y-4">
            <h1 className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
              {teamData.name}
            </h1>
            
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="w-16 h-16">
                <AvatarImage src="" />
                <AvatarFallback className={`text-lg font-semibold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                  {teamData.leader.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className={`font-medium ${getThemeTextColor('primary')}`}>
                  {teamData.leader.name}
                </p>
                <p className={`text-sm ${getThemeTextColor('secondary')}`}>
                  Team Leader
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 우측 상단 - 그라운드 룰 (2/5) */}
      <Card className={`${getCommonCardClass()} col-span-2 row-span-1`}>
        <CardHeader>
          <h3 className={`text-lg font-semibold ${getThemeTextColor('primary')}`}>
            Ground Rules
          </h3>
        </CardHeader>
        <CardContent className={spacing.inner.normal}>
          <div className="space-y-3">
            {teamData.groundRules.map((rule, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <span className={`text-sm ${getThemeTextColor('secondary')}`}>
                  {rule}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 좌측 하단 - 리더보드 (3/5) */}
      <Card className={`${getCommonCardClass()} col-span-3 row-span-1`}>
        <CardHeader>
          <h3 className={`text-lg font-semibold ${getThemeTextColor('primary')} flex items-center gap-2`}>
            <Trophy className="h-5 w-5" />
            Leaderboard
          </h3>
        </CardHeader>
        <CardContent className={spacing.inner.normal}>
          <div className="space-y-3">
            {teamData.leaderboard.map((member) => (
              <div key={member.rank} className={`flex items-center justify-between p-2 rounded-md ${getThemeClass('componentSecondary')}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    member.rank === 1 ? 'bg-yellow-500 text-black' :
                    member.rank === 2 ? 'bg-gray-400 text-white' :
                    member.rank === 3 ? 'bg-orange-600 text-white' :
                    `${getThemeClass('component')} ${getThemeTextColor('secondary')}`
                  }`}>
                    {member.rank}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${getThemeTextColor('primary')}`}>
                      {member.name}
                    </p>
                    <p className={`text-xs ${getThemeTextColor('secondary')}`}>
                      {member.hours}h
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-semibold ${getThemeTextColor('primary')}`}>
                    {member.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 우측 하단 - 오늘의 목표 설정 (2/5) */}
      <Card className={`${getCommonCardClass()} col-span-2 row-span-1`}>
        <CardHeader>
          <h3 className={`text-lg font-semibold ${getThemeTextColor('primary')} flex items-center gap-2`}>
            <Target className="h-5 w-5" />
            Today's Goal
          </h3>
        </CardHeader>
        <CardContent className={spacing.inner.normal}>
          <div className="space-y-4">
            {isEditingGoal ? (
              <div className="space-y-3">
                <textarea
                  value={todayGoal}
                  onChange={(e) => setTodayGoal(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border ${getThemeClass('border')} ${getThemeClass('component')} ${getThemeTextColor('primary')} focus:outline-none focus:ring-2 focus:ring-[#3F72AF] resize-none`}
                  rows={3}
                  placeholder="Enter today's team goal..."
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleGoalSave}
                    className={`${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')} hover:${getThemeClass('component')}`}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingGoal(false)}
                    className={`${getThemeClass('component')} ${getThemeClass('border')} ${getThemeTextColor('secondary')}`}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className={`p-4 rounded-lg ${getThemeClass('componentSecondary')} min-h-[80px] flex items-center`}>
                  <p className={`text-lg ${getThemeTextColor('primary')}`}>
                    {todayGoal}
                  </p>
                </div>
                <Button
                  onClick={() => setIsEditingGoal(true)}
                  variant="outline"
                  className={`${getThemeClass('component')} ${getThemeClass('border')} ${getThemeTextColor('secondary')} hover:${getThemeClass('componentSecondary')}`}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Goal
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}