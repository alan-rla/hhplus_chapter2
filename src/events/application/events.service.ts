import { HttpException, Inject, Injectable } from '@nestjs/common';
import { EventsRepository } from '../domain/repositories/events.repository';
import { DataSource } from 'typeorm';
import dayjs from 'dayjs';
import { EventProperty, Reservation, Seat } from '../domain/models/events.model';
import { QueuesRepository } from '../../queues/domain/repositories/queues.repository';
import { QueueStatusEnum, ReservationStatusEnum, SeatStatusEnum } from '../../libs/types';
import { UsersRepository } from '../../users/domain/repositories/users.repository';

@Injectable()
export class EventsService {
  constructor(
    @Inject('EventsRepository')
    private readonly eventsRepository: EventsRepository,
    private readonly queuesRepository: QueuesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getEventDates(eventId: number): Promise<EventProperty[]> {
    const now = dayjs(Date.now()).toDate();
    const eventDates = await this.eventsRepository.getEventProperties(eventId, now);
    return eventDates;
  }

  async getSeats(eventPropertyId: number): Promise<Seat[]> {
    const seats = await this.eventsRepository.getSeats(eventPropertyId);
    return seats;
  }

  async reserveSeat(seatId: number, userId: string): Promise<Reservation> {
    try {
      return await this.dataSource.createEntityManager().transaction(async (transactionalEntityManager) => {
        const occupied = SeatStatusEnum.OCCUPIED;
        // pessimistic_write 적용한 좌석 검색
        const seat = await this.eventsRepository.getSeatById(seatId, transactionalEntityManager);

        // 예약 검증
        if (Object.keys(seat).length === 0)
          throw new HttpException({ status: 'SEAT_NOT_FOUND', msg: '좌석 없음' }, 500);

        // 좌석 상태 변경
        if ((seat.status = occupied))
          throw new HttpException({ status: 'SEAT_OCCUPIED', msg: '좌석 이미 선택됨' }, 500);

        // 좌석 상태 AVAILABLE => OCCUPIED 변경
        await this.eventsRepository.putSeatStatus(seat.id, occupied, transactionalEntityManager);

        const eventProperty = await this.eventsRepository.getEventPropertyById(
          seat.eventPropertyId,
          transactionalEntityManager,
        );

        const reserved = ReservationStatusEnum.RESERVED;
        const eventId = eventProperty.event.id;
        const eventName = eventProperty.event.name;
        const eventPropertyId = eventProperty.id;
        const eventDate = eventProperty.eventDate;
        const price = seat.seatProperty.price;

        const reservation = await this.eventsRepository.reserveSeat(
          seatId,
          userId,
          reserved,
          eventId,
          eventName,
          eventPropertyId,
          eventDate,
          price,
          transactionalEntityManager,
        );

        return reservation;
      });
    } catch (err) {
      throw err;
    }
  }

  async paySeatReservation(reservationId: number, userId: string): Promise<Reservation> {
    try {
      return await this.dataSource.createEntityManager().transaction(async (transactionalEntityManager) => {
        const reservation = await this.eventsRepository.getReservation(reservationId, transactionalEntityManager);

        // 예약 검증
        if (Object.keys(reservation).length === 0)
          throw new HttpException({ status: 'RESERVATION_NOT_FOUND', msg: '예약 없음' }, 500);

        // 예약자 검증
        if (reservation.userId !== userId)
          throw new HttpException({ status: 'WRONG_USERID', msg: '예약자 불일치' }, 500);

        // 잔액 부족하면 예외처리
        const userBalance = await this.usersRepository.getUserBalanceById(userId);
        if (reservation.price > userBalance.balance)
          throw new HttpException({ status: 'BALANCE_NOT_ENOUGH', msg: '잔액 부족' }, 500);

        // 대기열 만료
        const queue = await this.queuesRepository.getByUserIdAndEventId(
          userId,
          reservation.eventId,
          transactionalEntityManager,
        );
        await this.queuesRepository.putQueueStatus([queue.id], QueueStatusEnum.EXPIRED, transactionalEntityManager);

        // 잔액 차감
        const remainingBalance = userBalance.balance - reservation.price;
        await this.usersRepository.putUserBalance(userId, remainingBalance, transactionalEntityManager);
        const balanceHistory = await this.usersRepository.use(userId, reservation.price, transactionalEntityManager);

        // 결제 기록 POST
        await this.eventsRepository.postPayment(reservation.id, balanceHistory.id, transactionalEntityManager);

        // 예약 상태 결제로 변경
        const paid = ReservationStatusEnum.PAID;
        const putReservation = await this.eventsRepository.putReservation(
          reservationId,
          paid,
          transactionalEntityManager,
        );

        return putReservation;
      });
    } catch (err) {
      throw err;
    }
  }
}
