import { HttpException, Inject, Injectable } from '@nestjs/common';
import { EventsRepository } from '../domain/repositories/events.repository';
import dayjs from 'dayjs';
import {
  EventProperty,
  EventPropertyProps,
  PaymentProps,
  Reservation,
  ReservationProps,
  Seat,
  SeatProps,
} from '../domain/models/events.model';
import { QueuesRepository } from '../../queues/domain/repositories/queues.repository';
import { QueueStatusEnum, ReservationStatusEnum, SeatStatusEnum } from '../../libs/types';
import { UsersRepository } from '../../users/domain/repositories/users.repository';
import { Transactional } from 'typeorm-transactional';
import { Mapper } from '../../libs/mappers';

@Injectable()
export class EventsService {
  constructor(
    @Inject('EventsRepository')
    private readonly eventsRepository: EventsRepository,
    @Inject('QueuesRepository')
    private readonly queuesRepository: QueuesRepository,
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
  ) {}

  async getEventDates(args: EventPropertyProps): Promise<EventProperty[]> {
    const now = dayjs(Date.now()).toDate();
    const eventDates = await this.eventsRepository.getEventProperties(args.eventId, now);
    return eventDates;
  }

  async getSeats(args: SeatProps): Promise<Seat[]> {
    const seats = await this.eventsRepository.getSeats(args.eventPropertyId);
    return seats;
  }

  @Transactional()
  async reserveSeat(args: ReservationProps): Promise<Reservation> {
    const occupied = SeatStatusEnum.OCCUPIED;
    const reserved = ReservationStatusEnum.RESERVED;
    // pessimistic_write 적용한 좌석 검색
    const seat = await this.eventsRepository.getSeatById(args.seatId);

    // 예약 검증
    if (!seat) throw new HttpException('SEAT_NOT_FOUND', 500);

    // 좌석 상태 변경
    if (seat.status === occupied) throw new HttpException('SEAT_OCCUPIED', 500);

    // 좌석 상태 AVAILABLE => OCCUPIED 변경

    await this.eventsRepository.putSeatStatus(seat.id, occupied);

    const eventProperty = await this.eventsRepository.getEventPropertyById(seat.eventPropertyId);
    const entity = await Mapper.classTransformer(Reservation, {
      seatId: args.seatId,
      userId: args.userId,
      status: reserved,
      eventId: eventProperty.event.id,
      eventName: eventProperty.event.name,
      eventPropertyId: eventProperty.id,
      eventDate: eventProperty.eventDate,
      price: seat.seatProperty.price,
    });
    const reservation = await this.eventsRepository.reserveSeat(entity);
    return reservation;
  }

  @Transactional()
  async paySeatReservation(args: PaymentProps): Promise<Reservation> {
    const reservation = await this.eventsRepository.getReservationById(args.reservationId);

    // 예약 검증
    if (!reservation) throw new HttpException('RESERVATION_NOT_FOUND', 500);

    // 예약자 검증
    if (reservation.userId !== args.userId) throw new HttpException('WRONG_USERID', 500);

    // 예약 상태 검증
    if (reservation.status !== ReservationStatusEnum.RESERVED) throw new HttpException('WRONG_RESERVATION_STATUS', 500);

    // 잔액 부족하면 예외처리
    const userBalance = await this.usersRepository.getUserBalanceById(args.userId);
    if (reservation.price > userBalance.balance) throw new HttpException('BALANCE_NOT_ENOUGH', 500);

    // 잔액 차감
    const remainingBalance = userBalance.balance - reservation.price;
    await this.usersRepository.putUserBalance(args.userId, remainingBalance);
    const balanceHistory = await this.usersRepository.use(args.userId, reservation.price);

    // 대기열 만료
    const queue = await this.queuesRepository.getByUserIdAndEventId(args.userId, reservation.eventId);
    await this.queuesRepository.putQueueStatus([queue.id], QueueStatusEnum.EXPIRED);
    // 결제 기록 POST
    await this.eventsRepository.postPayment(reservation.id, balanceHistory.id);

    // 예약 상태 결제로 변경
    const paid = ReservationStatusEnum.PAID;
    await this.eventsRepository.putReservation(args.reservationId, paid);
    reservation.status = paid;

    return reservation;
  }
}
