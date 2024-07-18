import { BalanceHistory, UserBalance } from '../models/users.model';

export abstract class UsersRepository {
  abstract getUserBalanceById(userId: string): Promise<UserBalance>;

  abstract putUserBalance(userId: string, balance: number): Promise<boolean>;

  abstract charge(userId: string, amount: number): Promise<BalanceHistory>;

  abstract use(userId: string, amount: number): Promise<BalanceHistory>;

  abstract refund(userId: string, amount: number): Promise<BalanceHistory>;
}
