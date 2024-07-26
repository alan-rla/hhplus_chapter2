import { Injectable } from '@nestjs/common';
import { RedisLocksService } from '@src/domains/redis.locks/redis.locks.service';
import { BalanceHistory, UserBalance } from '@src/domains/users/users.model';
import { UsersService } from '@src/domains/users/users.service';

@Injectable()
export class UsersFacade {
  constructor(
    private readonly usersService: UsersService,
    private readonly redisLocksService: RedisLocksService,
  ) {}

  async getUserBalanceByUserId(userId: string): Promise<UserBalance> {
    return await this.usersService.getUserBalanceByUserId(userId);
  }

  async charge(userId: string, amount: number): Promise<BalanceHistory> {
    const userBalance = await this.usersService.getUserBalanceByUserId(userId, true);
    const key = `POINT_LOCK:ID_${userId}`;
    const acquireLock = await this.redisLocksService.acquireLock(key, userId);
    if (acquireLock) {
      const chargeHistory = await this.usersService.charge(userId, userBalance.balance, amount);
      await this.redisLocksService.removeLock(key, userId);
      return chargeHistory;
    } else {
      await this.redisLocksService.addUserToSubscription(key, userId);
      return this.redisLocksService.listenMessage(key, userId).then(async () => {
        const chargeHistory = await this.usersService.charge(userId, userBalance.balance, amount);
        await this.redisLocksService.removeLock(key, userId);
        return chargeHistory;
      });
    }
  }
}
