import { Injectable } from '@nestjs/common';
import { BalanceTypeEnum } from '@src/libs/types';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Mapper } from '@src/libs/mappers';
import { UsersRepository } from '@src/domains/repositories';
import { BalanceHistory, UserBalance } from '@src/domains/users/users.model';
import { BalanceHistoryEntity, UserBalanceEntity } from '@src/infrastructures/entities';

@Injectable()
export class UsersRepositoryImpl implements UsersRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getUserBalanceByUserId(userId: string, lock?: boolean): Promise<UserBalance> {
    const entity = await Mapper.classTransformer(UserBalanceEntity, { userId });
    const findCondition = { where: entity };
    if (lock) Object.assign(findCondition, { lock: { mode: 'optimistic', version: 1 } });
    const userBalance = await this.dataSource.getRepository(UserBalanceEntity).findOne(findCondition);
    return await Mapper.classTransformer(UserBalance, userBalance);
  }

  async putUserBalance(userId: string, balance: number): Promise<boolean> {
    const entity = await Mapper.classTransformer(UserBalanceEntity, { userId, balance });
    const userBalance = await this.dataSource
      .createQueryBuilder()
      .update(UserBalanceEntity)
      .set(entity)
      .where('userId = :userId', { userId })
      .execute();

    return userBalance.affected[0] ? true : false;
  }

  async charge(userId: string, amount: number): Promise<BalanceHistory> {
    const type = BalanceTypeEnum.CHARGE;
    const entity = await Mapper.classTransformer(BalanceHistoryEntity, { userId, amount, type });
    const balanceHistory = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(BalanceHistoryEntity)
      .values(entity)
      .returning('*')
      .execute();

    return await Mapper.classTransformer(BalanceHistory, balanceHistory.raw[0]);
  }

  async use(userId: string, amount: number): Promise<BalanceHistory> {
    const type = BalanceTypeEnum.USE;
    const entity = await Mapper.classTransformer(BalanceHistoryEntity, { userId, amount, type });
    const balanceHistory = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(BalanceHistoryEntity)
      .values(entity)
      .returning('*')
      .execute();

    return await Mapper.classTransformer(BalanceHistory, balanceHistory.raw[0]);
  }

  async refund(userId: string, amount: number): Promise<BalanceHistory> {
    const type = BalanceTypeEnum.REFUND;
    const entity = await Mapper.classTransformer(BalanceHistoryEntity, { userId, amount, type });
    const balanceHistory = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(BalanceHistoryEntity)
      .values(entity)
      .returning('*')
      .execute();

    return await Mapper.classTransformer(BalanceHistory, balanceHistory.raw[0]);
  }
}
