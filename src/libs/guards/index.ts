import { Type } from '@nestjs/common';
import { EventPropertyLockGuard } from '@src/libs/guards/lock.guard';

export const guards: Type<any>[] = [EventPropertyLockGuard];
