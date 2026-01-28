export interface PaymentIntentResponse {
  clientSecret: string;
  amount?: number;
}

export interface BackendErrorResponse {
  message: string;
  statusCode?: number;
  error?: string;
}
