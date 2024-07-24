import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, ValidateNested } from 'class-validator';
import { SeatStatusEnum } from '@src/libs/types';

class SeatProperty {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    example: '스탠딩',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 10000,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  price: number;
}

export class SeatResponse {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  seatNumber: number;

  @ApiProperty({
    example: 'AVAILABLE',
  })
  @IsEnum(SeatStatusEnum)
  status: SeatStatusEnum;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  eventPropertyId: number;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  seatPropertyId: number;

  @ValidateNested()
  @ApiProperty({ type: SeatProperty })
  seatProperty: SeatProperty;
}
