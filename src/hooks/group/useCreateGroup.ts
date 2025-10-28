'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { groupNameCheckQueryKey, groupSearchQueryKey, myGroupsQueryKey } from '@/config/constants';
import { useNavigation } from '@/hooks/navigation/useNavigation';
import { useDebounce } from '@/hooks/ui/useDebounce';
import { useTranslation } from '@/providers/LanguageProvider';
import { validateGroupName } from '@/shared/api/get';
import { createGroup } from '@/shared/api/post';


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
  const { navigateWithParams } = useNavigation();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: (_data) => {
      // refetchQueries는 캐시에 없어도 강제로 새 데이터를 가져옴 (첫 그룹 생성에 적합)
      queryClient.refetchQueries({
        queryKey: myGroupsQueryKey(),
      });
      
      // 그룹 검색 결과도 무효화 (새로 생성된 그룹이 검색 결과에 반영되도록)
      queryClient.invalidateQueries({
        queryKey: groupSearchQueryKey(),
      });
      
      // 성공 시 그룹 검색 페이지로 이동
      setTimeout(() => {
        navigateWithParams('/group/search');
      }, 1000);
    },
  });
}

export function useCreateGroupWithToast() {
  const createGroupMutation = useCreateGroup();
  const { t } = useTranslation();

  const createGroupWithToast = async (request: Group.CreateGroupApiRequest) => {
    // mutation을 직접 사용하여 토스트와 쿼리 무효화를 모두 처리
    return toast.promise(
      createGroupMutation.mutateAsync(request),
      {
        loading: t('group.actionMessages.groupCreating'),
        success: t('group.actionMessages.createSuccess'),
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
          
          return t('group.actionMessages.createError');
        },
      },
      {
        id: 'create-group', // 중복 토스트 방지
      }
    );
  };

  return {
    createGroupWithToast,
    isLoading: createGroupMutation.isPending,
  };
}