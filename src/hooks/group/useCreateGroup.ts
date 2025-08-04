'use client';

import { groupNameCheckQueryKey, myGroupsQueryKey, GROUP_ACTION_MESSAGES } from '@/config/constants';
import { useDebounce } from '@/hooks/ui/useDebounce';
import { validateGroupName } from '@/shared/api/get';
import { createGroup } from '@/shared/api/post';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useGroupNameValidation(groupName: string) {
  const debouncedGroupName = useDebounce(groupName, 500);
  
  return useQuery({
    queryKey: groupNameCheckQueryKey(debouncedGroupName),
    queryFn: () => validateGroupName(debouncedGroupName),
    enabled: debouncedGroupName.length >= 1,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      // 성공 시 내 그룹 목록을 무효화하고 다시 가져오기
      queryClient.invalidateQueries({
        queryKey: myGroupsQueryKey(),
      });
      
      // 성공 시 그룹 찾기 페이지로 이동
      setTimeout(() => {
        router.push('/group/find');
      }, 1000);
    },
  });
}

export function useCreateGroupWithToast() {
  const createGroupMutation = useCreateGroup();

  const createGroupWithToast = async (request: Group.CreateGroupApiRequest) => {
    // react-hot-toast의 promise를 직접 사용
    return toast.promise(
      createGroup(request),
      {
        loading: GROUP_ACTION_MESSAGES.CREATE.LOADING,
        success: GROUP_ACTION_MESSAGES.CREATE.SUCCESS,
        error: (err: any) => {
          console.error('Failed to create group:', err);
          
          // 에러 메시지 추출
          if (err?.message) {
            return err.message;
          } else if (err?.response?.data?.message) {
            return err.response.data.message;
          } else if (typeof err === 'string') {
            return err;
          }
          
          return GROUP_ACTION_MESSAGES.CREATE.ERROR;
        },
      },
      {
        id: 'create-group', // 중복 토스트 방지
      }
    ).then(() => {
      // 성공 시 처리는 mutation의 onSuccess에서 담당
      createGroupMutation.mutate(request);
    }).catch(() => {
      // 에러는 이미 토스트로 표시됨
    });
  };

  return {
    createGroupWithToast,
    isLoading: createGroupMutation.isPending,
  };
}