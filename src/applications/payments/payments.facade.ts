import { Injectable } from '@nestjs/common';
import { PaymentsService } from '@src/domains/payments/payments.service';
import { RedisLocksService } from '@src/domains/redis.locks/redis.locks.service';
import { Reservation } from '@src/domains/reservations/reservations.model';
import { ReservationsService } from '@src/domains/reservations/reservations.service';
import { UsersService } from '@src/domains/users/users.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class PaymentsFacade {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly usersService: UsersService,
    private readonly paymentsService: PaymentsService,
    private readonly redisLocksService: RedisLocksService,
  ) {}

  async payReservation(reservationId: number, userId: string): Promise<Reservation> {
    const reservation = await this.reservationsService.getReservationById(reservationId);
    const key = `POINT_LOCK:ID_${userId}`;
    const acquireLock = await this.redisLocksService.acquireLock(key, userId);
    if (acquireLock) {
      const paidReservation = await this.payReservationTransaction(reservation, userId);
      await this.redisLocksService.removeLock(key, userId);
      return paidReservation;
    } else {
      await this.redisLocksService.addUserToSubscription(key, userId);
      return this.redisLocksService.listenMessage(key, userId).then(async () => {
        const paidReservation = await this.payReservationTransaction(reservation, userId);
        await this.redisLocksService.removeLock(key, userId);
        return paidReservation;
      });
    }
  }

  @Transactional()
  async payReservationTransaction(reservation: Reservation, userId: string): Promise<Reservation> {
    const paidReservation = await this.reservationsService.putReservationToPaid(reservation, userId);
    const userBalance = await this.usersService.getUserBalanceByUserId(userId);
    const balanceHistory = await this.usersService.use(userId, userBalance.balance, reservation.price);
    await this.paymentsService.postPayment(reservation.id, balanceHistory.id);
    return paidReservation;
  }
}
