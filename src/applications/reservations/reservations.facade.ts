import { Injectable } from '@nestjs/common';
import { EventsService } from '@src/domains/events/events.service';
import { RedisLocksService } from '@src/domains/redis.locks/redis.locks.service';
import { Reservation } from '@src/domains/reservations/reservations.model';
import { ReservationsService } from '@src/domains/reservations/reservations.service';
import { Seat } from '@src/domains/seats/seats.model';
import { SeatsService } from '@src/domains/seats/seats.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ReservationsFacade {
  constructor(
    private readonly seatsService: SeatsService,
    private readonly eventsService: EventsService,
    private readonly reservationsService: ReservationsService,
    private readonly redisLocksService: RedisLocksService,
  ) {}

  async postReservation(seatId: number, userId: string): Promise<Reservation> {
    const seat = await this.seatsService.getSeatById(seatId);
    const key = `EVENT_PROPERTY_LOCK:ID_${seat.eventPropertyId}`;
    const reservation = await this.postReservationTransaction(seat, userId);
    await this.redisLocksService.removeLock(key, userId);
    return reservation;
  }

  @Transactional()
  async postReservationTransaction(seat: Seat, userId: string): Promise<Reservation> {
    const occupiedSeat = await this.seatsService.putSeatStatusToOccupied(seat);
    const eventProperty = await this.eventsService.getEventPropertyById(occupiedSeat.eventPropertyId);
    return await this.reservationsService.postReservation(occupiedSeat, eventProperty, userId);
  }
}
