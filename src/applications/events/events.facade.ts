import { Injectable } from '@nestjs/common';
import { Event, EventProperty } from '@src/domains/events/events.model';
import { EventsService } from '@src/domains/events/events.service';

@Injectable()
export class EventsFacade {
  constructor(private readonly eventsService: EventsService) {}

  async getAllEvents(): Promise<Event[]> {
    return await this.eventsService.getAllEvents();
  }

  async getEventPropertiesByEventId(eventId: number): Promise<EventProperty[]> {
    return await this.eventsService.getEventPropertiesByEventId(eventId);
  }
}
