import { HttpException, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { EventsRepository } from '@src/domains/repositories/events.repository';
import { Event, EventProperty } from '@src/domains/events/events.model';
import { RedisKey } from '@src/libs/utils/redis.key.generator';
import { RedisCacheRepository } from '@src/domains/repositories';
import { ChainableCommander } from 'ioredis';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly redisCacheRepository: RedisCacheRepository,
  ) {}

  async getAllEvents(): Promise<Event[]> {
    return await this.eventsRepository.getAllEvents();
  }

  async getAllEventsCache(): Promise<Event[]> {
    const cacheKey = RedisKey.createCacheKey(Event);
    const cache = await this.redisCacheRepository.getHashAllValues(cacheKey, Event);
    return cache.length > 0 ? cache : null;
  }

  async getEventById(eventId: number): Promise<Event> {
    const event = await this.eventsRepository.getEventById(eventId);
    if (!event) throw new HttpException('EVENT_NOT_FOUND', 500);
    return event;
  }

  async getEventCacheById(eventId: number): Promise<Event> {
    const cacheKey = RedisKey.createCacheKey(Event);
    return await this.redisCacheRepository.getHashValueByField(cacheKey, `${eventId}`, Event);
  }

  async getAllEventProperties(): Promise<EventProperty[]> {
    return await this.eventsRepository.getAllEventProperties();
  }

  async getEventPropertiesByEventId(eventId: number): Promise<EventProperty[]> {
    const now = dayjs(Date.now()).toDate();
    return await this.eventsRepository.getEventPropertiesByEventId(eventId, now);
  }

  async getEventPropertiesCacheByEventId(eventId: number): Promise<EventProperty[]> {
    const now = dayjs(Date.now()).toDate();
    const cacheKey = RedisKey.createCacheKey(EventProperty, eventId);
    const cache = await this.redisCacheRepository.getHashAllValues(cacheKey, EventProperty);
    return cache.length > 0 ? cache.filter((ep) => ep.bookStartDate > now && ep.bookEndDate < now) : null;
  }

  async getEventPropertyById(eventPropertyId: number, lock?: boolean): Promise<EventProperty> {
    const eventProperty = await this.eventsRepository.getEventPropertyById(eventPropertyId, lock);
    if (!eventProperty) throw new HttpException('EVENT_PROPERTY_NOT_FOUND', 500);
    return eventProperty;
  }

  async getEventPropertyCacheById(eventPropertyId: number, eventId: number): Promise<EventProperty> {
    const cacheKey = RedisKey.createCacheKey(EventProperty, eventId);
    return await this.redisCacheRepository.getHashValueByField(cacheKey, `${eventPropertyId}`, EventProperty);
  }

  async putEventPropertySeatCount(eventProperty: EventProperty, seatCountChange: number): Promise<EventProperty> {
    if (eventProperty.seatCount + seatCountChange < 0) throw new HttpException('NOT_ENOUGH_SEAT', 500);
    await this.eventsRepository.putEventPropertySeatCount(eventProperty.id, eventProperty.seatCount + seatCountChange);
    eventProperty.seatCount += seatCountChange;
    return eventProperty;
  }

  async setEventPropertyCacheSeatCount(
    eventProperty: EventProperty,
    seatCountChange: number,
    multi?: ChainableCommander,
  ): Promise<boolean | ChainableCommander> {
    if (eventProperty.seatCount + seatCountChange < 0) throw new HttpException('NOT_ENOUGH_SEAT', 500);
    eventProperty.seatCount += seatCountChange;
    const cacheKey = RedisKey.createCacheKey(EventProperty, eventProperty.eventId);
    return multi
      ? this.redisCacheRepository.setHash(cacheKey, `${eventProperty.id}`, eventProperty, 6000, multi)
      : await this.redisCacheRepository.setHash(cacheKey, `${eventProperty.id}`, eventProperty, 6000);
  }
}
