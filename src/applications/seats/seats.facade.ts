import { Injectable } from '@nestjs/common';
import { Seat } from '@src/domains/seats/seats.model';
import { SeatsService } from '@src/domains/seats/seats.service';
import { RedisLocksService } from '@src/domains/redis.locks/redis.locks.service';

@Injectable()
export class SeatsFacade {
  constructor(
    private readonly seatsService: SeatsService,
    private readonly redisLocksService: RedisLocksService,
  ) {}

  async getSeatsByEventPropertyId(eventPropertyId: number, userId: string): Promise<Seat[]> {
    const key = `EVENT_PROPERTY_LOCK:ID_${eventPropertyId}`;
    // 락 획득 시도
    const acquireLock = await this.redisLocksService.acquireLock(key, userId);
    if (acquireLock) {
      // 락 획득 시 공연의 좌석 반환
      return await this.seatsService.getSeatsByEventPropertyId(eventPropertyId);
    } else {
      // 락 힉득 실패 시 공연 속성 ID 채널에 사용자 구독시키기
      await this.redisLocksService.addUserToSubscription(key, userId);
      // 1. 구독 및 LOCK 획득 대기방 추가 후 publishing되는 메세지 듣기
      // 2. 대기방에서 나온 후 락 획득 및 좌석 반환
      return this.redisLocksService.listenMessage(key, userId).then(async () => {
        return await this.seatsService.getSeatsByEventPropertyId(eventPropertyId);
      });
    }
  }
}
