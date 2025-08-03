'use client';

import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import { useTheme } from '@/hooks/ui/useTheme';
import { LucideIcon } from 'lucide-react';
import * as React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
  isLoading?: boolean;
  loadingText?: string;
  icon?: LucideIcon;
  showIcon?: boolean;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  isLoading = false,
  loadingText = 'Processing...',
  icon: Icon,
  showIcon = true,
}: ConfirmDialogProps) {
  const { getThemeClass, getThemeTextColor } = useTheme();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    await onConfirm();
  };

  const getButtonVariant = () => {
    if (variant === 'destructive') {
      return 'destructive';
    }
    return 'default';
  };

  const getButtonClassName = () => {
    if (variant === 'destructive') {
      return 'bg-red-600 hover:bg-red-700 text-white';
    }
    return 'bg-[#3F72AF] hover:bg-[#3F72AF]/90 text-white';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${getThemeClass('component')} ${getThemeClass('border')} max-w-md`}>
        <DialogHeader className="space-y-3">
          <DialogTitle className={`text-xl font-semibold ${getThemeTextColor('primary')}`}>
            {title}
          </DialogTitle>
          <DialogDescription className={`${getThemeTextColor('secondary')} leading-relaxed`}>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 gap-3 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className={`${getThemeClass('border')} ${getThemeTextColor('secondary')} hover:${getThemeTextColor('primary')}`}
          >
            {cancelText}
          </Button>
          <Button
            variant={getButtonVariant()}
            onClick={handleConfirm}
            disabled={isLoading}
            className={getButtonClassName()}
          >
            {isLoading ? (
              <>
                {Icon && showIcon && <Icon className="h-4 w-4 mr-2 animate-pulse" />}
                {loadingText}
              </>
            ) : (
              <>
                {Icon && showIcon && <Icon className="h-4 w-4 mr-2" />}
                {confirmText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}