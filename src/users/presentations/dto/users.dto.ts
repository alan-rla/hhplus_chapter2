import { IsInt, IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

export class GetUserDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}

export class PutUserBalanceDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  amount: number;
}
