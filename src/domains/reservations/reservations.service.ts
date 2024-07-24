import { HttpException, Injectable } from '@nestjs/common';
import { Mapper } from '@src/libs/mappers';
import { ReservationStatusEnum, SeatStatusEnum } from '@src/libs/types';
import { EventProperty } from '@src/domains/events/events.model';
import { ReservationsRepository } from '@src/domains/repositories';
import { Reservation } from '@src/domains/reservations/reservations.model';
import { Seat } from '@src/domains/seats/seats.model';

@Injectable()
export class ReservationsService {
  constructor(private readonly reservationsRepository: ReservationsRepository) {}

  async postReservation(seat: Seat, eventProperty: EventProperty, userId: string): Promise<Reservation> {
    if (seat.status === SeatStatusEnum.OCCUPIED) throw new HttpException('SEAT_OCCUPIED', 500);
    return await this.reservationsRepository.postReservation(
      await Mapper.classTransformer(Reservation, {
        seatId: seat.id,
        userId: userId,
        status: ReservationStatusEnum.RESERVED,
        eventId: eventProperty.event.id,
        eventName: eventProperty.event.name,
        eventPropertyId: eventProperty.id,
        eventDate: eventProperty.eventDate,
        price: seat.seatProperty.price,
      }),
    );
  }

  async getReservationById(reservationId: number): Promise<Reservation> {
    const reservation = await this.reservationsRepository.getReservationById(reservationId);
    if (!reservation) throw new HttpException('RESERVATION_NOT_FOUND', 500);
    return reservation;
  }

  async putReservationToPaid(reservation: Reservation, userId: string): Promise<Reservation> {
    // 예약자 검증
    if (reservation.userId !== userId) throw new HttpException('WRONG_USERID', 500);
    // 예약 상태 검증
    if (reservation.status !== ReservationStatusEnum.RESERVED) throw new HttpException('WRONG_RESERVATION_STATUS', 500);
    // 예약 상태 결제로 변경
    await this.reservationsRepository.putReservation(reservation.id, ReservationStatusEnum.PAID);
    reservation.status = ReservationStatusEnum.PAID;
    return reservation;
  }
}
