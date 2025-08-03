import { API } from '@/config/api';
import { parseApi } from '@/utils/api-utils';

export const deleteGroup = (groupId: string) =>
  parseApi<void>(API.delete(`/group/${groupId}`));