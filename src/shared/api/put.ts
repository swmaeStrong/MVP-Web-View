import { API } from '../../config/api';
import { parseApi } from '../../utils/api-utils';

// 구독 결제 취소
export const cancelSubscription = () =>
  parseApi(API.put('/users/subscriptions/current'));
