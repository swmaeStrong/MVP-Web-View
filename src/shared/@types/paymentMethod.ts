declare namespace PaymentMethod {
  interface PaymentMethodRequest {
    billingKey: string;
  }

  interface PaymentMethodResponse {
    id: string;
    pgProvider: string;
    issuer: string;
    number: string;
  }
}
