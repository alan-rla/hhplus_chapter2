import { Event, EventProperty, Payment, Reservation, Seat } from '../models/events.model';
import { ReservationStatusEnum, SeatStatusEnum } from '../../../libs/types';

export abstract class EventsRepository {
  abstract getAllEvents(): Promise<Event[]>;

  abstract getEventById(id: number): Promise<Event>;

  abstract getEventProperties(eventId: number, dateNow: Date): Promise<EventProperty[]>;

  abstract getEventPropertyById(id: number): Promise<EventProperty>;

  abstract getSeats(eventPropertyId: number): Promise<Seat[]>;

  abstract getSeatById(id: number): Promise<Seat>;

  abstract putSeatStatus(id: number, status: SeatStatusEnum): Promise<boolean>;

  abstract reserveSeat(entity: Reservation): Promise<Reservation>;

  abstract getReservationById(id: number): Promise<Reservation>;

  abstract putReservation(reservationId: number, status: ReservationStatusEnum): Promise<boolean>;

  abstract postPayment(reservationId: number, balanceHistoryId: number): Promise<Payment>;
}
