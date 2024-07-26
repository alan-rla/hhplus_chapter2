import { Injectable } from '@nestjs/common';
import { EventsService } from '@src/domains/events/events.service';
import { Queue } from '@src/domains/queues/queues.model';
import { QueuesService } from '@src/domains/queues/queues.service';
import { RedisLocksService } from '@src/domains/redis.locks/redis.locks.service';

@Injectable()
export class QueuesFacade {
  constructor(
    private readonly queuesService: QueuesService,
    private readonly eventsService: EventsService,
    private readonly redisLocksService: RedisLocksService,
  ) {}

  async getQueueByUserIdAndEventId(userId: string, eventId: number): Promise<Queue> {
    return await this.queuesService.getLatestQueueByUserIdAndEventId(userId, eventId);
  }

  async post(userId: string, eventId: number): Promise<Queue> {
    await this.eventsService.getEventById(eventId);
    const queue = await this.queuesService.getLatestQueueByUserIdAndEventId(userId, eventId);
    return await this.queuesService.post(userId, eventId, queue);
  }

  // async queueActivateManager(): Promise<void> {
  //   const events = await this.eventsService.getAllEvents();
  //   await this.queuesService.queueActivateManager(events);
  //   return;
  // }

  async queueExpireManager(): Promise<void> {
    const eventProperties = await this.eventsService.getAllEventProperties();
    for (const eventProperty of eventProperties) {
      const key = `EVENT_PROPERTY_LOCK:ID_${eventProperty.id}`;
      await this.redisLocksService.removeObsoleteLocks(key);
    }
    return;
  }
}
