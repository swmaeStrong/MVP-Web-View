import { API } from '../../config/api';
import { ApiResponse } from '../../types/common/apiResponse';
import { parseApi } from '../../utils/api-utils';

// 구독 결제 생성

export const createSubscriptionWithPaymentMethod = async (
  subscriptionPlanId: string,
  paymentMethodId: string
): Promise<ApiResponse<void>> =>
  parseApi(
    API.post('/users/subscription', {
      subscriptionPlanId,
      paymentMethodId,
    })
  );

export const createSubscriptionWithBillingKey = async (
  subscriptionPlanId: string,
  billingKey: string
): Promise<ApiResponse<void>> =>
  parseApi(
    API.post('/users/subscription', {
      subscriptionPlanId,
      billingKey,
    })
  );


// 그룹 생성
export const createGroup = (request: Group.CreateGroupApiRequest) =>
  parseApi(
    API.post('/group', request)
);

// 그룹 가입
export const joinGroup = (groupId: number, request: Group.JoinGroupApiRequest) => 
  parseApi(
    API.post(`/group/${groupId}/join`, request)
);

// 초대 코드로 그룹 가입
export const joinGroupByInviteCode = (inviteCode: string) =>
  parseApi(
    API.post(`/group/invite?code=${inviteCode}`, {})
);

// 그룹 초대 링크 생성
export const generateGroupInviteLink = (
  groupId: number, 
  request: Group.GenerateInviteLinkApiRequest = { emails: [""] }
) =>
  parseApi<Group.GenerateInviteLinkApiResponse>(
    API.post(`/group/${groupId}/invite`, request)
);

// 그룹 목표 설정
export const setGroupGoal = (groupId: number, request: Group.SetGroupGoalApiRequest) =>
  parseApi(
    API.post(`/group/${groupId}/goal`, request)
  );
