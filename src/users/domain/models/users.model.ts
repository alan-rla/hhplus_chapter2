import { BalanceTypeEnum } from '../../../libs/types';

export type UserBalanceProps = {
  id?: number;
  userId?: string;
  balance?: number;
};

export type BalanceHistoryProps = {
  userId: string;
  amount: number;
  type: BalanceTypeEnum;
};

export class UserBalance {
  id: number;
  userId: string;
  balance: number;
}

export class BalanceHistory {
  id: number;
  userId: string;
  type: BalanceTypeEnum;
  amount: number;
  createdAt: Date;
}
