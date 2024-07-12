import { HttpException, Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../domain/repositories/users.repository';
import { BalanceHistory, UserBalance } from '../domain/models/users.model';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getUserBalanceById(userId: string): Promise<UserBalance> {
    const userBalance = await this.usersRepository.getUserBalanceById(userId);
    if (Object.keys(userBalance).length === 0)
      throw new HttpException({ status: 'USER_BALANCE_NOT_FOUND', msg: '사용자 잔액 정보 없음' }, 500);
    return userBalance;
  }

  async charge(userId: string, amount: number): Promise<BalanceHistory> {
    try {
      return await this.dataSource.createEntityManager().transaction(async (transactionalEntityManager) => {
        const userBalance = await this.usersRepository.getUserBalanceById(userId, transactionalEntityManager);
        userBalance.balance += amount;
        await this.usersRepository.putUserBalance(userId, userBalance.balance, transactionalEntityManager);
        const balanceHistory = await this.usersRepository.charge(userId, amount, transactionalEntityManager);
        return balanceHistory;
      });
    } catch (err) {
      throw err;
    }
  }

  async use(userId: string, amount: number): Promise<BalanceHistory> {
    try {
      return await this.dataSource.createEntityManager().transaction(async (transactionalEntityManager) => {
        const userBalance = await this.usersRepository.getUserBalanceById(userId, transactionalEntityManager);
        userBalance.balance -= amount;

        if (userBalance.balance < 0) throw new HttpException({ status: 'NOT_ENOUGH_BALANCE', msg: '잔액 부족' }, 500);

        await this.usersRepository.putUserBalance(userId, amount, transactionalEntityManager);
        const balanceHistory = await this.usersRepository.use(userId, amount, transactionalEntityManager);
        return balanceHistory;
      });
    } catch (err) {
      throw err;
    }
  }

  async refund(userId: string, amount: number): Promise<BalanceHistory> {
    try {
      return await this.dataSource.createEntityManager().transaction(async (transactionalEntityManager) => {
        const userBalance = await this.usersRepository.getUserBalanceById(userId, transactionalEntityManager);
        userBalance.balance += amount;
        await this.usersRepository.putUserBalance(userId, amount, transactionalEntityManager);
        const balanceHistory = await this.usersRepository.refund(userId, amount, transactionalEntityManager);
        return balanceHistory;
      });
    } catch (err) {
      throw err;
    }
  }
}
