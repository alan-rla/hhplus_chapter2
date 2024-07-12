import { Module } from '@nestjs/common';
import { QueueGuard } from './queue.guard';
import { QueuesRepositoryImpl } from '../../queues/infrastructure/repositories/queues.repository';

@Module({
  providers: [
    QueueGuard,
    {
      provide: 'QueuesRepository',
      useClass: QueuesRepositoryImpl,
    },
  ],
})
export class GuardsModule {}
