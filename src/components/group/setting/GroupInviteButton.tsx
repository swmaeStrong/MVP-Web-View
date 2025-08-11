'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface GroupInviteButtonProps {
  password?: string | null;
  isPublic: boolean;
}

export default function GroupInviteButton({ password, isPublic }: GroupInviteButtonProps) {
  const { getThemeClass } = useTheme();

  // Public 그룹의 경우 invite code 버튼을 보이지 않게 함
  if (isPublic) {
    return null;
  }

  const copyInviteCode = () => {
    const textToCopy = password || 'No password required';
    navigator.clipboard.writeText(textToCopy);
    toast.success('Invite code copied to clipboard!');
  };

  return (
    <Button
      variant="outline"
      onClick={copyInviteCode}
      className={`gap-2 ${getThemeClass('component')} ${getThemeClass('border')}`}
    >
      <Copy className="h-4 w-4" />
      Invite Code: {password || 'No password required'}
    </Button>
  );
}