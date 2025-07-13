import { parseApi } from '../../utils/api-utils';
import { ApiResponse } from '../../types/common/apiResponse';
import { API } from '../../config/api';

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
