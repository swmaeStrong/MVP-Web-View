'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/ui/avatar';
import { cn } from '@/shadcn/lib/utils';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

interface UserAvatarProps {
  nickname: string;
  imageUrl?: string;
  size?: AvatarSize;
  isCurrentUser?: boolean;
  isAchieved?: boolean;
  showBorder?: boolean;
  className?: string;
}

// 사이즈별 스타일 정의
const sizeStyles: Record<AvatarSize, { container: string; text: string }> = {
  xs: {
    container: 'w-6 h-6',
    text: 'text-[8px]',
  },
  sm: {
    container: 'w-8 h-8',
    text: 'text-xs',
  },
  md: {
    container: 'w-10 h-10',
    text: 'text-sm',
  },
  lg: {
    container: 'w-16 h-16',
    text: 'text-lg',
  },
};

export default function UserAvatar({
  nickname,
  imageUrl,
  size = 'sm',
  isCurrentUser = false,
  isAchieved,
  showBorder = false,
  className,
}: UserAvatarProps) {
  const { container, text } = sizeStyles[size];
  
  // 닉네임에서 이니셜 추출
  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  // 테두리 스타일 결정
  const getBorderStyle = () => {
    if (!showBorder || !isCurrentUser) {
      return 'ring-1 ring-gray-200 dark:ring-gray-700';
    }
    
    if (isAchieved !== undefined) {
      return isAchieved
        ? 'ring-2 ring-green-400 dark:ring-green-500'
        : 'ring-2 ring-red-400 dark:ring-red-500';
    }
    
    return 'ring-1 ring-gray-200 dark:ring-gray-700';
  };

  return (
    <Avatar
      className={cn(
        container,
        getBorderStyle(),
        'group-hover:ring-gray-400 dark:group-hover:ring-gray-500',
        className
      )}
    >
      <AvatarImage src={imageUrl} />
      <AvatarFallback
        className={cn(
          text,
          'font-semibold bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
          'group-hover:text-gray-900 dark:group-hover:text-white'
        )}
      >
        {getInitials(nickname)}
      </AvatarFallback>
    </Avatar>
  );
}