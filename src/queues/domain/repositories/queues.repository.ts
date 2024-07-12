import { EntityManager } from 'typeorm';
import { QueueStatusEnum } from '../../../libs/types';
import { Queue } from '../models/queues.model';

export abstract class QueuesRepository {
  abstract post(userId: string, eventId: number): Promise<Queue>;

  abstract getByUserIdAndEventId(
    userId: string,
    eventId: number,
    transactionalEntityManager?: EntityManager,
  ): Promise<Queue>;

  abstract getQueuesByEventId(eventId: number, status: QueueStatusEnum): Promise<[Queue[], number]>;

  abstract putQueueStatus(
    ids: number[],
    status: QueueStatusEnum,
    transactionalEntityManager?: EntityManager,
  ): Promise<void>;
}
