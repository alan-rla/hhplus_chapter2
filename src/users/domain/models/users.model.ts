import { BalanceTypeEnum } from '../../../libs/types';
import { IsDate, IsEnum, IsNumber, IsUUID } from 'class-validator';

export class UserBalanceProps {
  @IsNumber()
  id?: number;

  @IsUUID()
  userId?: string;

  @IsNumber()
  balance?: number;
}

export class BalanceHistoryProps {
  @IsUUID()
  userId: string;

  @IsNumber()
  amount: number;

  @IsEnum(BalanceTypeEnum)
  type?: BalanceTypeEnum;
}

export class UserBalance {
  @IsNumber()
  id: number;

  @IsUUID()
  userId: string;

  @IsNumber()
  balance: number;
}

export class BalanceHistory {
  @IsNumber()
  id: number;

  @IsUUID()
  userId: string;

  @IsEnum(BalanceTypeEnum)
  type: BalanceTypeEnum;

  @IsNumber()
  amount: number;

  @IsDate()
  createdAt: Date;
}
