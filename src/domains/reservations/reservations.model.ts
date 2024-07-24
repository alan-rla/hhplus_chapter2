import { IsDate, IsEnum, IsNumber, IsString, IsUUID, ValidateIf } from 'class-validator';
import { ReservationStatusEnum } from '@src/libs/types';

export class Reservation {
  @IsNumber()
  id: number;

  @IsNumber()
  seatId: number;

  @IsUUID()
  userId: string;

  @IsEnum(ReservationStatusEnum)
  status: ReservationStatusEnum;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  @ValidateIf((o) => o.deletedAt !== null)
  deletedAt: Date;

  @IsNumber()
  eventId: number;

  @IsString()
  eventName: string;

  @IsNumber()
  eventPropertyId: number;

  @IsDate()
  eventDate: Date;

  @IsNumber()
  price: number;
}
