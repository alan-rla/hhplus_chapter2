import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

export class GetEventDatesDto {
  @ApiProperty({
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  eventId: number;
}

export class GetEventDateSeatsDto {
  @ApiProperty({
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  propertyId: number;
}

export class PostSeatReservationDto {
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
}

export class PutReservationDto {
  @ApiProperty({
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  reservationId: number;
}
