import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, IsUUID, ValidateIf } from 'class-validator';
import { ReservationStatusEnum } from '@src/libs/types';

export class ReservationResponse {
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
  seatId: number;

  @ApiProperty({
    example: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'RESERVED',
  })
  @IsEnum(ReservationStatusEnum)
  status: ReservationStatusEnum;

  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  @ValidateIf((o) => o.deletedAt !== null)
  @IsNotEmpty()
  deletedAt: Date;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  eventId: number;

  @ApiProperty({
    example: '공연 이름',
  })
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  eventPropertyId: number;

  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  @IsNotEmpty()
  eventDate: Date;

  @ApiProperty({
    example: 50000,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  price: number;
}
