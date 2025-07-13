declare namespace Subscription {
  interface AvailableSubscriptionPlansApiResponse {
    subscriptionPlanId: string;
    description: string;
    billingCycle: string;
    price: number;
  }

  interface UserSubscriptionApiResponse {
    userId: string;
    userSubscriptionId: string;
    subscriptionPlanId: string;
    userSubscriptionStatus: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
    subscriptionPlanType: 'BASIC' | 'PREMIUM';
    price: number;
    startTime: string;
    endTime: string;
  }

  interface CreateSubscriptionWithPaymentMethodApiRequest {
    subscriptionPlanId: string;
    paymentMethodId: string;
  }

  interface CreateSubscriptionWithBillingKeyApiRequest {
    subscriptionPlanId: string;
    billingKey: string;
  }
}
