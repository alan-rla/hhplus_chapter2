import { Injectable } from '@nestjs/common';
import { Payment } from '@src/domains/payments/payments.model';
import { PaymentsRepository } from '@src/domains/repositories';

@Injectable()
export class PaymentsService {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  // 결제 기록 POST
  async postPayment(reservationId: number, balanceHistoryId: number): Promise<Payment> {
    return await this.paymentsRepository.postPayment(reservationId, balanceHistoryId);
  }
}
