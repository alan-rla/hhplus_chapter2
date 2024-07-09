import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class BalanceAmountDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  amount: number;
}
