import { myGroupsQueryKey } from '@/config/constants/query-keys';
import { joinGroup } from '@/shared/api/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface UseJoinGroupOptions {
  onSuccess?: (group: Group.GroupApiResponse) => void;
  onError?: (error: Error) => void;
}

export function useJoinGroup(options: UseJoinGroupOptions = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ 
      group, 
      password 
    }: { 
      group: Group.GroupApiResponse; 
      password: string;
    }) => {
      // public 그룹이면 password를 null로, private 그룹이면 입력된 password 사용
      const request: Group.JoinGroupApiRequest = {
        password: group.isPublic ? null : password || null
      };
      
      await joinGroup(group.groupId, request);
      return group;
    },
    onSuccess: (group) => {
      // 성공 시 내 그룹 목록 다시 불러오기
      queryClient.invalidateQueries({
        queryKey: myGroupsQueryKey(),
      });
      
      toast.success('Successfully joined the group!');
      
      // 커스텀 성공 핸들러 호출
      if (options.onSuccess) {
        options.onSuccess(group);
      } else {
        // 기본 동작: 그룹 상세 페이지로 이동
        router.push(`/group/${group.groupId}/detail`);
      }
    },
    onError: (error: Error) => {
      console.error('Failed to join group:', error);
      toast.error('Failed to join the group. Please try again.');
      
      // 커스텀 에러 핸들러 호출
      if (options.onError) {
        options.onError(error);
      }
    }
  });
}