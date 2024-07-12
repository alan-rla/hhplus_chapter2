import { Module } from '@nestjs/common';
import { QueuesController } from './presentations/queues.controller';
import { QueuesService } from './application/queues.service';
import { QueuesRepository } from './domain/repositories/queues.repository';
import { QueuesRepositoryImpl } from './infrastructure/repositories/queues.repository';

@Module({
  controllers: [QueuesController],
  providers: [
    QueuesService,
    {
      provide: QueuesRepository,
      useClass: QueuesRepositoryImpl,
    },
  ],
})
export class QueuesModule {}
