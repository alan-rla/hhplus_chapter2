import { HttpException, Inject, Injectable } from '@nestjs/common';
import { QueuesRepository } from '../domain/repositories/queues.repository';
import { Queue, QueueRequestProps } from '../domain/models/queues.model';
import { QueueStatusEnum } from '../../libs/types';
import { EventsRepository } from '../../events/domain/repositories/events.repository';
import dayjs from 'dayjs';

@Injectable()
export class QueuesService {
  constructor(
    @Inject('QueuesRepository')
    private readonly queuesRepository: QueuesRepository,
    @Inject('EventsRepository')
    private readonly eventsRepository: EventsRepository,
  ) {}

  async post(args: QueueRequestProps): Promise<Queue> {
    const event = await this.eventsRepository.getEventById(args.eventId);
    if (!event) throw new HttpException('EVENT_NOT_FOUND', 500);

    const queue = await this.queuesRepository.getByUserIdAndEventId(args.userId, args.eventId);
    if (queue?.status === QueueStatusEnum.STANDBY || queue?.status === QueueStatusEnum.ACTIVATED)
      throw new HttpException('DUPLICATE_QUEUE', 500);

    const post = await this.queuesRepository.post(args.userId, args.eventId);
    return post;
  }

  async getByUserIdAndEventId(args: QueueRequestProps): Promise<Queue> {
    const queue = await this.queuesRepository.getByUserIdAndEventId(args.userId, args.eventId);
    return queue;
  }

  async queueActivateManager(): Promise<void> {
    const events = await this.eventsRepository.getAllEvents();
    for (const event of events) {
      const eventId = event.id;
      const standBy = QueueStatusEnum.STANDBY;
      const activated = QueueStatusEnum.ACTIVATED;
      /* eslint-disable */
      const [standByQueues, standByCount] = await this.queuesRepository.getQueuesByEventId(eventId, standBy);
      const [activatedQueues, activatedCount] = await this.queuesRepository.getQueuesByEventId(eventId, activated);
      /* eslint-enable */
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
      /* eslint-disable */
      const [activatedQueues, activatedCount] = await this.queuesRepository.getQueuesByEventId(eventId, activated);
      /* eslint-enable */
      const queueIds = [];

      for (const activatedQueue of activatedQueues) {
        if (activatedQueue.updatedAt < dayjs(Date.now()).subtract(20, 'minute').toDate())
          queueIds.push(activatedQueue.id);
      }

      await this.queuesRepository.putQueueStatus(queueIds, expired);
    }
  }
}
