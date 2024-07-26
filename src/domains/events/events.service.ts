import { HttpException, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { EventsRepository } from '@src/domains/repositories/events.repository';
import { Event, EventProperty } from '@src/domains/events/events.model';

@Injectable()
export class EventsService {
  constructor(private readonly eventsRepository: EventsRepository) {}

  async getAllEvents(): Promise<Event[]> {
    return await this.eventsRepository.getAllEvents();
  }

  async getEventById(eventId: number): Promise<Event> {
    const event = await this.eventsRepository.getEventById(eventId);
    if (!event) throw new HttpException('EVENT_NOT_FOUND', 500);
    return event;
  }

  async getAllEventProperties(): Promise<EventProperty[]> {
    return await this.eventsRepository.getAllEventProperties();
  }

  async getEventPropertiesByEventId(eventId: number): Promise<EventProperty[]> {
    const now = dayjs(Date.now()).toDate();
    return await this.eventsRepository.getEventPropertiesByEventId(eventId, now);
  }

  async getEventPropertyById(eventPropertyId: number): Promise<EventProperty> {
    const eventProperty = await this.eventsRepository.getEventPropertyById(eventPropertyId);
    if (!eventProperty) throw new HttpException('EVENT_PROPERTY_NOT_FOUND', 500);
    return eventProperty;
  }
}
