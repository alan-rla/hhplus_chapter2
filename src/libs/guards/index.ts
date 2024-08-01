import { Type } from '@nestjs/common';
import { QueueGuard } from '@src/libs/guards/queue.guard';

export const guards: Type<any>[] = [QueueGuard];
