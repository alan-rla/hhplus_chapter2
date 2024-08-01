import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Event, EventProperty } from '@src/domains/events/events.model';
import { EventEntity, EventPropertyEntity } from '@src/infrastructures/entities';
import { Mapper } from '@src/libs/mappers';
import { EventsRepository } from '@src/domains/repositories/events.repository';

@Injectable()
export class EventsRepositoryImpl implements EventsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getAllEvents(): Promise<Event[]> {
    const events = await this.dataSource.getRepository(EventEntity).find();
    return events.map((entity) => Mapper.classTransformer(Event, entity));
  }

  async getEventById(id: number): Promise<Event> {
    const entity = Mapper.classTransformer(EventEntity, { id });
    const event = await this.dataSource.getRepository(EventEntity).findOne({ where: entity });
    return Mapper.classTransformer(Event, event);
  }

  async getAllEventProperties(): Promise<EventProperty[]> {
    const eventProperties = await this.dataSource.getRepository(EventPropertyEntity).find();
    return eventProperties.map((entity) => Mapper.classTransformer(EventProperty, entity));
  }

  async getEventPropertiesByEventId(eventId: number, dateNow: Date): Promise<EventProperty[]> {
    const eventProperties = await this.dataSource
      .getRepository(EventPropertyEntity)
      .findBy({ eventId, bookStartDate: LessThanOrEqual(dateNow), bookEndDate: MoreThanOrEqual(dateNow) });
    return eventProperties.map((entity) => Mapper.classTransformer(EventProperty, entity));
  }

  async getEventPropertyById(id: number, lock?: boolean): Promise<EventProperty> {
    const entity = Mapper.classTransformer(EventPropertyEntity, { id });
    const findCondition = { where: entity, relations: { event: true } };
    if (lock) Object.assign(findCondition, { lock: { mode: 'optimistic', version: 1 } });
    const eventProperty = await this.dataSource.getRepository(EventPropertyEntity).findOne(findCondition);
    return Mapper.classTransformer(EventProperty, eventProperty);
  }

  async putEventPropertySeatCount(id: number, seatCount: number): Promise<boolean> {
    const entity = Mapper.classTransformer(EventProperty, { seatCount });
    const eventProperty = await this.dataSource
      .createQueryBuilder()
      .update(EventProperty)
      .set(entity)
      .where('id = :id', { id })
      .execute();

    return eventProperty.affected[0] ? true : false;
  }
}
