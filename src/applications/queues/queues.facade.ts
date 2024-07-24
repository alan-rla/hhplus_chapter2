import { Injectable } from '@nestjs/common';
import { EventsService } from '@src/domains/events/events.service';
import { Queue } from '@src/domains/queues/queues.model';
import { QueuesService } from '@src/domains/queues/queues.service';

@Injectable()
export class QueuesFacade {
  constructor(
    private readonly queuesService: QueuesService,
    private readonly eventsService: EventsService,
  ) {}

  async getQueueByUserIdAndEventId(userId: string, eventId: number): Promise<Queue> {
    return await this.queuesService.getLatestQueueByUserIdAndEventId(userId, eventId);
  }

  async post(userId: string, eventId: number): Promise<Queue> {
    await this.eventsService.getEventById(eventId);
    const queue = await this.queuesService.getLatestQueueByUserIdAndEventId(userId, eventId);
    return await this.queuesService.post(userId, eventId, queue);
  }

  async queueActivateManager(): Promise<void> {
    const events = await this.eventsService.getAllEvents();
    await this.queuesService.queueActivateManager(events);
    return;
  }

  async queueExpireManager(): Promise<void> {
    const events = await this.eventsService.getAllEvents();
    await this.queuesService.queueExpireManager(events);
    return;
  }
}
