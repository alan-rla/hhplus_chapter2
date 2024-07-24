import { HttpException, Injectable } from '@nestjs/common';
import { Event } from '@src/domains/events/events.model';
import { Queue } from '@src/domains/queues/queues.model';
import { QueuesRepository } from '@src/domains/repositories/queues.repository';
import { QueueStatusEnum } from '@src/libs/types';
import dayjs from 'dayjs';

@Injectable()
export class QueuesService {
  constructor(private readonly queuesRepository: QueuesRepository) {}

  async getLatestQueueByUserIdAndEventId(userId: string, eventId: number): Promise<Queue> {
    return await this.queuesRepository.getLatestQueueByUserIdAndEventId(userId, eventId);
  }

  async post(userId: string, eventId: number, queue: Queue): Promise<Queue> {
    if (!queue || queue.status === QueueStatusEnum.EXPIRED) return await this.queuesRepository.post(userId, eventId);
    else if (queue.status === QueueStatusEnum.STANDBY || queue.status === QueueStatusEnum.ACTIVATED)
      throw new HttpException('DUPLICATE_QUEUE', 500);
  }

  async expireQueue(queue: Queue): Promise<boolean> {
    if (!queue || queue.status === QueueStatusEnum.EXPIRED) throw new HttpException('QUEUE_NOT_FOUND', 500);
    else return await this.queuesRepository.putQueueStatus([queue.id], QueueStatusEnum.EXPIRED);
  }

  async queueActivateManager(events: Event[]): Promise<void> {
    for (const event of events) {
      const eventId = event.id;
      const standBy = QueueStatusEnum.STANDBY;
      const activated = QueueStatusEnum.ACTIVATED;
      /* eslint-disable */
      const [standByQueues, standByCount] = await this.queuesRepository.getQueuesByEventIdAndStatus(eventId, standBy);
      const [activatedQueues, activatedCount] = await this.queuesRepository.getQueuesByEventIdAndStatus(
        eventId,
        activated,
      );
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

  async queueExpireManager(events: Event[]): Promise<void> {
    for (const event of events) {
      const eventId = event.id;
      const expired = QueueStatusEnum.EXPIRED;
      const activated = QueueStatusEnum.ACTIVATED;
      /* eslint-disable */
      const [activatedQueues, activatedCount] = await this.queuesRepository.getQueuesByEventIdAndStatus(
        eventId,
        activated,
      );
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
