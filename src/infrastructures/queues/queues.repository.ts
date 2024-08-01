import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { QueuesRepository } from '@src/domains/repositories';
import Redis from 'ioredis';

@Injectable()
export class QueuesRepositoryImpl implements OnModuleDestroy, QueuesRepository {
  constructor(@InjectRedis() private readonly redisQueue: Redis) {}

  // NX: Only add new elements
  async saveSortedSet(key: string, userId: string): Promise<number> {
    return await this.redisQueue.zadd(key, 'NX', Date.now(), userId);
  }

  // complexity: O(1)
  async getSortedSetCount(key: string): Promise<number> {
    return await this.redisQueue.zcard(key);
  }
  // complexity: O(log(N)+M)
  // Sorted Set Date.now() 적은 순서대로 (만들어진 순서대로) 가져오기
  async getSortedSetDateAsc(key: string, limit?: number): Promise<string[]> {
    return await this.redisQueue.zrange(key, 0, limit - 1 || -1);
  }
  // complexity: O(log(N))
  // Sorted Set Date.now() 낮은 순서대로 몇번째 인지 출력
  async getSortedSetDateAscRank(key: string, userId: string): Promise<number> {
    return await this.redisQueue.zrank(key, userId);
  }
  // complexity: O(N) N = 검색 member 갯수
  // 검색한 멤버의 값이 없으면 [null] 반환
  async getSortedSetByKeyAndUserId(key: string, userId: string): Promise<string> {
    return await this.redisQueue.zmscore(key, userId)[0];
  }

  async removeSortedSet(key: string, userIds: string[]): Promise<void> {
    await this.redisQueue.zrem(key, ...userIds);
  }

  async saveSet(key: string, members: string[]): Promise<void> {
    await this.redisQueue.sadd(key, ...members);
  }

  async getAllMembersInSet(key: string): Promise<string[]> {
    return await this.redisQueue.smembers(key);
  }

  async scanSet(key: string, pattern: string, count: number): Promise<string[]> {
    let cursor = '0';
    let members: string[] = [];
    do {
      const [nextCursor, foundMembers] = await this.redisQueue.sscan(key, cursor, 'MATCH', pattern, 'COUNT', count);
      cursor = nextCursor;
      members = members.concat(foundMembers);
    } while (cursor !== '0');
    return members;
  }

  async removeMembersInSet(key: string, members: string[]): Promise<void> {
    await this.redisQueue.srem(key, ...members);
  }

  onModuleDestroy() {
    this.redisQueue.quit();
  }
}
