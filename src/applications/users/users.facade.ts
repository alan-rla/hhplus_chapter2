import { HttpException, Injectable } from '@nestjs/common';
import { RedisCacheService } from '@src/domains/redis.cache/redis.cache.service';
import { BalanceHistory, UserBalance } from '@src/domains/users/users.model';
import { UsersService } from '@src/domains/users/users.service';
import { RedisKey } from '@src/libs/utils/redis.key.generator';

@Injectable()
export class UsersFacade {
  constructor(
    private readonly usersService: UsersService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async getUserBalanceByUserId(userId: string): Promise<UserBalance> {
    return (
      (await this.usersService.getUserBalanceCacheByUserId(userId)) ||
      (await this.usersService.getUserBalanceByUserId(userId))
    );
  }

  async charge(userId: string, amount: number): Promise<BalanceHistory> {
    try {
      // 사용자 잔액 캐시 lock
      const ubCacheKey = RedisKey.createCacheKey(UserBalance, userId);
      await this.redisCacheService.watch(ubCacheKey);
      const userBalance = await this.getUserBalanceByUserId(userId);
      const { userBalanceAfter, balanceHistory } = await this.usersService.charge(userBalance, amount);
      await this.redisTransaction(userBalanceAfter, balanceHistory);
      return balanceHistory;
    } catch (err) {
      if (err.message.includes('NOT_FOUND')) await this.redisCacheService.discard();
    }
  }

  private redisTxCount = 0;
  async redisTransaction(userBalanceAfter: UserBalance, balanceHistory: BalanceHistory): Promise<void> {
    const multi = this.redisCacheService.multi();
    this.usersService.setUserBalanceCache(userBalanceAfter, multi);
    this.usersService.setBalanceHistoryCache(balanceHistory, multi);
    const result = await multi.exec();
    if (!result) {
      if (this.redisTxCount < 5) {
        setTimeout(() => {}, 100);
        this.redisTxCount += 1;
        return await this.redisTransaction(userBalanceAfter, balanceHistory);
      } else throw new HttpException('REDIS_PAYMENT_TX_FAILED', 500);
    } else {
      this.redisTxCount = 0;
      return;
    }
  }
}
