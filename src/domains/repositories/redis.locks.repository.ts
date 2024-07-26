import { Redis } from 'ioredis';

export abstract class RedisLocksRepository {
  abstract getSortedSetCount(key: string): Promise<number>;

  abstract getSortedSetDateAsc(key: string, limit?: number): Promise<string[]>;

  abstract getSortedSetDateAscRank(key: string, userId: string): Promise<number>;

  abstract getSortedSetByKeyAndUserId(key: string, userId: string): Promise<string>;

  abstract saveSortedSet(key: string, userId: string): Promise<void>;

  abstract removeSortedSet(key: string, userIds: string[]): Promise<void>;

  abstract subscribe(channel: string): Promise<void>;

  abstract listenMessage(listeningChannel: string, callback: (channel: string) => void): Promise<Redis>;

  abstract publish(channel: string, userId: string): Promise<void>;

  abstract unsubscribe(channel: string): Promise<void>;
}
