import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { QueuesService } from '@src/domains/queues/queues.service';
import { QueueStatusEnum } from '@src/libs/types';

type QueueInfo = {
  eventId: number;
  userId: string;
};
@Injectable()
export class QueueGuard implements CanActivate {
  constructor(private readonly queuesService: QueuesService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { eventId, userId }: QueueInfo = request.headers.queueInfo;

    const queue = await this.queuesService.getLatestQueueByUserIdAndEventId(userId, eventId);

    if (!queue) throw new UnauthorizedException({ status: 'QUEUE_NOT_FOUND', msg: '대기열 없음' });
    else if (queue.status === QueueStatusEnum.STANDBY)
      throw new UnauthorizedException({ status: 'QUEUE_YET_STANDBY', msg: '대기열 통과 못함' });
    else if (queue.status === QueueStatusEnum.EXPIRED)
      throw new UnauthorizedException({ status: 'QUEUE_EXPIRED', msg: '대기열 만료' });
    return;
  }
}
