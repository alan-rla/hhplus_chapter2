import { Injectable } from '@nestjs/common';
import { EventsService } from '@src/domains/events/events.service';
import { Reservation } from '@src/domains/reservations/reservations.model';
import { ReservationsService } from '@src/domains/reservations/reservations.service';
import { SeatsService } from '@src/domains/seats/seats.service';

@Injectable()
export class ReservationsFacade {
  constructor(
    private readonly seatsService: SeatsService,
    private readonly eventsService: EventsService,
    private readonly reservationsService: ReservationsService,
  ) {}

  async postReservation(seatId: number, userId: string): Promise<Reservation> {
    const seat = await this.seatsService.getSeatById(seatId);
    const occupiedSeat = await this.seatsService.putSeatStatusToOccupied(seat);
    const eventProperty = await this.eventsService.getEventPropertyById(occupiedSeat.eventPropertyId);
    return await this.reservationsService.postReservation(occupiedSeat, eventProperty, userId);
  }
}
