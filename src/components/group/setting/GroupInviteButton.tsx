'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Button } from '@/shadcn/ui/button';
import { generateGroupInviteLink } from '@/shared/api/post';
import { Link } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface GroupInviteButtonProps {
  password?: string | null;
  isPublic: boolean;
}

export default function GroupInviteButton({ password, isPublic }: GroupInviteButtonProps) {
  const { getThemeClass } = useTheme();
  const params = useParams();
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  
  const groupId = Array.isArray(params.id) ? parseInt(params.id[0], 10) : parseInt(params.id as string, 10);

  const generateAndCopyInviteLink = async () => {
    setIsGeneratingLink(true);
    try {
      const request: Group.GenerateInviteLinkApiRequest = { emails: [""] };
      const response = await generateGroupInviteLink(groupId, request);
      console.log(response.link);
      await navigator.clipboard.writeText("qwerqwer");
      await navigator.clipboard.writeText(response.link);
      toast.success('Invite link copied to clipboard!');
    } catch (error) {
      console.error('Failed to generate invite link:', error);
      toast.error('Failed to generate invite link. Please try again.');
    } finally {
      setIsGeneratingLink(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={generateAndCopyInviteLink}
      disabled={isGeneratingLink}
      className={`gap-2 ${getThemeClass('component')} ${getThemeClass('border')}`}
    >
      <Link className="h-4 w-4" />
      {isGeneratingLink ? 'Generating...' : 'Copy Invite Link'}
    </Button>
  );
}