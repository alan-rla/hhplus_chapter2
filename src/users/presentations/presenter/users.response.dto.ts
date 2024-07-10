import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsUUID, validate } from 'class-validator';

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

  constructor(args) {
    Object.assign(this, args);
  }

  static async fromDomain(user) {
    const [error] = await validate(user);
    if (error) throw error;
    return new GetUserBalanceResponseDto(user);
  }
}

enum BalanceStatusEnum {
  CHARGE = 'CHARGE',
  USE = 'USE',
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
    enum: BalanceStatusEnum,
  })
  @IsEnum(BalanceStatusEnum)
  @IsNotEmpty()
  status: BalanceStatusEnum;

  @ApiProperty({
    example: 50000,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  constructor(args) {
    Object.assign(this, args);
  }

  static async fromDomain(user) {
    const [error] = await validate(user);
    if (error) throw error;
    return new PutUserBalanceResponseDto(user);
  }
}
