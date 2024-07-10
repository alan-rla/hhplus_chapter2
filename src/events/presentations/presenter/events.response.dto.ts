import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, IsUUID, validate } from 'class-validator';

enum SeatStatusEnum {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
}

enum ReservationStatusEnum {
  RESERVED = 'RESERVED',
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export class EventDatesResponseDto {
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
  eventId: number;

  @ApiProperty({
    example: 50,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  seatCount: number;

  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  @IsNotEmpty()
  bookStartDate: Date;

  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  @IsNotEmpty()
  bookEndDate: Date;

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
  @IsNotEmpty()
  deletedAt: Date;

  constructor(args) {
    Object.assign(this, args);
  }

  static async fromDomain(eventDates) {
    const [error] = await validate(eventDates);
    if (error) throw error;
    return new EventDatesResponseDto(eventDates);
  }
}

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
  status: string;

  @ApiProperty({
    example: 10000,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  price: number;
}

export class EventSeatsResponseDto {
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
  status: string;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  propertyId: number;

  @ApiProperty({ type: SeatProperty })
  seatProperty: SeatProperty;

  constructor(args) {
    Object.assign(this, args);
  }

  static async fromDomain(eventSeats) {
    const [error] = await validate(eventSeats);
    if (error) throw error;
    return new EventSeatsResponseDto(eventSeats);
  }
}

export class ReservationResponseDto {
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
  status: string;

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
  eventName: number;

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

  constructor(args) {
    Object.assign(this, args);
  }

  static async fromDomain(reservation) {
    const [error] = await validate(reservation);
    if (error) throw error;
    return new ReservationResponseDto(reservation);
  }
}
