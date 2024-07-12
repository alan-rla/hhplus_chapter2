import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../domain/repositories/users.repository';
import { BalanceHistory, UserBalance } from '../../domain/models/users.model';
import { BalanceHistoryEntity, UserBalanceEntity } from '../entities';
import { UserMapper } from '../mappers/users.mapper';
import { BalanceTypeEnum } from '../../../libs/types';
import { EntityManager } from 'typeorm';

@Injectable()
export class UsersRepositoryImpl implements UsersRepository {
  constructor(private entityManager: EntityManager) {}

  getManager(): EntityManager {
    return this.entityManager;
  }

  async getUserBalanceById(userId: string, transactionalEntityManager?: EntityManager): Promise<UserBalance> {
    const entity = UserMapper.toUserBalanceEntity({ userId });
    const userBalance = await (transactionalEntityManager ? transactionalEntityManager : this.getManager())
      .getRepository(UserBalanceEntity)
      .findOne({ where: entity });
    return UserMapper.toUserBalanceDomain(userBalance);
  }

  async putUserBalance(
    userId: string,
    balance: number,
    transactionalEntityManager: EntityManager,
  ): Promise<UserBalance> {
    const entity = UserMapper.toUserBalanceEntity({ userId, balance });
    const userBalance = await transactionalEntityManager
      .createQueryBuilder()
      .update(UserBalanceEntity)
      .set(entity)
      .where('userId = :userId', { userId })
      .execute();

    return UserMapper.toUserBalanceDomain(userBalance.raw[0]);
  }

  async charge(userId: string, amount: number, transactionalEntityManager: EntityManager): Promise<BalanceHistory> {
    const type = BalanceTypeEnum.CHARGE;
    const entity = UserMapper.toBalanceHistoryEntity({ userId, amount, type });
    const balanceHistory = await transactionalEntityManager
      .createQueryBuilder()
      .insert()
      .into(BalanceHistoryEntity)
      .values(entity)
      .returning('*')
      .execute();

    return UserMapper.toBalanceHistoryDomain(balanceHistory.raw[0]);
  }

  async use(userId: string, amount: number, transactionalEntityManager: EntityManager): Promise<BalanceHistory> {
    const type = BalanceTypeEnum.USE;
    const entity = UserMapper.toBalanceHistoryEntity({ userId, amount, type });
    const balanceHistory = await transactionalEntityManager
      .createQueryBuilder()
      .insert()
      .into(BalanceHistoryEntity)
      .values(entity)
      .returning('*')
      .execute();

    return UserMapper.toBalanceHistoryDomain(balanceHistory.raw[0]);
  }

  async refund(userId: string, amount: number, transactionalEntityManager: EntityManager): Promise<BalanceHistory> {
    const type = BalanceTypeEnum.REFUND;
    const entity = UserMapper.toBalanceHistoryEntity({ userId, amount, type });
    const balanceHistory = await transactionalEntityManager
      .createQueryBuilder()
      .insert()
      .into(BalanceHistoryEntity)
      .values(entity)
      .returning('*')
      .execute();

    return UserMapper.toBalanceHistoryDomain(balanceHistory.raw[0]);
  }
}
