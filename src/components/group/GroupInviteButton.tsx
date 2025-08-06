'use client';

import { useTheme } from '@/hooks/ui/useTheme';
import { Button } from '@/shadcn/ui/button';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface GroupInviteButtonProps {
  password?: string | null;
}

export default function GroupInviteButton({ password }: GroupInviteButtonProps) {
  const { getThemeClass } = useTheme();

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