import { QueueStatusEnum } from '@src/libs/types';
import { Queue } from '@src/domains/queues/queues.model';

export abstract class QueuesRepository {
  abstract post(userId: string, eventId: number): Promise<Queue>;

  abstract getLatestQueueByUserIdAndEventId(userId: string, eventId: number): Promise<Queue>;

  abstract getQueuesByEventIdAndStatus(eventId: number, status: QueueStatusEnum): Promise<[Queue[], number]>;

  abstract putQueueStatus(ids: number[], status: QueueStatusEnum): Promise<boolean>;
}
