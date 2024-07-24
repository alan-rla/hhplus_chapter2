import { Injectable } from '@nestjs/common';
import { Seat } from '@src/domains/seats/seats.model';
import { SeatsService } from '@src/domains/seats/seats.service';

@Injectable()
export class SeatsFacade {
  constructor(private readonly seatsService: SeatsService) {}

  async getSeatsByEventPropertyId(eventPropertyId: number): Promise<Seat[]> {
    return await this.seatsService.getSeatsByEventPropertyId(eventPropertyId);
  }
}
