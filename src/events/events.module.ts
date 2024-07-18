import { Module } from '@nestjs/common';
import { EventsController } from './presentations/events.controller';
import { EventsService } from './application/events.service';
import { EventsRepositoryImpl } from './infrastructure/repositories/events.repository';
import { QueuesRepositoryImpl } from '../queues/infrastructure/repositories/queues.repository';
import { UsersRepositoryImpl } from '../users/infrastructure/repositories/users.repository';

@Module({
  controllers: [EventsController],
  providers: [
    EventsService,
    {
      provide: 'EventsRepository',
      useClass: EventsRepositoryImpl,
    },
    {
      provide: 'QueuesRepository',
      useClass: QueuesRepositoryImpl,
    },
    {
      provide: 'UsersRepository',
      useClass: UsersRepositoryImpl,
    },
  ],
})
export class EventsModule {}
