import { API } from '@/config/api';
import { parseApi } from '@/utils/api-utils';

export const deleteGroup = (groupId: string) =>
  parseApi<void>(API.delete(`/group/${groupId}`));

export const leaveGroup = (groupId: string) =>
  parseApi<void>(API.delete(`/group/${groupId}/quit`));

export const banGroupMember = (groupId: number, userId: string, reason: string) =>
  parseApi<void>(
    API.delete(`/group/${groupId}/ban`, {
      data: {
        userId,
        reason
      }
    })
  );