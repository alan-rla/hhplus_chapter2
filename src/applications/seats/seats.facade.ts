import { HttpException, Injectable } from '@nestjs/common';
import { Seat } from '@src/domains/seats/seats.model';
import { SeatsService } from '@src/domains/seats/seats.service';
import { EventsService } from '@src/domains/events/events.service';

@Injectable()
export class SeatsFacade {
  constructor(
    private readonly seatsService: SeatsService,
    private readonly eventsService: EventsService,
  ) {}

  async getSeatsByEventPropertyId(eventId: number, eventPropertyId: number): Promise<Seat[]> {
    const eventProperty =
      (await this.eventsService.getEventPropertyCacheById(eventPropertyId, eventId)) ||
      (await this.eventsService.getEventPropertyById(eventPropertyId));
    if (eventProperty.seatCount < 0) throw new HttpException('NO_SEAT_AVAILABLE', 500);

    return (
      (await this.seatsService.getSeatsCacheByEventPropertyId(eventPropertyId)) ||
      (await this.seatsService.getSeatsByEventPropertyId(eventPropertyId))
    );
  }
}
