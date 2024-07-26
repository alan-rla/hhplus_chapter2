import { HttpException, Injectable } from '@nestjs/common';
import { RedisLocksRepository } from '@src/domains/repositories';

@Injectable()
export class RedisLocksService {
  constructor(private readonly redisLocksRepository: RedisLocksRepository) {}
  private maxLock = 10;
  private maxSubscription = 1000;

  // const key = `EVENT_PROPERTY_LOCK:ID_${eventPropertyId}`;
  async acquireLock(key: string, userId: string): Promise<boolean> {
    const lockCount = await this.redisLocksRepository.getSortedSetCount(key);
    // lockCount 10개 이상이면 subscribe
    if (lockCount < this.maxLock) {
      const lock = await this.redisLocksRepository.getSortedSetByKeyAndUserId(key, userId);
      if (lock) throw new HttpException('DUPLICATE_LOCK', 500);
      await this.redisLocksRepository.saveSortedSet(key, userId);
      return true;
    } else return false;
  }

  async getSortedSetByKeyAndUserId(key: string, userId: string): Promise<string> {
    return await this.redisLocksRepository.getSortedSetByKeyAndUserId(key, userId);
  }

  async removeLock(key: string, userId: string): Promise<void> {
    await this.redisLocksRepository.removeSortedSet(key, [userId]);
    // 락 제거했다고 메세지 publish
    await this.redisLocksRepository.publish(key, userId);
    await this.redisLocksRepository.unsubscribe(key);
  }

  // 락 획득 못하면 subscription channel에 구독, subscription sorted set에 저장시키고 대기
  /**
   * sortedSet: `EVENT_PROPERTY_LOCK:ID_${eventPropertyId}` = transaction 실행 가능한 sorted set / 구독 채널
   * *          `POINT_LOCK:ID_${userId}`                   =
   *            `SUBSCRIPTIONS:EVENT_PROPERTY_LOCK:ID_${eventPropertyId}` = 대기중인 sorted set
   * *          `SUBSCRIPTIONS:POINT_LOCK:ID_${userId}`                   =
   * channel:   `EVENT_PROPERTY_LOCK:ID_${eventPropertyId}` = 대기중인 그룹이 구독중인 채널
   */
  async addUserToSubscription(key: string, userId: string): Promise<void> {
    const subKey = `SUBSCRIPTIONS:${key}`;
    const subscriptionCount = await this.redisLocksRepository.getSortedSetCount(subKey);
    if (subscriptionCount < this.maxSubscription) {
      const subscription = await this.redisLocksRepository.getSortedSetByKeyAndUserId(subKey, userId);
      if (!subscription) await this.redisLocksRepository.saveSortedSet(subKey, userId);
      await this.redisLocksRepository.subscribe(key);
    } else throw new HttpException('TOO_MANY_SUBSCRIBERS', 500);
  }

  listenMessage(channel: string, userId: string): Promise<boolean> {
    const subKey = `SUBSCRIPTIONS:${channel}`;
    return new Promise((resolve) => {
      this.redisLocksRepository.listenMessage(channel, async (publishingChannel) => {
        if (channel === publishingChannel) {
          const lockCount = await this.redisLocksRepository.getSortedSetCount(channel);
          const availableLocks = this.maxLock - lockCount;
          if (availableLocks) {
            // 락 획득 대기중인 유저 중 대기열 빨리 입장한 순서대로 availableLocks 숫자만큼 가져옴
            const pendingUsers = await this.redisLocksRepository.getSortedSetDateAsc(subKey, availableLocks - 1);
            for (let i = 0; i < pendingUsers.length; i += 2) {
              const userId = pendingUsers[i];
              await this.redisLocksRepository.saveSortedSet(channel, userId);
              await this.redisLocksRepository.removeSortedSet(subKey, [userId]);
            }
          }
          // TODO: socket으로 앞에 몇명 남았는지 알려주는 기능 추가
          // 락 획득 대기중인 사용자 대기열에서 빼낸 후 rank 검색에서 null값 나와야함 => resolve
          const rank = await this.redisLocksRepository.getSortedSetDateAscRank(channel, userId);
          console.log(`${rank} users left in queue - ${channel}`);
          if (rank === null) resolve(true);
        }
      });
    });
  }

  async removeObsoleteLocks(key: string): Promise<void> {
    // rawLocks = ["userId1", "Date.now()", "userId2", "Date.now()"] 형식으로 출력
    const rawLocks = await this.redisLocksRepository.getSortedSetDateAsc(key);
    const twentyMinutesAgo = Date.now() - 20 * 60000;

    for (let i = 0; i < rawLocks.length; i += 2) {
      const userId = rawLocks[i];
      const dateMillis = parseInt(rawLocks[i + 1], 10);
      if (dateMillis < twentyMinutesAgo) await this.redisLocksRepository.removeSortedSet(key, [userId]);
      else break;
    }
  }
}
