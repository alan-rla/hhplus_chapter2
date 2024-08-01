import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { QueuesService } from '@src/domains/queues/queues.service';

type QueueInfo = {
  userId: string;
};

@Injectable()
export class QueueGuard implements CanActivate {
  constructor(private readonly queuesService: QueuesService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId }: QueueInfo = request.headers.queueInfo;

    const activeToken = await this.queuesService.getUserInActiveToken(userId);
    if (activeToken) return true;
    else throw new UnauthorizedException({ status: 'TOKEN_NOT_FOUND', msg: '토큰 없음' });
  }
}
