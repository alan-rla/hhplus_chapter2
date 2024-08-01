import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { RedisCacheRepository } from '@src/domains/repositories/redis.cache.repository';
import { Mapper } from '@src/libs/mappers';
import Redis, { ChainableCommander } from 'ioredis';

@Injectable()
export class RedisCacheRepositoryImpl implements RedisCacheRepository {
  constructor(@InjectRedis() private readonly redisCache: Redis) {}

  // default ttl = 600 seconds
  async setString(
    key: string,
    value: object,
    ttl?: number,
    multi?: ChainableCommander,
  ): Promise<boolean | ChainableCommander> {
    const valueString = JSON.stringify(value);
    if (multi) return multi.set(key, valueString, 'EX', ttl || 600);
    else {
      const set = await this.redisCache.set(key, valueString, 'EX', ttl || 600);
      return set === 'OK';
    }
  }

  async getStringByKey<T>(key: string, outputClass: new () => T): Promise<T> {
    const value = JSON.parse(await this.redisCache.get(key));
    return Mapper.classTransformer(outputClass, value);
  }

  // unlink: 연결 먼저 해제 후 비동기로 value 삭제
  async unlinkByKey(key: string): Promise<boolean> {
    const unlink = await this.redisCache.unlink(key);
    return unlink === 1;
  }

  // default ttl = 600 seconds
  async setHash(
    key: string,
    field: string,
    value: object,
    ttl?: number,
    multi?: ChainableCommander,
  ): Promise<boolean | ChainableCommander> {
    const valueString = JSON.stringify(value);
    if (multi) return multi.hset(key, field, valueString).expire(key, ttl || 600);
    else {
      const hSet = await this.redisCache.hset(key, field, valueString);
      await this.redisCache.expire(key, ttl || 600);
      return hSet === 1;
    }
  }

  async getHashAllValues<T>(key: string, outputClass: new () => T): Promise<T[]> {
    const hashStrings = await this.redisCache.hvals(key);
    return hashStrings.map((string) => Mapper.classTransformer(outputClass, JSON.parse(string)));
  }

  async getHashValueByField<T>(key: string, field: string, outputClass: new () => T): Promise<T> {
    const hashString = await this.redisCache.hget(key, field);
    return Mapper.classTransformer(outputClass, JSON.parse(hashString));
  }

  // hash field 삭제는 unlink가 없음
  async delHashField(key: string, field: string, multi?: ChainableCommander): Promise<boolean | ChainableCommander> {
    if (multi) return multi.hdel(key, field);
    else {
      const del = await this.redisCache.hdel(key, field);
      return del === 1;
    }
  }

  async resetCache(): Promise<boolean> {
    const reset = await this.redisCache.reset();
    return reset === 'OK';
  }

  async watch(key: string): Promise<boolean> {
    const watch = await this.redisCache.watch(key);
    return watch === 'OK';
  }

  async unwatch(): Promise<boolean> {
    const unwatch = await this.redisCache.unwatch();
    return unwatch === 'OK';
  }

  async discard(): Promise<boolean> {
    const discard = await this.redisCache.discard();
    return discard === 'OK';
  }

  multi(): ChainableCommander {
    return this.redisCache.multi();
  }
}
