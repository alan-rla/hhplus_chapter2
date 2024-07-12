import { ReservationStatusEnum, SeatStatusEnum } from '../../../libs/types';

export type EventDatesRequestProps = {
  eventId: number;
};

export type EventPropertyRequestProps = {
  propertyId: number;
};

export type ReservationRequestProps = {
  userId: string;
  seatId: number;
};

export type PayRequestProps = {
  reservationId: number;
};

export class Event {
  id: number;
  name: string;
  starId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export class EventProperty {
  id: number;
  eventId: number;
  eventDate: Date;
  seatCount: number;
  bookStartDate: Date;
  bookEndDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  event: Event;
}

export class SeatProperty {
  id: number;
  name: string;
  price: number;
}

export class Seat {
  id: number;
  seatNumber: number;
  status: SeatStatusEnum;
  eventPropertyId: number;
  seatPropertyId: number;
  seatProperty: SeatProperty;
}

export class Reservation {
  id: number;
  seatId: number;
  userId: string;
  status: ReservationStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  eventId: number;
  eventName: string;
  eventPropertyId: number;
  eventDate: Date;
  price: number;
}

export class Payment {
  id: number;
  reservationId: number;
  balanceHistoryId: number;
}
