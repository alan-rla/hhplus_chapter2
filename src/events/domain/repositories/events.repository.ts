import { EntityManager } from 'typeorm';
import { Event, EventProperty, Payment, Reservation, Seat } from '../models/events.model';
import { ReservationStatusEnum, SeatStatusEnum } from '../../../libs/types';

export abstract class EventsRepository {
  abstract getAllEvents(): Promise<Event[]>;

  abstract getEventById(eventId: number, transactionalEntityManager?: EntityManager): Promise<Event>;

  abstract getEventProperties(eventId: number, dateNow: Date): Promise<EventProperty[]>;

  abstract getEventPropertyById(
    eventPropertyId: number,
    transactionalEntityManager?: EntityManager,
  ): Promise<EventProperty>;

  abstract getSeats(eventPropertyId: number): Promise<Seat[]>;

  abstract getSeatById(seatId: number, transactionalEntityManager?: EntityManager): Promise<Seat>;

  abstract putSeatStatus(
    seatId: number,
    status: SeatStatusEnum,
    transactionalEntityManager?: EntityManager,
  ): Promise<Seat>;

  abstract reserveSeat(
    seatId: number,
    userId: string,
    status: ReservationStatusEnum,
    eventId: number,
    eventName: string,
    eventPropertyId: number,
    eventDate: Date,
    price: number,
    transactionalEntityManager?: EntityManager,
  ): Promise<Reservation>;

  abstract getReservation(reservationId: number, transactionalEntityManager?: EntityManager): Promise<Reservation>;

  abstract putReservation(
    reservationId: number,
    status: ReservationStatusEnum,
    transactionalEntityManager?: EntityManager,
  ): Promise<Reservation>;

  abstract postPayment(
    reservationId: number,
    balanceHistoryId: number,
    transactionalEntityManager?: EntityManager,
  ): Promise<Payment>;
}
