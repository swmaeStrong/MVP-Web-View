'use client';

import { setGroupGoal } from '@/shared/api/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useSetGroupGoal(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: Group.SetGroupGoalApiRequest) => setGroupGoal(groupId, request),
    onSuccess: () => {
      // 성공 시 그룹 관련 쿼리 무효화 (필요에 따라 수정)
      queryClient.invalidateQueries({
        queryKey: ['groupDetail', groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ['groupGoals', groupId],
      });
      toast.success('Group goal has been set successfully!');
    },
    onError: (error) => {
      console.error('Failed to set group goal:', error);
      toast.error('Failed to set group goal. Please try again.');
    },
  });
}