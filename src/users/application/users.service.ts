import { HttpException, Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../domain/repositories/users.repository';
import { BalanceHistory, BalanceHistoryProps, UserBalance, UserBalanceProps } from '../domain/models/users.model';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
  ) {}

  async getUserBalanceById(args: UserBalanceProps): Promise<UserBalance> {
    const userBalance = await this.usersRepository.getUserBalanceById(args.userId);
    if (!userBalance) throw new HttpException('USER_BALANCE_NOT_FOUND', 500);
    return userBalance;
  }

  @Transactional()
  async charge(args: BalanceHistoryProps): Promise<BalanceHistory> {
    const userBalance = await this.usersRepository.getUserBalanceById(args.userId);
    if (!userBalance) throw new HttpException('USER_BALANCE_NOT_FOUND', 500);
    userBalance.balance += args.amount;
    await this.usersRepository.putUserBalance(args.userId, userBalance.balance);
    const balanceHistory = await this.usersRepository.charge(args.userId, args.amount);
    return balanceHistory;
  }

  @Transactional()
  async use(args: BalanceHistoryProps): Promise<BalanceHistory> {
    const userBalance = await this.usersRepository.getUserBalanceById(args.userId);
    if (!userBalance) throw new HttpException('USER_BALANCE_NOT_FOUND', 500);
    userBalance.balance -= args.amount;

    if (userBalance.balance < 0) throw new HttpException('NOT_ENOUGH_BALANCE', 500);

    await this.usersRepository.putUserBalance(args.userId, args.amount);
    const balanceHistory = await this.usersRepository.use(args.userId, args.amount);
    return balanceHistory;
  }

  @Transactional()
  async refund(args: BalanceHistoryProps): Promise<BalanceHistory> {
    const userBalance = await this.usersRepository.getUserBalanceById(args.userId);
    if (!userBalance) throw new HttpException('USER_BALANCE_NOT_FOUND', 500);
    userBalance.balance += args.amount;
    await this.usersRepository.putUserBalance(args.userId, args.amount);
    const balanceHistory = await this.usersRepository.refund(args.userId, args.amount);
    return balanceHistory;
  }
}
