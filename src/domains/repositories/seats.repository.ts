import { Seat } from '@src/domains/seats/seats.model';
import { SeatStatusEnum } from '@src/libs/types';

export abstract class SeatsRepository {
  abstract getSeats(eventPropertyId: number): Promise<Seat[]>;

  abstract getSeatById(id: number, lock?: boolean): Promise<Seat>;

  abstract putSeatStatus(id: number, status: SeatStatusEnum): Promise<boolean>;
}
