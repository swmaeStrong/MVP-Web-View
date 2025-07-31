import { parseApi } from '../../utils/api-utils';
import { API } from '../../config/api';

// 그룹 정보 수정
export const updateGroup = (groupId: number, request: Group.UpdateGroupApiRequest) =>
  parseApi<Group.GroupDetailApiResponse>(
    API.patch(`/group/${groupId}`, request)
  );