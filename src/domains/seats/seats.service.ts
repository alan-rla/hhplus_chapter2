import { HttpException, Injectable } from '@nestjs/common';
import { SeatStatusEnum } from '@src/libs/types';
import { RedisCacheRepository, SeatsRepository } from '@src/domains/repositories';
import { Seat } from '@src/domains/seats/seats.model';
import { RedisKey } from '@src/libs/utils/redis.key.generator';
import { ChainableCommander } from 'ioredis';

@Injectable()
export class SeatsService {
  constructor(
    private readonly seatsRepository: SeatsRepository,
    private readonly redisCacheRepository: RedisCacheRepository,
  ) {}

  async getSeatsByEventPropertyId(eventPropertyId: number): Promise<Seat[]> {
    return await this.seatsRepository.getSeats(eventPropertyId);
  }

  async getSeatsCacheByEventPropertyId(eventPropertyId: number): Promise<Seat[]> {
    const cacheKey = RedisKey.createCacheKey(Seat, eventPropertyId);
    return await this.redisCacheRepository.getHashAllValues(cacheKey, Seat);
  }

  async getSeatById(seatId: number, lock?: boolean): Promise<Seat> {
    // if (lock) = optimistic lock
    const seat = await this.seatsRepository.getSeatById(seatId, lock);
    if (!seat) throw new HttpException('SEAT_NOT_FOUND', 500);
    return seat;
  }

  async getSeatCacheById(seatId: number, eventPropertyId: number): Promise<Seat> {
    const cacheKey = RedisKey.createCacheKey(Seat, eventPropertyId);
    return await this.redisCacheRepository.getHashValueByField(cacheKey, `${seatId}`, Seat);
  }

  async putSeatStatusToOccupied(seat: Seat): Promise<Seat> {
    // 좌석 상태 검증
    if (seat.status === SeatStatusEnum.OCCUPIED) throw new HttpException('SEAT_OCCUPIED', 500);
    // 좌석 상태 AVAILABLE => OCCUPIED 변경
    await this.seatsRepository.putSeatStatus(seat.id, SeatStatusEnum.OCCUPIED);
    seat.status = SeatStatusEnum.OCCUPIED;
    return seat;
  }

  async setSeatCacheToOccupied(seat: Seat, multi?: ChainableCommander): Promise<boolean | ChainableCommander> {
    if (seat.status === SeatStatusEnum.OCCUPIED) throw new HttpException('SEAT_OCCUPIED', 500);
    seat.status = SeatStatusEnum.OCCUPIED;
    const cacheKey = RedisKey.createCacheKey(Seat, seat.eventPropertyId);
    return multi
      ? this.redisCacheRepository.setHash(cacheKey, `${seat.id}`, seat, 6000, multi)
      : await this.redisCacheRepository.setHash(cacheKey, `${seat.id}`, seat, 6000);
  }
}
