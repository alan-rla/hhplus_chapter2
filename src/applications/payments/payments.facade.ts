import { HttpException, Injectable } from '@nestjs/common';
import { Payment } from '@src/domains/payments/payments.model';
import { PaymentsService } from '@src/domains/payments/payments.service';
import { RedisCacheService } from '@src/domains/redis.cache/redis.cache.service';
import { Reservation } from '@src/domains/reservations/reservations.model';
import { ReservationsService } from '@src/domains/reservations/reservations.service';
import { BalanceHistory, UserBalance } from '@src/domains/users/users.model';
import { UsersService } from '@src/domains/users/users.service';
import { RedisKey } from '@src/libs/utils/redis.key.generator';
import { Transactional } from 'typeorm-transactional';

interface TransactionResult {
  paidReservation: Reservation;
  balanceHistory: BalanceHistory;
  userBalanceAfter: UserBalance;
  payment: Payment;
}
@Injectable()
export class PaymentsFacade {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly usersService: UsersService,
    private readonly paymentsService: PaymentsService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async payReservation(reservationId: number, seatId: number, userId: string): Promise<Reservation> {
    try {
      // redis 객체에 대한 lock 적용
      const userBalanceCacheKey = RedisKey.createCacheKey(UserBalance, userId);
      const resLockKey = RedisKey.createLockKey(Reservation, reservationId);
      // user balance는 key-value여서 cache key 그대로 watch
      await this.redisCacheService.watch(resLockKey);
      await this.redisCacheService.watch(userBalanceCacheKey);
      // optimistic lock 적용된 예약, 사용자 잔액정보 조회
      // write through 전략을 사용하므로 DB + Cache 둘다 쓰기 작업 진행
      const reservation = await this.reservationsService.getReservationById(reservationId);
      const userBalanceBefore = await this.usersService.getUserBalanceByUserId(userId, true);
      const { paidReservation, userBalanceAfter, balanceHistory, payment } = await this.dbTransaction(
        reservation,
        userBalanceBefore,
      );

      await this.redisTransaction(resLockKey, paidReservation, userBalanceAfter, balanceHistory, payment);
      return paidReservation;
    } catch (err) {
      if (err.message.includes('NOT_FOUND')) await this.redisCacheService.discard();
    }
  }

  @Transactional()
  async dbTransaction(reservation: Reservation, userBalanceBefore: UserBalance): Promise<TransactionResult> {
    // 예약 상태 바꾸기 + 캐시 업데이트
    const paidReservation = await this.reservationsService.putReservationToPaid(reservation, userBalanceBefore.userId);
    // 사용자 잔액 사용 + 캐시 정보 저장
    const { userBalanceAfter, balanceHistory } = await this.usersService.use(userBalanceBefore, reservation.price);
    // 결제 정보 DB + 캐시 저장
    const payment = await this.paymentsService.postPayment(reservation.id, balanceHistory.id);
    return { paidReservation, userBalanceAfter, balanceHistory, payment };
  }

  private redisTxCount = 0;
  async redisTransaction(
    resLockKey: string,
    paidReservation: Reservation,
    userBalanceAfter: UserBalance,
    balanceHistory: BalanceHistory,
    payment: Payment,
  ): Promise<void> {
    const multi = this.redisCacheService.multi();
    // reservation lock key는 가상의 락이라 값 추가해 줘야함
    // 다른 요청에 의해 set 되면 transaction abort
    multi.set(resLockKey, 'locked');
    this.reservationsService.setReservationCache(paidReservation, multi);
    this.usersService.setUserBalanceCache(userBalanceAfter, multi);
    this.usersService.setBalanceHistoryCache(balanceHistory, multi);
    this.paymentsService.setPaymentCache(payment, multi);
    multi.unlink(resLockKey);
    const result = await multi.exec();
    // watch중인 키의 값이 다른 요청에 의해 변경되면 result === null
    if (!result) {
      if (this.redisTxCount < 5) {
        setTimeout(() => {}, 100);
        this.redisTxCount += 1;
        return await this.redisTransaction(resLockKey, paidReservation, userBalanceAfter, balanceHistory, payment);
      } else throw new HttpException('REDIS_RESERVATION_TX_FAILED', 500);
    } else {
      this.redisTxCount = 0;
      return;
    }
  }
}
