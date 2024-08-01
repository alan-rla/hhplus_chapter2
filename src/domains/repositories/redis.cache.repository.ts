import { ChainableCommander } from 'ioredis';

export abstract class RedisCacheRepository {
  abstract setString(
    key: string,
    value: object,
    ttl?: number,
    multi?: ChainableCommander,
  ): Promise<boolean | ChainableCommander>;

  abstract getStringByKey<T>(key: string, outputClass: new () => T): Promise<T>;

  abstract unlinkByKey(key: string): Promise<boolean>;

  abstract setHash(
    key: string,
    field: string,
    value: object,
    ttl?: number,
    multi?: ChainableCommander,
  ): Promise<boolean | ChainableCommander>;

  abstract getHashAllValues<T>(key: string, outputClass: new () => T): Promise<T[]>;

  abstract getHashValueByField<T>(key: string, field: string, outputClass: new () => T): Promise<T>;

  abstract delHashField(key: string, field: string, multi?: ChainableCommander): Promise<boolean | ChainableCommander>;

  abstract resetCache(): Promise<boolean>;

  abstract watch(key: string): Promise<boolean>;

  abstract unwatch(): Promise<boolean>;

  abstract discard(): Promise<boolean>;

  abstract multi(): ChainableCommander;
}
