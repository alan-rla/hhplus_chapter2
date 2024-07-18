import 'reflect-metadata';

import { ReservationStatusEnum, SeatStatusEnum } from '../../../libs/types';
import { IsDate, IsEnum, IsNumber, IsString, IsUUID, ValidateIf, ValidateNested } from 'class-validator';

export class EventProps {
  @IsNumber()
  id: number;
}

export class EventPropertyProps {
  @IsNumber()
  id?: number;

  @IsNumber()
  eventId?: number;
}

export class SeatProps {
  @IsNumber()
  id?: number;

  @IsNumber()
  eventPropertyId?: number;

  @IsEnum(SeatStatusEnum)
  status?: SeatStatusEnum;
}

export class ReservationProps {
  @IsUUID()
  userId?: string;

  @IsNumber()
  seatId?: number;
}

export class PaymentProps {
  @IsUUID()
  userId?: string;

  @IsNumber()
  reservationId: number;

  @IsNumber()
  balanceHistoryId?: number;
}

export class Event {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  starId: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  @ValidateIf((o) => o.deletedAt !== null)
  deletedAt: Date;
}

export class EventProperty {
  @IsNumber()
  id: number;

  @IsNumber()
  eventId: number;

  @IsDate()
  eventDate: Date;

  @IsNumber()
  seatCount: number;

  @IsDate()
  bookStartDate: Date;

  @IsDate()
  bookEndDate: Date;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  @ValidateIf((o) => o.deletedAt !== null)
  deletedAt: Date;

  @ValidateNested()
  event?: Event;
}

export class SeatProperty {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  price: number;
}

export class Seat {
  @IsNumber()
  id: number;

  @IsNumber()
  seatNumber: number;

  @IsEnum(SeatStatusEnum)
  status: SeatStatusEnum;

  @IsNumber()
  eventPropertyId: number;

  @IsNumber()
  seatPropertyId: number;

  @ValidateNested()
  seatProperty: SeatProperty;
}

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

export class Payment {
  @IsNumber()
  id: number;

  @IsNumber()
  reservationId: number;

  @IsNumber()
  balanceHistoryId: number;
}
