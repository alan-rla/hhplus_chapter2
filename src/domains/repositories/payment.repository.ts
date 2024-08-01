import { Payment } from '@src/domains/payments/payments.model';

export abstract class PaymentsRepository {
  abstract postPayment(reservationId: number, balanceHistoryId: number): Promise<Payment>;
}
