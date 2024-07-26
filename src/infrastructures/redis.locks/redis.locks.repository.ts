import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisLocksRepository } from '@src/domains/repositories';
import Redis from 'ioredis';

// TODO: 질문 - 좌석 조회는 eventPropertyId, 포인트 부분은 userId 별로 채널을 생성하는게 맞는지?
// 그리고 한번에 좌석 조회를 할 수 있는 유저 수를 n명 이상 두기위해 SORTED SET를 사용했는데 괜찮은지?
@Injectable()
export class RedisLocksRepositoryImpl implements OnModuleDestroy, RedisLocksRepository {
  private readonly redisPublisher: Redis;
  private readonly redisSubscriber: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redisPublisher = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: +this.configService.get('REDIS_PORT'),
    });

    this.redisSubscriber = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: +this.configService.get('REDIS_PORT'),
    });

    this.redisSubscriber.on('message', async (channel, message) => {
      await this.handleMessage(channel, message);
    });
  }

  // complexity: O(1)
  async getSortedSetCount(key: string): Promise<number> {
    return await this.redisPublisher.zcard(key);
  }
  // complexity: O(log(N)+M)
  // Sorted Set Date.now() 적은 순서대로 (만들어진 순서대로) 가져오기
  async getSortedSetDateAsc(key: string, limit?: number): Promise<string[]> {
    return await this.redisPublisher.zrange(key, 0, limit || -1, 'WITHSCORES');
  }
  // complexity: O(log(N))
  // Sorted Set Date.now() 높은 순서대로 (최근 순서대로) 가져오기
  async getSortedSetDateAscRank(key: string, userId: string): Promise<number> {
    return await this.redisPublisher.zrank(key, userId);
  }
  // complexity: O(N) N = 검색 member 갯수
  // 검색한 멤버의 값이 없으면 [null] 반환
  async getSortedSetByKeyAndUserId(key: string, userId: string): Promise<string> {
    return await this.redisPublisher.zmscore(key, userId)[0];
  }

  async saveSortedSet(key: string, userId: string): Promise<void> {
    await this.redisPublisher.zadd(key, Date.now(), userId);
  }

  async removeSortedSet(key: string, userIds: string[]): Promise<void> {
    await this.redisPublisher.zrem(key, ...userIds);
  }

  async publish(channel: string, userId: string): Promise<void> {
    await this.redisPublisher.publish(channel, userId);
  }

  async subscribe(channel: string): Promise<void> {
    await this.redisSubscriber.subscribe(channel);
  }

  async listenMessage(listeningChannel: string, callback: (channel: string) => void): Promise<Redis> {
    await this.redisSubscriber.subscribe(listeningChannel);
    return this.redisSubscriber.on('message', async (channel) => callback(channel));
  }

  async unsubscribe(channel: string): Promise<void> {
    await this.redisSubscriber.unsubscribe(channel);
  }

  private async handleMessage(channel: string, userId: string): Promise<void> {
    await this.removeSortedSet(channel, [userId]);
  }

  onModuleDestroy() {
    this.redisSubscriber.quit();
    this.redisPublisher.quit();
  }
}
