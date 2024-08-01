import { Injectable } from '@nestjs/common';
import { Payment } from '@src/domains/payments/payments.model';
import { PaymentsRepository, RedisCacheRepository } from '@src/domains/repositories';
import { RedisKey } from '@src/libs/utils/redis.key.generator';
import { ChainableCommander } from 'ioredis';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly redisCacheRepository: RedisCacheRepository,
  ) {}

  // 결제 기록 POST
  async postPayment(reservationId: number, balanceHistoryId: number): Promise<Payment> {
    const payment = await this.paymentsRepository.postPayment(reservationId, balanceHistoryId);
    return payment;
  }

  async setPaymentCache(payment: Payment, multi?: ChainableCommander): Promise<boolean | ChainableCommander> {
    const paymentCacheKey = RedisKey.createCacheKey(Payment, payment.reservationId);
    return multi
      ? this.redisCacheRepository.setHash(paymentCacheKey, `${payment.id}`, payment, 6000, multi)
      : await this.redisCacheRepository.setHash(paymentCacheKey, `${payment.id}`, payment, 6000);
  }
}
