import { Queue } from '../models/queue.model';

export abstract class QueuesRepository {
  abstract post(userId: string, eventId: number): Promise<Queue>;

  abstract getByUserIdAndEventId(userId: string, eventId: number): Promise<Queue>;
}
