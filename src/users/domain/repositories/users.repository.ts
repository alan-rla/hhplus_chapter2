import { EntityManager } from 'typeorm';
import { BalanceHistory, UserBalance } from '../models/users.model';

export interface UsersRepository {
  getUserBalanceById(userId: string, transactionalEntityManager?: EntityManager): Promise<UserBalance>;

  putUserBalance(userId: string, balance: number, transactionalEntityManager?: EntityManager): Promise<UserBalance>;

  charge(userId: string, amount: number, transactionalEntityManager?: EntityManager): Promise<BalanceHistory>;

  use(userId: string, amount: number, transactionalEntityManager?: EntityManager): Promise<BalanceHistory>;

  refund(userId: string, amount: number, transactionalEntityManager?: EntityManager): Promise<BalanceHistory>;
}
