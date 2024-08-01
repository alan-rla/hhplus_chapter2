import { Injectable } from '@nestjs/common';
import { RedisCacheRepository } from '@src/domains/repositories';
import { ChainableCommander } from 'ioredis';

@Injectable()
export class RedisCacheService {
  constructor(private readonly redisCacheRepository: RedisCacheRepository) {}

  // default ttl = 600 seconds
  async setString(
    key: string,
    value: object,
    ttl?: number,
    multi?: ChainableCommander,
  ): Promise<boolean | ChainableCommander> {
    return multi
      ? this.redisCacheRepository.setString(key, value, ttl, multi)
      : await this.redisCacheRepository.setString(key, value, ttl);
  }

  async getStringByKey<T>(key: string, outputClass: new () => T): Promise<T> {
    return await this.redisCacheRepository.getStringByKey(key, outputClass);
  }

  // unlink: 연결 먼저 해제 후 비동기로 value 삭제
  async unlinkByKey(key: string): Promise<boolean> {
    return await this.redisCacheRepository.unlinkByKey(key);
  }

  // default ttl = 600 seconds
  async setHash(
    key: string,
    field: string,
    value: object,
    ttl?: number,
    multi?: ChainableCommander,
  ): Promise<boolean | ChainableCommander> {
    return multi
      ? this.redisCacheRepository.setHash(key, field, value, ttl, multi)
      : await this.redisCacheRepository.setHash(key, field, value, ttl);
  }

  async getHashAllValues<T>(key: string, outputClass: new () => T): Promise<T[]> {
    return await this.redisCacheRepository.getHashAllValues(key, outputClass);
  }

  async getHashValueByField<T>(key: string, field: string, outputClass: new () => T): Promise<T> {
    return await this.redisCacheRepository.getHashValueByField(key, field, outputClass);
  }

  // hash field 삭제는 unlink가 없음
  async delHashField(key: string, field: string, multi?: ChainableCommander): Promise<boolean | ChainableCommander> {
    return multi
      ? this.redisCacheRepository.delHashField(key, field, multi)
      : await this.redisCacheRepository.delHashField(key, field);
  }

  async resetCache(): Promise<boolean> {
    return await this.redisCacheRepository.resetCache();
  }

  async watch(key: string): Promise<boolean> {
    return await this.redisCacheRepository.watch(key);
  }

  async unwatch(): Promise<boolean> {
    return await this.redisCacheRepository.unwatch();
  }

  async discard(): Promise<boolean> {
    return await this.redisCacheRepository.discard();
  }

  multi(): ChainableCommander {
    return this.redisCacheRepository.multi();
  }
}
