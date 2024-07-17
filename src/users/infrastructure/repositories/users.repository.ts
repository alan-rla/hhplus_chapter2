import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../domain/repositories/users.repository';
import { BalanceHistory, UserBalance } from '../../domain/models/users.model';
import { BalanceHistoryEntity, UserBalanceEntity } from '../entities';
import { BalanceTypeEnum } from '../../../libs/types';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Mapper } from '../../../libs/mappers';

@Injectable()
export class UsersRepositoryImpl implements UsersRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getUserBalanceById(userId: string): Promise<UserBalance> {
    const entity = await Mapper.classTransformer(UserBalanceEntity, { userId });
    const userBalance = await this.dataSource.getRepository(UserBalanceEntity).findOne({ where: entity });
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
