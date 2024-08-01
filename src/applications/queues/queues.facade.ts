import { Injectable } from '@nestjs/common';
import { QueueTimeLeft } from '@src/domains/queues/queues.model';
import { QueuesService } from '@src/domains/queues/queues.service';

@Injectable()
export class QueuesFacade {
  constructor(private readonly queuesService: QueuesService) {}

  async joinWaitingQueue(userId: string): Promise<boolean> {
    return await this.queuesService.joinWaitingQueue(userId);
  }

  async getTimeLeftInWaitingQueue(userId: string): Promise<QueueTimeLeft> {
    return await this.queuesService.getTimeLeftInWaitingQueue(userId);
  }

  async tokenActivateManager(): Promise<void> {
    await this.queuesService.tokenActivateManager();
  }

  async tokenExpireManager(): Promise<void> {
    await this.queuesService.tokenExpireManager();
  }
}
