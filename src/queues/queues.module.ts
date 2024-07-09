import { Module } from '@nestjs/common';
import { QueuesController } from './presentations/queues.controller';

@Module({
  controllers: [QueuesController],
})
export class QueuesModule {}
