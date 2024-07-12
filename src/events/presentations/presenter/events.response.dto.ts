import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, IsUUID } from 'class-validator';
import { ReservationStatusEnum, SeatStatusEnum } from '../../../libs/types';

export class EventDatesResponseDto {
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
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  eventId: number;

  @Expose()
  @ApiProperty({
    example: 50,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  seatCount: number;

  @Expose()
  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  @IsNotEmpty()
  bookStartDate: Date;

  @Expose()
  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  @IsNotEmpty()
  bookEndDate: Date;

  @Expose()
  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @Expose()
  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  @Expose()
  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  @IsNotEmpty()
  deletedAt: Date;
}

class SeatProperty {
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
    example: '스탠딩',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @ApiProperty({
    example: 10000,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  price: number;
}

export class EventSeatsResponseDto {
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
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  seatNumber: number;

  @Expose()
  @ApiProperty({
    example: 'AVAILABLE',
  })
  @IsEnum(SeatStatusEnum)
  status: SeatStatusEnum;

  @Expose()
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  propertyId: number;

  @Expose()
  @ApiProperty({ type: SeatProperty })
  seatProperty: SeatProperty;
}

export class ReservationResponseDto {
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
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  seatId: number;

  @Expose()
  @ApiProperty({
    example: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @Expose()
  @ApiProperty({
    example: 'RESERVED',
  })
  @IsEnum(ReservationStatusEnum)
  status: ReservationStatusEnum;

  @Expose()
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  eventId: number;

  @Expose()
  @ApiProperty({
    example: '공연 이름',
  })
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @Expose()
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  eventPropertyId: number;

  @Expose()
  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  @IsNotEmpty()
  eventDate: Date;

  @Expose()
  @ApiProperty({
    example: 50000,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  price: number;
}
