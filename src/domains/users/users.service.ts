import { HttpException, Injectable } from '@nestjs/common';
import { RedisCacheRepository, UsersRepository } from '@src/domains/repositories';
import { BalanceHistory, UserBalance } from '@src/domains/users/users.model';
import { RedisKey } from '@src/libs/utils/redis.key.generator';
import { ChainableCommander } from 'ioredis';
import { Transactional } from 'typeorm-transactional';

interface BalanceResult {
  userBalanceAfter: UserBalance;
  balanceHistory: BalanceHistory;
}
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly redisCacheRepository: RedisCacheRepository,
  ) {}

  async getUserBalanceByUserId(userId: string, lock?: boolean): Promise<UserBalance> {
    const userBalance = await this.usersRepository.getUserBalanceByUserId(userId, lock);
    if (!userBalance) throw new HttpException('USER_BALANCE_NOT_FOUND', 500);
    return userBalance;
  }

  async getUserBalanceCacheByUserId(userId: string): Promise<UserBalance> {
    const userBalanceCacheKey = RedisKey.createCacheKey(UserBalance, userId);
    return await this.redisCacheRepository.getStringByKey(userBalanceCacheKey, UserBalance);
  }

  @Transactional()
  async charge(userBalance: UserBalance, amount: number): Promise<BalanceResult> {
    // 사용자 잔액 변경
    const userBalanceAfter = Object.assign({}, { ...userBalance, balance: userBalance.balance + amount });
    await this.usersRepository.putUserBalance(userBalanceAfter.userId, userBalanceAfter.balance);
    // 사용자 잔액 충전 기록 생성
    const balanceHistory = await this.usersRepository.charge(userBalanceAfter.userId, amount);
    return { userBalanceAfter, balanceHistory };
  }

  @Transactional()
  async use(userBalance: UserBalance, amount: number): Promise<BalanceResult> {
    if (userBalance.balance < amount) throw new HttpException('NOT_ENOUGH_BALANCE', 500);
    // 사용자 잔액 변경
    const userBalanceAfter = Object.assign({}, { ...userBalance, balance: userBalance.balance - amount });
    await this.usersRepository.putUserBalance(userBalanceAfter.userId, userBalanceAfter.balance);
    // 사용자 잔액 충전 기록 생성
    const balanceHistory = await this.usersRepository.use(userBalanceAfter.userId, amount);
    return { userBalanceAfter, balanceHistory };
  }

  async setUserBalanceCache(
    userBalance: UserBalance,
    multi?: ChainableCommander,
  ): Promise<boolean | ChainableCommander> {
    const userBalanceCacheKey = RedisKey.createCacheKey(UserBalance, userBalance.userId);
    return multi
      ? this.redisCacheRepository.setString(userBalanceCacheKey, userBalance, 6000, multi)
      : await this.redisCacheRepository.setString(userBalanceCacheKey, userBalance, 6000);
  }

  async setBalanceHistoryCache(
    balanceHistory: BalanceHistory,
    multi?: ChainableCommander,
  ): Promise<boolean | ChainableCommander> {
    const bhCacheKey = RedisKey.createCacheKey(BalanceHistory, balanceHistory.userId);
    return multi
      ? this.redisCacheRepository.setHash(bhCacheKey, `${balanceHistory.id}`, balanceHistory, 6000, multi)
      : await this.redisCacheRepository.setHash(bhCacheKey, `${balanceHistory.id}`, balanceHistory, 6000);
  }
}
