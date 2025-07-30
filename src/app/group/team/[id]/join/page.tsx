'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { Input } from '@/shadcn/ui/input';
import { Avatar, AvatarFallback } from '@/shadcn/ui/avatar';
import { Badge } from '@/shadcn/ui/badge';
import { ArrowLeft, Lock, Users, Hash } from 'lucide-react';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function JoinTeamPage() {
  const { getThemeClass, getThemeTextColor, getCommonCardClass } = useTheme();
  const router = useRouter();
  const params = useParams();
  const teamId = params.id as string;
  
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock team data - 실제로는 API에서 가져와야 함
  const team = {
    id: teamId,
    name: 'DevOps Masters',
    description: 'Docker, Kubernetes, CI/CD specialists',
    members: 6,
    isPublic: false,
    tags: ['Docker', 'Kubernetes', 'DevOps'],
    createdAt: '2024-02-01',
  };

  const handleJoinTeam = async () => {
    if (!inviteCode.trim()) {
      setError('초대 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 실제 API 호출 로직
      // await joinPrivateTeam(teamId, inviteCode);
      
      // Mock: 2초 후 성공으로 가정
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 성공 시 팀 상세 페이지로 이동
      router.push(`/group/team/${teamId}`);
    } catch (err) {
      setError('유효하지 않은 초대 코드입니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className={`p-2 ${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')}`}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className={`text-2xl font-bold ${getThemeTextColor('primary')}`}>
            Join Private Team
          </div>
        </div>

        {/* Team Info Card */}
        <Card className={getCommonCardClass()}>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Team Header */}
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className={`text-xl font-bold ${getThemeClass('componentSecondary')} ${getThemeTextColor('primary')}`}>
                    {team.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`text-xl font-bold ${getThemeTextColor('primary')}`}>
                      {team.name}
                    </div>
                    <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-700 hover:bg-amber-100">
                      <Lock className="h-3 w-3" />
                      Private
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <div className={`text-sm font-medium ${getThemeTextColor('primary')}`}>
                        {team.members}
                      </div>
                      <div className={`text-xs ${getThemeTextColor('secondary')}`}>
                        members
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <p className={`text-sm ${getThemeTextColor('secondary')} leading-relaxed`}>
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
            </div>
          </CardContent>
        </Card>

        {/* Join Form Card */}
        <Card className={getCommonCardClass()}>
          <CardHeader className="pb-4">
            <div className={`text-lg font-bold ${getThemeTextColor('primary')}`}>
              Enter Invite Code
            </div>
            <p className={`text-sm ${getThemeTextColor('secondary')}`}>
              This is a private team. You need an invite code from a team member to join.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter invite code..."
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value);
                  setError('');
                }}
                className="h-12 text-center text-lg font-mono tracking-wider !bg-white !border-gray-200 !text-gray-900 placeholder:!text-gray-500 focus:ring-2 focus:ring-[#3F72AF] focus:border-[#3F72AF] dark:!bg-white dark:!text-gray-900"
                disabled={isLoading}
              />
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleBack}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#3F72AF] text-white hover:bg-[#3F72AF]/90"
                onClick={handleJoinTeam}
                disabled={isLoading || !inviteCode.trim()}
              >
                {isLoading ? 'Joining...' : 'Join Team'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className={`${getCommonCardClass()} border-blue-200 bg-blue-50/50`}>
          <CardContent className="p-4">
            <div className={`text-sm ${getThemeTextColor('secondary')} space-y-1`}>
              <div className="font-medium">💡 Need an invite code?</div>
              <div>Ask a current team member to share their invite code with you.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}