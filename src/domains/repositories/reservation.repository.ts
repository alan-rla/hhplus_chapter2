import { Reservation } from '@src/domains/reservations/reservations.model';
import { ReservationStatusEnum } from '@src/libs/types';

export abstract class ReservationsRepository {
  abstract postReservation(entity: Reservation): Promise<Reservation>;

  abstract getReservationById(id: number): Promise<Reservation>;

  abstract putReservation(reservationId: number, status: ReservationStatusEnum): Promise<boolean>;
}
