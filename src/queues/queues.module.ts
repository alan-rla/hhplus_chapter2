import { Module } from '@nestjs/common';
import { QueuesController } from './presentations/queues.controller';
import { QueuesService } from './application/queues.service';
import { QueuesRepositoryImpl } from './infrastructure/repositories/queues.repository';
import { EventsRepositoryImpl } from '../events/infrastructure/repositories/events.repository';

@Module({
  controllers: [QueuesController],
  providers: [
    QueuesService,
    {
      provide: 'QueuesRepository',
      useClass: QueuesRepositoryImpl,
    },
    {
      provide: 'EventsRepository',
      useClass: EventsRepositoryImpl,
    },
  ],
})
export class QueuesModule {}
