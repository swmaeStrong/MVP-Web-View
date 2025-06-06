declare namespace Subscription {
  interface AvailableSubscriptionPlansResponse {
    subscriptionPlanId: string;
    description: string;
    billingCycle: string;
    price: number;
  }

  interface UserSubscriptionResponse {
    userId: string;
    userSubscriptionId: string;
    subscriptionPlanId: string;
    userSubscriptionStatus: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
    subscriptionPlanType: 'BASIC' | 'PREMIUM';
    price: number;
    startTime: string;
    endTime: string;
  }

  interface CreateSubscriptionWithPaymentMethodRequest {
    subscriptionPlanId: string;
    paymentMethodId: string;
  }

  interface CreateSubscriptionWithBillingKeyRequest {
    subscriptionPlanId: string;
    billingKey: string;
  }
}
