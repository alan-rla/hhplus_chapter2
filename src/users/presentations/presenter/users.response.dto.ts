import { ApiProperty } from '@nestjs/swagger';

import { IsDate, IsEnum, IsInt, IsNotEmpty, IsPositive, IsUUID } from 'class-validator';
import { BalanceTypeEnum } from '../../../libs/types';

export class GetUserBalanceResponseDto {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    example: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 50000,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  balance: number;
}

export class PutUserBalanceResponseDto {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    example: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'CHARGE',
    enum: BalanceTypeEnum,
  })
  @IsEnum(BalanceTypeEnum)
  @IsNotEmpty()
  type: BalanceTypeEnum;

  @ApiProperty({
    example: 50000,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  createdAt: Date;
}
