'use client';

import { groupDetailQueryKey, myGroupsQueryKey, GROUP_ACTION_MESSAGES } from '@/config/constants';
import { updateGroup, transferGroupOwnership } from '@/shared/api/patch';
import { deleteGroup, leaveGroup, banGroupMember } from '@/shared/api/delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useUpdateGroup(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: Group.UpdateGroupApiRequest) => updateGroup(groupId, request),
    onSuccess: () => {
      // 성공 시 그룹 상세 정보 및 사이드바 다시 조회
      queryClient.invalidateQueries({
        queryKey: groupDetailQueryKey(groupId),
      });
      queryClient.invalidateQueries({
        queryKey: myGroupsQueryKey(),
      });
      toast.success(GROUP_ACTION_MESSAGES.UPDATE.SUCCESS);
    },
    onError: (error) => {
      console.error('Failed to update group:', error);
      toast.error(GROUP_ACTION_MESSAGES.UPDATE.ERROR);
    },
  });
}

export function useDeleteGroup(groupId: number) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => deleteGroup(groupId.toString()),
    onSuccess: () => {
      // 성공 시 그룹 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: myGroupsQueryKey(),
      });
      toast.success(GROUP_ACTION_MESSAGES.DELETE.SUCCESS);
      // 그룹 찾기 페이지로 이동
      router.push('/group/find');
    },
    onError: (error) => {
      console.error('Failed to delete group:', error);
      toast.error(GROUP_ACTION_MESSAGES.DELETE.ERROR);
    },
  });
}

export function useBanMember(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) => 
      banGroupMember(groupId, userId, reason),
    onSuccess: () => {
      // 성공 시 그룹 상세 정보 다시 조회
      queryClient.invalidateQueries({
        queryKey: groupDetailQueryKey(groupId),
      });
      toast.success('Member has been removed from the group');
    },
    onError: (error) => {
      console.error('Failed to ban member:', error);
      toast.error('Failed to remove member');
    },
  });
}

export function useLeaveGroup(groupId: number) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => leaveGroup(groupId.toString()),
    onSuccess: () => {
      // 성공 시 그룹 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: myGroupsQueryKey(),
      });
      toast.success('Successfully left the group');
      // 그룹 찾기 페이지로 이동
      router.push('/group/find');
    },
    onError: (error) => {
      console.error('Failed to leave group:', error);
      toast.error('Failed to leave the group');
    },
  });
}

export function useTransferOwnership(groupId: number) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (userId: string) => 
      transferGroupOwnership(groupId, { userId }),
    onSuccess: () => {
      // 성공 시 그룹 상세 정보 다시 조회
      queryClient.invalidateQueries({
        queryKey: groupDetailQueryKey(groupId),
      });
      queryClient.invalidateQueries({
        queryKey: myGroupsQueryKey(),
      });
      toast.success('Group ownership has been transferred successfully');
      // 그룹 페이지로 리다이렉트 (더 이상 관리자가 아니므로)
      router.push(`/group/team/${groupId}`);
    },
    onError: (error) => {
      console.error('Failed to transfer ownership:', error);
      toast.error('Failed to transfer group ownership');
    },
  });
}