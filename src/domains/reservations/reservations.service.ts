import { HttpException, Injectable } from '@nestjs/common';
import { Mapper } from '@src/libs/mappers';
import { ReservationStatusEnum } from '@src/libs/types';
import { EventProperty } from '@src/domains/events/events.model';
import { RedisCacheRepository, ReservationsRepository } from '@src/domains/repositories';
import { Reservation } from '@src/domains/reservations/reservations.model';
import { Seat } from '@src/domains/seats/seats.model';
import { RedisKey } from '@src/libs/utils/redis.key.generator';
import { ChainableCommander } from 'ioredis';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    private readonly redisCacheRepository: RedisCacheRepository,
  ) {}

  async postReservation(seat: Seat, eventProperty: EventProperty, userId: string): Promise<Reservation> {
    return await this.reservationsRepository.postReservation(
      Mapper.classTransformer(Reservation, {
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

  async setReservationCache(
    reservation: Reservation,
    multi?: ChainableCommander,
  ): Promise<boolean | ChainableCommander> {
    const resCacheKey = RedisKey.createCacheKey(Reservation, reservation.seatId);
    return multi
      ? this.redisCacheRepository.setHash(resCacheKey, `${reservation.id}`, reservation, 6000, multi)
      : await this.redisCacheRepository.setHash(resCacheKey, `${reservation.id}`, reservation, 6000);
  }

  async getReservationById(reservationId: number): Promise<Reservation> {
    const reservation = await this.reservationsRepository.getReservationById(reservationId);
    if (!reservation) throw new HttpException('RESERVATION_NOT_FOUND', 500);
    return reservation;
  }

  async getReservationCacheById(reservationId: number, seatId: number): Promise<Reservation> {
    const reservationCacheKey = RedisKey.createCacheKey(Reservation, seatId);
    return await this.redisCacheRepository.getHashValueByField(reservationCacheKey, `${reservationId}`, Reservation);
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
