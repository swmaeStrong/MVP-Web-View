'use client';

import { groupDetailQueryKey, myGroupsQueryKey } from '@/config/constants';
import { useTranslation } from '@/providers/LanguageProvider';
import { banGroupMember, deleteGroup, leaveGroup } from '@/shared/api/delete';
import { transferGroupOwnership, updateGroup } from '@/shared/api/patch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useUpdateGroup(groupId: number) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

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
      toast.success(t('group.actionMessages.updateSuccess'));
    },
    onError: (error) => {
      console.error('Failed to update group:', error);
      toast.error(t('group.actionMessages.updateError'));
    },
  });
}

export function useDeleteGroup(groupId: number) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () => deleteGroup(groupId.toString()),
    onSuccess: () => {
      // 성공 시 그룹 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: myGroupsQueryKey(),
      });
      toast.success(t('group.actionMessages.deleteSuccess'));
      // 그룹 찾기 페이지로 이동
      router.push('/group/search');
    },
    onError: (error) => {
      console.error('Failed to delete group:', error);
      toast.error(t('group.actionMessages.deleteRequirement'));
    },
  });
}

export function useBanMember(groupId: number) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) => 
      banGroupMember(groupId, userId, reason),
    onSuccess: () => {
      // 성공 시 그룹 상세 정보 다시 조회
      queryClient.invalidateQueries({
        queryKey: groupDetailQueryKey(groupId),
      });
      toast.success(t('group.actionMessages.memberBanSuccess'));
    },
    onError: (error) => {
      console.error('Failed to ban member:', error);
      toast.error(t('group.actionMessages.memberBanError'));
    },
  });
}

export function useLeaveGroup(groupId: number) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () => leaveGroup(groupId.toString()),
    onSuccess: () => {
      // 성공 시 그룹 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: myGroupsQueryKey(),
      });
      toast.success(t('group.actionMessages.leaveSuccess'));
      // 그룹 찾기 페이지로 이동
      router.push('/group/search');
    },
    onError: (error) => {
      console.error('Failed to leave group:', error);
      toast.error(t('group.actionMessages.leaveError'));
    },
  });
}

export function useTransferOwnership(groupId: number) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

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
      toast.success(t('group.actionMessages.ownershipTransferSuccess'));
      // 그룹 페이지로 리다이렉트 (더 이상 관리자가 아니므로)
      router.push(`/group/${groupId}/detail`);
    },
    onError: (error) => {
      console.error('Failed to transfer ownership:', error);
      toast.error(t('group.actionMessages.ownershipTransferError'));
    },
  });
}