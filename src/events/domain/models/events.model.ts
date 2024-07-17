import { Expose } from 'class-transformer';
import { ReservationStatusEnum, SeatStatusEnum } from '../../../libs/types';
import { IsDate, IsEnum, IsNumber, IsString, IsUUID, ValidateIf, ValidateNested } from 'class-validator';

export class EventProps {
  @Expose()
  @IsNumber()
  id: number;
}

export class EventPropertyProps {
  @Expose()
  @IsNumber()
  id?: number;
  @Expose()
  @IsNumber()
  eventId?: number;
}

export class SeatProps {
  @Expose()
  @IsNumber()
  id?: number;
  @Expose()
  @IsNumber()
  eventPropertyId?: number;
  @Expose()
  @IsEnum(SeatStatusEnum)
  status?: SeatStatusEnum;
}

export class ReservationProps {
  @Expose()
  @IsNumber()
  id?: number;
  @Expose()
  @IsUUID()
  userId?: string;
  @Expose()
  @IsNumber()
  seatId?: number;
  @Expose()
  @IsEnum(ReservationStatusEnum)
  status?: ReservationStatusEnum;
  @Expose()
  @IsNumber()
  eventId?: number;
  @Expose()
  @IsString()
  eventName?: string;
  @Expose()
  @IsNumber()
  eventPropertyId?: number;
  @Expose()
  @IsDate()
  eventDate?: Date;
  @Expose()
  @IsNumber()
  price?: number;
}

export class PaymentProps {
  @Expose()
  @IsNumber()
  reservationId: number;
  @Expose()
  @IsNumber()
  balanceHistoryId: number;
}

export class Event {
  @Expose()
  @IsNumber()
  id: number;
  @Expose()
  name: string;
  @Expose()
  @IsNumber()
  starId: number;
  @Expose()
  @IsDate()
  createdAt: Date;
  @Expose()
  @IsDate()
  updatedAt: Date;
  @Expose()
  @IsDate()
  deletedAt: Date;
}

export class EventProperty {
  @Expose()
  @IsNumber()
  id: number;
  @Expose()
  @IsNumber()
  eventId: number;
  @Expose()
  @IsDate()
  eventDate: Date;
  @Expose()
  @IsNumber()
  seatCount: number;
  @Expose()
  @IsDate()
  bookStartDate: Date;
  @Expose()
  @IsDate()
  bookEndDate: Date;
  @Expose()
  @IsDate()
  createdAt: Date;
  @Expose()
  @IsDate()
  updatedAt: Date;
  @Expose()
  @ValidateIf((o) => o.deletedAt !== null)
  @IsDate()
  deletedAt: Date | null;
  @Expose()
  @ValidateNested()
  event?: Event;
}

export class SeatProperty {
  @Expose()
  @IsNumber()
  id: number;
  @Expose()
  @IsString()
  name: string;
  @Expose()
  @IsNumber()
  price: number;
}

export class Seat {
  @Expose()
  @IsNumber()
  id: number;
  @Expose()
  @IsNumber()
  seatNumber: number;
  @Expose()
  @IsEnum(SeatStatusEnum)
  status: SeatStatusEnum;
  @Expose()
  @IsNumber()
  eventPropertyId: number;
  @Expose()
  @IsNumber()
  seatPropertyId: number;
  @Expose()
  @ValidateNested()
  seatProperty: SeatProperty;
}

export class Reservation {
  @Expose()
  @IsNumber()
  id: number;
  @Expose()
  @IsNumber()
  seatId: number;
  @Expose()
  @IsUUID()
  userId: string;
  @Expose()
  @IsEnum(ReservationStatusEnum)
  status: ReservationStatusEnum;
  @Expose()
  @IsDate()
  createdAt: Date;
  @Expose()
  @IsDate()
  updatedAt: Date;
  @Expose()
  @IsDate()
  deletedAt: Date;
  @Expose()
  @IsNumber()
  eventId: number;
  @Expose()
  @IsString()
  eventName: string;
  @Expose()
  @IsNumber()
  eventPropertyId: number;
  @Expose()
  @IsDate()
  eventDate: Date;
  @Expose()
  @IsNumber()
  price: number;
}

export class Payment {
  @Expose()
  @IsNumber()
  id: number;
  @Expose()
  @IsNumber()
  reservationId: number;
  @Expose()
  @IsNumber()
  balanceHistoryId: number;
}
