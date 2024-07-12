import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { QueuesRepository } from '../../queues/domain/repositories/queues.repository';
import { QueueStatusEnum } from '../types';

type QueueInfo = {
  eventId: number;
  userId: string;
};
@Injectable()
export class QueueGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly queuesRepository: QueuesRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { eventId, userId }: QueueInfo = request.headers.queueInfo;

    const queue = await this.queuesRepository.getByUserIdAndEventId(userId, eventId);

    if (Object.keys(queue).length === 0)
      throw new UnauthorizedException({ status: 'QUEUE_NOT_FOUND', msg: '대기열 없음' });

    if (queue.status === QueueStatusEnum.STANDBY)
      throw new UnauthorizedException({ status: 'QUEUE_YET_STANDBY', msg: '대기열 통과 못함' });
    else if (queue.status === QueueStatusEnum.EXPIRED)
      throw new UnauthorizedException({ status: 'QUEUE_EXPIRED', msg: '대기열 만료' });
    return;
  }
}
