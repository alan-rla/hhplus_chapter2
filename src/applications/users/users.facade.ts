import { Injectable } from '@nestjs/common';
import { BalanceHistory, UserBalance } from '@src/domains/users/users.model';
import { UsersService } from '@src/domains/users/users.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class UsersFacade {
  constructor(private readonly usersService: UsersService) {}

  async getUserBalanceByUserId(userId: string): Promise<UserBalance> {
    return await this.usersService.getUserBalanceByUserId(userId);
  }

  @Transactional()
  async charge(userId: string, amount: number): Promise<BalanceHistory> {
    const userBalance = await this.usersService.getUserBalanceByUserId(userId);
    return await this.usersService.charge(userId, userBalance.balance, amount);
  }
}
