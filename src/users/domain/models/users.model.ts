import { Expose } from 'class-transformer';
import { BalanceTypeEnum } from '../../../libs/types';
import { IsDate, IsEnum, IsNumber, IsUUID } from 'class-validator';

export class UserBalanceProps {
  @Expose()
  @IsNumber()
  id?: number;
  @Expose()
  @IsUUID()
  userId?: string;
  @Expose()
  @IsNumber()
  balance?: number;
}

export class BalanceHistoryProps {
  @Expose()
  @IsUUID()
  userId: string;
  @Expose()
  @IsNumber()
  amount: number;
  @Expose()
  @IsEnum(BalanceTypeEnum)
  type: BalanceTypeEnum;
}

export class UserBalance {
  @Expose()
  @IsNumber()
  id: number;
  @Expose()
  @IsUUID()
  userId: string;
  @Expose()
  @IsNumber()
  balance: number;
}

export class BalanceHistory {
  @Expose()
  @IsNumber()
  id: number;
  @Expose()
  @IsUUID()
  userId: string;
  @Expose()
  @IsEnum(BalanceTypeEnum)
  type: BalanceTypeEnum;
  @Expose()
  @IsNumber()
  amount: number;
  @Expose()
  @IsDate()
  createdAt: Date;
}
