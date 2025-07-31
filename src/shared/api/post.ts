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