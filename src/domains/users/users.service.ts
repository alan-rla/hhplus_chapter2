import { HttpException, Injectable } from '@nestjs/common';
import { UsersRepository } from '@src/domains/repositories';
import { BalanceHistory, UserBalance } from '@src/domains/users/users.model';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserBalanceByUserId(userId: string, lock?: true): Promise<UserBalance> {
    const userBalance = await this.usersRepository.getUserBalanceByUserId(userId, lock);
    if (!userBalance) throw new HttpException('USER_BALANCE_NOT_FOUND', 500);
    return userBalance;
  }

  @Transactional()
  async charge(userId: string, balance: number, amount: number): Promise<BalanceHistory> {
    await this.usersRepository.putUserBalance(userId, balance + amount);
    return await this.usersRepository.charge(userId, amount);
  }

  @Transactional()
  async use(userId: string, balance: number, amount: number): Promise<BalanceHistory> {
    if (balance < amount) throw new HttpException('NOT_ENOUGH_BALANCE', 500);

    await this.usersRepository.putUserBalance(userId, balance - amount);
    return await this.usersRepository.use(userId, amount);
  }

  @Transactional()
  async refund(userId: string, balance: number, amount: number): Promise<BalanceHistory> {
    await this.usersRepository.putUserBalance(userId, balance + amount);
    return await this.usersRepository.refund(userId, amount);
  }
}
