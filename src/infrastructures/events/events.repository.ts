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
    return await Promise.all(events.map(async (entity) => await Mapper.classTransformer(Event, entity)));
  }

  async getEventById(id: number): Promise<Event> {
    const entity = await Mapper.classTransformer(EventEntity, { id });
    const event = await this.dataSource.getRepository(EventEntity).findOne({ where: entity });
    return await Mapper.classTransformer(Event, event);
  }

  async getAllEventProperties(): Promise<EventProperty[]> {
    const eventProperties = await this.dataSource.getRepository(EventPropertyEntity).find();
    return await Promise.all(
      eventProperties.map(async (entity) => await Mapper.classTransformer(EventProperty, entity)),
    );
  }

  async getEventPropertiesByEventId(eventId: number, dateNow: Date): Promise<EventProperty[]> {
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
}
