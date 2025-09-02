import { myGroupsQueryKey } from '@/config/constants/query-keys';
import { joinGroupByInviteCode } from '@/shared/api/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface UseJoinGroupByInviteOptions {
  onSuccess?: (inviteCode: string) => void;
  onError?: (error: Error) => void;
  groupId?: number; // Optional: if we know the group ID for navigation
}

export function useJoinGroupByInvite(options: UseJoinGroupByInviteOptions = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (inviteCode: string) => {
      await joinGroupByInviteCode(inviteCode);
      return inviteCode;
    },
    onSuccess: (inviteCode) => {
      // 성공 시 내 그룹 목록 다시 불러오기
      queryClient.invalidateQueries({
        queryKey: myGroupsQueryKey(),
      });
      
      toast.success('Successfully joined the group!');
      
      // 커스텀 성공 핸들러 호출
      if (options.onSuccess) {
        options.onSuccess(inviteCode);
      } else if (options.groupId) {
        // 기본 동작: 그룹 ID가 있으면 그룹 상세 페이지로 이동
        router.push(`/group/${options.groupId}/detail`);
      }
    },
    onError: (error: Error) => {
      console.error('Failed to join group by invite:', error);
      toast.error('Failed to join the group. Please try again.');
      
      // 커스텀 에러 핸들러 호출
      if (options.onError) {
        options.onError(error);
      }
    }
  });
}