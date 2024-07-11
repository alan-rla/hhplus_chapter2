import { Injectable } from '@nestjs/common';
import { QueuesRepository } from '../domain/repositories/queue.repository';
import { Queue } from '../domain/models/queue.model';

@Injectable()
export class QueuesService {
  constructor(private readonly queuesRepository: QueuesRepository) {}

  async post(userId: string, eventId: number): Promise<Queue> {
    const queue = await this.queuesRepository.post(userId, eventId);
    return queue;
  }

  async getByUserIdAndEventId(userId: string, eventId: number): Promise<Queue> {
    const queue = await this.queuesRepository.getByUserIdAndEventId(userId, eventId);
    return queue;
  }
}
