'use client';

import { deleteGroupGoal } from '@/shared/api/delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useDeleteGroupGoal(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: Group.DeleteGroupGoalApiRequest) => 
      deleteGroupGoal(groupId, request),
    onSuccess: () => {
      // 성공 시 그룹 목표 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['groupGoals', groupId]
      });
      toast.success('Goal deleted successfully');
    },
    onError: (error: any) => {
      console.error('Delete group goal error:', error);
      toast.error('Failed to delete goal');
    },
  });
}