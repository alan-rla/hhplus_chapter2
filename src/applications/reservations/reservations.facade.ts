import { HttpException, Injectable } from '@nestjs/common';
import { EventProperty } from '@src/domains/events/events.model';
import { EventsService } from '@src/domains/events/events.service';
import { RedisCacheService } from '@src/domains/redis.cache/redis.cache.service';
import { Reservation } from '@src/domains/reservations/reservations.model';
import { ReservationsService } from '@src/domains/reservations/reservations.service';
import { Seat } from '@src/domains/seats/seats.model';
import { SeatsService } from '@src/domains/seats/seats.service';
import { RedisKey } from '@src/libs/utils/redis.key.generator';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ReservationsFacade {
  constructor(
    private readonly seatsService: SeatsService,
    private readonly eventsService: EventsService,
    private readonly reservationsService: ReservationsService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  // seat, eventProperty = write back (캐시에서 다 쓰다가 나중에 스케쥴러로 일괄 처리)
  // 멘토링 후 아무래도 데이터 저장 주체가 redis가 되는것은 위험한것 같아 write through로 다시 변경
  // reservation = write through (캐시, db 같이 쓰기)
  async postReservation(seatId: number, eventPropertyId: number, userId: string): Promise<Reservation> {
    try {
      // seat, event property redis 락 설정
      const seatLockKey = RedisKey.createLockKey(Seat, seatId);
      const epLockKey = RedisKey.createLockKey(EventProperty, eventPropertyId);
      await this.redisCacheService.watch(seatLockKey);
      await this.redisCacheService.watch(epLockKey);

      // 좌석 검색
      const seat = await this.seatsService.getSeatById(seatId, true);
      // 공연 속성 검색
      const eventProperty = await this.eventsService.getEventPropertyById(eventPropertyId, true);
      const reservation = await this.dbTransaction(seat, eventProperty, userId);
      await this.redisTransaction(seatLockKey, epLockKey, seat, eventProperty, reservation);
      return reservation;
    } catch (err) {
      if (err.message.includes('NOT_FOUND')) await this.redisCacheService.discard();
    }
  }

  @Transactional()
  async dbTransaction(seat: Seat, eventProperty: EventProperty, userId: string): Promise<Reservation> {
    // 좌석 상태 변경
    await this.seatsService.putSeatStatusToOccupied(seat);
    // 공연 속성 좌석 갯수 차감
    await this.eventsService.putEventPropertySeatCount(eventProperty, -1);
    return await this.reservationsService.postReservation(seat, eventProperty, userId);
  }

  private redisTxCount = 0;
  async redisTransaction(
    seatLockKey: string,
    epLockKey: string,
    seat: Seat,
    eventProperty: EventProperty,
    reservation: Reservation,
  ): Promise<Reservation> {
    const multi = this.redisCacheService.multi();
    multi.set(seatLockKey, 'lock');
    multi.set(epLockKey, 'lock');
    // 좌석 상태 AVAILABLE -> OCCUPIED 변경
    this.seatsService.setSeatCacheToOccupied(seat, multi);
    // EventProperty available 좌석 차감
    this.eventsService.setEventPropertyCacheSeatCount(eventProperty, -1, multi);
    // 예약 Post
    this.reservationsService.setReservationCache(reservation, multi);
    multi.unlink(seatLockKey, epLockKey);
    const result = await multi.exec();
    // watch중인 키의 값이 다른 요청에 의해 변경되면 result === null
    if (!result) {
      if (this.redisTxCount < 5) {
        setTimeout(() => {}, 100);
        this.redisTxCount += 1;
        return await this.redisTransaction(seatLockKey, epLockKey, seat, eventProperty, reservation);
      } else throw new HttpException('REDIS_RESERVATION_TX_FAILED', 500);
    } else {
      this.redisTxCount = 0;
      return;
    }
  }
}
