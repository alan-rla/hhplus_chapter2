import { Event, EventProperty } from '@src/domains/events/events.model';

export abstract class EventsRepository {
  abstract getAllEvents(): Promise<Event[]>;

  abstract getEventById(id: number): Promise<Event>;

  abstract getAllEventProperties(): Promise<EventProperty[]>;

  abstract getEventPropertiesByEventId(eventId: number, dateNow: Date): Promise<EventProperty[]>;

  abstract getEventPropertyById(id: number): Promise<EventProperty>;
}
