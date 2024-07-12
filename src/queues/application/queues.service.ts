import { HttpException, Injectable } from '@nestjs/common';
import { QueuesRepository } from '../domain/repositories/queues.repository';
import { Queue } from '../domain/models/queues.model';
import { QueueStatusEnum } from '../../libs/types';
import { EventsRepository } from '../../events/domain/repositories/events.repository';
import dayjs from 'dayjs';

@Injectable()
export class QueuesService {
  constructor(
    private readonly queuesRepository: QueuesRepository,
    private readonly eventsRepository: EventsRepository,
  ) {}

  async post(userId: string, eventId: number): Promise<Queue> {
    const queue = await this.queuesRepository.getByUserIdAndEventId(userId, eventId);
    if (Object.keys(queue).length > 0) throw new HttpException({ status: 'DUPLICATE_QUEUE', msg: '대기열 존재' }, 500);
    const post = await this.queuesRepository.post(userId, eventId);
    return post;
  }

  async getByUserIdAndEventId(userId: string, eventId: number): Promise<Queue> {
    const queue = await this.queuesRepository.getByUserIdAndEventId(userId, eventId);
    return queue;
  }

  async queueActivateManager(): Promise<void> {
    const events = await this.eventsRepository.getAllEvents();
    for (const event of events) {
      const eventId = event.id;
      const standBy = QueueStatusEnum.STANDBY;
      const activated = QueueStatusEnum.ACTIVATED;
      const [standByQueues, standByCount] = await this.queuesRepository.getQueuesByEventId(eventId, standBy);
      const [activatedQueues, activatedCount] = await this.queuesRepository.getQueuesByEventId(eventId, activated);

      const availableQueues = 5 - activatedCount;
      const queueIds = [];

      for (let i = 0; i < availableQueues; i++) {
        if (!standByQueues[i]) break;
        queueIds.push(standByQueues[i].id);
      }

      await this.queuesRepository.putQueueStatus(queueIds, activated);
    }
  }

  async queueExpireManager(): Promise<void> {
    const events = await this.eventsRepository.getAllEvents();
    for (const event of events) {
      const eventId = event.id;
      const expired = QueueStatusEnum.EXPIRED;
      const activated = QueueStatusEnum.ACTIVATED;
      const [activatedQueues, activatedCount] = await this.queuesRepository.getQueuesByEventId(eventId, activated);

      const queueIds = [];

      for (const activatedQueue of activatedQueues) {
        if (activatedQueue.updatedAt < dayjs(Date.now()).subtract(20, 'minute').toDate())
          queueIds.push(activatedQueue.id);
      }

      await this.queuesRepository.putQueueStatus(queueIds, expired);
    }
  }
}
