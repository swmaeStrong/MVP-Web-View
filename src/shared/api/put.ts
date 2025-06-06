import { parseApi } from '../../utils/api-utils';
import { API } from '../configs/api';

// 구독 결제 취소
export const cancelSubscription = () =>
  parseApi(API.put('/users/subscriptions/current'));
