import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Event, EventProperty, Payment, Reservation, Seat } from '../../domain/models/events.model';
import { EventEntity, EventPropertyEntity, PaymentEntity, ReservationEntity, SeatEntity } from '../entities';
import { ReservationStatusEnum, SeatStatusEnum } from '../../../libs/types';
import { Mapper } from '../../../libs/mappers';
import { EventsRepository } from '../../domain/repositories/events.repository';

@Injectable()
export class EventsRepositoryImpl implements EventsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getAllEvents(): Promise<Event[]> {
    const events = await this.dataSource.getRepository(EventEntity).find();
    return await Promise.all(events.map(async (entity) => await Mapper.classTransformer(Event, entity)));
  }

  async getEventById(id: number): Promise<Event> {
    const entity = await Mapper.classTransformer(EventEntity, { id });
    const event = await this.dataSource.getRepository(EventEntity).findOne({ where: entity });
    return await Mapper.classTransformer(Event, event);
  }

  async getEventProperties(eventId: number, dateNow: Date): Promise<EventProperty[]> {
    const eventProperties = await this.dataSource
      .getRepository(EventPropertyEntity)
      .findBy({ eventId, bookStartDate: LessThanOrEqual(dateNow), bookEndDate: MoreThanOrEqual(dateNow) });
    return await Promise.all(
      eventProperties.map(async (entity) => await Mapper.classTransformer(EventProperty, entity)),
    );
  }

  async getEventPropertyById(id: number): Promise<EventProperty> {
    const entity = await Mapper.classTransformer(EventPropertyEntity, { id });
    const eventProperty = await this.dataSource
      .getRepository(EventPropertyEntity)
      .findOne({ where: entity, relations: { event: true } });
    return await Mapper.classTransformer(EventProperty, eventProperty);
  }

  async getSeats(eventPropertyId: number): Promise<Seat[]> {
    const entity = await Mapper.classTransformer(SeatEntity, { eventPropertyId });
    const seats = await this.dataSource
      .getRepository(SeatEntity)
      .find({ where: entity, relations: { seatProperty: true } });
    return await Promise.all(seats.map(async (entity) => await Mapper.classTransformer(Seat, entity)));
  }

  async getSeatById(id: number): Promise<Seat> {
    const entity = await Mapper.classTransformer(SeatEntity, { id });
    const seat = await this.dataSource
      .getRepository(SeatEntity)
      .findOne({ where: entity, lock: { mode: 'pessimistic_write' } });
    return await Mapper.classTransformer(Seat, seat);
  }

  async putSeatStatus(id: number, status: SeatStatusEnum): Promise<boolean> {
    const seat = await this.dataSource.getRepository(SeatEntity).update({ id }, { status });
    return seat.affected ? true : false;
  }

  async reserveSeat(args: Reservation): Promise<Reservation> {
    const entity = await Mapper.classTransformer(ReservationEntity, args);
    const reservation = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(ReservationEntity)
      .values(entity)
      .returning('*')
      .execute();
    return await Mapper.classTransformer(Reservation, reservation.raw[0]);
  }

  async getReservationById(id: number): Promise<Reservation> {
    const entity = await Mapper.classTransformer(ReservationEntity, { id });
    const reservation = await this.dataSource.getRepository(ReservationEntity).findOne({ where: entity });
    return await Mapper.classTransformer(Reservation, reservation);
  }

  async putReservation(id: number, status: ReservationStatusEnum): Promise<boolean> {
    const reservation = await this.dataSource.getRepository(ReservationEntity).update({ id }, { status });
    return reservation.affected ? true : false;
  }

  async postPayment(reservationId: number, balanceHistoryId: number): Promise<Payment> {
    const entity = await Mapper.classTransformer(PaymentEntity, { reservationId, balanceHistoryId });
    const payment = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(PaymentEntity)
      .values(entity)
      .returning('*')
      .execute();
    return await Mapper.classTransformer(Payment, payment.raw[0]);
  }
}
