export interface IPaymentBody {
  userId: string;
  eventId: string;
  paidAmount: number;
  currency?: string;
  email?: string;
}
