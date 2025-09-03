'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Button } from '@/shadcn/ui/button';
import { generateGroupInviteLink } from '@/shared/api/post';
import { Link } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

interface GroupInviteButtonProps {
  password?: string | null;
  isPublic: boolean;
}

export default function GroupInviteButton({ password, isPublic }: GroupInviteButtonProps) {
  const { getThemeClass } = useTheme();
  const params = useParams();
  const [isCopying, setIsCopying] = useState(false);
  
  const groupId = Array.isArray(params.id) ? parseInt(params.id[0], 10) : parseInt(params.id as string, 10);

  // 페이지 로드 시 초대 링크를 미리 가져옴
  const { data: inviteLink, isLoading, error, refetch } = useQuery({
    queryKey: ['groupInviteLink', groupId],
    queryFn: async () => {
      const request: Group.GenerateInviteLinkApiRequest = { emails: [""] };
      const response = await generateGroupInviteLink(groupId, request);
      return response.link;
    },
    enabled: !!groupId,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분간 가비지 컬렉션 방지
    retry: 1,
  });

  // 초대 링크 복사 함수
  const copyInviteLink = async () => {
    if (!inviteLink) {
      // 링크가 없으면 다시 가져오기 시도
      await refetch();
      return;
    }
    
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success('Invite link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy invite link:', error);
      toast.error('Failed to copy invite link. Please try again.');
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={copyInviteLink}
      disabled={isLoading || isCopying}
      className={`gap-2 ${getThemeClass('component')} ${getThemeClass('border')}`}
    >
      <Link className="h-4 w-4" />
      {isLoading ? 'Loading...' : isCopying ? 'Copying...' : 'Copy Invite Link'}
    </Button>
  );
}