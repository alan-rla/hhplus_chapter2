import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsPositive, IsUUID } from 'class-validator';
import { BalanceTypeEnum } from '../../../libs/types';

export class GetUserBalanceResponseDto {
  @Expose()
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @Expose()
  @ApiProperty({
    example: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @Expose()
  @ApiProperty({
    example: 50000,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  balance: number;
}

export class PutUserBalanceResponseDto {
  @Expose()
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @Expose()
  @ApiProperty({
    example: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @Expose()
  @ApiProperty({
    example: 'CHARGE',
    enum: BalanceTypeEnum,
  })
  @IsEnum(BalanceTypeEnum)
  @IsNotEmpty()
  type: BalanceTypeEnum;

  @Expose()
  @ApiProperty({
    example: 50000,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @Expose()
  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  createdAt: Date;
}
