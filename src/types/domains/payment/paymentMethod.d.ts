declare namespace PaymentMethod {
  interface PaymentMethodApiRequest {
    billingKey: string;
  }

  interface PaymentMethodApiResponse {
    id: string;
    pgProvider: string;
    issuer: string;
    number: string;
  }
}
