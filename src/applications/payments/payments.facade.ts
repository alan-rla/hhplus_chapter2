import { Injectable } from '@nestjs/common';
import { PaymentsService } from '@src/domains/payments/payments.service';
import { QueuesService } from '@src/domains/queues/queues.service';
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
    private readonly queuesService: QueuesService,
  ) {}

  @Transactional()
  async payReservation(reservationId: number, userId: string): Promise<Reservation> {
    const reservation = await this.reservationsService.getReservationById(reservationId);
    const paidReservation = await this.reservationsService.putReservationToPaid(reservation, userId);
    const userBalance = await this.usersService.getUserBalanceByUserId(userId);
    const balanceHistory = await this.usersService.use(userId, userBalance.balance, reservation.price);
    await this.paymentsService.postPayment(reservationId, balanceHistory.id);
    const queue = await this.queuesService.getLatestQueueByUserIdAndEventId(userId, reservation.eventId);
    await this.queuesService.expireQueue(queue);
    return paidReservation;
  }
}
