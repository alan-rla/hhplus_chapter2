import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisLocksService } from '@src/domains/redis.locks/redis.locks.service';

type EventPropertyLockInfo = {
  eventPropertyId: number;
  userId: string;
};

type PointLockInfo = {
  userId: string;
};

@Injectable()
export class EventPropertyLockGuard implements CanActivate {
  constructor(private readonly redisLocksService: RedisLocksService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { eventPropertyId, userId }: EventPropertyLockInfo = request.headers.queueInfo;
    const key = `EVENT_PROPERTY_LOCK:ID_${eventPropertyId}`;
    const subKey = `SUBSCRIPTIONS:${key}`;

    const lock = await this.redisLocksService.getSortedSetByKeyAndUserId(key, userId);
    const subscription = await this.redisLocksService.getSortedSetByKeyAndUserId(subKey, userId);

    if (lock) return;
    else if (!lock) throw new UnauthorizedException({ status: 'LOCK_NOT_FOUND', msg: '락 없음' });
    else if (subscription) throw new UnauthorizedException({ status: 'LOCK_YET_STANDBY', msg: '락 획득 대기중' });
    else throw new UnauthorizedException({ status: 'TRY_AGAIN_LATER', msg: '나중에 다시 오세요' });
  }
}

@Injectable()
export class PointLockGuard implements CanActivate {
  constructor(private readonly redisLocksService: RedisLocksService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId }: PointLockInfo = request.headers.queueInfo;
    const key = `POINT_LOCK:ID_${userId}`;
    const subKey = `SUBSCRIPTIONS:${key}`;

    const lock = await this.redisLocksService.getSortedSetByKeyAndUserId(key, userId);
    const subscription = await this.redisLocksService.getSortedSetByKeyAndUserId(subKey, userId);

    if (lock) return;
    else if (!lock) throw new UnauthorizedException({ status: 'LOCK_NOT_FOUND', msg: '락 없음' });
    else if (subscription) throw new UnauthorizedException({ status: 'LOCK_YET_STANDBY', msg: '락 획득 대기중' });
    else throw new UnauthorizedException({ status: 'TRY_AGAIN_LATER', msg: '나중에 다시 오세요' });
  }
}
